
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
  description?: string;  // Added missing property
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

// New interfaces for financial analysis
export interface CurrencyConversion {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  timestamp: Date;
}

export interface AirTransportCost {
  baseFare: number;
  baseFareCurrency: string;
  airportTaxes: number;
  fuelSurcharge: number;
  securityFee: number;
  bankCharges: number;
  seasonalFactor: number; // percentage multiplier for seasonal prices
  totalInOriginalCurrency: number;
  totalConverted?: number;
  airline?: string;
}

export interface SeaTransportCost {
  baseFreight: number;
  containerType: "FCL" | "LCL";
  portHandling: number;
  customDuties: number;
  fuelSurcharge: number;
  documentationFees: number;
  insurance: number;
  totalInUSD: number;
  totalConverted?: number;
  carrier?: string;
}

export interface RoadTransportCost {
  baseFare: number;
  distanceKm: number;
  tollCharges: number;
  borderCrossing?: number;
  fuelSurcharge: number;
  driverAllowance: number;
  totalInOriginalCurrency: number;
  totalConverted?: number;
  carrier?: string;
}

export interface FinancialBreakdown {
  transportMode: string;
  userCurrency: string;
  airCosts?: AirTransportCost;
  seaCosts?: SeaTransportCost;
  roadCosts?: RoadTransportCost;
  exchangeRates: Record<string, number>;
  totalCost: number;
  profitMargin: number;
  companyCost: number;
}

// New UI theme interfaces
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  text: string;
  border: string;
}

export interface GradientTheme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay: number;
}
