
import React from 'react';

interface MapMarkersProps {
  map: google.maps.Map;
  originLatLng: google.maps.LatLng;
  destLatLng: google.maps.LatLng;
  origin: string;
  destination: string;
}

const MapMarkers: React.FC<MapMarkersProps> = ({
  map,
  originLatLng,
  destLatLng,
  origin,
  destination
}) => {
  React.useEffect(() => {
    if (!map || !window.google?.maps) return;
    
    // Create markers for origin and destination
    const originMarker = new window.google.maps.Marker({
      position: originLatLng,
      map: map,
      title: origin,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#0062FF",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#FFFFFF",
      }
    });
    
    const destMarker = new window.google.maps.Marker({
      position: destLatLng,
      map: map,
      title: destination,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#6E36E5",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#FFFFFF",
      }
    });
    
    // Create info windows
    const originInfo = new window.google.maps.InfoWindow({
      content: `<div style="color: black; padding: 5px;"><strong>${origin}</strong></div>`,
    });
    
    const destInfo = new window.google.maps.InfoWindow({
      content: `<div style="color: black; padding: 5px;"><strong>${destination}</strong></div>`,
    });
    
    // Add click listeners to markers
    originMarker.addListener("click", () => {
      // Fix: Use the correct InfoWindow.open() method signature
      originInfo.open({
        map,
        anchor: originMarker
      });
    });
    
    destMarker.addListener("click", () => {
      // Fix: Use the correct InfoWindow.open() method signature
      destInfo.open({
        map,
        anchor: destMarker
      });
    });
    
    // Create bounds to fit both markers
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(originLatLng);
    bounds.extend(destLatLng);
    map.fitBounds(bounds);

    return () => {
      // Clean up markers when component unmounts
      originMarker.setMap(null);
      destMarker.setMap(null);
    };
  }, [map, originLatLng, destLatLng, origin, destination]);

  return null; // This component doesn't render anything directly
};

export default MapMarkers;
