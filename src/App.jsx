import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // ← LISÄÄ TÄMÄ
import { createList, joinList, getUserLatestList } from './utils/listService';
import { generateRoomCode } from './utils/helpers';
import { 
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
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { auth, db, COLLECTION_PATH, APP_ID } from './config/firebase';
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Check, 
  LogOut,
  ChefHat,
  Menu,
  Share2,
  ArchiveX,
  ChevronDown,
  ChevronUp,
  Tag,
  } from 'lucide-react';
import { CATEGORIES, RECIPES } from './data/constants';
import LoginScreen from './components/LoginScreen';
import ShareModal from './components/ShareModal';
import Sidebar from './components/Sidebar';

const ShoppingListApp = ({ roomCode, isPro, user, onLeave }) => {
  const { t } = useTranslation(); // ← LISÄÄ TÄMÄ

  console.log('👤 Current user ID:', user?.uid);
  console.log('🏠 Room code:', roomCode);
  //console.log('🟣 ShoppingListApp rendered with:', { roomCode, isPro, userId: user?.uid });
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
  //console.log('🔵 Setting up items listener for listId:', roomCode);
  
  const q = collection(db, 'list_items');
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const allDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const filtered = allDocs
      .filter(item => item.listId === roomCode)
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    
    //console.log('🔵 Items loaded:', filtered.length);
    setItems(filtered);
    setLoading(false);
  }, (err) => {
    //console.error('🔴 Error loading items:', err);
  });

  return () => {
    //console.log('🔵 Cleaning up listener');
    unsubscribe();
  };
}, [roomCode]); // ← TÄRKEÄÄ: vain roomCode dependency

  const addItem = async (text, recipeName = null) => {
  if (!text.trim()) return;
  try {
    await addDoc(collection(db, 'list_items'), {
      text: text.trim(),
      completed: false,
      listId: roomCode, // Yhdistä listaan
      createdAt: serverTimestamp(),
      userId: user.uid,
      recipeName: recipeName
    });
  } catch (err) { console.error(err); }
};

  const toggleItem = async (id, status) => {
  await updateDoc(doc(db, 'list_items', id), { 
    completed: !status 
  });
};

 const deleteItem = async (id) => {
  await deleteDoc(doc(db, 'list_items', id));
};

  const clearList = async () => {
  const batch = writeBatch(db);
  items.forEach(item => {
    batch.delete(doc(db, 'list_items', item.id));
  });
  await batch.commit();
};

  const addRecipe = async (recipe) => {
  const batch = writeBatch(db);
  recipe.items.forEach(item => {
    const newDocRef = doc(collection(db, 'list_items'));
    batch.set(newDocRef, {
      text: item,
      completed: false,
      listId: roomCode,
      createdAt: serverTimestamp(),
      userId: user.uid,
      recipeName: recipe.name
    });
  });
  await batch.commit();
  setSidebarOpen(false);
};

  const handleCopyCode = () => {
  const shareUrl = `${window.location.origin}/join/${roomCode}`;
  const el = document.createElement('textarea');
  el.value = shareUrl;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

  const handleWhatsAppShare = () => {
  const shareUrl = `${window.location.origin}/join/${roomCode}`;
  const message = encodeURIComponent(`Heippa! Tule mukaan muokkaamaan kauppalistaa! 🛒✨\n\n${shareUrl}`);
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
    
    <Sidebar
      isOpen={sidebarOpen}
      isPro={isPro}
      user={user}
      onClose={() => setSidebarOpen(false)}
      onAddItem={addItem}
      onAddRecipe={addRecipe}
    />

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
                <Share2 className="w-3 h-3" /> {t('app.shareCode')}
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
                <span className="hidden lg:inline uppercase">{t('app.clear')}</span>
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
              placeholder={t('app.addItem')}
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
              <p className="text-xs font-black uppercase tracking-widest">{t('app.loading')}</p>
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
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('app.otherItems')}</h3>
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
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('app.completed')} ({completedItems.length})</span>
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
                  <p className="font-black text-xl text-slate-800 uppercase tracking-tighter">{t('app.emptyTitle')}</p>
                  <p className="text-sm font-bold">{t('app.emptySubtitle')}</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Jakomoduali - WhatsApp ja Kopiointi */}
{showShareModal && (
  <ShareModal
    roomCode={roomCode}
    copied={copied}
    onClose={() => setShowShareModal(false)}
    onCopyCode={handleCopyCode}
    onWhatsAppShare={handleWhatsAppShare}
  />
)}

      
    </div>
  );
};
const JoinPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const joinListFromUrl = async () => {
      console.log('🔵 JoinPage: code =', code);
      
      if (!code) {
        console.log('🔴 No code, redirecting to home');
        navigate('/');
        return;
      }
      
      try {
        // Kirjaudu jos ei ole vielä kirjautunut
        let currentUser = auth.currentUser;
        console.log('🔵 Current user:', currentUser?.uid);
        
        if (!currentUser) {
          console.log('🔵 No user, signing in anonymously...');
          const userCredential = await signInAnonymously(auth);
          currentUser = userCredential.user;
          console.log('🔵 Signed in as:', currentUser.uid);
        }
        
        // Liity listaan (lisää jäseneksi)
        console.log('🔵 Calling joinList with:', code.toUpperCase(), currentUser.uid);
        const result = await joinList(code.toUpperCase(), currentUser.uid);
        console.log('🔵 joinList result:', result);
        
        if (result.success) {
          const newSession = { code: result.code, isPro: false };
          localStorage.setItem('shopping_session_pro_v2', JSON.stringify(newSession));
          console.log('🟢 Session saved, navigating to home');
          navigate('/');
        } else {
          console.error('🔴 joinList failed:', result.error);
          alert('Virhe listan liittymisessä: ' + (result.error?.message || 'Tuntematon virhe'));
          navigate('/');
        }
      } catch (error) {
        console.error('🔴 Exception in joinListFromUrl:', error);
        alert('Virhe: ' + error.message);
        navigate('/');
      }
    };
    
    joinListFromUrl();
  }, [code, navigate]);
  
  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="ml-4 font-bold text-slate-600">Liitytään listaan...</p>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/join/:code" element={<JoinPage />} />
        <Route path="/" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
}

// Siirrä vanha App-logiikka MainApp-komponenttiin
function MainApp() {
  const { i18n } = useTranslation();
  
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // ← VAIN TÄMÄ
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem('shopping_session_pro_v2');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        // Ei kirjautunut käyttäjä
        if (localStorage.getItem('shopping_session_pro_v2')) {
          signInAnonymously(auth).catch(e => console.error(e));
        }
      } else {
        // Käyttäjä on kirjautunut
        setUser(u);
        
        // Jos käyttäjä on kirjautunut emaililla mutta ei ole sessiota
        // JA ei ole kirjautumassa ulos
        if (!session && !u.isAnonymous && !isLoggingOut) {
          console.log('🔵 Pro user logged in, fetching their list...');
          
          // Hae käyttäjän lista
          const existingList = await getUserLatestList(u.uid);
          
          if (existingList.success) {
            console.log('📂 Restoring session with list:', existingList.code);
            const restoredSession = { 
              code: existingList.code, 
              isPro: true 
            };
            setSession(restoredSession);
            localStorage.setItem('shopping_session_pro_v2', JSON.stringify(restoredSession));
          } else {
            console.log('📂 No list found, user needs to create one');
          }
        }
      }
    });
    return () => unsubscribe();
  }, [session, isLoggingOut]);

  const handleJoin = async (code, isPro = false) => {
    let currentUser = auth.currentUser;
    
    if (!currentUser) {
      const userCredential = await signInAnonymously(auth);
      currentUser = userCredential.user;
    }
    
    const result = await joinList(code, currentUser.uid);
    
    if (result.success) {
      const newSession = { code: result.code, isPro };
      setSession(newSession);
      localStorage.setItem('shopping_session_pro_v2', JSON.stringify(newSession));
    } else {
      console.error('Failed to join/create list:', result.error);
      alert('Virhe listan luomisessa/liittymisessä');
    }
  };

  // ← POISTA TÄMÄ: const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setSession(null);
    localStorage.removeItem('shopping_session_pro_v2');
    await signOut(auth);
    setUser(null);
    setIsLoggingOut(false);
  };

  if (session && !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <LoginScreen 
      key={i18n.language}
      onJoin={(code) => handleJoin(code, false)} 
      onProLogin={async (u) => {
        console.log('🔵 onProLogin called with user:', u.uid);
        localStorage.removeItem('shopping_session_pro_v2');
        
        // Yritä hakea käyttäjän vanha lista
        console.log('🔵 Fetching user latest list...');
        const existingList = await getUserLatestList(u.uid);
        console.log('🔵 getUserLatestList result:', existingList);
        
        if (existingList.success) {
          console.log('📂 Rejoining existing list:', existingList.code);
          handleJoin(existingList.code, true);
        } else {
          console.log('📂 Creating new list');
          const newCode = generateRoomCode();
          console.log('📂 New code generated:', newCode);
          handleJoin(newCode, true);
        }
      }}
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