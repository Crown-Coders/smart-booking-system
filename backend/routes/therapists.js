// routes/therapists.js - REVERT TO ORIGINAL WORKING VERSION
const express = require('express');
const router = express.Router();
const { TherapistProfile, User } = require("../models");
const bcrypt = require('bcrypt');

const buildTherapistResponse = (profile, user) => ({
  id: profile?.id || null,
  userId: user?.id || profile?.userId || null,
  name: user?.name || '',
  email: user?.email || '',
  phone: user?.phone || '',
  idNumber: user?.idNumber || '',
  role: user?.role || '',
  specialization: profile?.specialization || '',
  qualification: profile?.qualification || '',
  yearsOfExperience: profile?.yearsOfExperience || 0,
  licenseNumber: profile?.licenseNumber || '',
  typeOfPractice: profile?.typeOfPractice || '',
  bio: profile?.bio || '',
  image: profile?.image || null,
  createdAt: profile?.createdAt || user?.createdAt || null,
  updatedAt: profile?.updatedAt || user?.updatedAt || null,
});

// GET all therapists - using manual fetching (NO include)
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all therapists...');
    
    // Fetch all therapist profiles
    const therapistProfiles = await TherapistProfile.findAll();
    console.log(`Found ${therapistProfiles.length} therapist profiles`);

    // For each profile, fetch the corresponding user manually
    const therapists = await Promise.all(
      therapistProfiles.map(async (profile) => {
        const user = await User.findByPk(profile.userId, {
          attributes: ['id', 'name', 'email', 'phone', 'idNumber', 'role']
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
            phone: user.phone,
            idNumber: user.idNumber,
            role: user.role
          } : null
        };
      })
    );

    console.log('Sending therapists data');
    res.json(therapists);
  } catch (err) {
    console.error('Error in GET /api/therapists:', err);
    res.status(500).json({ error: 'Failed to fetch therapists' });
  }
});

// GET therapist profile by user id
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'phone', 'idNumber', 'role', 'createdAt', 'updatedAt']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await TherapistProfile.findOne({ where: { userId: user.id } });
    return res.json(buildTherapistResponse(profile, user));
  } catch (err) {
    console.error('Error in GET /api/therapists/:userId:', err);
    return res.status(500).json({ message: 'Failed to fetch therapist profile' });
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
    console.error(err);
    res.status(500).json({ error: 'Failed to create therapist' });
  }
});

// UPDATE therapist profile by user id
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      name,
      email,
      phone,
      idNumber,
      specialization,
      qualification,
      yearsOfExperience,
      licenseNumber,
      typeOfPractice,
      bio,
      image
    } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    user.name = typeof name === 'string' ? name : user.name;
    user.email = typeof email === 'string' ? email : user.email;
    user.phone = typeof phone === 'string' ? phone : user.phone;
    user.idNumber = typeof idNumber === 'string' ? idNumber : user.idNumber;
    await user.save();

    const [profile] = await TherapistProfile.findOrCreate({
      where: { userId: user.id },
      defaults: {
        userId: user.id,
        specialization: specialization || '',
        qualification: qualification || '',
        yearsOfExperience: Number.isFinite(Number(yearsOfExperience)) ? Number(yearsOfExperience) : 0,
        licenseNumber: licenseNumber || '',
        typeOfPractice: typeOfPractice || '',
        bio: bio || '',
        image: image || null
      }
    });

    if (typeof specialization === 'string') profile.specialization = specialization;
    if (typeof qualification === 'string') profile.qualification = qualification;
    if (yearsOfExperience !== undefined) profile.yearsOfExperience = Number(yearsOfExperience) || 0;
    if (typeof licenseNumber === 'string') profile.licenseNumber = licenseNumber;
    if (typeof typeOfPractice === 'string') profile.typeOfPractice = typeOfPractice;
    if (typeof bio === 'string') profile.bio = bio;
    if (typeof image === 'string' || image === null) profile.image = image;

    await profile.save();

    return res.json(buildTherapistResponse(profile, user));
  } catch (err) {
    console.error('Error in PUT /api/therapists/:userId:', err);
    return res.status(500).json({ message: 'Failed to update therapist profile' });
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
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;