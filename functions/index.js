const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
  // CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    // Haetaan environment variablesta
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      throw new Error('Stripe key not configured');
    }
    
    const stripe = require('stripe')(stripeSecretKey);

    const { priceId, userId } = req.body;

    if (!priceId || !userId) {
      res.status(400).json({ error: 'Missing parameters' });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://kauppalista-pro.web.app?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://kauppalista-pro.web.app',
      client_reference_id: userId,
      metadata: { userId },
    });

    // Palauta URL
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});