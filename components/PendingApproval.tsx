
import React, { useState } from 'react';
import { Shield, Clock, LogOut, UserX, RefreshCw, Loader2, User } from 'lucide-react';

interface PendingApprovalProps {
  onLogout: () => void;
  isDeleted?: boolean;
  email?: string;
  onCheckStatus: () => Promise<void>;
}

export const PendingApproval: React.FC<PendingApprovalProps> = ({ 
  onLogout, 
  isDeleted = false, 
  email,
  onCheckStatus 
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleLogoutClick = () => {
    setIsLoggingOut(true);
    onLogout();
  };

  const handleCheckStatus = async () => {
    setIsChecking(true);
    await onCheckStatus();
    setTimeout(() => setIsChecking(false), 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
         <div className={`absolute top-[20%] right-[20%] w-[400px] h-[400px] rounded-full blur-[100px] ${isDeleted ? 'bg-red-900/10' : 'bg-blue-900/10'}`}></div>
         <div className={`absolute bottom-[10%] left-[10%] w-[300px] h-[300px] rounded-full blur-[80px] ${isDeleted ? 'bg-red-900/5' : 'bg-blue-900/5'}`}></div>
      </div>

      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl relative z-10 text-center animate-fade-up">
        
        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
           {isDeleted ? (
             <UserX className="text-red-500 w-10 h-10" />
           ) : (
             <Shield className="text-blue-500 w-10 h-10 animate-pulse" />
           )}
           
           {!isDeleted && (
             <div className="absolute bottom-0 left-0 bg-slate-900 p-1 rounded-full border border-slate-700">
               <Clock className="text-yellow-500 w-5 h-5" />
             </div>
           )}
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          {isDeleted ? 'لم يتم العثور على الحساب' : 'الحساب قيد المراجعة'}
        </h1>
        
        {email && (
            <div className="inline-flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full mb-6 border border-slate-700/50">
                <User size={14} className="text-slate-400" />
                <span className="text-sm text-slate-300 font-mono" dir="ltr">{email}</span>
            </div>
        )}
        
        <p className="text-slate-400 mb-8 leading-relaxed">
          {isDeleted ? (
            <span>
              يبدو أن حسابك قد تم حذفه من قاعدة البيانات.
              <br/>
              يرجى تسجيل الخروج وإنشاء حساب جديد.
            </span>
          ) : (
            <span>
              تم إنشاء حسابك بنجاح، لكن الوصول إلى هذا النظام الآمن يتطلب موافقة مسبقة.
              <br /><br />
              <span className="text-blue-400 font-semibold bg-blue-900/20 px-2 py-1 rounded">يجب أن يقوم المسؤول بالموافقة على حسابك</span> قبل أن تتمكن من الدخول.
            </span>
          )}
        </p>

        <div className="space-y-4">
          {!isDeleted && (
            <button 
              onClick={handleCheckStatus}
              disabled={isChecking}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isChecking ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
              {isChecking ? 'جاري التحقق...' : 'التحقق من الحالة'}
            </button>
          )}
          
          <button 
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            className={`w-full font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${isDeleted ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
          >
            {isLoggingOut ? <Loader2 className="animate-spin" size={18} /> : <LogOut size={18} />}
            {isDeleted ? 'تسجيل الخروج وإعادة البدء' : 'تسجيل الخروج'}
          </button>
        </div>
      </div>
    </div>
  );
};
