const express = require("express");
const request = require("supertest");
const { expect } = require("chai");
const sinon = require("sinon");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authRoutes = require("../routes/auth");
const userRoutes = require("../routes/users");
const { User } = require("../models");

const buildApp = (router, basePath) => {
  const app = express();
  app.use(express.json());
  app.use(basePath, router);
  return app;
};

describe("Auth Routes", () => {
  let sandbox;
  let app;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    app = buildApp(authRoutes, "/api/auth");
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("rejects register requests with missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Nqobile", email: "nqobile@example.com" });

    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal("All fields are required");
  });

  it("creates a client user on register and returns a token", async () => {
    sandbox.stub(User, "findOne").resolves(null);
    sandbox.stub(bcrypt, "hash").resolves("hashed-password");
    sandbox.stub(User, "create").resolves({
      id: 7,
      role: "CLIENT",
      isStaff: false,
      isSuperUser: false,
      isActive: true,
    });
    sandbox.stub(jwt, "sign").returns("signed-token");

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Nqobile",
        surname: "Magwaza",
        email: "nqobile@example.com",
        password: "Secret123!",
        idNumber: "9001015009087",
      });

    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal("User registered");
    expect(res.body.token).to.equal("signed-token");
    expect(User.create.calledOnce).to.be.true;
    expect(User.create.firstCall.args[0].role).to.equal("CLIENT");
  });

  it("rejects login when account is inactive", async () => {
    sandbox.stub(User, "findOne").resolves({
      id: 3,
      email: "inactive@example.com",
      password: "hashed",
      isActive: false,
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "inactive@example.com", password: "Secret123!" });

    expect(res.status).to.equal(403);
    expect(res.body.message).to.equal("Account is inactive");
  });

  it("logs in a valid user", async () => {
    sandbox.stub(User, "findOne").resolves({
      id: 4,
      name: "Admin User",
      email: "admin@example.com",
      password: "hashed",
      role: "ADMIN",
      isStaff: true,
      isSuperUser: false,
      isActive: true,
      idNumber: "9001015009087",
      cardHolderName: null,
      cardBrand: null,
      cardLast4: null,
      cardExpiryMonth: null,
      cardExpiryYear: null,
    });
    sandbox.stub(bcrypt, "compare").resolves(true);
    sandbox.stub(jwt, "sign").returns("login-token");

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "Secret123!" });

    expect(res.status).to.equal(200);
    expect(res.body.token).to.equal("login-token");
    expect(res.body.user.email).to.equal("admin@example.com");
    expect(res.body.user.role).to.equal("ADMIN");
  });
});

describe("User Routes", () => {
  let sandbox;
  let app;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    app = buildApp(userRoutes, "/api/users");
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("returns all users", async () => {
    sandbox.stub(User, "findAll").resolves([
      {
        id: 1,
        name: "User One",
        email: "one@example.com",
        role: "CLIENT",
        idNumber: "1",
        isStaff: false,
        isSuperUser: false,
        isActive: true,
      },
    ]);

    const res = await request(app).get("/api/users");

    expect(res.status).to.equal(200);
    expect(res.body).to.have.length(1);
    expect(res.body[0].email).to.equal("one@example.com");
  });

  it("updates a user", async () => {
    const save = sandbox.stub().resolves();
    sandbox.stub(User, "findByPk").resolves({
      id: 2,
      name: "Old Name",
      email: "old@example.com",
      idNumber: "123",
      role: "CLIENT",
      isStaff: false,
      isSuperUser: false,
      isActive: true,
      save,
    });
    sandbox.stub(User, "findOne").resolves(null);

    const res = await request(app)
      .patch("/api/users/2")
      .send({
        name: "New Name",
        email: "new@example.com",
        idNumber: "9001015009087",
        role: "therapist",
      });

    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal("New Name");
    expect(res.body.role).to.equal("THERAPIST");
    expect(res.body.isStaff).to.equal(true);
    expect(save.calledOnce).to.be.true;
  });

  it("deactivates a user", async () => {
    const user = {
      id: 5,
      name: "User Five",
      email: "five@example.com",
      role: "CLIENT",
      idNumber: "5",
      isStaff: false,
      isSuperUser: false,
      isActive: true,
      save: sandbox.stub().resolves(),
    };
    sandbox.stub(User, "findByPk").resolves(user);

    const res = await request(app).patch("/api/users/5/deactivate");

    expect(res.status).to.equal(200);
    expect(res.body.isActive).to.equal(false);
    expect(user.isActive).to.equal(false);
  });

  it("activates a user", async () => {
    const user = {
      id: 6,
      name: "User Six",
      email: "six@example.com",
      role: "CLIENT",
      idNumber: "6",
      isStaff: false,
      isSuperUser: false,
      isActive: false,
      save: sandbox.stub().resolves(),
    };
    sandbox.stub(User, "findByPk").resolves(user);

    const res = await request(app).patch("/api/users/6/activate");

    expect(res.status).to.equal(200);
    expect(res.body.isActive).to.equal(true);
    expect(user.isActive).to.equal(true);
  });
});
