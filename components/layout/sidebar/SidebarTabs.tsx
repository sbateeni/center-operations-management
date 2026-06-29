import React from 'react';
import { Users, MapPin, Activity, Settings } from 'lucide-react';

export type TabId = 'units' | 'notes' | 'logs' | 'settings';

interface SidebarTabsProps {
  activeTab: TabId;
  setActiveTab: (t: TabId) => void;
  counts: { notes: number; logs: number };
  canViewLogs?: boolean;
}

type Counts = { notes: number; logs: number };
const allTabs: { id: TabId; icon: React.ElementType; label: string; badge?: keyof Counts }[] = [
  { id: 'units', icon: Users, label: 'الوحدات' },
  { id: 'notes', icon: MapPin, label: 'البلاغات', badge: 'notes' },
  { id: 'logs', icon: Activity, label: 'السجل', badge: 'logs' },
  { id: 'settings', icon: Settings, label: 'الإعدادات' },
];

export const SidebarTabs: React.FC<SidebarTabsProps> = ({ activeTab, setActiveTab, counts, canViewLogs }) => {
  const tabs = allTabs.filter(t => t.id !== 'logs' || canViewLogs);
  return (
    <div className="flex border-b border-slate-800 bg-slate-900/80 shrink-0">
      {tabs.map(({ id, icon: Icon, label, badge }) => {
        const isActive = activeTab === id;
        const count = badge ? counts[badge] : 0;
        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold transition-all relative ${
              isActive
                ? 'text-blue-400 bg-blue-900/10'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
            }`}
          >
            <Icon size={14} />
            <span>{label}</span>
            {count > 0 && (
              <span className="absolute -top-0.5 -left-0.5 bg-blue-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-mono">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
