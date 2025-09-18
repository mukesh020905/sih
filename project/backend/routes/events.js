const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
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

// @route   POST api/events/upload
// @desc    Upload an image
// @access  Private
router.post('/upload', auth, upload.single('image'), (req, res) => {
  res.send(`http://localhost:5000/${req.file.path.replace(/\\/g, '/')}`);
});

// @route   POST api/events
// @desc    Create an event
// @access  Private
router.post('/', auth, async (req, res) => {
  console.log('Received request to create event with body:', req.body);
  const {
    title,
    description,
    date,
    time,
    location,
    maxAttendees,
    category,
    image,
    isVirtual,
    rsvp,
  } = req.body;

  try {
    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      maxAttendees,
      category,
      image,
      isVirtual,
      rsvp,
      createdBy: req.user.id,
    });

    const event = await newEvent.save();
    console.log('Saved event:', event);
    res.json(event);
  } catch (err) {
    console.error('Error creating event:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('attendees', ['name', 'profilePicture']);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/events/:id/rsvp
// @desc    RSVP for an event
// @access  Private
router.post('/:id/rsvp', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Check if the user has already RSVP'd
    if (event.attendees.some((attendee) => attendee.toString() === req.user.id)) {
      return res.status(400).json({ msg: "User already RSVP'd" });
    }

    event.attendees.unshift(req.user.id);

    await event.save();

    const user = await User.findById(req.user.id);

    try {
      await sendEmail({
        email: user.email,
        subject: `RSVP Confirmation for ${event.title}`,
        message: `Hi ${user.name},

          You have successfully RSVP'd for the event: ${event.title}.

          We look forward to seeing you there!
`,
      });
    } catch (err) {
      console.error(err);
    }

    res.json(event.attendees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

// @route   PUT api/events/:id
// @desc    Update an event
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const {
    title,
    description,
    date,
    time,
    location,
    maxAttendees,
    category,
    image,
    isVirtual,
    rsvp,
  } = req.body;

  // Build event object
  const eventFields = {};
  if (title) eventFields.title = title;
  if (description) eventFields.description = description;
  if (date) eventFields.date = date;
  if (time) eventFields.time = time;
  if (location) eventFields.location = location;
  if (maxAttendees) eventFields.maxAttendees = maxAttendees;
  if (category) eventFields.category = category;
  if (image) eventFields.image = image;
  if (isVirtual) eventFields.isVirtual = isVirtual;
  if (rsvp) eventFields.rsvp = rsvp;

  try {
    let event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: 'Event not found' });

    // Make sure user owns event
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: eventFields },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: 'Event not found' });

    // Make sure user owns event
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Event.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

