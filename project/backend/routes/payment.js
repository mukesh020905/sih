const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route   POST api/payment/razorpay
// @desc    Create a Razorpay order
// @access  Public
router.post('/razorpay', async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency: 'INR',
    receipt: `receipt_order_${new Date().getTime()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      id: order.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/payment/verification
// @desc    Verify payment signature
// @access  Public
router.post('/verification', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const body = razorpay_order_id + '|' + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    res.json({ success: true, message: 'Payment successful' });
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
});

module.exports = router;
