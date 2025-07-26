// Deploy Payment Config Endpoint
// This script adds the missing /api/payment/config endpoint to the backend

const express = require('express');
const router = express.Router();

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

module.exports = router; 