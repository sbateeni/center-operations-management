
import { useState, useEffect, useCallback } from 'react';

export function useGeolocation(enabled: boolean) {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (!enabled) return;
    
    if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                setUserLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
            },
            (err) => {
                if (err.code === 1) {
                    navigator.permissions.query({ name: 'geolocation' as any }).then(result => {
                        if (result.state === 'prompt') {
                            navigator.geolocation.getCurrentPosition(
                                (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                                () => {}
                            );
                        }
                    });
                }
                console.log("Location access denied or error", err);
            },
            { 
              enableHighAccuracy: true,
              maximumAge: 10000,
              timeout: 20000
            }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [enabled]);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Manual location request denied", err),
        { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { userLocation, requestLocation };
}
