
import { useState, useEffect } from 'react';

export const useGoogleMapsLoader = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google?.maps || document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDwfCy0-lqvF6jqMO32DiTb5HwObJvloVk&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setLoadError('Failed to load Google Maps API');
    document.head.appendChild(script);

    return () => {
      // Cleanup if component unmounts before script loads
      if (!isLoaded) {
        document.head.removeChild(script);
      }
    };
  }, [isLoaded]);

  return { isLoaded, loadError };
};
