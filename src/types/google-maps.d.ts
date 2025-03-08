
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      setMapTypeId(mapTypeId: string): void;
      fitBounds(bounds: LatLngBounds): void;
    }

    class DirectionsService {
      route(request: DirectionsRequest, callback: (result: DirectionsResult, status: DirectionsStatus) => void): void;
    }

    class DirectionsRenderer {
      constructor(opts?: DirectionsRendererOptions);
      setDirections(directions: DirectionsResult): void;
      setMap(map: Map): void;
    }

    class LatLngBounds {
      constructor();
      extend(latLng: LatLng | LatLngLiteral): void;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: string;
    }

    interface LatLng {
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface DirectionsRequest {
      origin: string | LatLng | LatLngLiteral;
      destination: string | LatLng | LatLngLiteral;
      travelMode: TravelMode;
      provideRouteAlternatives?: boolean;
      drivingOptions?: DrivingOptions;
    }

    interface DirectionsResult {
      routes: DirectionsRoute[];
    }

    interface DirectionsRoute {
      legs: DirectionsLeg[];
      overview_path: LatLng[];
    }

    interface DirectionsLeg {
      steps: DirectionsStep[];
    }

    interface DirectionsStep {
      path: LatLng[];
    }

    interface DrivingOptions {
      departureTime: Date;
      trafficModel: any;
    }

    interface DirectionsRendererOptions {
      map?: Map;
      suppressMarkers?: boolean;
    }

    enum DirectionsStatus {
      OK = 'OK',
      NOT_FOUND = 'NOT_FOUND',
      ZERO_RESULTS = 'ZERO_RESULTS',
      MAX_WAYPOINTS_EXCEEDED = 'MAX_WAYPOINTS_EXCEEDED',
      INVALID_REQUEST = 'INVALID_REQUEST',
      OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
      REQUEST_DENIED = 'REQUEST_DENIED',
      UNKNOWN_ERROR = 'UNKNOWN_ERROR'
    }

    enum TravelMode {
      DRIVING = 'DRIVING',
      BICYCLING = 'BICYCLING',
      TRANSIT = 'TRANSIT',
      WALKING = 'WALKING'
    }

    enum TrafficModel {
      BEST_GUESS = 'bestguess',
      OPTIMISTIC = 'optimistic',
      PESSIMISTIC = 'pessimistic'
    }

    namespace MapTypeId {
      const ROADMAP: string;
      const SATELLITE: string;
      const HYBRID: string;
      const TERRAIN: string;
    }
  }
}

interface Window {
  google?: typeof google;
}
