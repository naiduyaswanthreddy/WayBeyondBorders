
import React from "react";
import { Button } from "@/components/ui/button";
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
import { ChevronsUpDown, Box } from "lucide-react";
import { CargoTypeData } from "./types";

interface CargoTypeSelectorProps {
  cargoType: string;
  setCargoType: (value: string) => void;
  cargoTypes: CargoTypeData[];
  restrictions: string[];
  error?: string;
}

const CargoTypeSelector: React.FC<CargoTypeSelectorProps> = ({
  cargoType,
  setCargoType,
  cargoTypes,
  restrictions,
  error
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        Cargo Type
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            type="button"
            className={cn(
              "w-full justify-between border-white/10 bg-muted text-left font-normal",
              !cargoType && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            {cargoType
              ? cargoTypes.find((type) => type.value === cargoType)?.label
              : "Select cargo type"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command className="w-full">
            <CommandInput placeholder="Search cargo type..." />
            <CommandEmpty>No cargo type found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {cargoTypes.map((type) => (
                <CommandItem
                  key={type.value}
                  value={type.value}
                  onSelect={(currentValue) => {
                    setCargoType(currentValue === cargoType ? "" : currentValue);
                  }}
                >
                  <Box className="mr-2 h-4 w-4 text-nexus-teal" />
                  {type.label}
                  <div className="ml-auto flex space-x-1">
                    {type.restrictions.includes("no-air") && (
                      <span className="text-xs bg-red-500/20 text-red-500 px-1 rounded">No Air</span>
                    )}
                    {type.restrictions.includes("prioritize-air") && (
                      <span className="text-xs bg-green-500/20 text-green-500 px-1 rounded">Air Priority</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {restrictions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {restrictions.map((restriction, index) => (
            <span 
              key={index} 
              className="rounded bg-white/10 px-1 py-0.5 text-xs text-muted-foreground"
            >
              {restriction}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CargoTypeSelector;
