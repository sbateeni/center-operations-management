import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Circle, Hexagon, MapPin, Eye, EyeOff, Edit3 } from 'lucide-react';
import { GeofenceZone } from '../../types';

const ZONE_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

interface GeofenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  zones: GeofenceZone[];
  onCreateZone: (zone: Omit<GeofenceZone, 'id' | 'createdAt'>) => void;
  onUpdateZone: (id: string, updates: Partial<GeofenceZone>) => void;
  onDeleteZone: (id: string) => void;
  onFlyToZone: (zone: GeofenceZone) => void;
  onEditPolygon?: (zone: GeofenceZone) => void;
}

export const GeofenceModal: React.FC<GeofenceModalProps> = ({
  isOpen, onClose, zones, onCreateZone, onUpdateZone, onDeleteZone, onFlyToZone, onEditPolygon,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'circle' | 'polygon'>('circle');
  const [radius, setRadius] = useState(500);
  const [color, setColor] = useState(ZONE_COLORS[0]);

  useEffect(() => {
    if (!isOpen) { setShowForm(false); setName(''); setType('circle'); setRadius(500); setColor(ZONE_COLORS[0]); }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!name.trim()) { alert('يرجى إدخال اسم للمنطقة'); return; }
    onCreateZone({ name: name.trim(), type, lat: 31.9522, lng: 35.2332, radius: type === 'circle' ? radius : undefined, points: type === 'polygon' ? [] : undefined, color, isActive: true });
    setShowForm(false); setName(''); setType('circle'); setRadius(500); setColor(ZONE_COLORS[0]);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-green-900/20 p-2 rounded-lg border border-green-900/50">
              <Hexagon className="text-green-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">النطاق الجغرافي</h2>
              <p className="text-xs text-slate-400">إدارة مناطق العمليات</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Zone List */}
          {zones.length === 0 && !showForm && (
            <div className="text-center py-8 text-slate-500 text-sm">
              <MapPin size={40} className="mx-auto mb-3 opacity-30" />
              لا توجد مناطق بعد. أضف منطقة جديدة.
            </div>
          )}

          {zones.map(zone => (
            <div key={zone.id} className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: zone.color, flexShrink: 0 }} />
                <div>
                  <div className="text-sm font-bold text-white">{zone.name}</div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <Circle size={10} /> {zone.type === 'circle' ? `${zone.radius}م` : 'مضلع'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onFlyToZone(zone)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-400 transition-all" title="الذهاب للمنطقة">
                  <MapPin size={16} />
                </button>
                {zone.type === 'polygon' && onEditPolygon && (
                  <button onClick={() => onEditPolygon(zone)} className="p-2 hover:bg-amber-900/20 rounded-lg text-slate-400 hover:text-amber-400 transition-all" title="تعديل النقاط">
                    <Edit3 size={16} />
                  </button>
                )}
                <button onClick={() => onUpdateZone(zone.id!, { isActive: !zone.isActive })} className={`p-2 rounded-lg transition-all ${zone.isActive ? 'text-green-400 hover:bg-green-900/20' : 'text-slate-600 hover:bg-slate-800'}`} title={zone.isActive ? 'تعطيل' : 'تفعيل'}>
                  {zone.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => { if (confirm('حذف المنطقة؟')) onDeleteZone(zone.id!); }} className="p-2 hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-400 transition-all" title="حذف">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* Create Form */}
          {showForm && (
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-4">
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="اسم المنطقة (مثال: المنطقة الشمالية)" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none placeholder-slate-600 text-sm" />

              <div className="flex gap-3">
                <button onClick={() => setType('circle')} className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${type === 'circle' ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                  <Circle size={16} className="inline ml-1" /> دائرة
                </button>
                <button onClick={() => setType('polygon')} className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${type === 'polygon' ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                  <Hexagon size={16} className="inline ml-1" /> مضلع
                </button>
              </div>

              {type === 'circle' && (
                <div>
                  <label className="text-xs text-slate-400 block mb-1">نصف القطر: {radius}م</label>
                  <input type="range" min={50} max={5000} step={50} value={radius} onChange={e => setRadius(Number(e.target.value))} className="w-full accent-green-500" />
                  <div className="flex justify-between text-[10px] text-slate-600">50م <span>5000م</span></div>
                </div>
              )}

              <div>
                <label className="text-xs text-slate-400 block mb-2">اللون</label>
                <div className="flex gap-2 flex-wrap">
                  {ZONE_COLORS.map(c => (
                    <button key={c} onClick={() => setColor(c)} className={`w-7 h-7 rounded-full border-2 transition-all ${color === c ? 'border-white scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">إلغاء</button>
                <button onClick={handleCreate} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-green-600 hover:bg-green-500 text-white transition-all">
                  {type === 'polygon' ? 'ابدأ الرسم على الخريطة' : 'إضافة المنطقة'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
              <Plus size={20} /> إضافة منطقة جديدة
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
