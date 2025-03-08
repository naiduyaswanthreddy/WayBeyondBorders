import { LocationData, CargoTypeData, TransportModeData } from "./types";

export const locations: LocationData[] = [
  { label: "New York, USA", value: "newyork", port: true, airport: true, roadHub: true, description: "Major East Coast logistics center" },
  { label: "Los Angeles, USA", value: "losangeles", port: true, airport: true, roadHub: true, description: "Busiest port in Western USA" },
  { label: "Miami, USA", value: "miami", port: true, airport: true, roadHub: true, description: "Gateway to Latin America" },
  { label: "London, UK", value: "london", port: true, airport: true, roadHub: true, description: "European commercial hub" },
  { label: "Rotterdam, Netherlands", value: "rotterdam", port: true, airport: true, roadHub: true, description: "Europe's largest seaport" },
  { label: "Hamburg, Germany", value: "hamburg", port: true, airport: true, roadHub: true, description: "Germany's largest port" },
  { label: "Shanghai, China", value: "shanghai", port: true, airport: true, roadHub: true, description: "World's busiest container port" },
  { label: "Singapore", value: "singapore", port: true, airport: true, roadHub: true, description: "Major maritime hub in Southeast Asia" },
  { label: "Tokyo, Japan", value: "tokyo", port: true, airport: true, roadHub: true, description: "Japan's main logistics gateway" },
  { label: "Sydney, Australia", value: "sydney", port: true, airport: true, roadHub: true, description: "Australia's busiest port" },
  { label: "Dubai, UAE", value: "dubai", port: true, airport: true, roadHub: true, description: "Leading Middle Eastern logistics hub" },
  { label: "Cape Town, South Africa", value: "capetown", port: true, airport: true, roadHub: true, description: "Major African logistics hub" },
  { label: "São Paulo, Brazil", value: "saopaulo", port: false, airport: true, roadHub: true, description: "South America's largest city" },
  { label: "Mumbai, India", value: "mumbai", port: true, airport: true, roadHub: true, description: "India's largest port city" },
  { label: "Moscow, Russia", value: "moscow", port: false, airport: true, roadHub: true, description: "Northern European transport hub" },
];

export const cargoTypes: CargoTypeData[] = [
  { label: "General Cargo", value: "general", restrictions: [] },
  { label: "Perishable Goods", value: "perishable", restrictions: ["prioritize-air"], airPriority: true },
  { label: "Hazardous Materials", value: "hazmat", restrictions: ["no-air"], airAllowed: false },
  { label: "Fragile Items", value: "fragile", restrictions: ["careful-handling"] },
  { label: "Electronics", value: "electronics", restrictions: ["temperature-control"] },
  { label: "Vehicles", value: "vehicles", restrictions: ["special-handling"] },
  { label: "Bulk Liquids", value: "liquids", restrictions: ["no-air"], airAllowed: false },
  { label: "Heavy Machinery", value: "machinery", restrictions: ["weight-restrictions"] },
];

export const transportModes: TransportModeData[] = [
  { label: "Any (AI Optimized)", value: "any" },
  { label: "Air Freight", value: "air" },
  { label: "Sea Freight", value: "sea" },
  { label: "Road Transport", value: "road" },
  { label: "Express Air", value: "express" },
];
