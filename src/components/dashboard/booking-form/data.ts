
import { LocationData, CargoTypeData, TransportModeData } from "./types";

export const locations: LocationData[] = [
  { label: "Shanghai, China", value: "shanghai", port: true, airport: true, roadHub: true, description: "World's busiest container port" },
  { label: "Singapore", value: "singapore", port: true, airport: true, roadHub: true, description: "Major maritime hub in Southeast Asia" },
  { label: "Rotterdam, Netherlands", value: "rotterdam", port: true, airport: true, roadHub: true, description: "Europe's largest seaport" },
  { label: "Los Angeles, USA", value: "losangeles", port: true, airport: true, roadHub: true, description: "Busiest port in Western USA" },
  { label: "Dubai, UAE", value: "dubai", port: true, airport: true, roadHub: true, description: "Leading Middle Eastern logistics hub" },
  { label: "Hamburg, Germany", value: "hamburg", port: true, airport: true, roadHub: true, description: "Germany's largest port" },
  { label: "New York, USA", value: "newyork", port: true, airport: true, roadHub: true, description: "Major East Coast logistics center" },
  
  { label: "Hong Kong, China", value: "hongkong", port: true, airport: true, roadHub: true, description: "Premier air freight hub" },
  { label: "Memphis, USA", value: "memphis", port: false, airport: true, roadHub: true, description: "Global air cargo superhub" },
  { label: "Incheon, South Korea", value: "incheon", port: true, airport: true, roadHub: true, description: "Leading Asian air freight center" },
  { label: "Frankfurt, Germany", value: "frankfurt", port: false, airport: true, roadHub: true, description: "Central European air cargo hub" },
  
  { label: "Busan, South Korea", value: "busan", port: true, airport: false, roadHub: true, description: "Northeast Asia's transport hub" },
  { label: "Antwerp, Belgium", value: "antwerp", port: true, airport: false, roadHub: true, description: "Major European port" },
  { label: "Ningbo, China", value: "ningbo", port: true, airport: false, roadHub: true, description: "Second busiest port in China" },
  { label: "Jebel Ali, UAE", value: "jebelali", port: true, airport: false, roadHub: true, description: "Middle East's largest marine terminal" },
  
  { label: "Tokyo, Japan", value: "tokyo", port: true, airport: true, roadHub: true, description: "Japan's main logistics gateway" },
  { label: "Sydney, Australia", value: "sydney", port: true, airport: true, roadHub: true, description: "Australia's busiest port" },
  { label: "Mumbai, India", value: "mumbai", port: true, airport: true, roadHub: true, description: "India's largest port city" },
  { label: "Sao Paulo, Brazil", value: "saopaulo", port: false, airport: true, roadHub: true, description: "South America's largest city" },
  { label: "Johannesburg, South Africa", value: "johannesburg", port: false, airport: true, roadHub: true, description: "Africa's economic powerhouse" },
  { label: "Vancouver, Canada", value: "vancouver", port: true, airport: true, roadHub: true, description: "Canada's gateway to the Pacific" },
  { label: "Bangkok, Thailand", value: "bangkok", port: true, airport: true, roadHub: true, description: "Southeast Asian transport center" },
  { label: "Cairo, Egypt", value: "cairo", port: false, airport: true, roadHub: true, description: "North African logistics hub" },
  { label: "Moscow, Russia", value: "moscow", port: false, airport: true, roadHub: true, description: "Northern European transport hub" },
  { label: "Madrid, Spain", value: "madrid", port: false, airport: true, roadHub: true, description: "Southern European logistics center" },
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
