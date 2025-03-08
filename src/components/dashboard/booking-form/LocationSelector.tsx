
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { ChevronsUpDown } from "lucide-react";
import { LocationData } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LocationSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  manualInput?: string;
  onManualInputChange?: (value: string) => void;
  locations: LocationData[];
  placeholder: string;
  error?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  label,
  value,
  onChange,
  manualInput = "",
  onManualInputChange,
  locations,
  placeholder,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("saved");
  
  const selectedLocation = locations.find(loc => loc.value === value);
  const displayValue = selectedLocation?.label || manualInput || placeholder;
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            type="button"
            className={cn(
              "w-full justify-between border-white/10 bg-muted text-left font-normal",
              !value && !manualInput && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            {displayValue}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-2" align="start" sideOffset={5}>
          <Tabs defaultValue="saved" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-2">
              <TabsTrigger value="saved">Saved Locations</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>
            <TabsContent value="saved" className="mt-0">
              <Command className="w-full">
                <CommandInput placeholder="Search location..." />
                <CommandEmpty>No location found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {locations.map((location) => (
                    <CommandItem
                      key={location.value}
                      value={location.value}
                      onSelect={(currentValue) => {
                        onChange(currentValue === value ? "" : currentValue);
                        if (onManualInputChange) onManualInputChange("");
                        setIsOpen(false);
                      }}
                    >
                      <MapPin className={cn(
                        "mr-2 h-4 w-4",
                        label === "Origin" ? "text-nexus-blue" : "text-nexus-purple"
                      )} />
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
            </TabsContent>
            <TabsContent value="manual" className="mt-0">
              <div className="space-y-2 p-1">
                <Input
                  placeholder="Enter location manually"
                  value={manualInput}
                  onChange={(e) => onManualInputChange && onManualInputChange(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <Button 
                    size="sm"
                    disabled={!manualInput}
                    onClick={() => {
                      onChange("");
                      setIsOpen(false);
                    }}
                  >
                    Use Manual Entry
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
      {value && (
        <p className="text-xs text-muted-foreground mt-1">
          {locations.find(loc => loc.value === value)?.description}
        </p>
      )}
    </div>
  );
};

export default LocationSelector;
