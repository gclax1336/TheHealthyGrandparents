const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51RdCw8RCwgGZn0bR1UYxZeNAy9xDLrq4bswHDAEhEceQOg7Kl7M6QpjCW4DSRqgfs1GOzOmGPHFn3yOKB534CteZ00e13QXYxq'); // Your secret key
const userModel = require('../models/userModel');

router.post('/create-payment-intent', async (req, res) => {
  const { amount, discountCode, phone } = req.body;

  // If discount code is GBC100, make it free
  if (discountCode === 'GBC100') {
    return res.json({ clientSecret: null, free: true });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in cents
      currency: 'usd',
      metadata: { phone: phone || '' },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stripe webhook to mark user as paid
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const phone = paymentIntent.metadata.phone;
    if (phone) {
      await userModel.markUserAsPaid(phone);
    }
  }
  res.json({ received: true });
});

module.exports = router; 