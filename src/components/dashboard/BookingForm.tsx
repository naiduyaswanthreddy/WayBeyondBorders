
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronsUpDown, Clock, MapPin, Package, Weight, ArrowRight, AlertTriangle } from "lucide-react";
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

const locations = [
  { label: "Los Angeles, USA", value: "LAX" },
  { label: "New York, USA", value: "NYC" },
  { label: "Shanghai, China", value: "SHA" },
  { label: "Singapore", value: "SIN" },
  { label: "Dubai, UAE", value: "DXB" },
  { label: "Rotterdam, Netherlands", value: "RTM" },
  { label: "Mumbai, India", value: "BOM" },
  { label: "Sydney, Australia", value: "SYD" },
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
  { label: "Rail Freight", value: "rail" },
  { label: "Road Transport", value: "road" },
  { label: "Express Air", value: "express" },
];

interface BookingFormProps {
  className?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ className }) => {
  const [date, setDate] = useState<Date>();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [weight, setWeight] = useState("");
  const [transportMode, setTransportMode] = useState("any");
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [restrictionWarning, setRestrictionWarning] = useState("");
  const navigate = useNavigate();

  // Apply cargo type restrictions whenever cargoType changes
  useEffect(() => {
    if (!cargoType) return;
    
    const selectedCargo = cargoTypes.find(c => c.value === cargoType);
    if (selectedCargo) {
      setRestrictions(selectedCargo.restrictions);
      
      // Handle air restrictions
      if (selectedCargo.restrictions.includes("no-air") && (transportMode === "air" || transportMode === "express")) {
        setTransportMode("sea");
        setRestrictionWarning("This cargo type cannot be transported by air. Switched to sea freight.");
      } 
      // Handle air priority for perishables
      else if (selectedCargo.restrictions.includes("prioritize-air") && transportMode !== "air" && transportMode !== "express") {
        setTransportMode("air");
        setRestrictionWarning("Perishable goods are best transported by air for faster delivery.");
      }
      else {
        setRestrictionWarning("");
      }
    }
  }, [cargoType]);

  const handleTransportModeChange = (value: string) => {
    const selectedCargo = cargoTypes.find(c => c.value === cargoType);
    
    // Check if the selected mode is allowed for this cargo
    if (selectedCargo?.restrictions.includes("no-air") && (value === "air" || value === "express")) {
      toast({
        title: "Transport Mode Restricted",
        description: "This cargo type cannot be transported by air.",
        variant: "destructive"
      });
      return;
    }
    
    setTransportMode(value);
  };

  const handleFindRoutes = () => {
    // Validate form
    if (!origin || !destination || !date || !cargoType || !weight) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields to find optimal routes.",
        variant: "destructive"
      });
      return;
    }

    // Store booking data in session storage
    const bookingData = {
      origin,
      destination,
      date: date ? format(date, 'yyyy-MM-dd') : null,
      cargoType,
      weight,
      transportMode
    };
    
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    toast({
      title: "Finding optimal routes",
      description: "Analyzing available routes based on your requirements...",
    });
    
    // Navigate to routes page
    setTimeout(() => {
      navigate('/routes');
    }, 500);
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
        {/* Origin */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Origin
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
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
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search location..." />
                <CommandEmpty>No location found.</CommandEmpty>
                <CommandGroup>
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
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Destination */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Destination
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
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
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search location..." />
                <CommandEmpty>No location found.</CommandEmpty>
                <CommandGroup>
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
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Date */}
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

        {/* Cargo Type */}
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

        {/* Transport Mode */}
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
                const isDisabled = selectedCargo?.restrictions.includes("no-air") && isAirMode;
                
                return (
                  <SelectItem 
                    key={mode.value} 
                    value={mode.value}
                    disabled={isDisabled}
                    className={isDisabled ? "opacity-50" : ""}
                  >
                    {mode.label}
                    {isDisabled && " (Not available for this cargo)"}
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
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Weight (kg)
          </label>
          <div className="relative">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-muted px-3 py-2 pr-10 text-white placeholder:text-muted-foreground focus:border-nexus-purple/50 focus:outline-none focus:ring-1 focus:ring-nexus-purple/50"
              placeholder="Enter weight"
            />
            <Weight className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        {/* ETA */}
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

        {/* Submit Button */}
        <div className="col-span-2 mt-2">
          <Button 
            className="nexus-button-primary w-full"
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
