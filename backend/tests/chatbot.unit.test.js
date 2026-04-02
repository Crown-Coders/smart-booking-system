// backend/tests/chatbot.unit.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { expect } = require('chai');
const sinon = require('sinon');

const app = require('../index');
const { User, TherapistProfile, AvailabilitySlot } = require('../models');
const { executeFunctionCall, callLLM } = require('../routes/chatbot');

/* ------------------------------------------------------------------ */
/* ------------------- UNIT TESTS: TOOL LOGIC ------------------------ */
/* ------------------------------------------------------------------ */
describe('Chatbot Logic – executeFunctionCall', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('get_available_therapists', () => {
    it('returns all therapists when no specialty filter', async () => {
      sandbox.stub(TherapistProfile, 'findAll').resolves([
        { id: 1, userId: 2, specialization: 'CBT', bio: 'Bio 1' },
        { id: 2, userId: 3, specialization: 'Anxiety', bio: 'Bio 2' }
      ]);
      const userStub = sandbox.stub(User, 'findByPk');
      userStub.withArgs(2).resolves({ id: 2, name: 'Dr. Smith' });
      userStub.withArgs(3).resolves({ id: 3, name: 'Dr. Jones' });

      const result = await executeFunctionCall('get_available_therapists', {});
      const parsed = JSON.parse(result);
      expect(parsed).to.have.length(2);
      expect(parsed[0].name).to.equal('Dr. Smith');
      expect(parsed[1].name).to.equal('Dr. Jones');
    });

    it('filters therapists by specialty', async () => {
      sandbox.stub(TherapistProfile, 'findAll').resolves([
        { id: 1, userId: 2, specialization: 'CBT', bio: '' },
        { id: 2, userId: 3, specialization: 'Anxiety', bio: '' }
      ]);
      const userStub = sandbox.stub(User, 'findByPk');
      userStub.withArgs(2).resolves({ id: 2, name: 'Dr. Smith' });
      userStub.withArgs(3).resolves({ id: 3, name: 'Dr. Jones' });

      const result = await executeFunctionCall('get_available_therapists', { specialty: 'CBT' });
      const parsed = JSON.parse(result);
      expect(parsed).to.have.length(1);
      expect(parsed[0].name).to.equal('Dr. Smith');
    });

    it('returns alternatives when no exact match', async () => {
      sandbox.stub(TherapistProfile, 'findAll').resolves([
        { id: 1, userId: 2, specialization: 'CBT', bio: '' }
      ]);
      sandbox.stub(User, 'findByPk').withArgs(2).resolves({ id: 2, name: 'Dr. Smith' });

      const result = await executeFunctionCall('get_available_therapists', { specialty: 'Trauma' });
      const parsed = JSON.parse(result);
      expect(parsed.error).to.exist;
      expect(parsed.alternatives).to.have.length(1);
    });
  });

  describe('get_available_slots', () => {
    it('returns available slots', async () => {
      sandbox.stub(AvailabilitySlot, 'findAll').resolves([
        { therapistId: 1, date: '2024-01-20', startTime: '09:00', endTime: '10:00', isBooked: false }
      ]);
      const result = await executeFunctionCall('get_available_slots', { therapistId: '1', date: '2024-01-20' });
      expect(result).to.include('09:00-10:00');
    });

    it('returns no-slots message when empty', async () => {
      sandbox.stub(AvailabilitySlot, 'findAll').resolves([]);
      const result = await executeFunctionCall('get_available_slots', { therapistId: '1', date: '2024-01-20' });
      expect(result).to.equal('No available slots for that therapist on that date.');
    });
  });

  describe('error handling', () => {
    it('handles database errors gracefully', async () => {
      sandbox.stub(AvailabilitySlot, 'findAll').rejects(new Error('DB Error'));
      const result = await executeFunctionCall('get_available_slots', { therapistId: '1', date: '2024-01-20' });
      expect(result).to.equal('I encountered a database error.');
    });

    it('returns unknown function message', async () => {
      const result = await executeFunctionCall('invalid_fn', {});
      expect(result).to.equal('Unknown function');
    });
  });
});

/* ------------------------------------------------------------------ */
/* -------------------- INTEGRATION: API ROUTE ----------------------- */
/* ------------------------------------------------------------------ */
describe('Chatbot API Route', () => {
  let sandbox;
  let token;
  let callLLMStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    token = jwt.sign({ id: 1 }, 'test-secret');
    callLLMStub = sandbox.stub(require('../routes/chatbot'), 'callLLM');

    // Stub all model methods to avoid real DB calls
    sandbox.stub(User, 'findByPk').resolves({ id: 1, name: 'John Doe' });
    sandbox.stub(TherapistProfile, 'findAll').resolves([]);
    sandbox.stub(AvailabilitySlot, 'findAll').resolves([]);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('handles a basic chat request', async () => {
    callLLMStub.resolves({ choices: [{ message: { content: 'Hello John!', tool_calls: null } }] });
    const res = await request(app)
      .post('/api/chatbot')
      .set('Authorization', `Bearer ${token}`)
      .send({ history: [{ role: 'user', content: 'Hi' }] });
    expect(res.status).to.equal(200);
    expect(res.body.reply).to.include('Hello');
  });

  it('handles missing history safely', async () => {
    callLLMStub.resolves({ choices: [{ message: { content: 'How can I help?', tool_calls: null } }] });
    const res = await request(app)
      .post('/api/chatbot')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).to.equal(200);
    expect(res.body.reply).to.be.a('string');
  });

  it('handles invalid JSON tool arguments safely', async () => {
    callLLMStub.resolves({
      choices: [{
        message: {
          content: null,
          tool_calls: [{ id: 'tool_1', function: { name: 'get_available_therapists', arguments: 'invalid-json' } }]
        }
      }]
    });
    const res = await request(app)
      .post('/api/chatbot')
      .set('Authorization', `Bearer ${token}`)
      .send({ history: [{ role: 'user', content: 'Find therapist' }] });
    expect(res.status).to.equal(200);
    expect(res.body.reply).to.be.a('string');
  });

  it('handles JWT decode returning null', async () => {
    const invalidToken = jwt.sign({}, 'test-secret', { expiresIn: '-1s' });
    // The default stub from beforeEach is already present; we just need to ensure it's not called
    const userFindStub = User.findByPk;
    callLLMStub.resolves({ choices: [{ message: { content: 'Hi', tool_calls: null } }] });

    const res = await request(app)
      .post('/api/chatbot')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send({ history: [{ role: 'user', content: 'Hi' }] });

    expect(res.status).to.equal(200);
    expect(res.body.reply).to.be.a('string');
    // Verify that the user lookup was never attempted
    expect(userFindStub.called).to.be.false;
  });

  it('handles valid token but user not found', async () => {
    const validToken = jwt.sign({ id: 999 }, 'test-secret');
    // Override the default stub to return null for this specific ID
    User.findByPk.restore();
    sandbox.stub(User, 'findByPk').withArgs(999).resolves(null);
    callLLMStub.resolves({ choices: [{ message: { content: 'Hi', tool_calls: null } }] });

    const res = await request(app)
      .post('/api/chatbot')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ history: [{ role: 'user', content: 'Hi' }] });

    expect(res.status).to.equal(200);
    expect(res.body.reply).to.be.a('string');
  });
});

/* ------------------------------------------------------------------ */
/* -------------------- EDGE CASES FOR FULL COVERAGE ---------------- */
/* ------------------------------------------------------------------ */
describe('Chatbot API Route – edge cases', () => {
  let sandbox;
  let token;
  let callLLMStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    token = jwt.sign({ id: 1 }, 'test-secret');
    callLLMStub = sandbox.stub(require('../routes/chatbot'), 'callLLM');

    // Stub all model methods to avoid real DB calls
    sandbox.stub(User, 'findByPk').resolves({ id: 1, name: 'John Doe' });
    sandbox.stub(TherapistProfile, 'findAll').resolves([]);
    sandbox.stub(AvailabilitySlot, 'findAll').resolves([]);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('handles tool call with unknown function', async () => {
    callLLMStub.onFirstCall().resolves({
      choices: [{ message: { content: null, tool_calls: [{ id: 'x', function: { name: 'unknown_fn', arguments: '{}' } }] } }]
    });
    callLLMStub.onSecondCall().resolves({
      choices: [{ message: { content: 'Fallback response', tool_calls: null } }]
    });

    const res = await request(app)
      .post('/api/chatbot')
      .set('Authorization', `Bearer ${token}`)
      .send({ history: [{ role: 'user', content: 'test unknown' }] });

    expect(res.status).to.equal(200);
    expect(res.body.reply).to.be.a('string');
  });

  it('handles tool call returning empty array', async () => {
    // Instead of stubbing executeFunctionCall, we rely on the real function
    // but make the underlying database return an empty array
    TherapistProfile.findAll.resolves([]); // already done in beforeEach, but explicit

    callLLMStub.onFirstCall().resolves({
      choices: [{ message: { content: null, tool_calls: [{ id: 'y', function: { name: 'get_available_therapists', arguments: '{}' } }] } }]
    });
    callLLMStub.onSecondCall().resolves({
      choices: [{ message: { content: 'No results found', tool_calls: null } }]
    });

    const res = await request(app)
      .post('/api/chatbot')
      .set('Authorization', `Bearer ${token}`)
      .send({ history: [{ role: 'user', content: 'find CBT' }] });

    expect(res.status).to.equal(200);
    expect(res.body.reply).to.be.a('string');
  });

  it('covers the “no available slots” branch inside executeFunctionCall', async () => {
    // Retrieve the existing stub (already set in beforeEach)
    const stub = AvailabilitySlot.findAll;
    const result = await executeFunctionCall('get_available_slots', { therapistId: '1', date: '2099-12-31' });
    expect(result).to.equal('No available slots for that therapist on that date.');
    expect(stub.calledOnce).to.be.true;
  });
});