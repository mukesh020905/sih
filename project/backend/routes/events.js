const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @route   POST api/events
// @desc    Create an event
// @access  Private
router.post('/', auth, async (req, res) => {
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
    res.json(event);
  } catch (err) {
    console.error(err.message);
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

