import React from 'react';
import { useTranslation } from 'react-i18next'; // ← LISÄÄ TÄMÄ
import { QRCodeSVG } from 'qrcode.react';
import { 
  Share2, 
  Copy, 
  MessageCircle, 
  CheckCircle2 
} from 'lucide-react';

const ShareModal = ({ roomCode, copied, onClose, onCopyCode, onWhatsAppShare }) => {
   const { t } = useTranslation(); // ← JA TÄMÄ!
  const shareUrl = `${window.location.origin}/join/${roomCode}`;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
      <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="bg-emerald-100 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Share2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">{t('share.title')}</h2>
        <p className="text-slate-500 text-sm mb-8 font-medium italic">{t('share.subtitle')}</p>
        
        {/* TÄHÄN tulee QR-koodi ja linkit koodi */}
        <div className="space-y-4 mb-6">
          {/* QR-koodi */}
          <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 flex justify-center">
            <QRCodeSVG 
              value={shareUrl} 
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          
          {/* Linkki ja koodi */}
          <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-100">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase">{t('share.linkLabel')}</p>
            <p className="text-xs font-mono text-emerald-600 break-all select-all bg-white p-2 rounded-lg border border-slate-200">{shareUrl}</p>
            <p className="text-xs text-slate-400 mt-3 mb-1">{t('share.codeLabel')}</p>
            <p className="text-2xl font-black tracking-widest text-slate-700 uppercase text-center">{roomCode}</p>
          </div>
        </div>

        {/* Napit jatkuvat täällä */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={onCopyCode}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${copied ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-50 bg-slate-50 text-slate-600 hover:border-emerald-200'}`}
          >
            {copied ? <CheckCircle2 className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
            <span className="text-[10px] font-black uppercase tracking-widest">
  {copied ? t('share.copied') : t('share.copy')}
</span>
          </button>
          
          <button 
            onClick={onWhatsAppShare}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-emerald-600 hover:border-emerald-200 transition-all"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t('share.whatsapp')}</span>
          </button>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black shadow-lg shadow-slate-200 active:scale-95 transition-all uppercase"
        >
          {t('share.close')}
        </button>
      </div>
    </div>
  );
};

export default ShareModal;