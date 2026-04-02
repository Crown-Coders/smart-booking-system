// backend/tests/chatbot.integration.test.js
const request = require('supertest');
const { expect } = require('chai');
const { sequelize, User, TherapistProfile, AvailabilitySlot } = require('../models');
const app = require('../index');
const jwt = require('jsonwebtoken');

describe('Chatbot API Integration Tests', () => {
  let testUser;
  let testTherapist;
  let testTherapistUser;
  let testToken;

  beforeAll(async () => {
    // Sync database and create test data
    await sequelize.sync({ force: true });
    
    // Create test user with all required fields
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword123',
      idNumber: '1234567890123', // Required field
      role: 'user',
      isActive: true
    });

    // Create test therapist user with all required fields
    testTherapistUser = await User.create({
      name: 'Dr. Test Therapist',
      email: 'therapist@example.com',
      password: 'hashedpassword123',
      idNumber: '9876543210987', // Required field
      role: 'therapist',
      isActive: true
    });

    testTherapist = await TherapistProfile.create({
      userId: testTherapistUser.id,
      specialization: 'CBT',
      bio: 'Experienced CBT therapist',
      yearsOfExperience: 5
    });

    // Create availability slots
    await AvailabilitySlot.bulkCreate([
      {
        therapistId: testTherapist.id,
        date: '2024-01-20',
        startTime: '09:00',
        endTime: '10:00',
        isBooked: false
      },
      {
        therapistId: testTherapist.id,
        date: '2024-01-20',
        startTime: '10:00',
        endTime: '11:00',
        isBooked: false
      }
    ]);

    testToken = jwt.sign({ id: testUser.id }, process.env.JWT_SECRET || 'test-secret');
  });

  afterAll(async () => {
    // Clean up test data
    await sequelize.close();
  });

  describe('Real Database Interactions', () => {
    it('should properly execute get_available_therapists tool with real data', async () => {
      const response = await request(app)
        .post('/api/chatbot')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          history: [
            { role: 'user', content: 'Show me CBT therapists' }
          ]
        });

      expect(response.status).to.equal(200);
      expect(response.body.reply).to.be.a('string');
    });

    it('should check real availability slots', async () => {
      const response = await request(app)
        .post('/api/chatbot')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          history: [
            { role: 'user', content: `Check availability for therapist ${testTherapist.id} on 2024-01-20` }
          ]
        });

      expect(response.status).to.equal(200);
      expect(response.body.reply).to.be.a('string');
    });
  });
});