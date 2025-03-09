
import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useGoogleMapsLoader } from "./hooks/useGoogleMapsLoader";
import { mapStyles } from "./utils/mapStyles";
import { getFallbackCoordinates } from "./utils/locationUtils";
import { drawRouteLines } from "./utils/routeUtils";
import MapMarkers from "./components/MapMarkers";

interface StopPoint {
  address: string;
  type: 'pickup' | 'dropoff' | 'both';
}

interface GoogleMapDisplayProps {
  origin: string;
  destination: string;
  stops?: StopPoint[];
  transportModes?: string[];
  isSharedRide?: boolean;
}

const GoogleMapDisplay: React.FC<GoogleMapDisplayProps> = ({ 
  origin, 
  destination,
  stops = [], 
  transportModes = ["driving"],
  isSharedRide = false
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [originLatLng, setOriginLatLng] = useState<google.maps.LatLng | null>(null);
  const [destLatLng, setDestLatLng] = useState<google.maps.LatLng | null>(null);
  const [stopLatLngs, setStopLatLngs] = useState<{
    position: google.maps.LatLng;
    title: string;
    type: 'pickup' | 'dropoff' | 'both';
  }[]>([]);
  const [mapType, setMapType] = useState<string>("roadmap");
  
  const { isLoaded } = useGoogleMapsLoader();
  
  // Handle map type change
  const handleMapTypeChange = (type: string) => {
    setMapType(type);
    if (mapInstance && window.google?.maps) {
      switch(type) {
        case "satellite":
          // @ts-ignore - setMapTypeId exists but not in the type definitions
          mapInstance.setMapTypeId(google.maps.MapTypeId.SATELLITE);
          break;
        case "hybrid":
          // @ts-ignore - setMapTypeId exists but not in the type definitions
          mapInstance.setMapTypeId(google.maps.MapTypeId.HYBRID);
          break;
        case "terrain":
          // @ts-ignore - setMapTypeId exists but not in the type definitions
          mapInstance.setMapTypeId(google.maps.MapTypeId.TERRAIN);
          break;
        default:
          // @ts-ignore - setMapTypeId exists but not in the type definitions
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
      
      // Function to geocode an address
      const geocodeAddress = (address: string) => {
        return new Promise<google.maps.LatLng>((resolve) => {
          geocoder.geocode({ address }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
              resolve(results[0].geometry.location);
            } else {
              // Use fallback coordinates for major shipping cities
              const fallbackCoords = getFallbackCoordinates(address);
              resolve(new window.google.maps.LatLng(fallbackCoords.lat, fallbackCoords.lng));
            }
          });
        });
      };
      
      // Geocode all addresses: origin, stops, and destination
      const geocodePromises = [
        geocodeAddress(origin),
        ...stops.map(stop => geocodeAddress(stop.address)),
        geocodeAddress(destination)
      ];
      
      Promise.all(geocodePromises)
        .then((coordinates) => {
          // First coordinate is origin
          const originCoord = coordinates[0];
          setOriginLatLng(originCoord);
          
          // Last coordinate is destination
          const destCoord = coordinates[coordinates.length - 1];
          setDestLatLng(destCoord);
          
          // Middle coordinates are stops (if any)
          if (stops.length > 0) {
            const stopCoordinates = coordinates.slice(1, coordinates.length - 1).map((coord, idx) => ({
              position: coord,
              title: stops[idx].address,
              type: stops[idx].type
            }));
            setStopLatLngs(stopCoordinates);
          }
          
          // Draw route lines based on transport modes
          if (stops.length > 0) {
            // Draw segments between each pair of points
            let previousPoint = originCoord;
            
            // Draw from origin to first stop
            drawRouteLines(
              map, 
              previousPoint, 
              stopCoordinates[0].position, 
              transportModes,
              isSharedRide
            );
            
            // Draw between stops
            for (let i = 0; i < stopCoordinates.length; i++) {
              const currentPoint = stopCoordinates[i].position;
              
              // If this is not the last stop, draw to the next stop
              if (i < stopCoordinates.length - 1) {
                const nextPoint = stopCoordinates[i + 1].position;
                drawRouteLines(
                  map, 
                  currentPoint, 
                  nextPoint, 
                  transportModes,
                  isSharedRide
                );
              } else {
                // If this is the last stop, draw to the destination
                drawRouteLines(
                  map, 
                  currentPoint, 
                  destCoord, 
                  transportModes,
                  isSharedRide
                );
              }
              
              previousPoint = currentPoint;
            }
          } else {
            // No stops, just draw from origin to destination
            drawRouteLines(
              map, 
              originCoord, 
              destCoord, 
              transportModes,
              isSharedRide
            );
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
      
    } catch (error) {
      console.error("Error initializing Google Maps:", error);
      setIsLoading(false);
    }
  }, [isLoaded, origin, destination, stops, transportModes, isSharedRide]);

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
          markers={[
            {
              position: originLatLng,
              title: origin,
              isOrigin: true
            },
            // Add stop markers
            ...stopLatLngs.map((stop) => ({
              position: stop.position,
              title: stop.title,
              isStop: true,
              stopType: stop.type
            })),
            {
              position: destLatLng,
              title: destination,
              isDestination: true
            }
          ]}
          isSharedRide={isSharedRide}
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
      
      {/* Shared ride indicator */}
      {isSharedRide && (
        <div className="absolute top-3 left-3 z-10 bg-black/60 rounded-md px-3 py-1 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-xs text-white">Shared Ride</span>
          </div>
        </div>
      )}
      
      {/* Map attribution - important for Google Maps */}
      <div className="absolute bottom-1 left-1 text-[8px] text-white/70">
        Map data ©{new Date().getFullYear()} Google
      </div>
    </div>
  );
};

export default GoogleMapDisplay;
