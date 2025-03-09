
import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

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
  const [mapInitialized, setMapInitialized] = useState(false);
  
  useEffect(() => {
    // Load Google Maps script dynamically
    const loadGoogleMapsScript = () => {
      if (window.google?.maps || document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDhUmpR2V68xXAU9p6XsWFQnLAaRCzIgPU&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initializeMap();
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google?.maps) return;
      
      setIsLoading(true);
      
      try {
        // Create map instance
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 20, lng: 0 }, // Default center
          zoom: 2,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#193341" }]
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [{ color: "#2c5a71" }]
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#29768a" }, { lightness: -37 }]
            }
          ]
        });
        
        // Create geocoder to convert address strings to coordinates
        const geocoder = new google.maps.Geocoder();
        
        // Convert origin and destination to coordinates
        Promise.all([
          new Promise<google.maps.LatLng>((resolve, reject) => {
            geocoder.geocode({ address: origin }, (results, status) => {
              if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                resolve(results[0].geometry.location);
              } else {
                // Use fallback coordinates for major shipping cities
                const fallbackCoords = getFallbackCoordinates(origin);
                resolve(new google.maps.LatLng(fallbackCoords.lat, fallbackCoords.lng));
              }
            });
          }),
          new Promise<google.maps.LatLng>((resolve, reject) => {
            geocoder.geocode({ address: destination }, (results, status) => {
              if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                resolve(results[0].geometry.location);
              } else {
                // Use fallback coordinates for major shipping cities
                const fallbackCoords = getFallbackCoordinates(destination);
                resolve(new google.maps.LatLng(fallbackCoords.lat, fallbackCoords.lng));
              }
            });
          })
        ]).then(([originLatLng, destLatLng]) => {
          // Create markers for origin and destination
          const originMarker = new google.maps.Marker({
            position: originLatLng,
            map: map,
            title: origin,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#0062FF",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#FFFFFF",
            }
          });
          
          const destMarker = new google.maps.Marker({
            position: destLatLng,
            map: map,
            title: destination,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#6E36E5",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#FFFFFF",
            }
          });
          
          // Create info windows
          const originInfo = new google.maps.InfoWindow({
            content: `<div style="color: black; padding: 5px;"><strong>${origin}</strong></div>`,
          });
          
          const destInfo = new google.maps.InfoWindow({
            content: `<div style="color: black; padding: 5px;"><strong>${destination}</strong></div>`,
          });
          
          // Add click listeners to markers
          originMarker.addListener("click", () => {
            originInfo.open(map, originMarker);
          });
          
          destMarker.addListener("click", () => {
            destInfo.open(map, destMarker);
          });
          
          // Create bounds to fit both markers
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(originLatLng);
          bounds.extend(destLatLng);
          map.fitBounds(bounds);
          
          // Draw route lines based on transport modes
          drawRouteLines(map, originLatLng, destLatLng, transportModes);
        }).finally(() => {
          setMapInitialized(true);
          setIsLoading(false);
        });
        
      } catch (error) {
        console.error("Error initializing Google Maps:", error);
        setIsLoading(false);
      }
    };

    // Helper function to draw route lines
    const drawRouteLines = (
      map: google.maps.Map, 
      origin: google.maps.LatLng, 
      destination: google.maps.LatLng, 
      modes: string[]
    ) => {
      // For air travel - draw a curved arc line
      if (modes.includes("air")) {
        const pathCoordinates = getArcCoordinates(origin, destination);
        new google.maps.Polyline({
          path: pathCoordinates,
          geodesic: false,
          strokeColor: "#0062FF",
          strokeOpacity: 0.8,
          strokeWeight: 3,
          map: map,
          icons: [{
            icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
            repeat: "100px"
          }]
        });
      }
      
      // For sea travel - draw a different curved line
      if (modes.includes("sea")) {
        const pathCoordinates = getArcCoordinates(origin, destination, -1); // Negative bend for different curve
        new google.maps.Polyline({
          path: pathCoordinates,
          geodesic: false,
          strokeColor: "#00CFD5",
          strokeOpacity: 0.8,
          strokeWeight: 3,
          map: map,
          icons: [{
            icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
            repeat: "100px"
          }]
        });
      }
      
      // For truck/road travel
      if (modes.includes("truck") || modes.includes("electric truck")) {
        new google.maps.Polyline({
          path: [origin, destination],
          geodesic: true,
          strokeColor: modes.includes("electric truck") ? "#34D399" : "#FCD34D",
          strokeOpacity: 0.8,
          strokeWeight: 3,
          map: map,
          icons: [{
            icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
            repeat: "100px"
          }]
        });
      }
    };

    // Helper function to generate arc coordinates between two points
    const getArcCoordinates = (
      origin: google.maps.LatLng, 
      destination: google.maps.LatLng, 
      bendFactor = 1
    ): google.maps.LatLng[] => {
      const points = [];
      const latOrigin = origin.lat();
      const lngOrigin = origin.lng();
      const latDest = destination.lat();
      const lngDest = destination.lng();
      
      // Calculate distance and midpoint
      const distance = google.maps.geometry?.spherical.computeDistanceBetween(origin, destination) || 0;
      const midLat = (latOrigin + latDest) / 2;
      const midLng = (lngOrigin + lngDest) / 2;
      
      // Calculate bending magnitude based on distance
      const bendMagnitude = Math.min(Math.max(distance / 50000, 0.1), 0.5) * bendFactor;
      
      // Calculate perpendicular vector
      const dx = latDest - latOrigin;
      const dy = lngDest - lngOrigin;
      const perpX = -dy;
      const perpY = dx;
      const perpLength = Math.sqrt(perpX * perpX + perpY * perpY);
      const normalizedPerpX = perpX / perpLength;
      const normalizedPerpY = perpY / perpLength;
      
      // Add bending to the midpoint
      const bendLat = midLat + normalizedPerpX * bendMagnitude;
      const bendLng = midLng + normalizedPerpY * bendMagnitude;
      
      // Generate path points
      const numPoints = 20;
      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        
        // Quadratic Bezier curve formula: (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        const lat = uu * latOrigin + 2 * u * t * bendLat + tt * latDest;
        const lng = uu * lngOrigin + 2 * u * t * bendLng + tt * lngDest;
        
        points.push(new google.maps.LatLng(lat, lng));
      }
      
      return points;
    };

    // Helper function to get fallback coordinates for major shipping cities
    const getFallbackCoordinates = (locationName: string): { lat: number, lng: number } => {
      const fallbackLocations: Record<string, { lat: number, lng: number }> = {
        // Asia
        "Shanghai": { lat: 31.2304, lng: 121.4737 },
        "Shanghai, China": { lat: 31.2304, lng: 121.4737 },
        "Singapore": { lat: 1.3521, lng: 103.8198 },
        "Hong Kong": { lat: 22.3193, lng: 114.1694 },
        "Hong Kong, China": { lat: 22.3193, lng: 114.1694 },
        "Tokyo": { lat: 35.6762, lng: 139.6503 },
        "Tokyo, Japan": { lat: 35.6762, lng: 139.6503 },
        
        // Europe
        "Rotterdam": { lat: 51.9244, lng: 4.4777 },
        "Rotterdam, Netherlands": { lat: 51.9244, lng: 4.4777 },
        "Hamburg": { lat: 53.5511, lng: 9.9937 },
        "Hamburg, Germany": { lat: 53.5511, lng: 9.9937 },
        "Antwerp": { lat: 51.2194, lng: 4.4025 },
        "Antwerp, Belgium": { lat: 51.2194, lng: 4.4025 },
        
        // North America
        "Los Angeles": { lat: 34.0522, lng: -118.2437 },
        "Los Angeles, USA": { lat: 34.0522, lng: -118.2437 },
        "New York": { lat: 40.7128, lng: -74.0060 },
        "New York, USA": { lat: 40.7128, lng: -74.0060 },
        
        // Default
        "default": { lat: 0, lng: 0 }
      };
      
      // Search for exact match
      if (fallbackLocations[locationName]) {
        return fallbackLocations[locationName];
      }
      
      // Search for partial match
      const locationLower = locationName.toLowerCase();
      for (const [key, value] of Object.entries(fallbackLocations)) {
        if (locationLower.includes(key.toLowerCase())) {
          return value;
        }
      }
      
      return fallbackLocations["default"];
    };

    loadGoogleMapsScript();
    
    return () => {
      // Cleanup if needed
    };
  }, [origin, destination, transportModes]);

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
      
      {/* Map attribution - important for Google Maps */}
      <div className="absolute bottom-1 left-1 text-[8px] text-white/70">
        Map data ©{new Date().getFullYear()} Google
      </div>
    </div>
  );
};

export default GoogleMapDisplay;
