const express = require("express");
const request = require("supertest");
const { expect } = require("chai");
const sinon = require("sinon");

const bookingRoutes = require("../routes/booking");
const { Booking, AvailabilitySlot, Payment, User, sequelize } = require("../models");

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/bookings", bookingRoutes);
  return app;
};

describe("Booking Routes", () => {
  let sandbox;
  let app;
  let transaction;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    app = buildApp();
    transaction = {
      commit: sandbox.stub().resolves(),
      rollback: sandbox.stub().resolves(),
    };
    sandbox.stub(sequelize, "transaction").resolves(transaction);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("returns bookings with calculated fallback price", async () => {
    sandbox.stub(Booking, "findAll").resolves([
      {
        get: () => ({
          id: 1,
          client: { name: "Thobile" },
          startTime: "08:00",
          endTime: "09:30",
          payment: null,
        }),
      },
    ]);

    const res = await request(app).get("/api/bookings");

    expect(res.status).to.equal(200);
    expect(res.body).to.have.length(1);
    expect(res.body[0].price).to.equal(1200);
  });

  it("rejects create booking when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .send({
        userId: 1,
        therapistId: 2,
        bookingDate: "2026-04-08",
        startTime: "09:00",
      });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal("Missing required booking fields");
    expect(transaction.rollback.calledOnce).to.be.true;
  });

  it("rejects create booking when slot already exists", async () => {
    sandbox.stub(AvailabilitySlot, "findOne").resolves({ id: 99 });

    const res = await request(app)
      .post("/api/bookings")
      .send({
        userId: 1,
        therapistId: 2,
        bookingDate: "2026-04-08",
        startTime: "09:00",
        endTime: "10:00",
      });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal("This slot is already booked");
    expect(transaction.rollback.calledOnce).to.be.true;
  });

  it("updates booking status to confirmed and marks payment completed", async () => {
    const save = sandbox.stub().resolves();
    sandbox.stub(Booking, "findByPk")
      .onFirstCall()
      .resolves({
        id: 12,
        therapistId: 4,
        bookingDate: "2026-04-10",
        startTime: "10:00",
        endTime: "11:00",
        status: "PENDING",
        save,
      })
      .onSecondCall()
      .resolves({
        get: () => ({
          id: 12,
          client: { name: "Thobile", email: "thobile@example.com", role: "CLIENT" },
          startTime: "10:00",
          endTime: "11:00",
          status: "CONFIRMED",
          payment: { amount: 800, status: "COMPLETED", currency: "ZAR" },
        }),
      });

    sandbox.stub(AvailabilitySlot, "update").resolves([1]);
    sandbox.stub(Payment, "update").resolves([1]);

    const res = await request(app)
      .patch("/api/bookings/12/status")
      .send({ status: "CONFIRMED" });

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("CONFIRMED");
    expect(res.body.price).to.equal(800);
    expect(save.calledOnce).to.be.true;
    expect(AvailabilitySlot.update.calledOnce).to.be.true;
    expect(Payment.update.calledOnce).to.be.true;
    expect(transaction.commit.calledOnce).to.be.true;
  });

  it("rejects invalid booking status updates", async () => {
    sandbox.stub(Booking, "findByPk").resolves({
      id: 7,
      status: "PENDING",
      save: sandbox.stub().resolves(),
    });

    const res = await request(app)
      .patch("/api/bookings/7/status")
      .send({ status: "DONE" });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal("Invalid booking status");
    expect(transaction.rollback.calledOnce).to.be.true;
  });
});
