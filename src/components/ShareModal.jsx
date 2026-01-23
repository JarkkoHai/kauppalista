import React from 'react';
import { 
  Share2, 
  Copy, 
  MessageCircle, 
  CheckCircle2 
} from 'lucide-react';

const ShareModal = ({ roomCode, copied, onClose, onCopyCode, onWhatsAppShare }) => {
  return (
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
            onClick={onCopyCode}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${copied ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-50 bg-slate-50 text-slate-600 hover:border-emerald-200'}`}
          >
            {copied ? <CheckCircle2 className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
            <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'Kopioitu!' : 'Kopioi'}</span>
          </button>
          
          <button 
            onClick={onWhatsAppShare}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-emerald-600 hover:border-emerald-200 transition-all"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
          </button>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black shadow-lg shadow-slate-200 active:scale-95 transition-all uppercase"
        >
          Sulje
        </button>
      </div>
    </div>
  );
};

export default ShareModal;