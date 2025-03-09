
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
      // @ts-ignore - animation exists but not in the type definitions
      animation: window.google.maps.Animation.DROP,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#0062FF",
        fillOpacity: 1,
        strokeWeight: 3,
        strokeColor: "#FFFFFF",
      }
    });
    
    const destMarker = new window.google.maps.Marker({
      position: destLatLng,
      map: map,
      title: destination,
      // @ts-ignore - animation exists but not in the type definitions
      animation: window.google.maps.Animation.DROP,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#6E36E5",
        fillOpacity: 1,
        strokeWeight: 3,
        strokeColor: "#FFFFFF",
      }
    });
    
    // Create enhanced info windows with styled content
    const originInfo = new window.google.maps.InfoWindow({
      content: `
        <div style="color: black; padding: 8px; max-width: 200px; font-family: 'Arial', sans-serif;">
          <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px; color: #0062FF;">${origin}</div>
          <div style="font-size: 12px; color: #555;">Origin Location</div>
        </div>
      `,
      pixelOffset: new window.google.maps.Size(0, -5)
    });
    
    const destInfo = new window.google.maps.InfoWindow({
      content: `
        <div style="color: black; padding: 8px; max-width: 200px; font-family: 'Arial', sans-serif;">
          <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px; color: #6E36E5;">${destination}</div>
          <div style="font-size: 12px; color: #555;">Destination Location</div>
        </div>
      `,
      pixelOffset: new window.google.maps.Size(0, -5)
    });
    
    // Add click listeners to markers
    originMarker.addListener("click", () => {
      originInfo.open({
        map,
        anchor: originMarker as unknown as google.maps.MVCObject
      });
    });
    
    destMarker.addListener("click", () => {
      destInfo.open({
        map,
        anchor: destMarker as unknown as google.maps.MVCObject
      });
    });
    
    // Bounce animation on hover
    const addBounceOnHover = (marker: google.maps.Marker) => {
      marker.addListener('mouseover', () => {
        // @ts-ignore - setAnimation exists but not in the type definitions
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
      });
      
      marker.addListener('mouseout', () => {
        // @ts-ignore - setAnimation exists but not in the type definitions
        marker.setAnimation(null);
      });
    };
    
    addBounceOnHover(originMarker);
    addBounceOnHover(destMarker);
    
    // Create bounds to fit both markers
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(originLatLng);
    bounds.extend(destLatLng);
    
    // Add some padding to the bounds
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });

    return () => {
      // Clean up markers when component unmounts
      originMarker.setMap(null);
      destMarker.setMap(null);
    };
  }, [map, originLatLng, destLatLng, origin, destination]);

  return null; // This component doesn't render anything directly
};

export default MapMarkers;
