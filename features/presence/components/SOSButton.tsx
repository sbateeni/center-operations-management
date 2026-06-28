


import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Siren } from 'lucide-react';

interface SOSButtonProps {
  isActive: boolean;
  onToggle: () => void;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ isActive, onToggle }) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearCountdown = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setCountdown(null);
  }, []);

  useEffect(() => () => clearCountdown(), [clearCountdown]);

  const handleClick = () => {
    // If SOS is active, deactivate immediately
    if (isActive) {
      clearCountdown();
      onToggle();
      return;
    }

    // If countdown is running, cancel it
    if (countdown !== null) {
      clearCountdown();
      return;
    }

    // Start 3-second countdown
    setCountdown(3);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearCountdown();
          onToggle();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const isCountingDown = countdown !== null;

  return (
    <button 
      onClick={handleClick}
      className={`
        fixed bottom-24 right-4 z-[500] 
        w-16 h-16 rounded-full flex items-center justify-center 
        shadow-2xl border-4 transition-all duration-300
        ${isActive 
          ? 'bg-red-600 border-red-400 animate-pulse scale-110 shadow-red-900/50' 
          : isCountingDown 
            ? 'bg-yellow-600 border-yellow-400 scale-110 shadow-yellow-900/50'
            : 'bg-slate-900 border-slate-700 hover:bg-red-900/20 hover:border-red-900/50'}
      `}
      title={isActive ? "إلغاء الاستغاثة" : isCountingDown ? "إلغاء العد التنازلي" : "إطلاق نداء استغاثة"}
    >
      {isCountingDown ? (
        <span className="text-white text-2xl font-black animate-countdown">{countdown}</span>
      ) : (
        <Siren 
          size={32} 
          className={`transition-all ${isActive ? 'text-white animate-spin' : 'text-red-500'}`} 
        />
      )}
      
      {/* Ripple Effect when Active */}
      {isActive && (
        <>
          <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-75"></div>
          <div className="absolute inset-[-10px] rounded-full border-2 border-red-500 animate-ping opacity-50 delay-75"></div>
        </>
      )}
      
      {/* Countdown ring */}
      {isCountingDown && (
        <div className="absolute inset-[-4px] rounded-full border-4 border-yellow-400 animate-ping opacity-60"></div>
      )}
    </button>
  );
};
