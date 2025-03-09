
declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      fitBounds(bounds: LatLngBounds): void;
      getBounds(): LatLngBounds;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setPosition(latLng: LatLng | LatLngLiteral): void;
      setMap(map: Map | null): void;
      addListener(eventName: string, handler: Function): MapsEventListener;
    }

    class Polyline {
      constructor(opts?: PolylineOptions);
      setPath(path: Array<LatLng | LatLngLiteral>): void;
      setMap(map: Map | null): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
      toJSON(): LatLngLiteral;
    }

    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
      extend(latLng: LatLng | LatLngLiteral): LatLngBounds;
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map: Map, anchor?: Marker): void;
      close(): void;
    }

    class Geocoder {
      geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: GeocoderStatus) => void): void;
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon | Symbol;
    }

    interface Icon {
      url?: string;
      size?: Size;
      origin?: Point;
      anchor?: Point;
      scaledSize?: Size;
      path?: string;
      fillColor?: string;
      fillOpacity?: number;
      strokeWeight?: number;
      strokeColor?: string;
      scale?: number;
    }

    interface Symbol {
      path: SymbolPath | string;
      fillColor?: string;
      fillOpacity?: number;
      scale?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
    }

    interface PolylineOptions {
      path?: Array<LatLng | LatLngLiteral>;
      geodesic?: boolean;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      map?: Map;
      icons?: Array<IconSequence>;
    }

    interface IconSequence {
      icon: Symbol;
      repeat?: string;
      offset?: string;
    }

    interface InfoWindowOptions {
      content?: string | Node;
      position?: LatLng | LatLngLiteral;
      maxWidth?: number;
    }

    interface GeocoderRequest {
      address?: string;
      location?: LatLng | LatLngLiteral;
      bounds?: LatLngBounds;
      componentRestrictions?: GeocoderComponentRestrictions;
      region?: string;
    }

    interface GeocoderComponentRestrictions {
      country: string | string[];
    }

    interface GeocoderResult {
      address_components: GeocoderAddressComponent[];
      formatted_address: string;
      geometry: GeocoderGeometry;
      place_id: string;
      types: string[];
    }

    interface GeocoderAddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    interface GeocoderGeometry {
      location: LatLng;
      location_type: GeocoderLocationType;
      viewport: LatLngBounds;
      bounds?: LatLngBounds;
    }

    enum GeocoderLocationType {
      APPROXIMATE,
      GEOMETRIC_CENTER,
      RANGE_INTERPOLATED,
      ROOFTOP
    }

    enum GeocoderStatus {
      ERROR,
      INVALID_REQUEST,
      OK,
      OVER_QUOTA,
      REQUEST_DENIED,
      UNKNOWN_ERROR,
      ZERO_RESULTS
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: MapTypeId;
      disableDefaultUI?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
      zoomControl?: boolean;
      styles?: Array<MapTypeStyle>;
    }

    enum MapTypeId {
      ROADMAP,
      SATELLITE,
      HYBRID,
      TERRAIN
    }

    interface MapTypeStyle {
      featureType?: string;
      elementType?: string;
      stylers: Array<{ [key: string]: any }>;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface Size {
      width: number;
      height: number;
    }

    interface Point {
      x: number;
      y: number;
    }

    enum SymbolPath {
      BACKWARD_CLOSED_ARROW,
      BACKWARD_OPEN_ARROW,
      CIRCLE,
      FORWARD_CLOSED_ARROW,
      FORWARD_OPEN_ARROW
    }

    interface MapsEventListener {
      remove(): void;
    }

    namespace geometry {
      namespace spherical {
        function computeDistanceBetween(from: LatLng, to: LatLng): number;
      }
    }
  }
}

export {};
