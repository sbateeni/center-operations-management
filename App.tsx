
import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { useAppLogic } from './hooks/useAppLogic';
import { SourceSession } from './types';
import { Monitor, Siren, Users, Clock, Hexagon } from 'lucide-react';
import { isAdmin } from './constants/roles';

// Components
import { ModalContainer } from './components/ui/ModalContainer';
import { Sidebar } from './components/layout/Sidebar';
import { MapControls } from './features/map/components/MapControls';
import { DatabaseSetupModal } from './components/ui/DatabaseSetupModal';
import { GeofenceModal } from './features/geofence/GeofenceModal';
import { AuthPage } from './pages/AuthPage';
import { PendingApproval } from './pages/PendingApproval';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { TacticalOverlay } from './components/ui/TacticalOverlay';

const StrategicDashboard = lazy(() => import('./components/ui/StrategicDashboard').then(m => ({ default: m.StrategicDashboard })));

const LeafletMap = lazy(() => import('./features/map/components/LeafletMap').then(m => ({ default: m.LeafletMap })));

export default function App() {
  const [sourceSession, setSourceSession] = useState<SourceSession | null>(null);
  const [showDatabaseFix, setShowDatabaseFix] = useState(false);
  const [showStrategicHub, setShowStrategicHub] = useState(true);
  const [sourceTimeLeft, setSourceTimeLeft] = useState<string | null>(null);

  // --- 1. CORE LOGIC HOOKS ---
  const logic = useAppLogic(!!sourceSession);

  const {
    session, authLoading, userRole, isApproved, isAccountDeleted, permissions, handleLogout, refreshAuth, userProfile, isBanned,
    notes, isConnected, updateStatus,
    myStatus, setMyStatus, isSOS, handleToggleSOS, assignments, handleAcceptAssignment,
    onlineUsers, userLocation, distressedUser, handleLocateSOSUser, locateLogUser, allProfiles,
    currentRoute, secondaryRoute, handleNavigateToNote, handleStopNavigation,
    sidebarOpen, setSidebarOpen, isSatellite, setIsSatellite, mapProvider, setMapProvider,
    searchQuery, setSearchQuery, isSearching, handleSearch, flyToTarget, locateUser, requestLocation, permissionDenied, isLocating,
    selectedNote, setSelectedNote, flyToNote, handleDeleteNote,
    showDashboard, setShowDashboard, showSettings, setShowSettings, showFullLogs, setShowFullLogs,
    showCampaigns, setShowCampaigns,
    commandUser, setCommandUser, onUserClick, handleIntercept, handleDispatch,
    handleNavigateNearest,
    showLocationPicker, setShowLocationPicker, handleSelectDispatchLocation,
    dispatchTargetLocation, setDispatchTargetLocation, handleOpenDispatchModal, handleSendDispatchOrder,
    showModal, tempCoords, userNoteInput, setUserNoteInput, isEditingNote,
    handleMapClick, handleEditNote, handleSaveNote, closeModal,
    setTargetUserFilter,
    activeCampaign, handleStartCampaign, handleUpdateCampaign,
    geofenceZones, showGeofence, setShowGeofence,
    handleGeofenceEvent,
    handleCreateGeofenceZone,
    handleUpdateGeofenceZone,
    handleDeleteGeofenceZone,
    handleFlyToGeofenceZone,
    isDrawingPolygon, pendingPolygonPoints, pendingPolygonMeta, editingPolygonId,
    handlePolygonMapClick,
    handleSavePolygon,
    handleCancelPolygon,
    handleEditPolygon,
  } = logic;

  const isOpsManager = isAdmin(userRole);

  const handleMapClickWrapper = isDrawingPolygon ? handlePolygonMapClick : handleMapClick;

  // --- POLYGON DRAWING CURSOR ---
  const bodyCursorRef = useRef<string | null>(null);
  useEffect(() => {
    if (isDrawingPolygon) {
      bodyCursorRef.current = document.body.style.cursor;
      document.body.style.cursor = 'crosshair';
    } else if (bodyCursorRef.current !== null) {
      document.body.style.cursor = bodyCursorRef.current;
      bodyCursorRef.current = null;
    }
  }, [isDrawingPolygon]);

  // --- SOURCE SESSION AUTO-EXPIRY ---
  useEffect(() => {
    if (!sourceSession) {
      setSourceTimeLeft(null);
      return;
    }
    const tick = () => {
      const remaining = sourceSession.expiresAt - Date.now();
      if (remaining <= 0) {
        setSourceSession(null);
        setSourceTimeLeft(null);
        return;
      }
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      setSourceTimeLeft(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [sourceSession]);

  if (authLoading && !sourceSession) {
    return <LoadingScreen />;
  }
  
  if (!session && !sourceSession) {
    return <AuthPage onSourceLogin={(s) => setSourceSession(s)} />;
  }

  if (!isApproved && !sourceSession && session && !isBanned) {
      return (
        <PendingApproval 
            onLogout={handleLogout} 
            isDeleted={isAccountDeleted} 
            email={session.user?.email}
            onCheckStatus={refreshAuth}
        />
      );
  }

  return (
    <div className="flex h-screen w-full bg-[#020617] text-white overflow-hidden" dir="rtl">
      
      {/* 1. Sidebar */}
      <Sidebar 
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          notes={notes}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearching={isSearching}
          onSearch={handleSearch}
          onFlyToNote={flyToNote} 
          onDeleteNote={handleDeleteNote}
          onEditNote={handleEditNote} 
          onNavigateToNote={handleNavigateToNote}
          routeData={currentRoute}
          onUpdateStatus={updateStatus}
          isConnected={isConnected}
          userRole={sourceSession ? 'source' : userRole}
          onLogout={handleLogout}
          onOpenDashboard={() => setShowDashboard(true)} 
          onOpenSettings={() => setShowSettings(true)}
          onOpenCampaigns={() => setShowCampaigns(true)}
          canManageContent={permissions.can_manage_content}
          canViewLogs={permissions.can_view_logs}
          userGovernorate={userProfile?.governorate}
          myStatus={myStatus}
          setMyStatus={setMyStatus}
          onlineUsers={onlineUsers}
          currentUserId={session?.user?.id}
          // Integrated Map Controls
          isSatellite={isSatellite}
          setIsSatellite={setIsSatellite}
          onLocateUser={locateUser}
          isLocating={isLocating}
          assignments={assignments}
          onAcceptAssignment={handleAcceptAssignment}
          hasActiveRoute={!!currentRoute || !!secondaryRoute}
          onClearRoute={handleStopNavigation}
            onExpandLogs={() => setShowFullLogs(true)}
            onOpenGeofence={() => setShowGeofence(true)}
        />

      {/* 2. Main Content Area */}
      <div className="flex-1 relative h-full overflow-hidden">
        
        {/* Active Campaign Banner */}
        {activeCampaign && (
          <div className="absolute top-0 left-0 right-0 z-[999] pointer-events-none" dir="rtl">
            <div className="mx-auto max-w-2xl mt-2 px-4">
              <div className="bg-yellow-900/80 backdrop-blur-xl border border-yellow-600/50 rounded-xl px-4 py-2 flex items-center justify-between pointer-events-auto shadow-lg shadow-yellow-900/30 animate-fade-up">
                <div className="flex items-center gap-3">
                  <Siren size={16} className="text-yellow-400 animate-pulse" />
                  <span className="text-yellow-200 text-xs font-bold">{activeCampaign.name}</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono">
                  <span className="text-yellow-300 flex items-center gap-1">
                    <Users size={10} /> {activeCampaign.participantIds.size} عنصر
                  </span>
                  <span className="text-yellow-400/70 flex items-center gap-1">
                    <Clock size={10} /> {Math.round((Date.now() - activeCampaign.startTime) / 60000)} د
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Source Session Timer */}
        {sourceSession && sourceTimeLeft && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[999]" dir="rtl">
            <div className="bg-blue-900/80 backdrop-blur-xl border border-blue-500/30 rounded-full px-4 py-1.5 flex items-center gap-3 shadow-lg animate-fade-up">
              <Clock size={12} className="text-blue-400" />
              <span className="text-blue-200 text-[11px] font-bold">جلسة مصدر مؤقتة</span>
              <span className="text-blue-400 text-xs font-mono font-black">{sourceTimeLeft}</span>
            </div>
          </div>
        )}

        {/* Dubai Strategic Dashboard Layer */}
        {isOpsManager && (
            <StrategicDashboard 
                onlineUsers={onlineUsers}
                notes={notes}
                isOpen={showStrategicHub}
            />
        )}

        {/* Map Background */}
        <Suspense fallback={<div className="w-full h-full bg-slate-950 flex items-center justify-center"><div className="text-slate-600 text-sm">جاري تحميل الخريطة...</div></div>}>
          <LeafletMap 
            isSatellite={isSatellite}
            mapProvider={mapProvider}
            notes={notes} 
            selectedNote={selectedNote}
            setSelectedNote={setSelectedNote}
            onMapClick={handleMapClickWrapper}
            flyToTarget={flyToTarget}
            tempMarkerCoords={tempCoords}
            userLocation={userLocation}
            currentRoute={currentRoute}
            secondaryRoute={secondaryRoute}
            otherUsers={onlineUsers}
            onUserClick={onUserClick}
            onNavigate={handleNavigateToNote}
            onDispatch={handleOpenDispatchModal}
            canSeeOthers={permissions.can_see_others}
            canNavigate={permissions.can_navigate}
            canDispatch={permissions.can_dispatch}
            currentUserId={userProfile?.id}
            userRole={userRole}
            userGovernorate={userProfile?.governorate}
            geofenceZones={geofenceZones}
            onGeofenceEvent={handleGeofenceEvent}
            isDrawingPolygon={isDrawingPolygon}
            drawingPolygonPoints={pendingPolygonPoints}
            drawingPolygonColor={pendingPolygonMeta?.color || '#10b981'}
          />
        </Suspense>

        {/* HUD: Tactical Overlay (SOS, Logs) */}
        <TacticalOverlay 
            isSOS={isSOS}
            onToggleSOS={handleToggleSOS}
            onExpandLogs={() => setShowFullLogs(true)}
            distressedUser={distressedUser}
            onLocateSOS={handleLocateSOSUser}
            onLocateLogUser={locateLogUser}
            canViewLogs={permissions.can_view_logs}
        />

        {/* Location Permission Prompt */}
        {permissionDenied && !userLocation && (
            <div className="absolute top-36 left-1/2 -translate-x-1/2 z-[1500]">
                <div className="bg-amber-600/90 backdrop-blur border border-amber-400 rounded-xl shadow-lg px-5 py-3 flex items-center gap-3 text-sm">
                    <span className="text-amber-100">الموقع غير مفعل — بعض الميزات لن تعمل</span>
                    <button onClick={requestLocation} className="bg-white text-amber-700 font-bold px-4 py-1.5 rounded-lg hover:scale-105 transition-all text-xs">
                        تفعيل الموقع
                    </button>
                </div>
            </div>
        )}

        {/* Map Control Buttons */}
        <MapControls
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Polygon Drawing HUD */}
        {isDrawingPolygon && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[2000] flex flex-col items-center gap-2 animate-fade-down" dir="rtl">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-green-500/30 rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-400">
                <Hexagon size={18} />
                <span className="text-xs font-bold">{pendingPolygonMeta?.name || 'رسم مضلع'}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">{pendingPolygonPoints.length} نقاط</div>
              <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
                <button onClick={handleSavePolygon} disabled={pendingPolygonPoints.length < 3} className="px-4 py-1.5 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-bold rounded-lg transition-all">
                  حفظ
                </button>
                <button onClick={handleCancelPolygon} className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-all">
                  إلغاء
                </button>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 bg-slate-900/70 backdrop-blur px-4 py-1.5 rounded-full border border-slate-700/50">
              انقر على الخريطة لإضافة نقاط — 3 نقاط على الأقل
            </div>
          </div>
        )}

        {/* Tactical Hub Toggle (Dubai Style) */}
        {isOpsManager && (
            <button 
                onClick={() => setShowStrategicHub(!showStrategicHub)}
                className={`absolute bottom-24 left-4 z-[400] w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl border
                ${showStrategicHub ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:bg-slate-800'}
                `}
                title="مركز غياث للبيانات الاستراتيجية"
            >
                <Monitor size={20} />
            </button>
        )}

        {/* Modal Manager */}
        <ModalContainer
            showCreateModal={showModal}
            closeCreateModal={closeModal}
            tempCoords={tempCoords}
            userNoteInput={userNoteInput}
            setUserNoteInput={setUserNoteInput}
            onSaveNote={handleSaveNote}
            isEditingNote={isEditingNote}
            showDashboard={showDashboard}
            closeDashboard={() => setShowDashboard(false)}
            currentUserId={userProfile?.id || ''}
            currentUserEmail={session?.user?.email}
            currentUserProfile={userProfile}
            onlineUsers={onlineUsers}
            allProfiles={allProfiles}
            showSettings={showSettings}
            closeSettings={() => setShowSettings(false)}
            user={session?.user}
            userRole={userRole}
            mapProvider={mapProvider}
            setMapProvider={setMapProvider}
            onOpenDatabaseFix={() => { setShowSettings(false); setShowDatabaseFix(true); }}
            commandUser={commandUser}
            closeCommandUser={() => setCommandUser(null)}
            onIntercept={handleIntercept}
            onDispatch={handleDispatch}
            onNavigateNearest={handleNavigateNearest}
            showLocationPickerModal={showLocationPicker}
            closeLocationPicker={() => setShowLocationPicker(false)}
            notes={notes}
            onSelectDispatchLocation={handleSelectDispatchLocation}
            dispatchTargetLocation={dispatchTargetLocation}
            closeDispatchModal={() => setDispatchTargetLocation(null)}
            onSendDispatch={handleSendDispatchOrder}
            showFullLogs={showFullLogs}
            closeFullLogs={() => setShowFullLogs(false)}
            onLocateLogUser={locateLogUser}
            showCampaigns={showCampaigns}
            closeCampaigns={() => setShowCampaigns(false)}
            activeCampaign={activeCampaign}
            onStartCampaign={handleStartCampaign}
            onUpdateCampaign={handleUpdateCampaign}
            canEditUsers={permissions.can_edit_users}
            onFilterByUser={(uid, name) => {
                setTargetUserFilter({ id: uid, name });
                setShowDashboard(false);
            }}
            onLogout={handleLogout}
        />

        {/* DB Setup Warning */}
        {showDatabaseFix && <DatabaseSetupModal onClose={() => setShowDatabaseFix(false)} />}

        {/* Geofence Modal */}
        <GeofenceModal
          isOpen={showGeofence}
          onClose={() => setShowGeofence(false)}
          zones={geofenceZones}
          onCreateZone={handleCreateGeofenceZone}
          onUpdateZone={handleUpdateGeofenceZone}
          onDeleteZone={handleDeleteGeofenceZone}
          onFlyToZone={handleFlyToGeofenceZone}
          onEditPolygon={handleEditPolygon}
        />
      </div>
    </div>
  );
}
