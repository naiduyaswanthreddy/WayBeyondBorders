
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Box, ChevronsUpDown, Search } from "lucide-react";
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
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter cargo types based on search query
  const filteredCargoTypes = cargoTypes.filter((type) => 
    type.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        Cargo Type
      </label>
      <Popover open={open} onOpenChange={setOpen}>
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
        <PopoverContent className="w-[300px] p-0 bg-popover z-50" align="start">
          <div className="flex flex-col">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Search cargo type..."
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto">
              {filteredCargoTypes.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No cargo types found with that search.
                </div>
              ) : (
                filteredCargoTypes.map((type) => (
                  <div
                    key={type.value}
                    className={cn(
                      "flex items-start py-2 px-2 cursor-pointer hover:bg-accent hover:text-accent-foreground",
                      cargoType === type.value ? "bg-accent/50" : ""
                    )}
                    onClick={() => {
                      setCargoType(type.value);
                      setOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          cargoType === type.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{type.label}</span>
                        <div className="ml-auto flex space-x-1 mt-1">
                          {type.restrictions.includes("no-air") && (
                            <span className="text-xs bg-red-500/20 text-red-500 px-1 rounded">No Air</span>
                          )}
                          {type.restrictions.includes("prioritize-air") && (
                            <span className="text-xs bg-green-500/20 text-green-500 px-1 rounded">Air Priority</span>
                          )}
                          {type.restrictions.includes("temperature-control") && (
                            <span className="text-xs bg-blue-500/20 text-blue-500 px-1 rounded">Temp Control</span>
                          )}
                          {type.restrictions.includes("special-handling") && (
                            <span className="text-xs bg-yellow-500/20 text-yellow-500 px-1 rounded">Special Handling</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
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
