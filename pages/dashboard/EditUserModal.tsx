import React, { useState, useEffect } from 'react';
import { X, Shield, ToggleLeft, ToggleRight, ChevronDown, Clock, Wifi, Mail, Ban, CheckCircle2 } from 'lucide-react';
import { UserProfile, UserPermissions, UserRole } from '../../types';

interface EditUserModalProps {
  user: UserProfile | null;
  currentUserProfile: UserProfile | null;
  onClose: () => void;
  onUpdateRole: (user: UserProfile, role: UserRole) => void;
  onUpdateHierarchy: (user: UserProfile, gov: string, center: string) => void;
  onUpdatePermissions: (user: UserProfile, perms: UserPermissions) => void;
  availableCenters: string[];
  governoratesList: string[];
}

const roleColors: Record<string, string> = {
  central_operations: 'text-purple-400 bg-purple-900/20 border-purple-900/50',
  governorate_police: 'text-indigo-400 bg-indigo-900/20 border-indigo-900/50',
  center: 'text-blue-400 bg-blue-900/20 border-blue-900/50',
  officer: 'text-sky-400 bg-sky-900/20 border-sky-900/50',
  source: 'text-slate-400 bg-slate-800 border-slate-700',
  banned: 'text-red-400 bg-red-900/20 border-red-900/50',
};

const roleLabels: Record<string, string> = {
  central_operations: 'العمليات المركزية', governorate_police: 'شرطة المحافظة', center: 'المركز',
  officer: 'ضابط', source: 'مصدر', banned: 'محظور',
};

export const EditUserModal: React.FC<EditUserModalProps> = ({
  user, currentUserProfile, onClose, onUpdateRole, onUpdateHierarchy, onUpdatePermissions,
  availableCenters, governoratesList
}) => {
  const [editGov, setEditGov] = useState("");
  const [editCenter, setEditCenter] = useState("");

  useEffect(() => {
    if (user) {
      if (currentUserProfile?.role === 'governorate_police') {
        setEditGov(currentUserProfile.governorate || "");
      } else if (currentUserProfile?.role === 'center') {
        setEditGov(currentUserProfile.governorate || "");
        setEditCenter(currentUserProfile.center || "");
      } else {
        setEditGov(user.governorate || "");
      }
      setEditCenter(user.center || "");
    }
  }, [user, currentUserProfile]);

  if (!user) return null;

  const handlePermChange = (key: keyof UserPermissions) => {
    const newPerms = { ...user.permissions, [key]: !user.permissions[key] };
    onUpdatePermissions(user, newPerms);
  };

  const permLabels: Record<keyof UserPermissions, { label: string; desc: string }> = {
    can_create: { label: 'إضافة بلاغات', desc: 'إنشاء ملاحظات وبلاغات جديدة على الخريطة' },
    can_see_others: { label: 'رؤية الزملاء', desc: 'عرض مواقع العناصر الأخرى على الخريطة' },
    can_navigate: { label: 'الملاحة', desc: 'استخدام خاصية导航 للوصول إلى البلاغات' },
    can_edit_users: { label: 'إدارة المستخدمين', desc: 'تعديل صلاحيات ورتب المستخدمين' },
    can_dispatch: { label: 'إرسال توجيهات', desc: 'إرسال أوامر وتعليمات للعناصر' },
    can_view_logs: { label: 'السجلات', desc: 'عرض سجل العمليات والأحداث' },
    can_manage_content: { label: 'إدارة المحتوى', desc: 'تعديل وحذف محتوى البلاغات' },
    can_manage_campaigns: { label: 'إدارة الحملات', desc: 'إنشاء وتعديل وإطلاق الحملات الميدانية' },
  };

  const lastSeen = user.last_seen ? new Date(user.last_seen).toLocaleString('ar-EG') : 'غير معروف';
  const isBanned = user.role === 'banned';

  return (
    <div className="absolute inset-0 z-[1300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg p-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg ${isBanned ? 'bg-red-900 text-red-200' : 'bg-slate-700 text-slate-300'}`}>
              {isBanned ? <Ban size={20} /> : user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {user.username}
                {isBanned && <span className="text-[10px] bg-red-900/30 text-red-400 px-2 py-0.5 rounded-full border border-red-900/50">محظور</span>}
              </h3>
              {user.full_name && <p className="text-xs text-slate-400">{user.full_name}</p>}
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Mail size={10} /> {user.email || 'بريد غير متوفر'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-3">
            <div className="text-[9px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1">
              <Shield size={10} /> الرتبة
            </div>
            <div className={`text-xs font-bold px-2 py-1 rounded border w-fit ${roleColors[user.role] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
              {roleLabels[user.role] || 'عنصر'}
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-3">
            <div className="text-[9px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1">
              <Clock size={10} /> آخر نشاط
            </div>
            <div className="text-xs text-slate-300 font-bold">{lastSeen}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-3">
            <div className="text-[9px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1">
              <CheckCircle2 size={10} /> الموافقة
            </div>
            <div className={`text-xs font-bold ${user.isApproved ? 'text-green-400' : 'text-yellow-400'}`}>
              {user.isApproved ? 'تمت الموافقة' : 'بإنتظار الموافقة'}
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-3">
            <div className="text-[9px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1">
              <Wifi size={10} /> المحافظة
            </div>
            <div className="text-xs text-slate-300 font-bold">{user.governorate || 'غير محدد'}</div>
          </div>
        </div>

        {/* Role & Hierarchy Section */}
        <div className="space-y-4 mb-5 pb-5 border-b border-slate-800">
          <h4 className="text-xs uppercase text-slate-500 font-bold">الهيكلية والرتبة</h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs text-slate-400 block mb-1">الرتبة</label>
              <select
                value={user.role}
                onChange={(e) => onUpdateRole(user, e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-purple-500 focus:outline-none"
                disabled={!['central_operations', 'governorate_police', 'center'].includes(currentUserProfile?.role || '')}
              >
                <option value="source">مصدر</option>
                <option value="officer">ضابط</option>
                <option value="center">المركز</option>
                <option value="governorate_police">شرطة المحافظة</option>
                {currentUserProfile?.role === 'central_operations' && (
                  <option value="central_operations">العمليات المركزية</option>
                )}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">المحافظة</label>
              <div className="relative">
                <select
                  value={editGov}
                  onChange={(e) => { setEditGov(e.target.value); setEditCenter(""); }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-sm appearance-none focus:border-purple-500 focus:outline-none disabled:opacity-50"
                  disabled={currentUserProfile?.role === 'governorate_police' || currentUserProfile?.role === 'center'}
                >
                  <option value="">-- اختر المحافظة --</option>
                  {governoratesList.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                </select>
                <ChevronDown className="absolute left-3 top-3.5 text-slate-500 pointer-events-none" size={16} />
              </div>
            </div>

            {user.role !== 'governorate_police' && (
              <div>
                <label className="text-xs text-slate-400 block mb-1">المركز / القسم</label>
                <input
                  list="centers-list" type="text" value={editCenter}
                  onChange={(e) => setEditCenter(e.target.value)}
                  placeholder="اكتب اسم المركز..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-purple-500 focus:outline-none disabled:opacity-50"
                  disabled={currentUserProfile?.role === 'center'}
                />
                <datalist id="centers-list">
                  {availableCenters.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
            )}

            {user.role === 'central_operations' && (
              <div className="bg-purple-900/20 border border-purple-900/50 rounded-lg p-3 text-center col-span-2">
                <span className="text-purple-400 text-sm font-bold flex items-center justify-center gap-2">
                  <Shield size={16} /> يملك كافة الصلاحيات على جميع المحافظات (يمكن تحديد محافظة للتصنيف فقط)
                </span>
              </div>
            )}
          </div>

          <button onClick={() => onUpdateHierarchy(user, editGov, editCenter)}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold transition-colors mt-2">
            حفظ التعديلات الهيكلية
          </button>
        </div>

        {/* Permissions Section */}
        {user.role !== 'central_operations' && (
          <div className="space-y-3 mb-5 pb-5 border-b border-slate-800">
            <h4 className="text-xs uppercase text-slate-500 font-bold">الصلاحيات الفنية</h4>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(permLabels) as Array<keyof UserPermissions>).map(perm => (
                <div key={perm} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex-1 ml-3">
                    <div className="text-sm font-medium text-white">{permLabels[perm].label}</div>
                    <div className="text-[10px] text-slate-500">{permLabels[perm].desc}</div>
                  </div>
                  <button onClick={() => handlePermChange(perm)}>
                    {user.permissions[perm]
                      ? <ToggleRight className="text-green-500 w-8 h-8 shrink-0 transition-colors" />
                      : <ToggleLeft className="text-slate-600 w-8 h-8 shrink-0 transition-colors" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={onClose}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-900/20">
          تم
        </button>
      </div>
    </div>
  );
};
