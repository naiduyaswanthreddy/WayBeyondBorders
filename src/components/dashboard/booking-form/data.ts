
import { LocationData, CargoTypeData, TransportModeData } from "./types";

// Extensive, predefined dataset of shipping locations
export const locations: LocationData[] = [
  // North America
  { label: "New York, USA", value: "newyork", port: true, airport: true, roadHub: true, description: "Major East Coast logistics center" },
  { label: "Los Angeles, USA", value: "losangeles", port: true, airport: true, roadHub: true, description: "Busiest port in Western USA" },
  { label: "Miami, USA", value: "miami", port: true, airport: true, roadHub: true, description: "Gateway to Latin America" },
  { label: "Chicago, USA", value: "chicago", port: false, airport: true, roadHub: true, description: "Major Midwest transportation hub" },
  { label: "Houston, USA", value: "houston", port: true, airport: true, roadHub: true, description: "Gulf Coast shipping center" },
  { label: "Seattle, USA", value: "seattle", port: true, airport: true, roadHub: true, description: "Major Pacific Northwest port" },
  { label: "Vancouver, Canada", value: "vancouver", port: true, airport: true, roadHub: true, description: "Largest port in Canada" },
  { label: "Toronto, Canada", value: "toronto", port: false, airport: true, roadHub: true, description: "Canada's financial hub" },
  { label: "Montreal, Canada", value: "montreal", port: true, airport: true, roadHub: true, description: "Major Quebec shipping center" },
  { label: "Mexico City, Mexico", value: "mexicocity", port: false, airport: true, roadHub: true, description: "Central Mexico logistics hub" },
  
  // Europe
  { label: "London, UK", value: "london", port: true, airport: true, roadHub: true, description: "European commercial hub" },
  { label: "Rotterdam, Netherlands", value: "rotterdam", port: true, airport: true, roadHub: true, description: "Europe's largest seaport" },
  { label: "Hamburg, Germany", value: "hamburg", port: true, airport: true, roadHub: true, description: "Germany's largest port" },
  { label: "Antwerp, Belgium", value: "antwerp", port: true, airport: false, roadHub: true, description: "Second-largest European port" },
  { label: "Marseille, France", value: "marseille", port: true, airport: true, roadHub: true, description: "Largest French port" },
  { label: "Barcelona, Spain", value: "barcelona", port: true, airport: true, roadHub: true, description: "Major Mediterranean port" },
  { label: "Genoa, Italy", value: "genoa", port: true, airport: false, roadHub: true, description: "Italy's busiest port" },
  { label: "Piraeus, Greece", value: "piraeus", port: true, airport: false, roadHub: true, description: "Greece's largest port" },
  { label: "Istanbul, Turkey", value: "istanbul", port: true, airport: true, roadHub: true, description: "Gateway between Europe and Asia" },
  { label: "Gdansk, Poland", value: "gdansk", port: true, airport: true, roadHub: true, description: "Major Baltic Sea port" },
  
  // Asia
  { label: "Shanghai, China", value: "shanghai", port: true, airport: true, roadHub: true, description: "World's busiest container port" },
  { label: "Singapore", value: "singapore", port: true, airport: true, roadHub: true, description: "Major maritime hub in Southeast Asia" },
  { label: "Hong Kong", value: "hongkong", port: true, airport: true, roadHub: true, description: "Major Asian logistics center" },
  { label: "Tokyo, Japan", value: "tokyo", port: true, airport: true, roadHub: true, description: "Japan's main logistics gateway" },
  { label: "Busan, South Korea", value: "busan", port: true, airport: true, roadHub: true, description: "South Korea's largest port" },
  { label: "Mumbai, India", value: "mumbai", port: true, airport: true, roadHub: true, description: "India's largest port city" },
  { label: "Chennai, India", value: "chennai", port: true, airport: true, roadHub: true, description: "Major port in Southern India" },
  { label: "Bangkok, Thailand", value: "bangkok", port: true, airport: true, roadHub: true, description: "Thailand's central logistics hub" },
  { label: "Ho Chi Minh City, Vietnam", value: "hochiminh", port: true, airport: true, roadHub: true, description: "Vietnam's commercial center" },
  { label: "Jakarta, Indonesia", value: "jakarta", port: true, airport: true, roadHub: true, description: "Indonesia's largest port" },
  
  // Middle East
  { label: "Dubai, UAE", value: "dubai", port: true, airport: true, roadHub: true, description: "Leading Middle Eastern logistics hub" },
  { label: "Abu Dhabi, UAE", value: "abudhabi", port: true, airport: true, roadHub: true, description: "Major oil export terminal" },
  { label: "Jeddah, Saudi Arabia", value: "jeddah", port: true, airport: true, roadHub: true, description: "Saudi Arabia's major port" },
  { label: "Haifa, Israel", value: "haifa", port: true, airport: false, roadHub: true, description: "Israel's largest seaport" },
  
  // Oceania
  { label: "Sydney, Australia", value: "sydney", port: true, airport: true, roadHub: true, description: "Australia's busiest port" },
  { label: "Melbourne, Australia", value: "melbourne", port: true, airport: true, roadHub: true, description: "Major Southern Australian port" },
  { label: "Brisbane, Australia", value: "brisbane", port: true, airport: true, roadHub: true, description: "Queensland's primary port" },
  { label: "Auckland, New Zealand", value: "auckland", port: true, airport: true, roadHub: true, description: "New Zealand's largest port" },
  
  // South America
  { label: "São Paulo, Brazil", value: "saopaulo", port: false, airport: true, roadHub: true, description: "South America's largest city" },
  { label: "Santos, Brazil", value: "santos", port: true, airport: false, roadHub: true, description: "Largest port in Latin America" },
  { label: "Buenos Aires, Argentina", value: "buenosaires", port: true, airport: true, roadHub: true, description: "Argentina's primary port" },
  { label: "Valparaíso, Chile", value: "valparaiso", port: true, airport: false, roadHub: true, description: "Chile's main container port" },
  { label: "Callao, Peru", value: "callao", port: true, airport: false, roadHub: true, description: "Peru's main seaport" },
  { label: "Cartagena, Colombia", value: "cartagena", port: true, airport: true, roadHub: true, description: "Colombia's main cargo port" },
  
  // Africa
  { label: "Durban, South Africa", value: "durban", port: true, airport: true, roadHub: true, description: "Africa's busiest port" },
  { label: "Cape Town, South Africa", value: "capetown", port: true, airport: true, roadHub: true, description: "Major port in Southern Africa" },
  { label: "Lagos, Nigeria", value: "lagos", port: true, airport: true, roadHub: true, description: "West Africa's largest port" },
  { label: "Mombasa, Kenya", value: "mombasa", port: true, airport: true, roadHub: true, description: "East Africa's largest port" },
  { label: "Alexandria, Egypt", value: "alexandria", port: true, airport: true, roadHub: true, description: "Egypt's main port on Mediterranean" },
  { label: "Tangier, Morocco", value: "tangier", port: true, airport: true, roadHub: true, description: "Strategic port at Gibraltar Strait" },
];

// Expanded cargo types with detailed attributes
export const cargoTypes: CargoTypeData[] = [
  // General Cargo
  { label: "General Cargo", value: "general", restrictions: [], airAllowed: true },
  { label: "Mixed Freight", value: "mixed", restrictions: [], airAllowed: true },
  
  // Containers
  { label: "20ft Container", value: "container20", restrictions: [], airAllowed: false },
  { label: "40ft Container", value: "container40", restrictions: [], airAllowed: false },
  { label: "40ft High Cube", value: "container40hc", restrictions: [], airAllowed: false },
  { label: "Refrigerated Container", value: "reefer", restrictions: ["temperature-control"], airAllowed: false },
  { label: "Open Top Container", value: "opentop", restrictions: ["special-handling"], airAllowed: false },
  { label: "Flat Rack Container", value: "flatrack", restrictions: ["special-handling"], airAllowed: false },
  { label: "Tank Container", value: "tank", restrictions: ["special-handling"], airAllowed: false },
  
  // Perishable Goods
  { label: "Perishable Goods", value: "perishable", restrictions: ["prioritize-air", "temperature-control"], airPriority: true, airAllowed: true },
  { label: "Fresh Produce", value: "produce", restrictions: ["prioritize-air", "temperature-control"], airPriority: true, airAllowed: true },
  { label: "Frozen Food", value: "frozen", restrictions: ["temperature-control"], airAllowed: true },
  { label: "Dairy Products", value: "dairy", restrictions: ["prioritize-air", "temperature-control"], airPriority: true, airAllowed: true },
  { label: "Meat & Seafood", value: "meat", restrictions: ["prioritize-air", "temperature-control"], airPriority: true, airAllowed: true },
  { label: "Flowers & Plants", value: "flowers", restrictions: ["prioritize-air", "temperature-control"], airPriority: true, airAllowed: true },
  
  // Hazardous Materials
  { label: "Hazardous Materials", value: "hazmat", restrictions: ["no-air", "special-handling"], airAllowed: false },
  { label: "Flammable Liquids", value: "flammable", restrictions: ["no-air", "special-handling"], airAllowed: false },
  { label: "Corrosive Substances", value: "corrosive", restrictions: ["no-air", "special-handling"], airAllowed: false },
  { label: "Toxic Materials", value: "toxic", restrictions: ["no-air", "special-handling"], airAllowed: false },
  { label: "Radioactive Materials", value: "radioactive", restrictions: ["no-air", "special-handling"], airAllowed: false },
  
  // High-Value Goods
  { label: "Electronics", value: "electronics", restrictions: ["temperature-control", "high-value"], airAllowed: true },
  { label: "Pharmaceuticals", value: "pharmaceuticals", restrictions: ["temperature-control", "high-value"], airAllowed: true },
  { label: "Luxury Goods", value: "luxury", restrictions: ["high-value"], airAllowed: true },
  { label: "Artwork", value: "artwork", restrictions: ["careful-handling", "high-value"], airAllowed: true },
  
  // Oversized & Heavy
  { label: "Vehicles", value: "vehicles", restrictions: ["special-handling", "oversized"], airAllowed: false },
  { label: "Heavy Machinery", value: "machinery", restrictions: ["weight-restrictions", "oversized"], airAllowed: false },
  { label: "Construction Equipment", value: "construction", restrictions: ["weight-restrictions", "oversized"], airAllowed: false },
  { label: "Project Cargo", value: "project", restrictions: ["special-handling", "oversized"], airAllowed: false },
  
  // Bulk Cargo
  { label: "Bulk Dry", value: "bulkdry", restrictions: ["no-air"], airAllowed: false },
  { label: "Bulk Grain", value: "grain", restrictions: ["no-air"], airAllowed: false },
  { label: "Bulk Coal", value: "coal", restrictions: ["no-air"], airAllowed: false },
  { label: "Bulk Minerals", value: "minerals", restrictions: ["no-air"], airAllowed: false },
  
  // Liquid Bulk
  { label: "Bulk Liquids", value: "liquids", restrictions: ["no-air"], airAllowed: false },
  { label: "Crude Oil", value: "oil", restrictions: ["no-air"], airAllowed: false },
  { label: "Petroleum Products", value: "petroleum", restrictions: ["no-air"], airAllowed: false },
  { label: "Chemicals", value: "chemicals", restrictions: ["no-air", "special-handling"], airAllowed: false },
  { label: "Vegetable Oils", value: "vegoil", restrictions: ["no-air"], airAllowed: false },
  
  // Special Cargo
  { label: "Live Animals", value: "animals", restrictions: ["prioritize-air", "special-handling"], airPriority: true, airAllowed: true },
  { label: "Human Remains", value: "remains", restrictions: ["special-handling"], airAllowed: true },
  { label: "Diplomatic Cargo", value: "diplomatic", restrictions: ["special-handling"], airAllowed: true },
  { label: "Military Equipment", value: "military", restrictions: ["special-handling"], airAllowed: true },
];

// Transport modes with detailed attributes
export const transportModes: TransportModeData[] = [
  { label: "Any (AI Optimized)", value: "any" },
  { label: "Air Freight", value: "air" },
  { label: "Express Air", value: "express" },
  { label: "Sea Freight", value: "sea" },
  { label: "Road Transport", value: "road" },
  { label: "Rail Transport", value: "rail" },
  { label: "Multimodal (Sea+Road)", value: "searoad" },
  { label: "Multimodal (Air+Road)", value: "airroad" },
  { label: "Multimodal (Sea+Rail)", value: "searail" },
];

// Additional transport-specific data could be added here for more complex routing
export const seaRoutes = {
  transatlantic: {
    name: "Transatlantic",
    averageDays: 10,
    ports: ["newyork", "rotterdam", "hamburg", "antwerp", "london"],
    costPerTEU: 2500, // USD
    frequency: "Weekly"
  },
  transpacific: {
    name: "Transpacific",
    averageDays: 14,
    ports: ["shanghai", "singapore", "hongkong", "losangeles", "seattle"],
    costPerTEU: 3800, // USD
    frequency: "Weekly"
  },
  europeAsia: {
    name: "Europe-Asia",
    averageDays: 28,
    ports: ["rotterdam", "hamburg", "shanghai", "singapore", "busan"],
    costPerTEU: 3200, // USD
    frequency: "Weekly"
  },
  asiaMiddleEast: {
    name: "Asia-Middle East",
    averageDays: 12,
    ports: ["shanghai", "singapore", "dubai", "jeddah"],
    costPerTEU: 2800, // USD
    frequency: "Weekly"
  }
};

export const airRoutes = {
  northAtlantic: {
    name: "North Atlantic",
    averageDays: 1,
    airports: ["newyork", "chicago", "london", "frankfurt"],
    costPerKg: 3.5, // USD
    frequency: "Daily"
  },
  transpacific: {
    name: "Transpacific",
    averageDays: 2,
    airports: ["losangeles", "shanghai", "tokyo", "hongkong"],
    costPerKg: 5.8, // USD
    frequency: "Daily"
  },
  europeAsia: {
    name: "Europe-Asia",
    averageDays: 2,
    airports: ["london", "frankfurt", "dubai", "singapore", "tokyo"],
    costPerKg: 4.2, // USD
    frequency: "Daily"
  },
  expressRoutes: {
    name: "Express Services",
    averageDays: 1,
    airports: ["newyork", "london", "frankfurt", "dubai", "shanghai", "tokyo"],
    costPerKg: 9.5, // USD
    frequency: "Daily"
  }
};

export const roadRoutes = {
  northAmerica: {
    name: "North American Network",
    connections: ["newyork", "chicago", "miami", "losangeles", "seattle", "toronto", "montreal"],
    costPerKm: 1.2, // USD
    restrictions: ["weight-restrictions"]
  },
  europe: {
    name: "European Network",
    connections: ["london", "rotterdam", "hamburg", "barcelona", "marseille", "antwerp", "genoa"],
    costPerKm: 1.5, // USD
    restrictions: []
  },
  asia: {
    name: "Asian Network",
    connections: ["shanghai", "hongkong", "bangkok", "hochiminh", "singapore"],
    costPerKm: 0.9, // USD
    restrictions: []
  }
};

export const railRoutes = {
  chinaSilkRoad: {
    name: "China-Europe Railway",
    averageDays: 18,
    terminals: ["shanghai", "hamburg", "rotterdam"],
    costPerTEU: 4500, // USD
    frequency: "Weekly"
  },
  northAmericaNetwork: {
    name: "North America Rail",
    averageDays: 5,
    terminals: ["chicago", "newyork", "losangeles"],
    costPerTEU: 2200, // USD
    frequency: "Daily"
  }
};

// Exchange rates data for financial calculations
export const exchangeRates = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 146.5,
  CNY: 7.2,
  INR: 83.5,
  AUD: 1.52,
  CAD: 1.36,
  SGD: 1.34,
  AED: 3.67
};

// Port and airport fees for cost calculation
export const portFees = {
  container: {
    handling: 250, // USD per container
    documentation: 120, // USD per shipment
    customs: 180 // USD per shipment
  },
  bulk: {
    handling: 8.5, // USD per ton
    documentation: 150, // USD per shipment
    customs: 220 // USD per shipment
  }
};

export const airportFees = {
  general: {
    handling: 0.32, // USD per kg
    documentation: 95, // USD per shipment
    security: 0.15, // USD per kg
    customs: 145 // USD per shipment
  },
  express: {
    handling: 0.45, // USD per kg
    documentation: 75, // USD per shipment
    security: 0.22, // USD per kg
    customs: 120 // USD per shipment
  }
};
