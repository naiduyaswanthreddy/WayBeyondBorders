
import { ReactNode } from "react";

export interface CargoItem {
  name: string;
  length: string;
  width: string;
  height: string;
  weight: string;
}

export interface TemplateData {
  id: string;
  name: string;
  origin: string;
  originLabel?: string;
  originInput?: string;
  destination: string;
  destinationLabel?: string;
  destinationInput?: string;
  cargoType: string;
  weight?: string;
  transportMode?: string;
  cargoItems?: CargoItem[];
  date?: string;
}

export interface LocationData {
  label: string;
  value: string;
  port: boolean;
  airport: boolean;
  roadHub: boolean;
  description: string;
}

export interface CargoTypeData {
  label: string;
  value: string;
  restrictions: string[];
  airPriority?: boolean;
  airAllowed?: boolean;
}

export interface TransportModeData {
  label: string;
  value: string;
}

export interface BookingFormProps {
  className?: string;
  updateRouteMap?: (data: any) => void;
}

// New interfaces for our expanded dataset
export interface SeaRoute {
  name: string;
  averageDays: number;
  ports: string[];
  costPerTEU: number;
  frequency: string;
}

export interface AirRoute {
  name: string;
  averageDays: number;
  airports: string[];
  costPerKg: number;
  frequency: string;
}

export interface RoadRoute {
  name: string;
  connections: string[];
  costPerKm: number;
  restrictions: string[];
}

export interface RailRoute {
  name: string;
  averageDays: number;
  terminals: string[];
  costPerTEU: number;
  frequency: string;
}

export interface PortFee {
  handling: number;
  documentation: number;
  customs: number;
}

export interface AirportFee {
  handling: number;
  documentation: number;
  security: number;
  customs: number;
}
