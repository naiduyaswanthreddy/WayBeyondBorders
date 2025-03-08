
import React, { useEffect, useState, useRef } from "react";
import { Loader } from "lucide-react";

interface GoogleMapDisplayProps {
  origin: string;
  destination: string;
  className?: string;
}

const GoogleMapDisplay: React.FC<GoogleMapDisplayProps> = ({
  origin,
  destination,
  className
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  
  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      // Check if Google Maps API is already loaded
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return;
      }
      
      const apiKey = 'AIzaSyDwfCy0-lqvF6jqMO32DiTb5HwObJvloVk';
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsLoaded(true);
      };
      
      script.onerror = () => {
        setError('Failed to load Google Maps API');
      };
      
      document.head.appendChild(script);
    };
    
    loadGoogleMapsAPI();
  }, []);
  
  // Initialize map and directions when API loads and origin/destination change
  useEffect(() => {
    if (!isLoaded || !origin || !destination || !mapRef.current || !window.google) return;
    
    try {
      // Initialize map if not already initialized
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: { lat: 20, lng: 0 },
          zoom: 2,
          mapTypeId: google.maps.MapTypeId.SATELLITE // Set satellite view as default
        });
        
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          map: mapInstanceRef.current,
          suppressMarkers: false
        });
      }
      
      // Get directions
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: google.maps.TrafficModel.BEST_GUESS
          }
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            directionsRendererRef.current?.setDirections(result);
            
            // Fit map to route bounds
            const bounds = new google.maps.LatLngBounds();
            result.routes[0].legs.forEach(leg => {
              leg.steps.forEach(step => {
                step.path.forEach(point => {
                  bounds.extend(point);
                });
              });
            });
            mapInstanceRef.current?.fitBounds(bounds);
          } else {
            setError(`Directions request failed: ${status}`);
          }
        }
      );
    } catch (err) {
      setError('Error initializing map');
      console.error('Google Maps error:', err);
    }
  }, [isLoaded, origin, destination]);
  
  if (error) {
    return (
      <div className={`flex items-center justify-center p-6 bg-muted/50 rounded-lg border border-muted ${className}`}>
        <div className="text-center text-muted-foreground">
          <p className="mb-2">Error loading map: {error}</p>
          <p className="text-sm">Please check your connection and try again</p>
        </div>
      </div>
    );
  }
  
  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center p-6 bg-muted/50 rounded-lg border border-muted ${className}`}>
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-nexus-blue mb-2 mx-auto" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={mapRef} 
      className={`h-[400px] w-full rounded-lg ${className}`}
      aria-label="Google Map showing route"
    />
  );
};

export default GoogleMapDisplay;
