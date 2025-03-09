
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
  modes: string[],
  isShared: boolean = false
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
      // Add dashed pattern for shared routes
      ...(isShared && {
        icons: [{
          icon: {
            path: 'M 0,-1 0,1',
            strokeOpacity: 1,
            scale: 3
          },
          offset: '0',
          repeat: '10px'
        }]
      })
    });
  }
};

// Draw multi-stop route with segments
export const drawMultiStopRoute = (
  map: google.maps.Map,
  stops: google.maps.LatLng[],
  modes: string[],
  isShared: boolean = false
) => {
  if (stops.length < 2) return;
  
  for (let i = 0; i < stops.length - 1; i++) {
    const segmentStart = stops[i];
    const segmentEnd = stops[i + 1];
    drawRouteLines(map, segmentStart, segmentEnd, modes, isShared);
  }
};

// Calculate distance between two points in kilometers
export const calculateDistance = (
  origin: google.maps.LatLng, 
  destination: google.maps.LatLng
): number => {
  const distance = window.google.maps.geometry?.spherical.computeDistanceBetween(origin, destination) || 0;
  return Math.round(distance / 1000); // Convert to kilometers and round
};

// Calculate total distance of a multi-stop route
export const calculateTotalDistance = (stops: google.maps.LatLng[]): number => {
  if (stops.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 0; i < stops.length - 1; i++) {
    totalDistance += calculateDistance(stops[i], stops[i + 1]);
  }
  
  return totalDistance;
};

// Estimate transit time between stops based on transport mode and distance
export const estimateTransitTime = (
  distance: number, 
  mode: string
): { hours: number; minutes: number } => {
  let speedKmPerHour = 0;
  
  switch (mode.toLowerCase()) {
    case 'air':
      speedKmPerHour = 800; // Average commercial aircraft speed
      break;
    case 'sea':
      speedKmPerHour = 40; // Average cargo ship speed
      break;
    case 'truck':
      speedKmPerHour = 80; // Average truck speed
      break;
    case 'electric truck':
      speedKmPerHour = 75; // Average electric truck speed
      break;
    default:
      speedKmPerHour = 60; // Default speed
  }
  
  const totalHours = distance / speedKmPerHour;
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  
  return { hours, minutes };
};

// Generate a cost estimate for a segment
export const estimateSegmentCost = (
  distance: number,
  mode: string,
  weight: number = 1000 // Default weight in kg
): number => {
  let baseCostPerKm = 0;
  
  switch (mode.toLowerCase()) {
    case 'air':
      baseCostPerKm = 3.5; // Higher cost for air freight
      break;
    case 'sea':
      baseCostPerKm = 0.8; // Lower cost for sea freight
      break;
    case 'truck':
      baseCostPerKm = 1.5; // Medium cost for truck
      break;
    case 'electric truck':
      baseCostPerKm = 1.7; // Slightly higher for electric
      break;
    default:
      baseCostPerKm = 1.0;
  }
  
  // Adjust for weight - heavier shipments cost more per km
  const weightFactor = Math.max(1, Math.log10(weight / 500));
  
  return Math.round(distance * baseCostPerKm * weightFactor);
};

// Generate total cost for multi-stop journey
export const calculateTotalCost = (
  stops: google.maps.LatLng[],
  modes: string[],
  weight: number = 1000
): number => {
  if (stops.length < 2) return 0;
  
  let totalCost = 0;
  for (let i = 0; i < stops.length - 1; i++) {
    const distance = calculateDistance(stops[i], stops[i + 1]);
    const modeIndex = Math.min(i, modes.length - 1);
    totalCost += estimateSegmentCost(distance, modes[modeIndex], weight);
  }
  
  return totalCost;
};

// Calculate cost savings for ride sharing
export const calculateRideSharingDiscount = (
  totalCost: number,
  participants: number = 2,
  fillRate: number = 0.8 // How full the transport is (0.0 to 1.0)
): number => {
  if (participants <= 1) return 0;
  
  // Base discount starts at 15% for 2 participants and increases slightly with more
  const baseDiscount = Math.min(0.35, 0.15 + (participants - 2) * 0.05);
  
  // Adjust for fill rate - higher fill rate means better efficiency
  const fillFactor = 0.7 + (fillRate * 0.3);
  
  return Math.round(totalCost * baseDiscount * fillFactor);
};

