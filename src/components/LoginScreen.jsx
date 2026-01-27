import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { generateRoomCode } from '../utils/helpers';
import React, { useState } from 'react';
import { 
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
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
  const { t } = useTranslation();

  
  
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
      
      // Yritä ensin kirjautua sisään
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        if (rememberMe) {
          localStorage.setItem('saved_email', email);
          localStorage.setItem('remember_me', 'true');
        } else {
          localStorage.removeItem('saved_email');
          localStorage.removeItem('remember_me');
        }
        
        onProLogin(userCredential.user);
      } catch (signInError) {
        // Jos käyttäjää ei löydy, luo uusi
        if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            if (rememberMe) {
              localStorage.setItem('saved_email', email);
              localStorage.setItem('remember_me', 'true');
            }
            
            onProLogin(userCredential.user);
          } catch (createError) {
            // Luo käyttäjä epäonnistui
            if (createError.code === 'auth/email-already-in-use') {
              setError(t('login.errors.wrongPassword'));
            } else if (createError.code === 'auth/weak-password') {
              setError(t('login.errors.weakPassword'));
            } else {
              setError(t('login.errors.registrationFailed'));
            }
          }
        } else if (signInError.code === 'auth/wrong-password') {
          setError(t('login.errors.wrongPassword'));
        } else if (signInError.code === 'auth/invalid-email') {
          setError(t('login.errors.invalidEmail'));
        } else {
          setError(t('login.errors.loginFailed'));
        }
      }
    } catch (error) {
      setError(t('login.errors.loginFailed'));
      console.error('Auth error:', error);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      onProLogin(userCredential.user);
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        setError(t('login.errors.cancelled'));
      } else {
        setError(t('login.errors.googleFailed'));
        console.error('Google login error:', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <LanguageSwitcher /> {/* ← LISÄÄ TÄMÄ */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center border border-emerald-100 relative">
        <div className="bg-emerald-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
          <ShoppingCart className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-black mb-2 tracking-tight uppercase">{t('login.title')}</h1>
        <p className="text-slate-500 mb-8 font-medium italic">{t('login.subtitle')}</p>
        
        {!showEmailLogin ? (
          <div className="space-y-4">
            <div className="space-y-3">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder={t('login.codeInput')}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-black text-center text-lg tracking-widest transition-all placeholder:text-slate-300 uppercase"
              />
              <p className="text-xs text-slate-400 font-bold">
                {t('login.codeHelp')}
              </p>
              <button 
                onClick={() => {
                  if (roomCode) {
                    onJoin(roomCode.trim().toUpperCase());
                  } else {
                    const newCode = generateRoomCode();
                    onJoin(newCode);
                  }
                }}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 active:scale-95 transition-all"
              >
                {t('login.startButton')}
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
                  <span className="font-bold text-sm">{t('login.proButton')}</span>
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
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('login.email')}</label>
              <div className="relative mt-1">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-300" />
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-50 focus:border-emerald-500 outline-none transition-all font-bold"
                  placeholder="matti@esimerkki.fi"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('login.password')}</label>
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
                {t('login.rememberMe')}
              </label>
            </div>

            <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-200 active:scale-95 transition-all">
              {t('login.loginButton')}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs font-bold">
                <span className="bg-white px-3 text-slate-400 uppercase tracking-widest">{t('login.or')}</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 py-3.5 rounded-2xl font-bold hover:border-slate-300 active:scale-95 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('login.googleButton')}
            </button>

            <button type="button" onClick={() => setShowEmailLogin(false)} className="w-full text-center text-xs font-bold text-slate-400 py-2">
              {t('login.backButton')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;