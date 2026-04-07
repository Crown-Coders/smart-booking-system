// routes/therapists.js - REVERT TO ORIGINAL WORKING VERSION
const express = require('express');
const router = express.Router();
const { TherapistProfile, User, Service } = require("../models");
const bcrypt = require('bcrypt');

const SERVICE_CATALOG = {
  "Educational Psychologist": {
    description: "Academic, emotional, and developmental support for learners.",
  },
  "Couple Therapy": {
    description: "Strengthen communication, repair trust, and rebuild connection.",
  },
  "Occupational Therapist": {
    description: "Support for daily functioning, adjustment, and recovery.",
  },
  "Speech and Language Therapy": {
    description: "Professional help with communication and language development.",
  },
  "Family Therapist": {
    description: "Navigate conflict, transitions, and healthier family dynamics.",
  },
  Counselling: {
    description: "General emotional support for stress, grief, and life challenges.",
  },
  "Trauma Counselling": {
    description: "Compassionate trauma-informed care for recovery and grounding.",
  },
};

const serializeTherapistProfile = async (profile) => {
  const user = await User.findByPk(profile.userId, {
    attributes: ['id', 'name', 'email', 'idNumber', 'role']
  });

  const services = await Service.findAll({
    where: { therapistId: profile.id, isActive: true },
    attributes: ['id', 'name', 'description', 'durationMinutes', 'price', 'isActive'],
    order: [['createdAt', 'ASC']],
  });

  return {
    id: profile.id,
    specialization: profile.specialization,
    yearsOfExperience: profile.yearsOfExperience,
    licenseNumber: profile.licenseNumber,
    typeOfPractice: profile.typeOfPractice,
    qualification: profile.qualification,
    bio: profile.bio,
    image: profile.image,
    workingDays: profile.workingDays || '1,2,3,4,5',
    workDayStart: profile.workDayStart || '08:00',
    workDayEnd: profile.workDayEnd || '17:00',
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
    services,
    user: user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      idNumber: user.idNumber,
      role: user.role
    } : null
  };
};

// GET all therapists - using manual fetching (NO include)
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all therapists...');
    
    // Fetch all therapist profiles
    const therapistProfiles = await TherapistProfile.findAll();
    console.log(`Found ${therapistProfiles.length} therapist profiles`);

    // For each profile, fetch the corresponding user manually
    const therapists = await Promise.all(
      therapistProfiles.map((profile) => serializeTherapistProfile(profile))
    );

    console.log('Sending therapists data');
    res.json(therapists);
  } catch (err) {
    console.error('Error in GET /api/therapists:', err);
    res.status(500).json({ error: 'Failed to fetch therapists' });
  }
});

// POST add a new therapist
router.post('/', async (req, res) => {
  try {
    const {
      name,
      surname,
      email,
      password,
      specialty,
      yearsOfExperience,
      licenseNumber,
      typeOfPractice,
      bio,
      image,
      workingDays,
      workDayStart,
      workDayEnd,
    } = req.body;

    if (!SERVICE_CATALOG[specialty]) {
      return res.status(400).json({
        message: 'Invalid specialty. Please choose one of the predefined service categories.',
      });
    }

    const idNumber = '8901015009087';

    // Check if email exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: `${name} ${surname}`,
      email,
      password: hashedPassword,
      idNumber,
      role: 'THERAPIST',
      isStaff: true,
      isActive: true
    });

    // Create therapist profile
    const therapistProfile = await TherapistProfile.create({
      userId: user.id,
      specialization: specialty,
      yearsOfExperience,
      licenseNumber,
      typeOfPractice,
      workingDays: workingDays || '1,2,3,4,5',
      workDayStart: workDayStart || '08:00',
      workDayEnd: workDayEnd || '17:00',
      bio,
      image: image || null
    });

    await Service.create({
      therapistId: therapistProfile.id,
      name: specialty,
      description: SERVICE_CATALOG[specialty].description,
      durationMinutes: 60,
      price: 800,
      isActive: true,
    });

    const fullProfile = await serializeTherapistProfile(therapistProfile);

    res.status(201).json({
      message: 'Therapist created successfully',
      therapist: fullProfile
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create therapist' });
  }
});

// DELETE a therapist
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const therapist = await TherapistProfile.findByPk(id);
    if (!therapist) return res.status(404).json({ message: 'Therapist not found' });
    await Service.destroy({ where: { therapistId: therapist.id } });
    await therapist.destroy();
    res.json({ message: 'Therapist removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET therapist by user ID
router.get('/by-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const therapistProfile = await TherapistProfile.findOne({ where: { userId } });
    if (!therapistProfile) return res.status(404).json({ message: 'Therapist not found' });
    res.json({ therapistId: therapistProfile.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET therapist profile by user ID
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const therapistProfile = await TherapistProfile.findOne({ where: { userId } });
    if (!therapistProfile) return res.status(404).json({ message: 'Therapist profile not found' });
    res.json(await serializeTherapistProfile(therapistProfile));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const therapistProfile = await TherapistProfile.findOne({ where: { userId } });
    if (!therapistProfile) return res.status(404).json({ message: 'Therapist profile not found' });

    const {
      specialization,
      yearsOfExperience,
      licenseNumber,
      qualification,
      bio,
      typeOfPractice,
      workingDays,
      workDayStart,
      workDayEnd,
      image,
    } = req.body;

    if (specialization !== undefined) therapistProfile.specialization = specialization;
    if (yearsOfExperience !== undefined) therapistProfile.yearsOfExperience = yearsOfExperience;
    if (licenseNumber !== undefined) therapistProfile.licenseNumber = licenseNumber;
    if (qualification !== undefined) therapistProfile.qualification = qualification;
    if (bio !== undefined) therapistProfile.bio = bio;
    if (typeOfPractice !== undefined) therapistProfile.typeOfPractice = typeOfPractice;
    if (workingDays !== undefined) therapistProfile.workingDays = workingDays;
    if (workDayStart !== undefined) therapistProfile.workDayStart = workDayStart;
    if (workDayEnd !== undefined) therapistProfile.workDayEnd = workDayEnd;
    if (image !== undefined) therapistProfile.image = image;

    await therapistProfile.save();

    if (specialization !== undefined && SERVICE_CATALOG[specialization]) {
      const existingService = await Service.findOne({ where: { therapistId: therapistProfile.id } });

      if (existingService) {
        existingService.name = specialization;
        existingService.description = SERVICE_CATALOG[specialization].description;
        existingService.durationMinutes = existingService.durationMinutes || 60;
        existingService.price = existingService.price || 800;
        existingService.isActive = true;
        await existingService.save();
      } else {
        await Service.create({
          therapistId: therapistProfile.id,
          name: specialization,
          description: SERVICE_CATALOG[specialization].description,
          durationMinutes: 60,
          price: 800,
          isActive: true,
        });
      }
    }

    res.json(await serializeTherapistProfile(therapistProfile));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update therapist profile' });
  }
});

module.exports = router;
