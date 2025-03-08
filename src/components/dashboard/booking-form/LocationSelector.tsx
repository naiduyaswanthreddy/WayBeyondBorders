
import React, { useState } from "react";
import { LocationData } from "./types";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
}: LocationSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [inputMode, setInputMode] = useState<"saved" | "manual">(
    "saved"
  );

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

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between">
        <label className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal",
              error ? "border-destructive" : ""
            )}
          >
            {value
              ? selectedLocation?.label
              : manualInput
              ? manualInput
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Tabs
            defaultValue={inputMode}
            value={inputMode}
            onValueChange={handleModeChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="saved">Select Location</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>
            <TabsContent value="saved" className="mt-0">
              <Command>
                <CommandInput placeholder="Search location..." />
                <CommandEmpty>No location found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {locations && locations.map((location) => (
                    <CommandItem
                      key={location.value}
                      value={location.value}
                      onSelect={(currentValue) => {
                        onChange(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === location.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{location.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {location.description}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </TabsContent>
            <TabsContent value="manual" className="mt-0 p-4 pt-2">
              <div className="flex flex-col space-y-3">
                <Input
                  placeholder="Enter location manually"
                  value={manualInput}
                  onChange={(e) => onManualInputChange(e.target.value)}
                  className="w-full"
                />
                <Button
                  variant="default"
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
    </div>
  );
};

export default LocationSelector;
