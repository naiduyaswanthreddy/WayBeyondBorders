
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, 
  ChevronDown, 
  Package, 
  Truck, 
  Plane, 
  Ship, 
  Train,
  Droplets,
  Zap,
  ThermometerSnowflake,
  Glasses,
  Verified
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CargoClassificationProps {
  className?: string;
}

type TransportMode = "air" | "sea" | "rail" | "road";
type CargoType = "general" | "hazmat" | "perishable" | "fragile" | "liquid" | "refrigerated";

interface CargoOption {
  value: CargoType;
  label: string;
  icon: React.ElementType;
  description: string;
  disabledModes: TransportMode[];
}

const cargoOptions: CargoOption[] = [
  {
    value: "general",
    label: "General Cargo",
    icon: Package,
    description: "Standard cargo with no special handling requirements.",
    disabledModes: [],
  },
  {
    value: "hazmat",
    label: "Hazardous Materials",
    icon: AlertTriangle,
    description: "Dangerous goods requiring special handling and documentation.",
    disabledModes: ["air"],
  },
  {
    value: "liquid",
    label: "Bulk Liquids",
    icon: Droplets,
    description: "Non-hazardous liquids requiring specialized containers.",
    disabledModes: ["air"],
  },
  {
    value: "fragile",
    label: "Fragile Items",
    icon: Glasses,
    description: "Delicate items requiring careful handling.",
    disabledModes: [],
  },
  {
    value: "perishable",
    label: "Perishable Goods",
    icon: Zap,
    description: "Time-sensitive goods with limited shelf life.",
    disabledModes: ["sea"],
  },
  {
    value: "refrigerated",
    label: "Refrigerated Cargo",
    icon: ThermometerSnowflake,
    description: "Temperature-controlled goods requiring specialized equipment.",
    disabledModes: [],
  },
];

const transportModes = [
  { value: "air", label: "Air Freight", icon: Plane },
  { value: "sea", label: "Sea Freight", icon: Ship },
  { value: "rail", label: "Rail Freight", icon: Train },
  { value: "road", label: "Road Freight", icon: Truck },
];

const CargoClassification: React.FC<CargoClassificationProps> = ({ className }) => {
  const [selectedCargo, setSelectedCargo] = useState<CargoType>("general");
  const [selectedTransport, setSelectedTransport] = useState<TransportMode[]>(["air", "sea", "rail", "road"]);

  const currentCargo = cargoOptions.find(cargo => cargo.value === selectedCargo);
  
  const handleCargoChange = (cargo: CargoType) => {
    setSelectedCargo(cargo);
    
    // Find the cargo option
    const cargoOption = cargoOptions.find(option => option.value === cargo);
    
    if (cargoOption) {
      // Remove disabled transport modes
      setSelectedTransport(prev => 
        prev.filter(mode => !cargoOption.disabledModes.includes(mode as TransportMode))
      );
    }
  };
  
  const toggleTransportMode = (mode: TransportMode) => {
    if (currentCargo?.disabledModes.includes(mode)) {
      return; // Don't toggle if disabled
    }
    
    setSelectedTransport(prev => 
      prev.includes(mode) 
        ? prev.filter(m => m !== mode) 
        : [...prev, mode]
    );
  };

  const isTransportDisabled = (mode: TransportMode) => {
    return currentCargo?.disabledModes.includes(mode);
  };

  return (
    <div className={cn("nexus-card-blue p-6", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Cargo Classification</h2>
        <span className="flex items-center gap-1 rounded-full bg-nexus-blue/20 px-3 py-1 text-xs font-medium text-nexus-blue">
          <Verified className="h-3 w-3" />
          <span>Rules Engine</span>
        </span>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Cargo Type
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between border-white/10 bg-muted text-white"
              >
                <div className="flex items-center">
                  {currentCargo && (
                    <>
                      <div className="mr-2 rounded-full bg-nexus-blue/20 p-1">
                        <currentCargo.icon className="h-4 w-4 text-nexus-blue" />
                      </div>
                      <span>{currentCargo.label}</span>
                    </>
                  )}
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              <DropdownMenuLabel>Select Cargo Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {cargoOptions.map((cargo) => {
                const CargoIcon = cargo.icon;
                return (
                  <DropdownMenuItem
                    key={cargo.value}
                    onClick={() => handleCargoChange(cargo.value)}
                    className="flex cursor-pointer items-center py-2"
                  >
                    <div className="mr-2 rounded-full bg-nexus-blue/20 p-1">
                      <CargoIcon className="h-4 w-4 text-nexus-blue" />
                    </div>
                    <div className="flex flex-col">
                      <span>{cargo.label}</span>
                      <span className="text-xs text-muted-foreground">{cargo.description}</span>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">
              Available Transport Modes
            </label>
            <span className="text-xs text-muted-foreground">
              {selectedTransport.length} selected
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <TooltipProvider>
              {transportModes.map((mode) => {
                const TransportIcon = mode.icon;
                const isDisabled = isTransportDisabled(mode.value as TransportMode);
                const isSelected = selectedTransport.includes(mode.value as TransportMode);
                
                return (
                  <Tooltip key={mode.value}>
                    <TooltipTrigger asChild>
                      <button
                        className={cn(
                          "flex h-20 w-24 flex-col items-center justify-center rounded-md border transition-all",
                          isDisabled
                            ? "cursor-not-allowed border-white/5 bg-muted/30 opacity-50"
                            : isSelected
                            ? "border-nexus-blue/50 bg-nexus-blue/20"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        )}
                        onClick={() => toggleTransportMode(mode.value as TransportMode)}
                        disabled={isDisabled}
                      >
                        <TransportIcon className={cn(
                          "mb-2 h-6 w-6",
                          isSelected ? "text-nexus-blue" : "text-muted-foreground"
                        )} />
                        <span className={cn(
                          "text-xs",
                          isSelected ? "font-medium text-white" : "text-muted-foreground"
                        )}>
                          {mode.label}
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {isDisabled ? (
                        <div className="flex items-center text-destructive">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          <span>Not available for {currentCargo?.label}</span>
                        </div>
                      ) : (
                        <span>{isSelected ? "Active transport mode" : "Click to select"}</span>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>
        </div>

        {currentCargo?.disabledModes.length > 0 && (
          <div className="rounded-lg bg-yellow-500/10 p-4 text-sm text-yellow-300 border border-yellow-500/20">
            <div className="flex items-start">
              <AlertTriangle className="mr-2 h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Transport Mode Restrictions</p>
                <p className="mt-1 text-xs text-yellow-300/80">
                  {currentCargo.label} cannot be transported via {currentCargo.disabledModes.map(mode => 
                    transportModes.find(m => m.value === mode)?.label
                  ).join(", ")}.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CargoClassification;
