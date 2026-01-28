import React, { useState } from 'react';
import { X, Crown, Check } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLIC_KEY, PRICES } from '../config/stripe';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const PricingModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    
    try {
      const stripe = await stripePromise;
      
      // Tämä tulee myöhemmin Firebase Functionista
      // Nyt vain placeholder
      alert('Stripe checkout tulossa pian! Price ID: ' + PRICES.PRO_MONTHLY);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Virhe maksun käsittelyssä');
    }
    
    setLoading(false);
  };

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
          
          <h2 className="text-2xl font-black mb-2">Kauppalista Pro+</h2>
          <p className="text-slate-500 mb-6">Paranna ostoskokemustasi premium-ominaisuuksilla</p>

          <div className="bg-slate-50 rounded-2xl p-6 mb-6">
            <div className="text-4xl font-black mb-1">9,99€</div>
            <div className="text-slate-500 text-sm font-bold">per kuukausi</div>
          </div>

          <div className="space-y-3 mb-8 text-left">
            {[
              'Resepti-ideat ja ainesten lisäys',
              'Kategorioitu tuotelista',
              'Pysyvä lista joka säilyy',
              'Nopea pikalisäys',
              'Ei mainoksia'
            ].map((feature, i) => (
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
            {loading ? 'Ladataan...' : 'Aloita Pro+ tilaus'}
          </button>

          <p className="text-xs text-slate-400 mt-4">
            Voit peruuttaa milloin tahansa. Turvallinen maksu Stripen kautta.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;