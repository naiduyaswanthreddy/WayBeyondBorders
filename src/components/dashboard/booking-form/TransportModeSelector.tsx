
import React from "react";
import { AlertTriangle } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransportModeData, CargoTypeData } from "./types";

interface TransportModeSelectorProps {
  transportMode: string;
  handleTransportModeChange: (value: string) => void;
  transportModes: TransportModeData[];
  cargoType: string;
  cargoTypes: CargoTypeData[];
  availableRoutes: string[];
  restrictionWarning: string;
}

const TransportModeSelector: React.FC<TransportModeSelectorProps> = ({
  transportMode,
  handleTransportModeChange,
  transportModes,
  cargoType,
  cargoTypes,
  availableRoutes,
  restrictionWarning,
}) => {
  // Determine if multimode should be enabled for this cargo type
  const selectedCargo = cargoTypes.find(c => c.value === cargoType);
  const canUseMultimode = !selectedCargo?.restrictions.includes("no-multimode");
  
  return (
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
            const isMultiMode = mode.value === 'multimode';
            const selectedCargo = cargoTypes.find(c => c.value === cargoType);
            
            // Determine if mode should be disabled
            const isDisabled = 
              // Check if air mode is restricted for this cargo
              (selectedCargo?.restrictions.includes("no-air") && isAirMode) || 
              // Check if mode is available for the route (except for 'any' which is always available)
              (mode.value !== 'any' && mode.value !== 'multimode' && !availableRoutes.includes(mode.value) && availableRoutes.length > 0) ||
              // Check if multimode should be disabled
              (isMultiMode && !canUseMultimode);
            
            return (
              <SelectItem 
                key={mode.value} 
                value={mode.value}
                disabled={isDisabled}
                className={isDisabled ? "opacity-50" : ""}
              >
                {mode.label}
                {isDisabled && " (Not available for this route/cargo)"}
                {isMultiMode && canUseMultimode && " (Recommended for efficiency)"}
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
      
      {availableRoutes.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          <span className="text-xs text-muted-foreground">Available transport: </span>
          {availableRoutes.map((route) => (
            <span 
              key={route} 
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-nexus-blue/20 text-nexus-blue"
            >
              {route.charAt(0).toUpperCase() + route.slice(1)}
            </span>
          ))}
          {canUseMultimode && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">
              Multimode
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TransportModeSelector;
