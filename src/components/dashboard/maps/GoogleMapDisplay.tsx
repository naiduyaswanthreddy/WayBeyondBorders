import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useGoogleMapsLoader } from "./hooks/useGoogleMapsLoader";
import { mapStyles } from "./utils/mapStyles";
import { getFallbackCoordinates } from "./utils/locationUtils";
import { drawRouteLines, drawMultiStopRoute } from "./utils/routeUtils";
import MapMarkers from "./components/MapMarkers";

interface Stop {
  location: string;
  type: "pickup" | "dropoff" | "both";
}

interface GoogleMapDisplayProps {
  origin: string;
  destination: string;
  intermediateStops?: Stop[];
  transportModes?: string[];
  isSharedRide?: boolean;
}

const GoogleMapDisplay: React.FC<GoogleMapDisplayProps> = ({ 
  origin, 
  destination,
  intermediateStops = [], 
  transportModes = ["driving"],
  isSharedRide = false
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [originLatLng, setOriginLatLng] = useState<google.maps.LatLng | null>(null);
  const [destLatLng, setDestLatLng] = useState<google.maps.LatLng | null>(null);
  const [mapType, setMapType] = useState<string>("roadmap");
  const [stopLatLngs, setStopLatLngs] = useState<google.maps.LatLng[]>([]);
  
  const { isLoaded } = useGoogleMapsLoader();
  
  // Handle map type change
  const handleMapTypeChange = (type: string) => {
    setMapType(type);
    if (mapInstance && window.google?.maps) {
      switch(type) {
        case "satellite":
          // @ts-ignore
          mapInstance.setMapTypeId(google.maps.MapTypeId.SATELLITE);
          break;
        case "hybrid":
          // @ts-ignore
          mapInstance.setMapTypeId(google.maps.MapTypeId.HYBRID);
          break;
        case "terrain":
          // @ts-ignore
          mapInstance.setMapTypeId(google.maps.MapTypeId.TERRAIN);
          break;
        default:
          // @ts-ignore
          mapInstance.setMapTypeId(google.maps.MapTypeId.ROADMAP);
      }
    }
  };
  
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps) return;
    
    setIsLoading(true);
    
    try {
      // Create map instance
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 20, lng: 0 }, // Default center
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.HYBRID, // Start with hybrid view
        disableDefaultUI: false,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: mapType === "roadmap" ? mapStyles : [] // Only apply custom styles in roadmap view
      });
      
      setMapInstance(map);
      setMapType("hybrid"); // Set initial state to match the mapTypeId
      
      // Add 45-degree imagery where available (may not work in all browsers)
      try {
        // @ts-ignore - setTilt is available but not in type definitions
        map.setTilt(45);
      } catch (e) {
        console.warn("Unable to set map tilt: ", e);
      }
      
      // Create geocoder to convert address strings to coordinates
      const geocoder = new window.google.maps.Geocoder();
      
      // Array of all locations to geocode (origin, destination, and intermediate stops)
      const allLocations = [
        origin,
        ...intermediateStops.map(stop => stop.location),
        destination
      ];
      
      // Convert all locations to coordinates
      Promise.all(
        allLocations.map(location => 
          new Promise<google.maps.LatLng>((resolve) => {
            geocoder.geocode({ address: location }, (results, status) => {
              if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
                resolve(results[0].geometry.location);
              } else {
                // Use fallback coordinates for major shipping cities
                const fallbackCoords = getFallbackCoordinates(location);
                resolve(new window.google.maps.LatLng(fallbackCoords.lat, fallbackCoords.lng));
              }
            });
          })
        )
      ).then((coordinates) => {
        // First coordinate is origin
        setOriginLatLng(coordinates[0]);
        
        // Last coordinate is destination
        setDestLatLng(coordinates[coordinates.length - 1]);
        
        // Store all coordinates in order including intermediate stops
        setStopLatLngs(coordinates);
        
        // If there are intermediate stops, draw a multi-stop route
        if (intermediateStops.length > 0) {
          drawMultiStopRoute(map, coordinates, transportModes, isSharedRide);
        } else {
          // Otherwise, draw a direct route
          drawRouteLines(map, coordinates[0], coordinates[coordinates.length - 1], transportModes, isSharedRide);
        }
      }).finally(() => {
        setIsLoading(false);
      });
      
    } catch (error) {
      console.error("Error initializing Google Maps:", error);
      setIsLoading(false);
    }
  }, [isLoaded, origin, destination, intermediateStops, transportModes, isSharedRide]);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-white/10 relative">
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
          intermediateStops={intermediateStops.map((stop, index) => ({
            location: stop.location,
            type: stop.type,
            position: stopLatLngs[index + 1] // +1 because first position is origin
          }))}
        />
      )}
      
      {/* Map type controls */}
      <div className="absolute bottom-14 left-3 z-10 bg-black/60 rounded-md p-2 backdrop-blur-sm">
        <div className="flex gap-2 text-xs">
          <button 
            onClick={() => handleMapTypeChange("roadmap")} 
            className={`px-2 py-1 rounded ${mapType === "roadmap" ? "bg-nexus-blue text-white" : "bg-white/20 text-white/80"}`}
          >
            Road
          </button>
          <button 
            onClick={() => handleMapTypeChange("satellite")} 
            className={`px-2 py-1 rounded ${mapType === "satellite" ? "bg-nexus-blue text-white" : "bg-white/20 text-white/80"}`}
          >
            Satellite
          </button>
          <button 
            onClick={() => handleMapTypeChange("hybrid")} 
            className={`px-2 py-1 rounded ${mapType === "hybrid" ? "bg-nexus-blue text-white" : "bg-white/20 text-white/80"}`}
          >
            Hybrid
          </button>
          <button 
            onClick={() => handleMapTypeChange("terrain")} 
            className={`px-2 py-1 rounded ${mapType === "terrain" ? "bg-nexus-blue text-white" : "bg-white/20 text-white/80"}`}
          >
            Terrain
          </button>
        </div>
      </div>
      
      {/* Map attribution - important for Google Maps */}
      <div className="absolute bottom-1 left-1 text-[8px] text-white/70">
        Map data ©{new Date().getFullYear()} Google
      </div>
    </div>
  );
};

export default GoogleMapDisplay;
