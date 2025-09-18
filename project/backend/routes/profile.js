const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sendEmail = require('../utils/sendEmail');

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

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Error: File upload only supports the following filetypes - ' + filetypes);
  }
});

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
    role,
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
  if (role !== undefined) profileFields.role = role;

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


// @route   POST api/profile/connect/:id
// @desc    Send a connection request
// @access  Private
router.post('/connect/:id', auth, async (req, res) => {
  try {
    const sender = await User.findById(req.user.id);
    const receiver = await User.findById(req.params.id);

    if (!sender || !receiver) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if already connected
    if (sender.connections.some(conn => conn.user.toString() === req.params.id)) {
      return res.status(400).json({ msg: 'Already connected' });
    }

    // Check if request already sent
    if (sender.sentRequests.some(req => req.user.toString() === req.params.id)) {
      return res.status(400).json({ msg: 'Connection request already sent' });
    }

    // Check if request already received from this user
    if (sender.receivedRequests.some(req => req.user.toString() === req.params.id)) {
      return res.status(400).json({ msg: 'Connection request already received from this user. Please accept it.' });
    }

    // Add to sender's sentRequests
    sender.sentRequests.unshift({ user: req.params.id });
    await sender.save();

    // Add to receiver's receivedRequests
    receiver.receivedRequests.unshift({ user: req.user.id });
    await receiver.save();

    // Send email notification
    try {
      await sendEmail({
        email: receiver.email,
        subject: 'New Connection Request',
        message: `You have a new connection request from ${sender.name}. Please log in to your account to accept or reject it.`,
      });
    } catch (emailErr) {
      console.error('Error sending email:', emailErr);
      // Note: We don't want to fail the whole request if email sending fails
    }

    res.json({ msg: 'Connection request sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/accept/:id
// @desc    Accept a connection request
// @access  Private
router.put('/accept/:id', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const requester = await User.findById(req.params.id);

    if (!currentUser || !requester) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if request exists in receivedRequests
    if (!currentUser.receivedRequests.some(req => req.user.toString() === req.params.id)) {
      return res.status(400).json({ msg: 'No connection request from this user' });
    }

    // Remove from current user's receivedRequests
    currentUser.receivedRequests = currentUser.receivedRequests.filter(
      req => req.user.toString() !== req.params.id
    );
    // Add to current user's connections
    currentUser.connections.unshift({ user: req.params.id });
    await currentUser.save();

    // Remove from requester's sentRequests
    requester.sentRequests = requester.sentRequests.filter(
      req => req.user.toString() !== req.user.id
    );
    // Add to requester's connections
    requester.connections.unshift({ user: req.user.id });
    await requester.save();

    res.json({ msg: 'Connection accepted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile/reject/:id
// @desc    Reject a connection request
// @access  Private
router.delete('/reject/:id', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const requester = await User.findById(req.params.id);

    if (!currentUser || !requester) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if request exists in receivedRequests
    if (!currentUser.receivedRequests.some(req => req.user.toString() === req.params.id)) {
      return res.status(400).json({ msg: 'No connection request from this user' });
    }

    // Remove from current user's receivedRequests
    currentUser.receivedRequests = currentUser.receivedRequests.filter(
      req => req.user.toString() !== req.params.id
    );
    await currentUser.save();

    // Remove from requester's sentRequests
    requester.sentRequests = requester.sentRequests.filter(
      req => req.user.toString() !== req.user.id
    );
    await requester.save();

    res.json({ msg: 'Connection request rejected' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.mentorship === 'true') {
      query.isEnrolledInMentorship = true;
    }
    if (req.query.role) {
      query.role = req.query.role;
    }
    const profiles = await User.find(query).select('name profilePicture headline skills interests role');
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;