
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronsUpDown, Clock, MapPin, Package, Weight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  { label: "General Cargo", value: "general" },
  { label: "Perishable Goods", value: "perishable" },
  { label: "Hazardous Materials", value: "hazmat" },
  { label: "Fragile Items", value: "fragile" },
  { label: "Electronics", value: "electronics" },
  { label: "Vehicles", value: "vehicles" },
  { label: "Bulk Liquids", value: "liquids" },
  { label: "Heavy Machinery", value: "machinery" },
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full justify-between border-white/10 bg-muted text-left font-normal",
                  !cargoType && "text-muted-foreground"
                )}
              >
                {cargoType
                  ? cargoTypes.find((type) => type.value === cargoType)?.label
                  : "Select cargo type"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search cargo type..." />
                <CommandEmpty>No cargo type found.</CommandEmpty>
                <CommandGroup>
                  {cargoTypes.map((type) => (
                    <CommandItem
                      key={type.value}
                      value={type.value}
                      onSelect={(currentValue) => {
                        setCargoType(currentValue === cargoType ? "" : currentValue);
                      }}
                    >
                      <Package className="mr-2 h-4 w-4 text-nexus-blue" />
                      {type.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
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
          <Button className="nexus-button-primary w-full">Find Optimal Routes</Button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
