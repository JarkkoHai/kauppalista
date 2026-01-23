import React from 'react';
import { 
  Crown, 
  X, 
  ChefHat, 
  User as UserIcon 
} from 'lucide-react';
import { CATEGORIES, RECIPES } from '../data/constants';

const Sidebar = ({ isOpen, isPro, user, onClose, onAddItem, onAddRecipe }) => {
  if (!isPro) return null;

  return (
    <>
      <aside className={`
        fixed md:relative z-40 h-full w-72 bg-white border-r border-slate-100 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-emerald-600" />
              <h2 className="font-black text-slate-800 uppercase tracking-tighter text-xl text-nowrap">PRO-TYÖKALUT</h2>
            </div>
            <button onClick={onClose} className="md:hidden p-2 text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-8 scrollbar-hide pr-2">
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pikalisäys</h3>
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="mb-4">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <cat.icon className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">{cat.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map(item => (
                      <button 
                        key={item}
                        onClick={() => onAddItem(item)}
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
                    onClick={() => onAddRecipe(recipe)}
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

      {/* Overlay mobiilinäkymässä */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-30 md:hidden backdrop-blur-sm" 
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default Sidebar;