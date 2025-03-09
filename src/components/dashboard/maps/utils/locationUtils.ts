
// Helper function to get fallback coordinates for major shipping cities
export const getFallbackCoordinates = (locationName: string): { lat: number, lng: number } => {
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
