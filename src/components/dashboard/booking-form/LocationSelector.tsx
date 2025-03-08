
import React from "react";
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
import { ChevronsUpDown } from "lucide-react";
import { LocationData } from "./types";

interface LocationSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  locations: LocationData[];
  placeholder: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  label,
  value,
  onChange,
  locations,
  placeholder,
}) => {
  const selectedLocation = locations.find(loc => loc.value === value);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            type="button"
            className={cn(
              "w-full justify-between border-white/10 bg-muted text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            {value
              ? locations.find((location) => location.value === value)?.label
              : placeholder}
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
                    onChange(currentValue === value ? "" : currentValue);
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
