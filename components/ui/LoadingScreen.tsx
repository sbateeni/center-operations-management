


import React, { useState, useEffect } from 'react';
import { Loader2, Shield } from 'lucide-react';

const LOADING_MESSAGES = [
  'تأمين القنوات المشفرة...',
  'ربط الأقمار الصناعية...',
  'تهيئة الخريطة التكتيكية...',
  'مزامنة بيانات الوحدات...',
  'تفعيل نظام التتبع اللحظي...',
];

export const LoadingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 95));
    }, 400);

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('ar-EG', { hour12: false }));
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString('ar-EG', { hour12: false }));

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden" dir="rtl">
      {/* Background Pulse */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute bottom-[20%] left-[20%] w-[300px] h-[300px] bg-purple-900/5 rounded-full blur-[80px] animate-breathe"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6">
        <div className="w-20 h-20 bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl flex items-center justify-center shadow-2xl mb-6 animate-border-glow">
          <Shield className="text-blue-500 w-10 h-10 animate-pulse" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">نظام العمليات الجغرافية</h1>
        
        {/* Live Timestamp */}
        <div className="text-[10px] font-mono text-slate-600 mb-6 tracking-widest uppercase">
          SYS.INIT — {currentTime}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full animate-shimmer rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        
        {/* Rotating Status Message */}
        <div className="flex items-center gap-3 text-slate-400 text-sm font-mono h-6">
          <Loader2 className="animate-spin text-blue-500 shrink-0" size={16} />
          <span className="animate-fade-up" key={messageIndex}>
            {LOADING_MESSAGES[messageIndex]}
          </span>
        </div>
      </div>
    </div>
  );
};
