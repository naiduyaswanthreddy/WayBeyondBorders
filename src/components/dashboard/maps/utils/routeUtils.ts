
// Helper function to generate arc coordinates between two points
export const getArcCoordinates = (
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
  const distance = window.google.maps.geometry?.spherical.computeDistanceBetween(origin, destination) || 0;
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
    
    points.push(new window.google.maps.LatLng(lat, lng));
  }
  
  return points;
};

// Helper function to draw route lines
export const drawRouteLines = (
  map: google.maps.Map, 
  origin: google.maps.LatLng, 
  destination: google.maps.LatLng, 
  modes: string[]
) => {
  // For air travel - draw a curved arc line
  if (modes.includes("air")) {
    const pathCoordinates = getArcCoordinates(origin, destination);
    new window.google.maps.Polyline({
      path: pathCoordinates,
      geodesic: false,
      strokeColor: "#0062FF",
      strokeOpacity: 0.8,
      strokeWeight: 3,
      map: map,
      icons: [{
        icon: { path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
        repeat: "100px"
      }]
    });
  }
  
  // For sea travel - draw a different curved line
  if (modes.includes("sea")) {
    const pathCoordinates = getArcCoordinates(origin, destination, -1); // Negative bend for different curve
    new window.google.maps.Polyline({
      path: pathCoordinates,
      geodesic: false,
      strokeColor: "#00CFD5",
      strokeOpacity: 0.8,
      strokeWeight: 3,
      map: map,
      icons: [{
        icon: { path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
        repeat: "100px"
      }]
    });
  }
  
  // For truck/road travel
  if (modes.includes("truck") || modes.includes("electric truck")) {
    new window.google.maps.Polyline({
      path: [origin, destination],
      geodesic: true,
      strokeColor: modes.includes("electric truck") ? "#34D399" : "#FCD34D",
      strokeOpacity: 0.8,
      strokeWeight: 3,
      map: map,
      icons: [{
        icon: { path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
        repeat: "100px"
      }]
    });
  }
};
