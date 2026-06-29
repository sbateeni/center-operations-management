import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, Radio, Info, UserPlus, Ban, CheckCircle2, Clock } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { db } from '../../services/db';
import { LogEntry } from '../../types';

const getIcon = (type: string) => {
  switch (type) {
    case 'alert': return <AlertTriangle size={14} className="text-red-500 shrink-0" />;
    case 'dispatch': return <Radio size={14} className="text-purple-500 shrink-0" />;
    case 'user_joined': return <UserPlus size={14} className="text-green-500 shrink-0" />;
    case 'user_banned': return <Ban size={14} className="text-red-500 shrink-0" />;
    case 'approved': return <CheckCircle2 size={14} className="text-green-500 shrink-0" />;
    default: return <Info size={14} className="text-slate-500 shrink-0" />;
  }
};

const formatTime = (ts: number) =>
  new Date(ts).toLocaleDateString('ar-EG', {
    hour12: false, hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: '2-digit',
  });

export const AlertsPanel: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    db.getRecentLogs().then((data) => { setLogs(data); setLoading(false); });
    const channel = supabase
      .channel('alerts-panel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'logs' }, (payload: any) => {
        setLogs((prev) => [{
          id: payload.new.id, message: payload.new.message, type: payload.new.type,
          timestamp: payload.new.timestamp, userId: payload.new.user_id,
        }, ...prev].slice(0, 200));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = filterType === 'all' ? logs : logs.filter(l => l.type === filterType);

  const counts = {
    all: logs.length,
    alert: logs.filter(l => l.type === 'alert').length,
    dispatch: logs.filter(l => l.type === 'dispatch').length,
    user_joined: logs.filter(l => l.type === 'user_joined').length,
  };

  return (
    <div className="p-4 space-y-3">
      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {([{ key: 'all', label: 'الكل', count: counts.all },
          { key: 'alert', label: 'تنبيهات', count: counts.alert },
          { key: 'dispatch', label: 'توجيهات', count: counts.dispatch },
          { key: 'user_joined', label: 'مستخدمين', count: counts.user_joined },
        ] as const).map(({ key, label, count }) => (
          <button key={key} onClick={() => setFilterType(key)}
            className={`text-[10px] px-2.5 py-1 rounded-full border font-bold transition-colors ${
              filterType === key
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}>
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Logs List */}
      <div className="space-y-1">
        {loading ? (
          <div className="text-center py-8 text-slate-600 text-xs">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-slate-600 text-xs">
            <Activity size={24} className="mx-auto mb-2 opacity-50" />
            لا توجد أحداث مسجلة
          </div>
        ) : (
          filtered.map((log) => (
            <div key={log.id} className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-xs ${
              log.type === 'alert'
                ? 'bg-red-900/10 border-red-900/20 text-red-300'
                : log.type === 'dispatch'
                ? 'bg-purple-900/10 border-purple-900/20 text-purple-300'
                : 'bg-slate-800/30 border-slate-800/50 text-slate-400'
            }`}>
              {getIcon(log.type)}
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{log.message}</p>
                <span className="text-[9px] text-slate-600 font-mono flex items-center gap-1 mt-0.5">
                  <Clock size={8} /> {formatTime(log.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
