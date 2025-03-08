import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronsUpDown, Clock, MapPin, Package, Weight, ArrowRight, AlertTriangle, PlusCircle, DollarSign, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/components/ui/use-toast";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const locations = [
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

const cargoTypes = [
  { label: "General Cargo", value: "general", restrictions: [] },
  { label: "Perishable Goods", value: "perishable", restrictions: ["prioritize-air"], airPriority: true },
  { label: "Hazardous Materials", value: "hazmat", restrictions: ["no-air"], airAllowed: false },
  { label: "Fragile Items", value: "fragile", restrictions: ["careful-handling"] },
  { label: "Electronics", value: "electronics", restrictions: ["temperature-control"] },
  { label: "Vehicles", value: "vehicles", restrictions: ["special-handling"] },
  { label: "Bulk Liquids", value: "liquids", restrictions: ["no-air"], airAllowed: false },
  { label: "Heavy Machinery", value: "machinery", restrictions: ["weight-restrictions"] },
];

const transportModes = [
  { label: "Any (AI Optimized)", value: "any" },
  { label: "Air Freight", value: "air" },
  { label: "Sea Freight", value: "sea" },
  { label: "Road Transport", value: "road" },
  { label: "Express Air", value: "express" },
];

interface BookingFormProps {
  className?: string;
  updateRouteMap?: (data: any) => void;
}

interface CargoItem {
  name: string;
  length: string;
  width: string;
  height: string;
  weight: string;
}

interface TemplateData {
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

const BookingForm: React.FC<BookingFormProps> = ({ className }) => {
  const [date, setDate] = useState<Date | undefined>();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [weight, setWeight] = useState("");
  const [transportMode, setTransportMode] = useState("any");
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [restrictionWarning, setRestrictionWarning] = useState("");
  const [availableRoutes, setAvailableRoutes] = useState<string[]>([]);
  const [cargoItems, setCargoItems] = useState<CargoItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemLength, setNewItemLength] = useState("");
  const [newItemWidth, setNewItemWidth] = useState("");
  const [newItemHeight, setNewItemHeight] = useState("");
  const [newItemWeight, setNewItemWeight] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const templateString = sessionStorage.getItem('selectedTemplate');
    if (templateString) {
      try {
        const template: TemplateData = JSON.parse(templateString);
        
        if (template.origin) setOrigin(template.origin);
        if (template.destination) setDestination(template.destination);
        if (template.cargoType) setCargoType(template.cargoType);
        if (template.weight) setWeight(template.weight);
        if (template.transportMode) setTransportMode(template.transportMode);
        if (template.date) {
          const templateDate = new Date(template.date);
          if (!isNaN(templateDate.getTime())) {
            setDate(templateDate);
          }
        }
        if (template.cargoItems && template.cargoItems.length > 0) {
          setCargoItems(template.cargoItems);
        }
        
        sessionStorage.removeItem('selectedTemplate');
        
        toast({
          title: "Template Loaded",
          description: `"${template.name}" template has been applied to your new booking."
        });
      } catch (error) {
        console.error("Error parsing template data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (origin && destination) {
      const originLocation = locations.find(loc => loc.value === origin);
      const destLocation = locations.find(loc => loc.value === destination);
      
      const routeData = {
        origin,
        originLabel: originLocation?.label || origin,
        destination,
        destinationLabel: destLocation?.label || destination,
        date: date ? format(date, 'yyyy-MM-dd') : null,
        cargoType,
        weight,
        transportMode,
        cargoItems,
        availableRoutes
      };
      
      sessionStorage.setItem('routeMapData', JSON.stringify(routeData));
      
      const updateEvent = new CustomEvent('routeDataUpdated', { detail: routeData });
      window.dispatchEvent(updateEvent);
    }
  }, [origin, destination, date, cargoType, weight, transportMode, cargoItems, availableRoutes]);

  useEffect(() => {
    if (!cargoType) return;
    
    const selectedCargo = cargoTypes.find(c => c.value === cargoType);
    if (selectedCargo) {
      setRestrictions(selectedCargo.restrictions);
      
      if (selectedCargo.restrictions.includes("no-air") && (transportMode === "air" || transportMode === "express")) {
        setTransportMode("sea");
        setRestrictionWarning("This cargo type cannot be transported by air. Switched to sea freight.");
      } 
      else if (selectedCargo.restrictions.includes("prioritize-air") && transportMode !== "air" && transportMode !== "express") {
        setTransportMode("air");
        setRestrictionWarning("Perishable goods are best transported by air for faster delivery.");
      }
      else {
        setRestrictionWarning("");
      }
    }
  }, [cargoType]);

  useEffect(() => {
    if (!origin || !destination) return;
    
    const originLocation = locations.find(loc => loc.value === origin);
    const destLocation = locations.find(loc => loc.value === destination);
    
    if (!originLocation || !destLocation) return;
    
    const availableModes = [];
    
    if (originLocation.port && destLocation.port) {
      availableModes.push("sea");
    }
    
    if (originLocation.airport && destLocation.airport) {
      availableModes.push("air");
      availableModes.push("express");
    }
    
    if (originLocation.roadHub && destLocation.roadHub) {
      availableModes.push("road");
    }
    
    setAvailableRoutes(availableModes);
    
    if (transportMode !== "any" && !availableModes.includes(transportMode)) {
      setTransportMode("any");
      toast({
        title: "Transport Mode Reset",
        description: `Selected transport mode is not available between ${originLocation.label} and ${destLocation.label}`,
      });
    }
  }, [origin, destination]);

  const handleTransportModeChange = (value: string) => {
    const selectedCargo = cargoTypes.find(c => c.value === cargoType);
    
    if (selectedCargo?.restrictions.includes("no-air") && (value === "air" || value === "express")) {
      toast({
        title: "Transport Mode Restricted",
        description: "This cargo type cannot be transported by air.",
        variant: "destructive"
      });
      return;
    }
    
    if (value !== "any" && !availableRoutes.includes(value)) {
      toast({
        title: "Transport Mode Unavailable",
        description: `${value.charAt(0).toUpperCase() + value.slice(1)} transport is not available for this route.`,
        variant: "destructive"
      });
      return;
    }
    
    setTransportMode(value);
  };

  const handleAddCargoItem = () => {
    if (!newItemName || !newItemLength || !newItemWidth || !newItemHeight || !newItemWeight) {
      toast({
        title: "Incomplete Item Details",
        description: "Please fill in all item dimensions and weight",
        variant: "destructive"
      });
      return;
    }
    
    setCargoItems([
      ...cargoItems,
      {
        name: newItemName,
        length: newItemLength,
        width: newItemWidth,
        height: newItemHeight,
        weight: newItemWeight
      }
    ]);
    
    setNewItemName("");
    setNewItemLength("");
    setNewItemWidth("");
    setNewItemHeight("");
    setNewItemWeight("");
    
    toast({
      title: "Item Added",
      description: `${newItemName} added to shipment`
    });
  };

  const handleFindRoutes = () => {
    if (!origin || !destination || !date || !cargoType || (!weight && cargoItems.length === 0)) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields to find optimal routes.",
        variant: "destructive"
      });
      return;
    }

    const originLocation = locations.find(loc => loc.value === origin);
    const destLocation = locations.find(loc => loc.value === destination);

    const bookingData = {
      origin,
      originLabel: originLocation?.label || origin,
      destination,
      destinationLabel: destLocation?.label || destination,
      date: date ? format(date, 'yyyy-MM-dd') : null,
      cargoType,
      weight,
      transportMode,
      cargoItems,
      availableRoutes
    };
    
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    toast({
      title: "Finding optimal routes",
      description: "Analyzing available routes based on your requirements...",
    });
    
    setTimeout(() => {
      navigate('/routes');
    }, 500);
  };

  const handleSaveTemplate = () => {
    if (!origin || !destination || !cargoType) {
      toast({
        title: "Incomplete Template",
        description: "Please fill in at least origin, destination and cargo type to save a template.",
        variant: "destructive"
      });
      return;
    }
    
    const templateName = `${locations.find(loc => loc.value === origin)?.label} to ${locations.find(loc => loc.value === destination)?.label}`;
    const templates = JSON.parse(localStorage.getItem('shipmentTemplates') || '[]');
    
    templates.push({
      id: Date.now().toString(),
      name: templateName,
      origin,
      destination,
      cargoType,
      transportMode,
      cargoItems
    });
    
    localStorage.setItem('shipmentTemplates', JSON.stringify(templates));
    
    toast({
      title: "Template Saved",
      description: `Your shipment details have been saved as "${templateName}"`
    });
  };

  return (
    <div className={cn("nexus-card-blue p-6", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">New Booking</h2>
        <span className="rounded-full bg-nexus-blue/20 px-3 py-1 text-xs font-medium text-nexus-blue">
          AI Optimized
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Origin
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                type="button" // Explicitly set type to button to prevent form submission
                className={cn(
                  "w-full justify-between border-white/10 bg-muted text-left font-normal",
                  !origin && "text-muted-foreground"
                )}
              >
                {origin
                  ? locations.find((location) => location.value === origin)?.label
                  : "Select origin location"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start" sideOffset={5}>
              <Command className="w-full">
                <CommandInput placeholder="Search location..." />
                <CommandEmpty>No location found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {locations.map((location) => (
                    <CommandItem
                      key={location.value}
                      value={location.value}
                      onSelect={(currentValue) => {
                        setOrigin(currentValue === origin ? "" : currentValue);
                      }}
                    >
                      <MapPin className="mr-2 h-4 w-4 text-nexus-blue" />
                      {location.label}
                      <div className="ml-auto flex space-x-1">
                        {location.port && (
                          <span className="text-xs bg-blue-500/20 text-blue-500 px-1 rounded">Sea</span>
                        )}
                        {location.airport && (
                          <span className="text-xs bg-purple-500/20 text-purple-500 px-1 rounded">Air</span>
                        )}
                        {location.roadHub && (
                          <span className="text-xs bg-green-500/20 text-green-500 px-1 rounded">Road</span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {origin && (
            <p className="text-xs text-muted-foreground mt-1">
              {locations.find(loc => loc.value === origin)?.description}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Destination
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                type="button" // Explicitly set type to button to prevent form submission
                className={cn(
                  "w-full justify-between border-white/10 bg-muted text-left font-normal",
                  !destination && "text-muted-foreground"
                )}
              >
                {destination
                  ? locations.find((location) => location.value === destination)?.label
                  : "Select destination location"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start" sideOffset={5}>
              <Command className="w-full">
                <CommandInput placeholder="Search location..." />
                <CommandEmpty>No location found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {locations.map((location) => (
                    <CommandItem
                      key={location.value}
                      value={location.value}
                      onSelect={(currentValue) => {
                        setDestination(currentValue === destination ? "" : currentValue);
                      }}
                    >
                      <MapPin className="mr-2 h-4 w-4 text-nexus-purple" />
                      {location.label}
                      <div className="ml-auto flex space-x-1">
                        {location.port && (
                          <span className="text-xs bg-blue-500/20 text-blue-500 px-1 rounded">Sea</span>
                        )}
                        {location.airport && (
                          <span className="text-xs bg-purple-500/20 text-purple-500 px-1 rounded">Air</span>
                        )}
                        {location.roadHub && (
                          <span className="text-xs bg-green-500/20 text-green-500 px-1 rounded">Road</span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {destination && (
            <p className="text-xs text-muted-foreground mt-1">
              {locations.find(loc => loc.value === destination)?.description}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Shipping Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start border-white/10 bg-muted text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-nexus-teal" />
                {date ? format(date, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Cargo Type
          </label>
          <Select value={cargoType} onValueChange={setCargoType}>
            <SelectTrigger className="w-full border-white/10 bg-muted">
              <SelectValue placeholder="Select cargo type" />
            </SelectTrigger>
            <SelectContent>
              {cargoTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center">
                    <Package className="mr-2 h-4 w-4 text-nexus-blue" />
                    {type.label}
                    {type.restrictions.length > 0 && (
                      <span className="ml-2 text-xs opacity-70">
                        ({type.restrictions.length} restrictions)
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {restrictions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {restrictions.map((restriction, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-500/20 text-yellow-400"
                >
                  {restriction.split('-').join(' ')}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Transport Mode
          </label>
          <Select 
            value={transportMode} 
            onValueChange={handleTransportModeChange}
          >
            <SelectTrigger className="w-full border-white/10 bg-muted">
              <SelectValue placeholder="Select transport mode" />
            </SelectTrigger>
            <SelectContent>
              {transportModes.map((mode) => {
                const isAirMode = mode.value === 'air' || mode.value === 'express';
                const selectedCargo = cargoTypes.find(c => c.value === cargoType);
                const isDisabled = (selectedCargo?.restrictions.includes("no-air") && isAirMode) || 
                                  (mode.value !== 'any' && !availableRoutes.includes(mode.value) && availableRoutes.length > 0);
                
                return (
                  <SelectItem 
                    key={mode.value} 
                    value={mode.value}
                    disabled={isDisabled}
                    className={isDisabled ? "opacity-50" : ""}
                  >
                    {mode.label}
                    {isDisabled && " (Not available for this route/cargo)"}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          
          {restrictionWarning && (
            <p className="text-xs flex items-center text-yellow-400">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {restrictionWarning}
            </p>
          )}
          
          {availableRoutes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="text-xs text-muted-foreground">Available transport: </span>
              {availableRoutes.map((route) => (
                <span 
                  key={route} 
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-nexus-blue/20 text-nexus-blue"
                >
                  {route.charAt(0).toUpperCase() + route.slice(1)}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Total Weight (kg)
          </label>
          <div className="relative">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-muted px-3 py-2 pr-10 text-white placeholder:text-muted-foreground focus:border-nexus-purple/50 focus:outline-none focus:ring-1 focus:ring-nexus-purple/50"
              placeholder="Enter total weight"
            />
            <Weight className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Estimated Arrival
          </label>
          <div className="flex items-center rounded-md border border-white/10 bg-muted px-3 py-2 text-white">
            <Clock className="mr-2 h-4 w-4 text-nexus-teal" />
            <span>
              {origin && destination ? "3-5 days (AI optimized)" : "Select origin & destination"}
            </span>
          </div>
        </div>
        
        <div className="col-span-2 mt-4 space-y-4 border border-white/10 rounded-md p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium text-white">Cargo Items</h3>
            <span className="text-xs text-muted-foreground">
              {cargoItems.length} items added
            </span>
          </div>
          
          {cargoItems.length > 0 && (
            <div className="rounded-md border border-white/10 overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="p-2 text-left text-xs font-medium text-muted-foreground">Item</th>
                    <th className="p-2 text-left text-xs font-medium text-muted-foreground">Dimensions (L×W×H)</th>
                    <th className="p-2 text-left text-xs font-medium text-muted-foreground">Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {cargoItems.map((item, index) => (
                    <tr key={index} className="bg-white/5">
                      <td className="p-2 text-sm text-white">{item.name}</td>
                      <td className="p-2 text-sm text-white">{item.length}×{item.width}×{item.height} cm</td>
                      <td className="p-2 text-sm text-white">{item.weight} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="grid grid-cols-6 gap-2">
            <Input
              className="col-span-2 bg-muted border-white/10"
              placeholder="Item name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <Input
              className="bg-muted border-white/10"
              placeholder="Length (cm)"
              value={newItemLength}
              onChange={(e) => setNewItemLength(e.target.value)}
              type="number"
            />
            <Input
              className="bg-muted border-white/10"
              placeholder="Width (cm)"
              value={newItemWidth}
              onChange={(e) => setNewItemWidth(e.target.value)}
              type="number"
            />
            <Input
              className="bg-muted border-white/10"
              placeholder="Height (cm)"
              value={newItemHeight}
              onChange={(e) => setNewItemHeight(e.target.value)}
              type="number"
            />
            <Input
              className="bg-muted border-white/10"
              placeholder="Weight (kg)"
              value={newItemWeight}
              onChange={(e) => setNewItemWeight(e.target.value)}
              type="number"
            />
          </div>
          
          <Button 
            variant="outline"
            className="w-full border-dashed border-white/20"
            onClick={handleAddCargoItem}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="col-span-2 mt-4 grid grid-cols-2 gap-4">
          <Button 
            variant="outline"
            className="border-white/10"
            onClick={handleSaveTemplate}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Save as Template
          </Button>
          <Button 
            className="nexus-button-primary"
            onClick={handleFindRoutes}
          >
            Find Optimal Routes
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
