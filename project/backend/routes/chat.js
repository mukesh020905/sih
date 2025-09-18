const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/chat/messages/:id
// @desc    Get messages with a specific user
// @access  Private
router.get('/messages/:id', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const otherUser = await User.findById(req.params.id);

    if (!currentUser || !otherUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // For simplicity, let's assume messages are stored in a separate collection
    // For now, we'll return dummy messages
    const messages = [
      {
        sender: otherUser._id,
        receiver: currentUser._id,
        text: 'Hi there!',
        createdAt: new Date(Date.now() - 60000).toISOString(),
      },
      {
        sender: currentUser._id,
        receiver: otherUser._id,
        text: 'Hello! How are you?',
        createdAt: new Date().toISOString(),
      },
    ];

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/chat/messages
// @desc    Send a message to a user
// @access  Private
router.post('/messages', auth, async (req, res) => {
  const { receiverId, text } = req.body;

  try {
    const sender = await User.findById(req.user.id);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // For simplicity, we'll just return the sent message
    const newMessage = {
      sender: sender._id,
      receiver: receiver._id,
      text,
      createdAt: new Date().toISOString(),
    };

    res.json(newMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;