// routes/therapists.js - REVERT TO ORIGINAL WORKING VERSION
const express = require('express');
const router = express.Router();
const { TherapistProfile, User } = require("../models");
const bcrypt = require('bcrypt');

// GET all therapists - using manual fetching (NO include)
router.get('/', async (req, res) => {
  try {
    // Fetch all therapist profiles
    const therapistProfiles = await TherapistProfile.findAll();

    // For each profile, fetch the corresponding user manually
    const therapists = await Promise.all(
      therapistProfiles.map(async (profile) => {
        const user = await User.findByPk(profile.userId, {
          attributes: ['id', 'name', 'email', 'idNumber', 'role']
        });

        return {
          id: profile.id,
          specialization: profile.specialization,
          yearsOfExperience: profile.yearsOfExperience,
          licenseNumber: profile.licenseNumber,
          typeOfPractice: profile.typeOfPractice,
          bio: profile.bio,
          image: profile.image,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
          user: user ? {
            id: user.id,
            name: user.name,
            email: user.email,
            idNumber: user.idNumber,
            role: user.role
          } : null
        };
      })
    );

    res.json(therapists);
  } catch (err) {
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
      image
    } = req.body;

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
      bio,
      image: image || null
    });

    const fullProfile = {
      id: therapistProfile.id,
      specialization: therapistProfile.specialization,
      yearsOfExperience: therapistProfile.yearsOfExperience,
      licenseNumber: therapistProfile.licenseNumber,
      typeOfPractice: therapistProfile.typeOfPractice,
      bio: therapistProfile.bio,
      image: therapistProfile.image,
      createdAt: therapistProfile.createdAt,
      updatedAt: therapistProfile.updatedAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        idNumber: user.idNumber,
        role: user.role
      }
    };

    res.status(201).json({
      message: 'Therapist created successfully',
      therapist: fullProfile
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create therapist' });
  }
});

// DELETE a therapist
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const therapist = await TherapistProfile.findByPk(id);
    if (!therapist) return res.status(404).json({ message: 'Therapist not found' });
    await therapist.destroy();
    res.json({ message: 'Therapist removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;