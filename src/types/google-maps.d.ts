
// Type definitions for Google Maps JavaScript API
interface Window {
  google: typeof google;
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      setOptions(options: MapOptions): void;
      panTo(latLng: LatLng | LatLngLiteral): void;
      getBounds(): LatLngBounds;
      getCenter(): LatLng;
      getZoom(): number;
      fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral, padding?: number | Padding): void;
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

    interface MapTypeStyle {
      featureType?: string;
      elementType?: string;
      stylers: Array<any>;
    }

    class LatLng {
      constructor(lat: number, lng: number, noWrap?: boolean);
      lat(): number;
      lng(): number;
      toJSON(): any;
      toString(): string;
      equals(other: LatLng): boolean;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
      contains(latLng: LatLng): boolean;
      equals(other: LatLngBounds | LatLngBoundsLiteral): boolean;
      extend(latLng: LatLng): LatLngBounds;
      getCenter(): LatLng;
      getNorthEast(): LatLng;
      getSouthWest(): LatLng;
      isEmpty(): boolean;
      toJSON(): any;
      toString(): string;
      union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    interface Padding {
      bottom: number;
      left: number;
      right: number;
      top: number;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latLng: LatLng | LatLngLiteral): void;
      setTitle(title: string): void;
      setIcon(icon: Icon | string): void;
      setLabel(label: string | MarkerLabel): void;
      addListener(eventName: string, handler: Function): MapsEventListener;
      getPosition(): LatLng;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: Icon | string;
      label?: string | MarkerLabel;
      draggable?: boolean;
      clickable?: boolean;
      visible?: boolean;
      zIndex?: number;
    }

    interface Icon {
      url?: string;
      path?: SymbolPath | string;
      scale?: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeWeight?: number;
      strokeColor?: string;
    }

    interface MarkerLabel {
      text: string;
      color?: string;
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
    }

    enum SymbolPath {
      BACKWARD_CLOSED_ARROW,
      BACKWARD_OPEN_ARROW,
      CIRCLE,
      FORWARD_CLOSED_ARROW,
      FORWARD_OPEN_ARROW
    }

    class Polyline {
      constructor(opts?: PolylineOptions);
      setMap(map: Map | null): void;
      setPath(path: Array<LatLng | LatLngLiteral>): void;
      setOptions(options: PolylineOptions): void;
      getPath(): MVCArray<LatLng>;
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
      offset?: string;
      repeat?: string;
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

    class Geocoder {
      geocode(
        request: GeocoderRequest,
        callback: (results: Array<GeocoderResult>, status: GeocoderStatus) => void
      ): void;
    }

    interface GeocoderRequest {
      address?: string;
      location?: LatLng | LatLngLiteral;
      bounds?: LatLngBounds | LatLngBoundsLiteral;
      componentRestrictions?: GeocoderComponentRestrictions;
      region?: string;
    }

    interface GeocoderComponentRestrictions {
      country: string | Array<string>;
      administrativeArea?: string;
      locality?: string;
      postalCode?: string;
      route?: string;
    }

    interface GeocoderResult {
      address_components: Array<GeocoderAddressComponent>;
      formatted_address: string;
      geometry: GeocoderGeometry;
      place_id: string;
      types: Array<string>;
    }

    interface GeocoderAddressComponent {
      long_name: string;
      short_name: string;
      types: Array<string>;
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
      OVER_QUERY_LIMIT,
      REQUEST_DENIED,
      UNKNOWN_ERROR,
      ZERO_RESULTS
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      close(): void;
      // Updated: Changed the open method's signature to accept InfoWindowOpenOptions
      open(options: InfoWindowOpenOptions): void;
      setContent(content: string | Element): void;
      setOptions(options: InfoWindowOptions): void;
    }

    interface InfoWindowOptions {
      content?: string | Element;
      disableAutoPan?: boolean;
      maxWidth?: number;
      pixelOffset?: Size;
      position?: LatLng | LatLngLiteral;
      zIndex?: number;
    }

    interface InfoWindowOpenOptions {
      map?: Map;
      anchor?: MVCObject;
    }

    class Size {
      constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
      equals(other: Size): boolean;
      width: number;
      height: number;
    }

    class MVCObject {
      addListener(eventName: string, handler: Function): MapsEventListener;
      bindTo(key: string, target: MVCObject, targetKey?: string, noNotify?: boolean): void;
      get(key: string): any;
      notify(key: string): void;
      set(key: string, value: any): void;
      setValues(values: any): void;
      unbind(key: string): void;
      unbindAll(): void;
    }

    class MVCArray<T> extends MVCObject {
      constructor(array?: Array<T>);
      clear(): void;
      forEach(callback: (elem: T, i: number) => void): void;
      getArray(): Array<T>;
      getAt(i: number): T;
      getLength(): number;
      insertAt(i: number, elem: T): void;
      pop(): T;
      push(elem: T): number;
      removeAt(i: number): T;
      setAt(i: number, elem: T): void;
    }

    interface MapsEventListener {
      remove(): void;
    }

    namespace geometry {
      namespace spherical {
        function computeDistanceBetween(from: LatLng, to: LatLng, radius?: number): number;
        function computeHeading(from: LatLng, to: LatLng): number;
        function computeOffset(from: LatLng, distance: number, heading: number, radius?: number): LatLng;
      }
    }

    enum MapTypeId {
      HYBRID,
      ROADMAP,
      SATELLITE,
      TERRAIN
    }
  }
}
