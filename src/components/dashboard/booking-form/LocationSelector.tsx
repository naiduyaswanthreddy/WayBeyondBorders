
import React, { useState } from "react";
import { LocationData } from "./types";
import { Check, ChevronsUpDown, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface LocationSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  manualInput: string;
  onManualInputChange: (value: string) => void;
  locations: LocationData[];
  placeholder?: string;
  error?: string;
  hideLabel?: boolean; // Added hideLabel prop
}

const LocationSelector = ({
  label,
  value,
  onChange,
  manualInput,
  onManualInputChange,
  locations,
  placeholder = "Select a location",
  error,
  hideLabel = false, // Default value is false
}: LocationSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [inputMode, setInputMode] = useState<"saved" | "manual">(
    "saved"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const selectedLocation = locations.find(
    (location) => location.value === value
  );

  const handleModeChange = (mode: string) => {
    setInputMode(mode as "saved" | "manual");
    if (mode === "saved" && manualInput) {
      onManualInputChange("");
    } else if (mode === "manual" && value) {
      onChange("");
    }
  };

  // Filter locations based on search query
  const filteredLocations = locations.filter((location) => 
    location.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-2">
      {!hideLabel && (
        <div className="flex justify-between">
          <label className="text-sm font-medium text-muted-foreground">
            {label}
          </label>
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="premium-outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal",
              error ? "border-destructive" : ""
            )}
          >
            {value && selectedLocation
              ? (
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{selectedLocation.label}</span>
                </div>
              ) 
              : manualInput ? (
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{manualInput}</span>
                </div>
              ) 
              : (
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{placeholder}</span>
                </div>
              )
            }
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 bg-card backdrop-blur-xl border border-white/10 shadow-premium z-50" align="start">
          <Tabs
            defaultValue={inputMode}
            value={inputMode}
            onValueChange={handleModeChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-muted/30 backdrop-blur-md">
              <TabsTrigger value="saved">Search Location</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>
            <TabsContent value="saved" className="mt-0">
              <div className="flex flex-col">
                <div className="flex items-center border-b border-white/10 px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Search location..."
                  />
                </div>

                <div className="max-h-[300px] overflow-y-auto">
                  {filteredLocations.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      No locations found. Try manual entry.
                    </div>
                  ) : (
                    filteredLocations.map((location) => (
                      <div
                        key={location.value}
                        className={cn(
                          "flex items-start py-2 px-2 cursor-pointer transition-colors hover:bg-white/5",
                          value === location.value ? "bg-nexus-blue/10" : ""
                        )}
                        onClick={() => {
                          onChange(location.value);
                          setOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <div className="flex items-center">
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 text-nexus-blue-light",
                              value === location.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">{location.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {location.description}
                            </span>
                            <div className="flex gap-1 mt-1">
                              {location.port && (
                                <span className="premium-pill-blue">Port</span>
                              )}
                              {location.airport && (
                                <span className="premium-pill-purple">Airport</span>
                              )}
                              {location.roadHub && (
                                <span className="premium-pill-teal">Road Hub</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="manual" className="mt-0 p-4 pt-2">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter location manually"
                    value={manualInput}
                    onChange={(e) => onManualInputChange(e.target.value)}
                    className="w-full nexus-input"
                  />
                </div>
                <Button
                  variant="premium-blue"
                  onClick={() => setOpen(false)}
                  className="w-full"
                >
                  Confirm
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
};

export default LocationSelector;
