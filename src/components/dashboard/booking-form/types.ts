
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
  destination: string;
  destinationLabel?: string;
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
