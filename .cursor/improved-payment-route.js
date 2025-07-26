const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const userModel = require('../models/userModel');

// Use environment variable for Stripe key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Validate Stripe key
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('ERROR: STRIPE_SECRET_KEY not found in environment variables');
}

// Get Stripe configuration (publishable key)
router.get('/config', (req, res) => {
  try {
    // Extract publishable key from secret key
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error('[Payment Config] ERROR: STRIPE_SECRET_KEY not found');
      return res.status(500).json({ error: 'Stripe configuration not found' });
    }
    
    // Convert secret key to publishable key format
    // Stripe secret keys start with sk_test_ or sk_live_
    // Publishable keys start with pk_test_ or pk_live_
    const publishableKey = secretKey.replace('sk_test_', 'pk_test_').replace('sk_live_', 'pk_live_');
    
    console.log('[Payment Config] Returning Stripe configuration');
    res.json({ 
      publishableKey: publishableKey,
      currency: 'usd'
    });
    
  } catch (error) {
    console.error('[Payment Config] Error:', error);
    res.status(500).json({ error: 'Failed to get Stripe configuration' });
  }
});

router.post('/create-payment-intent', async (req, res) => {
  const { amount, discountCode, phone } = req.body;

  console.log(`[Payment] Creating payment intent: amount=${amount}, discountCode=${discountCode}, phone=${phone}`);

  // Validate required fields
  if (!amount || amount <= 0) {
    console.log('[Payment] Error: Invalid amount');
    return res.status(400).json({ error: 'Invalid amount' });
  }

  // If discount code is GBC100, make it free
  if (discountCode === 'GBC100') {
    console.log('[Payment] Discount code GBC100 applied - payment is free');
    return res.json({ 
      clientSecret: null, 
      free: true,
      message: 'Payment is free with discount code'
    });
  }

  try {
    console.log(`[Payment] Creating Stripe payment intent for $${amount}`);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: { 
        phone: phone || '',
        discountCode: discountCode || '',
        timestamp: new Date().toISOString()
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log(`[Payment] Payment intent created successfully: ${paymentIntent.id}`);
    
    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
      currency: 'usd'
    });
    
  } catch (err) {
    console.error('[Payment] Stripe error:', err);
    res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: err.message 
    });
  }
});

// Stripe webhook to mark user as paid
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  console.log('[Webhook] Received webhook event');
  
  if (!endpointSecret) {
    console.error('[Webhook] ERROR: STRIPE_WEBHOOK_SECRET not found');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], endpointSecret);
    console.log(`[Webhook] Event verified: ${event.type}`);
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const phone = paymentIntent.metadata.phone;
      
      console.log(`[Webhook] Payment succeeded for phone: ${phone}`);
      
      if (phone) {
        try {
          await userModel.markUserAsPaid(phone);
          console.log(`[Webhook] User marked as paid: ${phone}`);
        } catch (err) {
          console.error('[Webhook] Error marking user as paid:', err);
        }
      }
      break;
      
    case 'payment_intent.payment_failed':
      console.log('[Webhook] Payment failed:', event.data.object.id);
      break;
      
    default:
      console.log(`[Webhook] Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Get payment status
router.get('/payment-status/:paymentIntentId', async (req, res) => {
  const { paymentIntentId } = req.params;
  
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    res.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      created: new Date(paymentIntent.created * 1000).toISOString()
    });
  } catch (err) {
    console.error('[Payment Status] Error:', err);
    res.status(500).json({ error: 'Failed to retrieve payment status' });
  }
});

module.exports = router; 