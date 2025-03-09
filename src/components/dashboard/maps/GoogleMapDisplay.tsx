
import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useGoogleMapsLoader } from "./hooks/useGoogleMapsLoader";
import { mapStyles } from "./utils/mapStyles";
import { getFallbackCoordinates } from "./utils/locationUtils";
import { drawRouteLines } from "./utils/routeUtils";
import MapMarkers from "./components/MapMarkers";

interface GoogleMapDisplayProps {
  origin: string;
  destination: string;
  transportModes?: string[];
}

const GoogleMapDisplay: React.FC<GoogleMapDisplayProps> = ({ 
  origin, 
  destination, 
  transportModes = ["driving"]
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [originLatLng, setOriginLatLng] = useState<google.maps.LatLng | null>(null);
  const [destLatLng, setDestLatLng] = useState<google.maps.LatLng | null>(null);
  
  const { isLoaded } = useGoogleMapsLoader();
  
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps) return;
    
    setIsLoading(true);
    
    try {
      // Create map instance
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 20, lng: 0 }, // Default center
        zoom: 2,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: mapStyles
      });
      
      setMapInstance(map);
      
      // Create geocoder to convert address strings to coordinates
      const geocoder = new window.google.maps.Geocoder();
      
      // Convert origin and destination to coordinates
      Promise.all([
        new Promise<google.maps.LatLng>((resolve) => {
          geocoder.geocode({ address: origin }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
              resolve(results[0].geometry.location);
            } else {
              // Use fallback coordinates for major shipping cities
              const fallbackCoords = getFallbackCoordinates(origin);
              resolve(new window.google.maps.LatLng(fallbackCoords.lat, fallbackCoords.lng));
            }
          });
        }),
        new Promise<google.maps.LatLng>((resolve) => {
          geocoder.geocode({ address: destination }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
              resolve(results[0].geometry.location);
            } else {
              // Use fallback coordinates for major shipping cities
              const fallbackCoords = getFallbackCoordinates(destination);
              resolve(new window.google.maps.LatLng(fallbackCoords.lat, fallbackCoords.lng));
            }
          });
        })
      ]).then(([originCoord, destCoord]) => {
        setOriginLatLng(originCoord);
        setDestLatLng(destCoord);
        
        // Draw route lines based on transport modes
        drawRouteLines(map, originCoord, destCoord, transportModes);
      }).finally(() => {
        setIsLoading(false);
      });
      
    } catch (error) {
      console.error("Error initializing Google Maps:", error);
      setIsLoading(false);
    }
  }, [isLoaded, origin, destination, transportModes]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-white/10 relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-nexus-blue-light" />
            <span className="mt-2 text-sm text-muted-foreground">Loading map data...</span>
          </div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="w-full h-full bg-gray-900"
      ></div>
      
      {/* Render map markers if coordinates are available */}
      {mapInstance && originLatLng && destLatLng && (
        <MapMarkers
          map={mapInstance}
          originLatLng={originLatLng}
          destLatLng={destLatLng}
          origin={origin}
          destination={destination}
        />
      )}
      
      {/* Map attribution - important for Google Maps */}
      <div className="absolute bottom-1 left-1 text-[8px] text-white/70">
        Map data ©{new Date().getFullYear()} Google
      </div>
    </div>
  );
};

export default GoogleMapDisplay;
