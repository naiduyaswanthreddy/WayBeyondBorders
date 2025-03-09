
import React from 'react';

interface MapMarkersProps {
  map: google.maps.Map;
  markers: {
    position: google.maps.LatLng;
    title: string;
    isOrigin?: boolean;
    isDestination?: boolean;
    isStop?: boolean;
    stopType?: 'pickup' | 'dropoff' | 'both';
  }[];
  isSharedRide?: boolean;
}

const MapMarkers: React.FC<MapMarkersProps> = ({
  map,
  markers,
  isSharedRide = false
}) => {
  React.useEffect(() => {
    if (!map || !window.google?.maps) return;
    
    // Store all markers to clean up later
    const createdMarkers: google.maps.Marker[] = [];
    const infoWindows: google.maps.InfoWindow[] = [];
    
    // Create markers for all points
    markers.forEach((markerData, index) => {
      let iconColor = "#6E36E5"; // Default purple color
      let iconScale = 8;
      
      // Determine marker color and scale based on point type
      if (markerData.isOrigin) {
        iconColor = "#0062FF"; // Blue for origin
        iconScale = 10;
      } else if (markerData.isDestination) {
        iconColor = "#6E36E5"; // Purple for destination
        iconScale = 10;
      } else if (markerData.isStop) {
        // Colors for intermediate stops based on type
        if (markerData.stopType === 'pickup') {
          iconColor = "#10B981"; // Green for pickup
        } else if (markerData.stopType === 'dropoff') {
          iconColor = "#EF4444"; // Red for dropoff
        } else if (markerData.stopType === 'both') {
          iconColor = "#F59E0B"; // Amber for both
        }
      }
      
      // Create marker with appropriate styling
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map: map,
        title: markerData.title,
        // @ts-ignore - animation exists but not in the type definitions
        animation: window.google.maps.Animation.DROP,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: iconScale,
          fillColor: iconColor,
          fillOpacity: 1,
          strokeWeight: 3,
          strokeColor: "#FFFFFF",
        }
      });
      
      createdMarkers.push(marker);
      
      // Create enhanced info windows with styled content
      let infoContent = `
        <div style="color: black; padding: 8px; max-width: 200px; font-family: 'Arial', sans-serif;">
          <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px; color: ${iconColor};">${markerData.title}</div>
      `;
      
      // Add appropriate subtitle based on point type
      if (markerData.isOrigin) {
        infoContent += `<div style="font-size: 12px; color: #555;">Origin Location</div>`;
      } else if (markerData.isDestination) {
        infoContent += `<div style="font-size: 12px; color: #555;">Destination Location</div>`;
      } else if (markerData.isStop) {
        if (markerData.stopType === 'pickup') {
          infoContent += `<div style="font-size: 12px; color: #555;">Pickup Stop</div>`;
        } else if (markerData.stopType === 'dropoff') {
          infoContent += `<div style="font-size: 12px; color: #555;">Dropoff Stop</div>`;
        } else if (markerData.stopType === 'both') {
          infoContent += `<div style="font-size: 12px; color: #555;">Pickup & Dropoff Stop</div>`;
        } else {
          infoContent += `<div style="font-size: 12px; color: #555;">Intermediate Stop</div>`;
        }
      }
      
      infoContent += `</div>`;
      
      const infoWindow = new window.google.maps.InfoWindow({
        content: infoContent,
        pixelOffset: new window.google.maps.Size(0, -5)
      });
      
      infoWindows.push(infoWindow);
      
      // Add click listeners to markers
      marker.addListener("click", () => {
        infoWindow.open({
          map,
          anchor: marker as unknown as google.maps.MVCObject
        });
      });
      
      // Bounce animation on hover
      marker.addListener('mouseover', () => {
        // @ts-ignore - setAnimation exists but not in the type definitions
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
      });
      
      marker.addListener('mouseout', () => {
        // @ts-ignore - setAnimation exists but not in the type definitions
        marker.setAnimation(null);
      });
    });
    
    // Create bounds to fit all markers
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach(marker => {
      bounds.extend(marker.position);
    });
    
    // Add some padding to the bounds
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });

    return () => {
      // Clean up markers when component unmounts
      createdMarkers.forEach(marker => marker.setMap(null));
      infoWindows.forEach(infoWindow => infoWindow.close());
    };
  }, [map, markers]);

  return null; // This component doesn't render anything directly
};

export default MapMarkers;
