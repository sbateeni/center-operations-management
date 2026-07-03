export const notifications = {
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const result = await Notification.requestPermission();
    return result === 'granted';
  },

  show(title: string, options?: NotificationOptions): void {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      navigator.serviceWorker?.ready.then(reg => {
        reg.showNotification(title, {
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-192.png',
          tag: 'ops-' + Date.now(),
          ...options,
        });
      });
    }
  },

  showSOS(username: string, lat: number, lng: number): void {
    this.show(`🚨 SOS من ${username}`, {
      body: `حالة طوارئ — الموقع: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      tag: 'sos-' + Date.now(),
      requireInteraction: true,
      data: { type: 'sos', lat, lng },
    });
  },

  showAssignment(title: string, from: string): void {
    this.show(`📋 تكليف جديد`, {
      body: `${from}: ${title}`,
      tag: 'assignment-' + Date.now(),
    });
  },

  showGeofenceAlert(zoneName: string, username: string): void {
    this.show(`⛔ تنبيه نطاق جغرافي`, {
      body: `${username} اخترق منطقة ${zoneName}`,
      tag: 'geofence-' + Date.now(),
    });
  },
};
