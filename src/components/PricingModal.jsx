import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Crown, Check } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLIC_KEY, PRICES } from '../config/stripe';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const PricingModal = ({ onClose, user }) => { // ← Lisää user prop
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    
    try {
      // Tarkista että käyttäjä on kirjautunut
      if (!user || user.isAnonymous) {
        alert('Kirjaudu ensin Pro+ tilille aloittaaksesi tilauksen.');
        setLoading(false);
        return;
      }
      
      console.log('🔵 Calling Firebase Function...');
      console.log('Price ID:', PRICES.PRO_MONTHLY);
      console.log('User ID:', user.uid); // ← Oikea user ID
      
      const response = await fetch('https://us-central1-kauppalista-pro.cloudfunctions.net/createCheckoutSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: PRICES.PRO_MONTHLY,
          userId: user.uid, // ← KÄYTÄ OIKEAA USER ID:tä!
        }),
      });

      console.log('🔵 Response status:', response.status);
      
      const data = await response.json();
      console.log('🔵 Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Unknown error');
      }

      const checkoutUrl = data.url;
      console.log('🔵 Redirecting to:', checkoutUrl);
      
      window.location.href = checkoutUrl;
      
    } catch (error) {
      console.error('🔴 Error:', error);
      alert('Virhe: ' + error.message);
      setLoading(false);
    }
  };

  const features = [
    t('pricing.features.recipes'),
    t('pricing.features.categories'),
    t('pricing.features.persistent'),
    t('pricing.features.quickAdd'),
    t('pricing.features.noAds')
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-slate-900" />
          </div>
          
          <h2 className="text-2xl font-black mb-2">{t('pricing.title')}</h2>
          <p className="text-slate-500 mb-6">{t('pricing.subtitle')}</p>

          <div className="bg-slate-50 rounded-2xl p-6 mb-6">
            <div className="text-4xl font-black mb-1">{t('pricing.price')}</div>
            <div className="text-slate-500 text-sm font-bold">{t('pricing.period')}</div>
          </div>

          <div className="space-y-3 mb-8 text-left">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="bg-emerald-100 rounded-full p-1">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="font-bold text-slate-700">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-4 rounded-2xl font-black shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? t('app.loading') : t('pricing.button')}
          </button>

          <p className="text-xs text-slate-400 mt-4">
            {t('pricing.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;