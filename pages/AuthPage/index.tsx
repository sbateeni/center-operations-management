
import React, { useState, useId } from 'react';
import { ShieldCheck, Mail, Lock, Check, KeyRound, User, Loader2 } from 'lucide-react';
import { auth } from '../../services/auth';
import { db } from '../../services/db';
import { SourceSession } from '../../types';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: '#020617',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Tajawal', system-ui, -apple-system, sans-serif",
    direction: 'rtl',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundGlow: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(15,23,42,0) 70%)',
    top: '50%',
    left: '50%',
    pointerEvents: 'none',
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px rgba(59,130,246,0.05)',
    border: '1px solid rgba(255,255,255,0.05)',
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    animation: 'fadeSlideUp 0.6s ease-out forwards'
  },
  logoBox: {
    width: '70px',
    height: '70px',
    borderRadius: '18px',
    margin: '0 auto 15px auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
  },
  title: { fontSize: '24px', fontWeight: '800', color: 'white', textAlign: 'center', margin: 0 },
  subtitle: { fontSize: '13px', color: '#94a3b8', textAlign: 'center', marginTop: '5px' },
  inputGroup: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    backgroundColor: '#020617',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    padding: '14px 45px 14px 15px',
    fontSize: '15px',
    color: 'white',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  button: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '15px',
    fontWeight: 'bold',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.2s',
  },
  checkboxWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    marginTop: '2px',
    userSelect: 'none',
  }
};

interface AuthPageProps {
  onSourceLogin?: (session: SourceSession) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSourceLogin }) => {
  const rememberId = useId();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'source'>('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  
  const [email, setEmail] = useState(() => localStorage.getItem('ops_saved_email') || '');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [rememberMe, setRememberMe] = useState(() => Boolean(localStorage.getItem('ops_saved_email')));

  const getAuthErrorMessage = (errorMessage: string) => {
    if (errorMessage.includes('Invalid login credentials')) {
      return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
    }
    if (errorMessage.includes('Email not confirmed')) {
      return 'الحساب غير مفعل. يرجى تأكيد البريد الإلكتروني أولاً.';
    }
    if (errorMessage.includes('User already registered')) {
      return 'هذا البريد الإلكتروني مسجل بالفعل.';
    }
    if (errorMessage.includes('Password should be at least 6 characters')) {
      return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.';
    }
    if (errorMessage.includes('إعدادات Supabase غير مكتملة')) {
      return 'تعذر الاتصال بمنظومة التحقق. تأكد من إعدادات البيئة.';
    }
    return authMode === 'signup' ? 'تعذر إنشاء الحساب. حاول مرة أخرى.' : 'تعذر تسجيل الدخول الآن. حاول مرة أخرى.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (authMode === 'source') {
         const res = await db.verifyAccessCode(accessCode);
         if (res.valid && res.expiresAt) {
             onSourceLogin?.({ code: accessCode, expiresAt: res.expiresAt, label: res.label });
         } else throw new Error(res.error || 'كود غير صالح');
      } else if (authMode === 'signup') {
        if (!username.trim()) throw new Error('يرجى إدخال اسم المستخدم');
        const { data, error } = await auth.signUp(email, password, username);
        if (error) throw new Error(getAuthErrorMessage(error.message || ''));
        setMessage({ type: 'success', text: 'تم إنشاء الحساب بنجاح! يرجى تفعيل البريد الإلكتروني قبل تسجيل الدخول.' });
      } else {
        const { error } = await auth.signIn(email, password);
        if (error) throw new Error(getAuthErrorMessage(error.message || ''));

        // إدارة ميزة "تذكرني"
        if (rememberMe) {
          localStorage.setItem('ops_saved_email', email);
        } else {
          localStorage.removeItem('ops_saved_email');
        }
      }
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : 'حدث خطأ';
      setMessage({ type: 'error', text: errorText });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage(null);
    // إعادة تعيين loading بعد 7 ثوانٍ في حال لم يحدث التوجيه
    const fallbackTimer = setTimeout(() => setLoading(false), 7000);
    try {
      const { error } = await auth.signInWithProvider('google');
      clearTimeout(fallbackTimer);
      if (error) throw new Error(error.message || 'فشل بدء تسجيل الدخول بجوجل');
      // عند النجاح ستتم إعادة التوجيه إلى مزود Google من Supabase
    } catch (err: unknown) {
      clearTimeout(fallbackTimer);
      const errorText = err instanceof Error ? err.message : 'حدث خطأ';
      setMessage({ type: 'error', text: errorText });
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundGlow} className="animate-breathe"></div>
      {/* Secondary glow */}
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', top: '30%', left: '30%', pointerEvents: 'none' }} className="animate-breathe" />
      <div style={styles.card}>
        <div style={styles.logoBox}>
          <ShieldCheck size={35} color="white" />
        </div>
        <h1 style={styles.title}>{authMode === 'signup' ? 'إنشاء حساب جديد' : 'دخول النظام'}</h1>
        <p style={styles.subtitle}>مركز القيادة والسيطرة الجغرافي</p>

        {message && (
          <div role="alert" aria-live="polite" style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: '12px', border: '1px solid rgba(239,68,68,0.2)' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {authMode === 'signup' && (
            <div style={styles.inputGroup}>
              <input 
                type="text" 
                placeholder="اسم المستخدم" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                style={styles.input} 
                required 
              />
              <User size={18} style={{ position: 'absolute', right: '15px', top: '15px', color: '#64748b' }} />
            </div>
          )}

          {authMode !== 'source' && (
            <>
              <div style={styles.inputGroup}>
                <input 
                  type="email" 
                  placeholder="البريد الإلكتروني" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  style={styles.input} 
                  required 
                />
                <Mail size={18} style={{ position: 'absolute', right: '15px', top: '15px', color: '#64748b' }} />
              </div>

              <div style={styles.inputGroup}>
                <input 
                  type="password" 
                  placeholder="كلمة المرور" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  style={styles.input} 
                  required 
                />
                <Lock size={18} style={{ position: 'absolute', right: '15px', top: '15px', color: '#64748b' }} />
              </div>
            </>
          )}

          {authMode === 'source' && (
            <div style={styles.inputGroup}>
              <input 
                type="text" 
                placeholder="كود المصدر (16 رقم)" 
                value={accessCode} 
                onChange={e => setAccessCode(e.target.value)} 
                style={styles.input} 
                required 
              />
              <KeyRound size={18} style={{ position: 'absolute', right: '15px', top: '15px', color: '#64748b' }} />
            </div>
          )}

          {authMode === 'login' && (
            <label htmlFor={rememberId} style={styles.checkboxWrapper}>
              <input
                id={rememberId}
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                style={{ position: 'absolute', opacity: 0, width: 1, height: 1, pointerEvents: 'none' }}
              />
              <div aria-hidden="true" style={{
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                border: `2px solid ${rememberMe ? '#3b82f6' : '#1e293b'}`,
                backgroundColor: rememberMe ? '#3b82f6' : '#020617',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}>
                {rememberMe && <Check size={12} color="white" strokeWidth={4} />}
              </div>
              <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 'bold' }}>حفظ بيانات الدخول (يتم حفظ البريد فقط على هذا الجهاز)</span>
            </label>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            style={{ ...styles.button, backgroundColor: '#2563eb' }}
            onMouseEnter={e => { if (!loading) { (e.target as HTMLElement).style.transform = 'scale(1.02)'; (e.target as HTMLElement).style.boxShadow = '0 0 30px rgba(37,99,235,0.4)'; } }}
            onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)'; (e.target as HTMLElement).style.boxShadow = 'none'; }}
          >
            {loading ? <Loader2 className="animate-spin" /> : authMode === 'signup' ? 'إنشاء الحساب' : authMode === 'source' ? 'دخول كـ مصدر' : 'دخول النظام'}
          </button>
        </form>

        {/* Google button - قيد الإنشاء */}
        {authMode !== 'source' && (
          <div style={{ marginTop: authMode === 'signup' ? '0' : '8px' }}>
            {authMode === 'signup' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#1e293b' }} />
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>أو</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#1e293b' }} />
              </div>
            )}
            <div style={{ position: 'relative' }}>
              <button
                disabled
                style={{ ...styles.button, backgroundColor: '#ea4335', opacity: 0.5, cursor: 'not-allowed' }}
              >
                {authMode === 'signup' ? 'التسجيل بحساب Google' : 'الدخول بحساب Google'}
              </button>
              <span style={{
                position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)',
                backgroundColor: '#fbbf24', color: '#020617', fontSize: '9px', fontWeight: 'bold',
                padding: '2px 10px', borderRadius: '8px', whiteSpace: 'nowrap',
              }}>
                قيد الإنشاء
              </span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' }}>
          <button 
            onClick={() => {
              setAuthMode(authMode === 'signup' ? 'login' : 'signup');
              setMessage(null);
            }}
            style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {authMode === 'signup' ? 'لديك حساب بالفعل؟ سجل دخول' : 'ليس لديك حساب؟ إنشاء حساب جديد'}
          </button>
          <button 
            onClick={() => {
              setAuthMode(authMode === 'source' ? 'login' : 'source');
              setMessage(null);
            }}
            disabled={loading}
            style={{
              ...styles.button,
              backgroundColor: authMode === 'source' ? '#1e293b' : 'transparent',
              border: authMode === 'source' ? '1px solid #334155' : '1px dashed #475569',
              color: '#94a3b8',
              fontSize: '12px',
            }}
            onMouseEnter={e => { if (!loading) { (e.target as HTMLElement).style.borderColor = '#64748b'; (e.target as HTMLElement).style.color = '#cbd5e1'; } }}
            onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = authMode === 'source' ? '#334155' : '#475569'; (e.target as HTMLElement).style.color = '#94a3b8'; }}
          >
            <KeyRound size={14} />
            {authMode === 'source' ? 'العودة لدخول الطاقم' : 'الدخول كـ مصدر مؤقت'}
          </button>
        </div>
      </div>
    </div>
  );
};
