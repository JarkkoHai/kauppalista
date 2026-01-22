import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Check, 
  LogOut,
  ChevronRight,
  Crown,
  ChefHat,
  Apple,
  Milk,
  Beef,
  Menu,
  X,
  Mail,
  Lock,
  User as UserIcon,
  Share2,
  ArchiveX,
  ChevronDown,
  ChevronUp,
  Tag,
  Copy,
  MessageCircle,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const COLLECTION_PATH = "shared_shopping_lists";
const APP_ID = "kauppalista-pro-v1";

// --- Mock Data ---
const CATEGORIES = [
  { id: 'hevi', name: 'HeVi', icon: <Apple className="w-4 h-4" />, items: ['Omena', 'Banaani', 'Kurkku', 'Tomaatti', 'Porkkana', 'Sipuli'] },
  { id: 'maito', name: 'Maitotuotteet', icon: <Milk className="w-4 h-4" />, items: ['Maito', 'Kaurajuoma', 'Juusto', 'Voi', 'Jogurtti', 'Rahka'] },
  { id: 'liha', name: 'Liha & Proteiini', icon: <Beef className="w-4 h-4" />, items: ['Jauheliha', 'Kanafilee', 'Lohi', 'Kananmuna', 'Nakki'] },
];

const RECIPES = [
  { id: 'r1', name: 'Bolognese', items: ['Jauheliha', 'Tomaattimurska', 'Spagetti', 'Sipuli', 'Valkosipuli'] },
  { id: 'r2', name: 'Kanakeitto', items: ['Kana', 'Keittojuurekset', 'Peruna', 'Kanaliemikuutio'] },
  { id: 'r3', name: 'Lohipasta', items: ['Lohi', 'Kerma', 'Pasta', 'Sitruuna', 'Tilli'] },
];

// --- Components ---

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
      // Asetetaan pysyvyys valinnan mukaan
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
        // Jos käyttäjää ei löydy, yritetään luoda uusi tunnus (tämä on oletuslogiikka aiemmin)
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

const ShoppingListApp = ({ roomCode, isPro, user, onLeave }) => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const q = collection(db, 'artifacts', APP_ID, 'public', 'data', COLLECTION_PATH);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filtered = allDocs
        .filter(item => item.roomCode === roomCode)
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setItems(filtered);
      setLoading(false);
    }, (err) => console.error(err));

    return () => unsubscribe();
  }, [roomCode]);

  const addItem = async (text, recipeName = null) => {
    if (!text.trim()) return;
    try {
      await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', COLLECTION_PATH), {
        text: text.trim(),
        completed: false,
        roomCode,
        createdAt: serverTimestamp(),
        userId: user.uid,
        recipeName: recipeName
      });
    } catch (err) { console.error(err); }
  };

  const toggleItem = async (id, status) => {
    await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', COLLECTION_PATH, id), { 
      completed: !status 
    });
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', COLLECTION_PATH, id));
  };

  const clearList = async () => {
    const batch = writeBatch(db);
    items.forEach(item => {
      batch.delete(doc(db, 'artifacts', APP_ID, 'public', 'data', COLLECTION_PATH, item.id));
    });
    await batch.commit();
  };

  const addRecipe = async (recipe) => {
    const batch = writeBatch(db);
    recipe.items.forEach(item => {
      const newDocRef = doc(collection(db, 'artifacts', APP_ID, 'public', 'data', COLLECTION_PATH));
      batch.set(newDocRef, {
        text: item,
        completed: false,
        roomCode,
        createdAt: serverTimestamp(),
        userId: user.uid,
        recipeName: recipe.name
      });
    });
    await batch.commit();
    setSidebarOpen(false);
  };

  const handleCopyCode = () => {
    const el = document.createElement('textarea');
    el.value = roomCode;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(`Heippa! Tule mukaan muokkaamaan kauppalistaa Kauppalista Prossa koodilla: *${roomCode}* 🛒✨`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const activeItems = items.filter(i => !i.completed);
  const completedItems = items.filter(i => i.completed);

  const groupedActive = activeItems.reduce((acc, item) => {
    const key = item.recipeName || 'muut';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const renderItem = (item, compact = false) => (
    <div 
      key={item.id} 
      className={`bg-white ${compact ? 'p-3' : 'p-4'} rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-all`}
    >
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => toggleItem(item.id, item.completed)} 
          className={`w-7 h-7 rounded-full border-2 ${item.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 hover:border-emerald-500'} flex items-center justify-center transition-all`}
        >
          {item.completed ? <Check className="w-4 h-4" /> : <Check className="w-4 h-4 opacity-0 group-hover:opacity-20" />}
        </button>
        <span className={`font-bold ${item.completed ? 'text-slate-400 line-through italic text-sm' : 'text-slate-700 text-lg'}`}>
          {item.text}
        </span>
      </div>
      <button onClick={() => deleteItem(item.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
        <Trash2 className={compact ? "w-4 h-4" : "w-5 h-5"} />
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 max-w-6xl mx-auto overflow-hidden font-sans relative text-slate-800">
      
      {/* Sidebar - Pro Työkalut */}
      <aside className={`
        fixed md:relative z-40 h-full w-72 bg-white border-r border-slate-100 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${!isPro && 'hidden md:hidden'}
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-emerald-600" />
              <h2 className="font-black text-slate-800 uppercase tracking-tighter text-xl text-nowrap">PRO-TYÖKALUT</h2>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-8 scrollbar-hide pr-2">
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pikalisäys</h3>
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="mb-4">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    {cat.icon}
                    <span className="text-[10px] font-bold uppercase">{cat.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map(item => (
                      <button 
                        key={item}
                        onClick={() => addItem(item)}
                        className="bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 transition-all border border-slate-100 active:scale-90"
                      >
                        + {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Resepti-ideat</h3>
              <div className="grid gap-2">
                {RECIPES.map(recipe => (
                  <button 
                    key={recipe.id}
                    onClick={() => addRecipe(recipe)}
                    className="text-left p-3 rounded-2xl bg-slate-50 hover:bg-emerald-600 hover:text-white transition-all group border border-slate-100"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <ChefHat className="w-4 h-4 text-emerald-500 group-hover:text-white" />
                      <span className="font-bold text-sm">{recipe.name}</span>
                    </div>
                    <p className="text-[10px] opacity-60 font-medium">Lisää {recipe.items.length} ainesta</p>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{user.email || 'Anonyymi'}</p>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Premium Jäsen</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Pääsisältö */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-100 p-4 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-3 overflow-hidden">
            {isPro && (
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 bg-slate-100 rounded-xl text-slate-600">
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-lg shadow-emerald-100 hidden sm:block">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="font-black text-slate-800 leading-tight uppercase tracking-tight text-base sm:text-lg truncate">{roomCode}</h1>
              <button 
                onClick={() => setShowShareModal(true)}
                className="text-[10px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-1.5 hover:text-emerald-700 transition-colors"
              >
                <Share2 className="w-3 h-3" /> Jaa ryhmäkoodi
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button 
                onClick={clearList} 
                className="p-2.5 text-slate-400 hover:text-red-600 transition-all flex items-center gap-2 font-bold text-xs"
                title="Tyhjennä koko lista"
              >
                <ArchiveX className="w-5 h-5" />
                <span className="hidden lg:inline uppercase">Tyhjennä</span>
              </button>
            )}
            <button onClick={onLeave} className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all active:scale-90" title="Poistu ryhmästä">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Syöttökenttä */}
        <div className="p-4 md:p-6 bg-slate-50/80 backdrop-blur-md sticky top-0 z-20">
          <form 
            onSubmit={(e) => { e.preventDefault(); addItem(newItem); setNewItem(''); }} 
            className="flex gap-2 bg-white p-2 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Lisää uusi tuote..."
              className="flex-1 px-4 outline-none font-bold text-slate-700 placeholder:text-slate-300"
            />
            <button 
              type="submit" 
              className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all"
            >
              <Plus className="w-6 h-6 stroke-[3px]" />
            </button>
          </form>
        </div>

        {/* Lista */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-10 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-30">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xs font-black uppercase tracking-widest">Ladataan...</p>
            </div>
          ) : (
            <>
              {/* Ryhmitellyt Reseptit */}
              <div className="space-y-8 pt-4">
                {Object.entries(groupedActive).map(([recipeName, recipeItems]) => (
                  recipeName !== 'muut' && (
                    <div key={recipeName} className="relative p-4 mt-4 rounded-3xl border-2 border-emerald-100 bg-emerald-50/20 space-y-3">
                      <div className="absolute -top-3.5 left-6 px-3 bg-emerald-600 text-white rounded-full py-1 flex items-center gap-1.5 shadow-md shadow-emerald-100">
                        <ChefHat className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-wider">{recipeName}</span>
                      </div>
                      {recipeItems.map(item => renderItem(item, true))}
                    </div>
                  )
                ))}
              </div>

              {/* Muut tuotteet */}
              {groupedActive['muut'] && groupedActive['muut'].length > 0 && (
                <div className="space-y-3">
                  {Object.keys(groupedActive).length > 1 && (
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Muut ostokset</h3>
                  )}
                  {groupedActive['muut'].map(item => renderItem(item))}
                </div>
              )}

              {/* Kerätyt */}
              {completedItems.length > 0 && (
                <div className="pt-4">
                  <button 
                    onClick={() => setShowCompleted(!showCompleted)}
                    className="w-full flex items-center justify-between p-2 mb-4 text-slate-400 hover:text-slate-600 transition-all border-b border-slate-100"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">KERÄTYT ({completedItems.length})</span>
                    {showCompleted ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  {showCompleted && (
                    <div className="space-y-2">
                      {completedItems.map(item => (
                        <div key={item.id} className="relative group">
                          {renderItem(item, true)}
                          {item.recipeName && (
                            <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[8px] font-black text-slate-300 uppercase">
                              <Tag className="w-2 h-2" />
                              {item.recipeName}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {items.length === 0 && (
                <div className="text-center py-20 opacity-20">
                  <ShoppingCart className="w-20 h-20 mx-auto mb-4" />
                  <p className="font-black text-xl text-slate-800 uppercase tracking-tighter">Lista on tyhjä</p>
                  <p className="text-sm font-bold">Lisää jotain yläpuolelta!</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Jakomoduali - WhatsApp ja Kopiointi */}
      {showShareModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-100 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Share2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">Kutsu tiimiisi</h2>
            <p className="text-slate-500 text-sm mb-8 font-medium italic">Muut voivat liittyä tällä koodilla:</p>
            
            <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-100 mb-8 relative group">
              <p className="text-4xl font-black tracking-widest text-emerald-600 uppercase select-all">{roomCode}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                onClick={handleCopyCode}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${copied ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-50 bg-slate-50 text-slate-600 hover:border-emerald-200'}`}
              >
                {copied ? <CheckCircle2 className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'Kopioitu!' : 'Kopioi'}</span>
              </button>
              
              <button 
                onClick={handleWhatsAppShare}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-emerald-600 hover:border-emerald-200 transition-all"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
              </button>
            </div>

            <button 
              onClick={() => setShowShareModal(false)}
              className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black shadow-lg shadow-slate-200 active:scale-95 transition-all uppercase"
            >
              Sulje
            </button>
          </div>
        </div>
      )}

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-30 md:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem('shopping_session_pro_v2');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    // Tarkistetaan onko käyttäjä jo kirjautunut (Firebase Auth hoitaa pysyvyyden)
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        // Jos ei sessiota, ei pakoteta anonyymiä heti, jotta LoginScreen näkyy puhtaana
        // Mutta jos session koodi on jo olemassa (LocalStorage), kirjaudutaan anonyymisti
        if (localStorage.getItem('shopping_session_pro_v2')) {
          signInAnonymously(auth).catch(e => console.error(e));
        }
      } else {
        setUser(u);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleJoin = (code, isPro = false) => {
    const newSession = { code, isPro };
    setSession(newSession);
    localStorage.setItem('shopping_session_pro_v2', JSON.stringify(newSession));
    
    // Jos kirjaudutaan anonyymisti koodilla
    if (!auth.currentUser) {
       signInAnonymously(auth);
    }
  };

  const handleLogout = async () => {
    setSession(null);
    localStorage.removeItem('shopping_session_pro_v2');
    await signOut(auth);
    setUser(null);
  };

  // Ladataan tilaa
  if (session && !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <LoginScreen 
      onJoin={(code) => handleJoin(code, false)} 
      onProLogin={(u) => handleJoin('TIIMI-PRO', true)} 
    />;
  }

  return (
    <ShoppingListApp 
      roomCode={session.code} 
      isPro={session.isPro} 
      user={user} 
      onLeave={handleLogout} 
    />
  );
}