
import React from "react";
import { Package } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CargoTypeData } from "./types";

interface CargoTypeSelectorProps {
  cargoType: string;
  setCargoType: (value: string) => void;
  cargoTypes: CargoTypeData[];
  restrictions: string[];
}

const CargoTypeSelector: React.FC<CargoTypeSelectorProps> = ({
  cargoType,
  setCargoType,
  cargoTypes,
  restrictions
}) => {
  return (
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
  );
};

export default CargoTypeSelector;
