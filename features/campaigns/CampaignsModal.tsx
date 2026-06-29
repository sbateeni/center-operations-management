
import React, { useState, useEffect } from 'react';
import { X, Gamepad2, Users, MapPin, Eye, Shield } from 'lucide-react';
import { MapUser, MapNote, UserProfile, ActiveCampaign } from '../../types';
import { normalizeWantedStatus } from '../../utils/status';
import { MultiSelectSection } from './MultiSelectSection';

interface CampaignsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onlineUsers: MapUser[];
    allProfiles: UserProfile[]; // New prop for all users
    notes: MapNote[];
    currentUserProfile: UserProfile | null;
    activeCampaign: ActiveCampaign | null; // Pass active campaign to edit
    onStartCampaign: (name: string, participants: Set<string>, targets: Set<string>, commanders: Set<string>) => void;
    onUpdateCampaign: (name: string, participants: Set<string>, targets: Set<string>, commanders: Set<string>) => void;
}

export const CampaignsModal: React.FC<CampaignsModalProps> = ({ 
    isOpen, onClose, onlineUsers, allProfiles, notes, currentUserProfile, 
    activeCampaign, onStartCampaign, onUpdateCampaign 
}) => {
    const [campaignName, setCampaignName] = useState("");
    
    // Selections
    const [participants, setParticipants] = useState<Set<string>>(new Set());
    const [targets, setTargets] = useState<Set<string>>(new Set());
    const [commanders, setCommanders] = useState<Set<string>>(new Set());

    // Initialize with existing campaign data if available
    useEffect(() => {
        if (isOpen) {
            queueMicrotask(() => {
                if (activeCampaign) {
                    setCampaignName(activeCampaign.name);
                    setParticipants(new Set(activeCampaign.participantIds));
                    setTargets(new Set(activeCampaign.targetIds));
                    setCommanders(new Set(activeCampaign.commanderIds));
                } else {
                    // Reset for new campaign
                    setCampaignName("");
                    setParticipants(new Set());
                    setTargets(new Set());
                    setCommanders(new Set([currentUserProfile?.id || '']));
                }
            });
        }
    }, [isOpen, activeCampaign, currentUserProfile]);

    if (!isOpen) return null;

    // --- DATA PREPARATION ---
    
    // 1. ALL Users (Participants) - Marked with Online Status
    const onlineIds = new Set(onlineUsers.map(u => u.id));
    
    const availableUsers = allProfiles
        .filter(p => p.role !== 'banned')
        .map(p => {
            const isOnline = onlineIds.has(p.id);
            return {
                id: p.id,
                label: p.username,
                subLabel: isOnline ? 'متصل الآن' : 'غير متصل',
                isOnline: isOnline
            };
        })
        .sort((a, b) => (a.isOnline === b.isOnline ? 0 : a.isOnline ? -1 : 1)); // Online first

    // 2. Targets (Not Caught Notes)
    const availableTargets = notes
        .filter(n => normalizeWantedStatus(n.status) !== 'closed')
        .map(n => ({
            id: n.id,
            label: n.locationName,
            subLabel: n.userNote,
            color: 'bg-red-500' // Visual indicator
        }));

    // 3. Commanders (Potential Leaders)
    const availableCommanders = allProfiles
        .filter(p => ['officer', 'center', 'governorate_police', 'central_operations'].includes(p.role))
        .map(p => ({
            id: p.id,
            label: p.username,
            subLabel: p.role,
            color: 'bg-purple-500',
            isOnline: onlineIds.has(p.id)
        }));

    const toggleSet = (id: string, setFn: React.Dispatch<React.SetStateAction<Set<string>>>) => {
        setFn(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleSubmit = () => {
        if (!campaignName.trim() || participants.size === 0 || targets.size === 0) {
            alert("يرجى إدخال اسم الحملة واختيار قوة وأهداف على الأقل.");
            return;
        }

        if (activeCampaign) {
            // Update Mode
            onUpdateCampaign(campaignName, participants, targets, commanders);
            alert("تم تحديث الحملة.");
        } else {
            // Create Mode
            const summary = `
            تم إطلاق الحملة: ${campaignName}
            القوة: ${participants.size} عنصر
            المطاليب: ${targets.size}
            القيادة: ${commanders.size} ضباط
            `;
            if (confirm(summary + "\n\nهل أنت متأكد من البدء؟")) {
                onStartCampaign(campaignName, participants, targets, commanders);
            } else {
                return;
            }
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">
                
                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-900/20 p-2 rounded-lg border border-yellow-900/50">
                            <Gamepad2 className="text-yellow-500" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {activeCampaign ? 'تعديل الحملة الجارية' : 'إطلاق حملة أمنية'}
                            </h2>
                            <p className="text-xs text-slate-400">
                                {activeCampaign ? 'تحديث القوة والمطاليب المتبقية' : 'تخصيص القوة والمطاليب والصلاحيات'}
                            </p>
                            <span className={`text-[10px] font-bold ${activeCampaign ? 'text-green-400' : 'text-yellow-400'}`}>
                                الحالة: {activeCampaign ? 'جارية' : 'مخططة'}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* Name Input */}
                    <div>
                        <label className="text-xs text-slate-400 font-bold block mb-2">اسم الحملة / العملية</label>
                        <input 
                            type="text" 
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            placeholder="مثال: حملة الفجر - المنطقة الشمالية"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:outline-none placeholder-slate-600"
                        />
                    </div>

                    {/* Section 1: Participants (ALL USERS) */}
                    <MultiSelectSection 
                        title="القوة المشاركة (الكل)" 
                        icon={Users} 
                        items={availableUsers}
                        selectedIds={participants}
                        onToggle={(id) => toggleSet(id, setParticipants)}
                        placeholder="بحث عن عناصر (متصل أو غير متصل)..."
                    />

                    {/* Section 2: Targets */}
                    <MultiSelectSection 
                        title="المطاليب المتبقية" 
                        icon={MapPin} 
                        items={availableTargets}
                        selectedIds={targets}
                        onToggle={(id) => toggleSet(id, setTargets)}
                        placeholder="بحث عن مواقع..."
                    />

                    {/* Section 3: Commanders */}
                    <div className="bg-purple-900/10 rounded-xl border border-purple-900/30 p-4">
                        <div className="flex items-start gap-3 mb-4">
                            <Shield className="text-purple-400 mt-1" size={18} />
                            <div>
                                <h4 className="text-sm font-bold text-purple-200">صلاحيات الرؤية الكاملة</h4>
                                <p className="text-[10px] text-purple-300/70 leading-relaxed mt-1">
                                    المختارون هنا فقط سيرون أسماء الوحدات والمطاليب على الخريطة.
                                    <br/>باقي القوة المشاركة سترى نقاطاً مبهمة فقط.
                                </p>
                            </div>
                        </div>
                        
                        <MultiSelectSection 
                            title="قيادة الحملة (Command)" 
                            icon={Eye} 
                            items={availableCommanders}
                            selectedIds={commanders}
                            onToggle={(id) => toggleSet(id, setCommanders)}
                            placeholder="بحث عن ضباط..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
                    <button 
                        onClick={handleSubmit}
                        className="w-full bg-yellow-600 hover:bg-yellow-500 text-slate-900 font-bold py-3 rounded-xl shadow-lg shadow-yellow-900/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <Gamepad2 size={20} />
                        {activeCampaign ? 'حفظ التعديلات' : 'بدء الحملة وتعميم الإحداثيات'}
                    </button>
                </div>
            </div>
        </div>
    );
};
