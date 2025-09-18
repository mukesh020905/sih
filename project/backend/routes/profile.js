const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile
// @desc    Update user profile
// @access  Private
router.put('/', auth, async (req, res) => {
  const {
    name,
    email,
    headline,
    bio,
    website,
    linkedin,
    github,
    twitter,
    skills,
    experience,
    education,
    projects,
    certifications,
    interests,
  } = req.body;

  // Build profile object
  const profileFields = {};
  if (name !== undefined) profileFields.name = name;
  if (email !== undefined) profileFields.email = email;
  if (headline !== undefined) profileFields.headline = headline;
  if (bio !== undefined) profileFields.bio = bio;
  if (website !== undefined) profileFields.website = website;
  if (linkedin !== undefined) profileFields.linkedin = linkedin;
  if (github !== undefined) profileFields.github = github;
  if (twitter !== undefined) profileFields.twitter = twitter;

  // Handle array fields: convert comma-separated string to array, filter out empty strings
  if (skills !== undefined) {
    profileFields.skills = skills.split(',').map((skill) => skill.trim()).filter(s => s !== '');
  }
  if (certifications !== undefined) {
    profileFields.certifications = certifications.split(',').map((cert) => cert.trim()).filter(c => c !== '');
  }
  if (interests !== undefined) {
    profileFields.interests = interests.split(',').map((interest) => interest.trim()).filter(i => i !== '');
  }

  if (experience !== undefined) {
    profileFields.experience = experience.split('\n').map(exp => {
      const [title, company] = exp.split(' at ');
      return { title, company };
    });
  }
  if (education !== undefined) {
    profileFields.education = education.split('\n').map(edu => {
      const [degree, fieldOfStudy] = edu.split(' in ');
      return { degree, fieldOfStudy };
    });
  }
  if (projects !== undefined) {
    profileFields.projects = projects.split('\n').map(proj => {
      return { title: proj };
    });
  }

  try {
    let user = await User.findById(req.user.id);

    if (user) {
      // Update
      user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: profileFields },
        { new: true }
      ).select('-password');

      return res.json(user);
    }
    res.status(404).json({ msg: 'User not found' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile/picture
// @desc    Upload profile picture
// @access  Private
router.post('/picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Delete old profile picture if it exists
    if (user.profilePicture) {
      const oldPicturePath = path.join(__dirname, '..', user.profilePicture);
      if (fs.existsSync(oldPicturePath)) {
        fs.unlinkSync(oldPicturePath);
      }
    }

    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ profilePicture: user.profilePicture });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/mentorship
// @desc    Update mentorship enrollment status
// @access  Private
router.put('/mentorship', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.isEnrolledInMentorship = !user.isEnrolledInMentorship;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;