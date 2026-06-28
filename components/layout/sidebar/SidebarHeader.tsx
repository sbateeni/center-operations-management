import React from 'react';
import { X, Shield, Search, Loader2 } from 'lucide-react';
import { UnitStatus } from '../../../types';

interface SidebarHeaderProps {
  setIsOpen: (o: boolean) => void;
  myStatus: UnitStatus;
  setMyStatus: (s: UnitStatus) => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  isSearching: boolean;
  onSearch: (e: React.FormEvent) => void;
}

const statusConfig: Record<UnitStatus, { color: string; label: string }> = {
  patrol: { color: 'bg-green-500', label: 'دورية' },
  busy: { color: 'bg-yellow-500', label: 'مشغول' },
  pursuit: { color: 'bg-red-500', label: 'مطاردة' },
  offline: { color: 'bg-slate-500', label: 'غير متصل' },
};

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  setIsOpen, myStatus, setMyStatus, searchQuery, setSearchQuery, isSearching, onSearch,
}) => (
  <div className="p-3 border-b border-slate-800 bg-slate-900/50 shrink-0">
    <div className="flex items-center justify-between mb-3">
      <button
        onClick={() => setIsOpen(false)}
        className="p-2 bg-slate-800 rounded-lg text-slate-400 md:hidden hover:text-white"
      >
        <X size={20} />
      </button>
      <div className="flex items-center gap-3">
        <div className="text-left">
          <h1 className="font-bold text-base tracking-tight text-white leading-none mb-1">غرفة العمليات</h1>
          <div className="relative group">
            <button className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2 py-0.5 text-[10px] font-bold text-slate-300 hover:bg-slate-700 transition-colors">
              {statusConfig[myStatus].label}
              <div className={`w-2 h-2 rounded-full ${statusConfig[myStatus].color} animate-pulse`} />
            </button>
            <div className="absolute top-full right-0 mt-1 w-32 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden hidden group-hover:block z-50">
              {(['patrol', 'busy', 'pursuit'] as UnitStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setMyStatus(s)}
                  className="w-full text-right px-3 py-2 text-xs font-bold hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-end gap-2"
                >
                  {statusConfig[s].label}
                  <div className={`w-2 h-2 rounded-full ${statusConfig[s].color}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Shield className="text-white w-5 h-5" />
        </div>
      </div>
    </div>
    <form onSubmit={onSearch} className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="بحث عن بلاغ أو مطلوب..."
        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-2 pr-9 pl-9 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-right"
        disabled={isSearching}
      />
      <Search className="absolute right-3 top-2.5 text-slate-500" size={15} />
      {isSearching && <Loader2 className="absolute left-3 top-2.5 text-blue-500 animate-spin" size={15} />}
    </form>
  </div>
);
