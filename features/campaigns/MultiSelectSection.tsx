
import React, { useState } from 'react';
import { Search, CheckCircle, LucideIcon } from 'lucide-react';

interface SelectItem {
  id: string;
  label: string;
  subLabel?: string;
  color?: string;
  isOnline?: boolean;
}

interface MultiSelectSectionProps {
  title: string;
  icon: LucideIcon;
  items: SelectItem[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  placeholder: string;
}

export const MultiSelectSection: React.FC<MultiSelectSectionProps> = ({
  title, icon: Icon, items, selectedIds, onToggle, placeholder
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()));
  const count = selectedIds.size;

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="text-yellow-500" size={18} />
          <span className="text-sm font-bold text-slate-200">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <span className="bg-yellow-900/40 text-yellow-400 text-xs font-mono px-2 py-0.5 rounded-full border border-yellow-900/50">
              {count}
            </span>
          )}
          <span className="text-slate-500 text-xs">{isOpen ? 'إخفاء' : 'عرض واختيار'}</span>
        </div>
      </button>

      {isOpen && (
        <div className="p-3 border-t border-slate-700/50 bg-slate-900/30 animate-in slide-in-from-top-2">
          <div className="relative mb-2">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pr-8 pl-2 text-xs text-white focus:outline-none focus:border-yellow-500"
            />
            <Search className="absolute right-2.5 top-2.5 text-slate-500" size={14} />
          </div>

          <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1">
            {filtered.length === 0 ? (
              <p className="text-center text-slate-500 text-xs py-2">لا توجد نتائج.</p>
            ) : (
              filtered.map(item => {
                const isSelected = selectedIds.has(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => onToggle(item.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${isSelected ? 'bg-yellow-900/20 border-yellow-600/50' : 'bg-slate-800 border-transparent hover:bg-slate-700'}`}
                  >
                    <div className="flex items-center gap-3 text-right overflow-hidden">
                      {item.isOnline !== undefined ? (
                        <div className={`w-2 h-2 rounded-full shrink-0 ${item.isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-600'}`}></div>
                      ) : (
                        <div className={`w-2 h-2 rounded-full shrink-0 ${item.color || 'bg-slate-500'}`}></div>
                      )}
                      <div className="min-w-0">
                        <div className={`text-xs font-bold truncate ${isSelected ? 'text-yellow-400' : 'text-slate-300'}`}>
                          {item.label}
                        </div>
                        {item.subLabel && <div className="text-[10px] text-slate-500 truncate">{item.subLabel}</div>}
                      </div>
                    </div>
                    {isSelected && <CheckCircle size={14} className="text-yellow-500 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
