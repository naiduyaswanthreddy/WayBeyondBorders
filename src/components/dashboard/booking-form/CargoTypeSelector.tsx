
import React from "react";
import { Package, AlertTriangle } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  // Filter to show only the most commonly used cargo types
  const commonCargoTypes = cargoTypes.filter(type => 
    ["general", "electronics", "apparel", "perishable", "hazardous", "oversized"].includes(type.value)
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        Cargo Type
      </label>
      <Select value={cargoType} onValueChange={setCargoType}>
        <SelectTrigger className={`w-full border-white/10 bg-muted ${error ? "border-destructive" : ""}`}>
          <SelectValue placeholder="Select cargo type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Common Cargo Types</SelectLabel>
            {commonCargoTypes.map((type) => (
              <SelectItem 
                key={type.value} 
                value={type.value}
                className={`${type.value === "hazardous" ? "text-amber-400" : ""}`}
              >
                {type.label}
                {type.value === "hazardous" && " ⚠️"}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Other Cargo Types</SelectLabel>
            {cargoTypes
              .filter(type => !commonCargoTypes.some(commonType => commonType.value === type.value))
              .map((type) => (
                <SelectItem 
                  key={type.value} 
                  value={type.value}
                  className={`${type.value === "hazardous" ? "text-amber-400" : ""}`}
                >
                  {type.label}
                  {type.value === "hazardous" && " ⚠️"}
                </SelectItem>
              ))
            }
          </SelectGroup>
        </SelectContent>
      </Select>
      
      {restrictions.length > 0 && (
        <div className="flex items-center mt-1">
          <AlertTriangle className="h-3 w-3 text-amber-400 mr-1" />
          <p className="text-xs text-amber-400">
            {restrictions.includes("no-air") && "Not suitable for air transport. "}
            {restrictions.includes("refrigerated") && "Requires refrigerated transport. "}
            {restrictions.includes("prioritize-air") && "Prioritize air transport for freshness. "}
            {restrictions.includes("special-handling") && "Requires special handling. "}
          </p>
        </div>
      )}
      
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
};

export default CargoTypeSelector;
