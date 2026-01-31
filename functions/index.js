const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Älä alusta Stripea heti, vaan vasta kun sitä tarvitaan
let stripe;

exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
  // Alusta Stripe vasta täällä
  if (!stripe) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }

  // CORS
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const priceId = req.body.priceId;
    const userId = req.body.userId;

    if (!priceId || !userId) {
      res.status(400).json({ error: 'Missing parameters' });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: 'https://kauppalista-pro.web.app?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://kauppalista-pro.web.app',
      client_reference_id: userId,
      metadata: {
        userId: userId,
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Käsittele event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;

    console.log('💳 Payment successful for user:', userId);

    // Päivitä käyttäjän Pro+ status
    await admin.firestore().collection('users').doc(userId).set({
      isPro: true,
      stripeCustomerId: session.customer,
      subscriptionId: session.subscription,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    console.log('✅ User upgraded to Pro+:', userId);
  }

  res.status(200).send('OK');
});