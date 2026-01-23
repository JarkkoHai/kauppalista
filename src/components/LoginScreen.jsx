import React, { useState } from 'react';
import { 
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { 
  ShoppingCart, 
  ChevronRight, 
  Crown, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { auth } from '../config/firebase';

const LoginScreen = ({ onJoin, onProLogin }) => {
  const [roomCode, setRoomCode] = useState('');
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [email, setEmail] = useState(localStorage.getItem('saved_email') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(localStorage.getItem('remember_me') === 'true');
  const [error, setError] = useState('');

  const handleProLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (rememberMe) {
        localStorage.setItem('saved_email', email);
        localStorage.setItem('remember_me', 'true');
      } else {
        localStorage.removeItem('saved_email');
        localStorage.removeItem('remember_me');
      }
      
      onProLogin(userCredential.user);
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          onProLogin(userCredential.user);
        } catch (err) {
          setError('Kirjautuminen epäonnistui. Tarkista tiedot.');
          console.error(err);
        }
      } else {
        setError('Virhe kirjautumisessa.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center border border-emerald-100 relative">
        <div className="bg-emerald-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
          <ShoppingCart className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-black mb-2 tracking-tight uppercase">Kauppalista Pro</h1>
        <p className="text-slate-500 mb-8 font-medium italic">Suunnittele ja jaa perheen kesken.</p>
        
        {!showEmailLogin ? (
          <div className="space-y-4">
            <div className="space-y-3">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="SYÖTÄ RYHMÄKOODI"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-black text-center text-lg tracking-widest transition-all placeholder:text-slate-300 uppercase"
              />
              <button 
                onClick={() => roomCode && onJoin(roomCode.trim().toUpperCase())}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 active:scale-95 transition-all"
              >
                ALOITA KÄYTTÖ
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <button 
                onClick={() => setShowEmailLogin(true)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-lg active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-400 p-1.5 rounded-lg">
                    <Crown className="w-4 h-4 text-slate-900 fill-slate-900" />
                  </div>
                  <span className="font-bold text-sm">Pro+ Kirjautuminen</span>
                </div>
                <ChevronRight className="w-5 h-5 opacity-50" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProLogin} className="space-y-4 text-left">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sähköposti</label>
              <div className="relative mt-1">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-300" />
                <input 
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-50 focus:border-emerald-500 outline-none transition-all font-bold"
                  placeholder="matti@esimerkki.fi"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Salasana</label>
              <div className="relative mt-1">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-300" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 border-slate-50 focus:border-emerald-500 outline-none transition-all font-bold"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-1 pb-2">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-200 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="remember" className="text-xs font-bold text-slate-500 select-none">
                Muista minut tällä laitteella
              </label>
            </div>

            <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-200 active:scale-95 transition-all">
              KIRJAUDU SISÄÄN
            </button>
            <button type="button" onClick={() => setShowEmailLogin(false)} className="w-full text-center text-xs font-bold text-slate-400 py-2">
              Palaa takaisin
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;