
// Type definitions for Google Maps JavaScript API
// This file provides the necessary type augmentation for methods not covered in the standard types

// Extend the existing Google Maps types with missing methods
declare global {
  namespace google.maps {
    interface Map {
      setMapTypeId(mapTypeId: google.maps.MapTypeId | string): void;
      setTilt(tiltAngle: number): void;
    }
  }
}

// Export an empty object to make this a module
export {};
