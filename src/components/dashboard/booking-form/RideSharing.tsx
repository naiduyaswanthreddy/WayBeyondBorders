
import React, { useState, useEffect } from "react";
import { Share2, TrendingDown, Clock, Check, X, Truck, Ship, Plane, Scale, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface SharedShipmentOption {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  availableSpace: string;
  costSaving: string;
  savingPercentage: number;
  transportMode: 'sea' | 'air' | 'road';
  compatibility: number; // 0-100 scale
  carrier: string;
  co2Reduction: string;
}

interface RideSharingProps {
  origin: string;
  destination: string;
  cargoType: string;
  weight: string;
  transportMode: string;
  enableRideSharing: boolean;
  onEnableRideSharingChange: (enabled: boolean) => void;
  selectedSharedOption: string | null;
  onSelectSharedOption: (optionId: string | null) => void;
}

const RideSharing: React.FC<RideSharingProps> = ({
  origin,
  destination,
  cargoType,
  weight,
  transportMode,
  enableRideSharing,
  onEnableRideSharingChange,
  selectedSharedOption,
  onSelectSharedOption
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sharedOptions, setSharedOptions] = useState<SharedShipmentOption[]>([]);
  
  // Generate sample shared shipment options based on origin, destination, and other factors
  useEffect(() => {
    if (!origin || !destination) {
      setSharedOptions([]);
      return;
    }
    
    if (enableRideSharing) {
      setIsLoading(true);
      
      // Simulate API call to get shared shipment options
      setTimeout(() => {
        // Generate some sample options based on the current route
        const options: SharedShipmentOption[] = [
          {
            id: "shared-1",
            origin,
            destination,
            departureDate: "2023-10-15",
            arrivalDate: "2023-10-21",
            availableSpace: "60%",
            costSaving: "$950",
            savingPercentage: 25,
            transportMode: 'sea',
            compatibility: 95,
            carrier: "CodeBlue Shipping Co.",
            co2Reduction: "0.8 tons"
          },
          {
            id: "shared-2",
            origin,
            destination,
            departureDate: "2023-10-16",
            arrivalDate: "2023-10-19",
            availableSpace: "35%",
            costSaving: "$1,250",
            savingPercentage: 32,
            transportMode: 'air',
            compatibility: 85,
            carrier: "FastAir Logistics",
            co2Reduction: "0.6 tons"
          },
          {
            id: "shared-3",
            origin,
            destination,
            departureDate: "2023-10-14",
            arrivalDate: "2023-10-22",
            availableSpace: "75%",
            costSaving: "$820",
            savingPercentage: 22,
            transportMode: 'road',
            compatibility: 90,
            carrier: "EcoTruck Inc.",
            co2Reduction: "1.2 tons"
          }
        ];
        
        setSharedOptions(options);
        setIsLoading(false);
        
        // Auto-select a shared option if compatible with user selection
        const compatibleWithMode = options.filter(option => {
          if (transportMode === 'any') return true;
          return (
            (transportMode === 'sea' && option.transportMode === 'sea') ||
            (transportMode === 'air' && option.transportMode === 'air') ||
            (transportMode === 'road' && option.transportMode === 'road')
          );
        });
        
        if (compatibleWithMode.length > 0 && !selectedSharedOption) {
          // Sort by highest savings and select the first one
          const bestOption = [...compatibleWithMode].sort((a, b) => 
            parseFloat(b.costSaving.replace('$', '').replace(',', '')) - 
            parseFloat(a.costSaving.replace('$', '').replace(',', ''))
          )[0];
          
          onSelectSharedOption(bestOption.id);
        }
      }, 1500);
    }
  }, [origin, destination, enableRideSharing, transportMode]);
  
  // Handle toggling ride sharing
  const handleToggleRideSharing = (checked: boolean) => {
    onEnableRideSharingChange(checked);
    
    if (checked) {
      toast({
        title: "Ride-Sharing Enabled",
        description: "Finding compatible shipments to share transport with..."
      });
    } else {
      onSelectSharedOption(null);
    }
  };
  
  // Handle selecting a shared option
  const handleSelectOption = (optionId: string) => {
    onSelectSharedOption(optionId);
    
    const option = sharedOptions.find(opt => opt.id === optionId);
    
    if (option) {
      toast({
        title: "Shared Shipment Selected",
        description: `You'll save ${option.costSaving} (${option.savingPercentage}%) with this option.`
      });
    }
  };
  
  // Get transport mode icon
  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'sea':
        return <Ship className="h-4 w-4" />;
      case 'air':
        return <Plane className="h-4 w-4" />;
      case 'road':
        return <Truck className="h-4 w-4" />;
      default:
        return <Truck className="h-4 w-4" />;
    }
  };
  
  // Calculate total potential savings
  const calculateTotalSavings = () => {
    if (!selectedSharedOption) return "$0";
    
    const option = sharedOptions.find(opt => opt.id === selectedSharedOption);
    return option ? option.costSaving : "$0";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex items-center">
          <Share2 className="mr-3 h-5 w-5 text-nexus-blue" />
          <div>
            <h3 className="text-base font-medium text-white">Enable Ride-Sharing</h3>
            <p className="text-xs text-muted-foreground">
              Share transport with compatible shipments to reduce costs
            </p>
          </div>
        </div>
        <Switch 
          checked={enableRideSharing}
          onCheckedChange={handleToggleRideSharing}
        />
      </div>
      
      {enableRideSharing && (
        <>
          {isLoading ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-6 flex flex-col items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-nexus-blue mb-4"></div>
              <p className="text-muted-foreground">Finding compatible shipments...</p>
            </div>
          ) : sharedOptions.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-muted-foreground">No compatible shipments found</p>
              <p className="text-xs text-muted-foreground mt-2">
                Try adjusting your route or check back later
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-white/5">
                      <TableHead className="w-[100px]">Carrier</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead className="text-right">Schedule</TableHead>
                      <TableHead className="text-right">Savings</TableHead>
                      <TableHead className="text-right w-[80px]">Compatibility</TableHead>
                      <TableHead className="text-right w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sharedOptions.map((option) => (
                      <TableRow 
                        key={option.id}
                        className={cn(
                          "cursor-pointer hover:bg-white/5",
                          selectedSharedOption === option.id && "bg-nexus-blue/10"
                        )}
                        onClick={() => handleSelectOption(option.id)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {getTransportIcon(option.transportMode)}
                            <span className="ml-2">{option.carrier}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div>{option.origin}</div>
                            <div className="text-muted-foreground">to {option.destination}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="text-xs">
                            <div>Departs: {option.departureDate}</div>
                            <div className="text-muted-foreground">Arrives: {option.arrivalDate}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="text-green-400 font-medium">
                            {option.costSaving}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ({option.savingPercentage}%)
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className={cn(
                                    "absolute inset-y-0 left-0 rounded-full",
                                    option.compatibility > 90 ? "bg-green-500" : 
                                    option.compatibility > 75 ? "bg-amber-500" :
                                    "bg-orange-500"
                                  )}
                                  style={{ width: `${option.compatibility}%` }}
                                />
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-60">
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold">Compatibility Score: {option.compatibility}%</h4>
                                <div className="text-xs space-y-1">
                                  <div className="flex justify-between">
                                    <span>Route Match:</span>
                                    <span>100%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Schedule Flexibility:</span>
                                    <span>90%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Cargo Compatibility:</span>
                                    <span>95%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Space Available:</span>
                                    <span>{option.availableSpace}</span>
                                  </div>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </TableCell>
                        <TableCell className="text-right">
                          {selectedSharedOption === option.id ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 bg-nexus-blue/10 text-nexus-blue hover:bg-nexus-blue/20"
                            >
                              <Check className="h-3 w-3" />
                              Selected
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={() => handleSelectOption(option.id)}
                            >
                              Select
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {selectedSharedOption && (
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-lg border border-white/10 bg-nexus-blue/5 p-4">
                    <div className="flex items-center mb-2">
                      <DollarSign className="mr-2 h-5 w-5 text-nexus-blue" />
                      <h4 className="text-base font-medium text-white">Cost Savings</h4>
                    </div>
                    <div className="text-2xl font-bold text-nexus-blue">
                      {calculateTotalSavings()}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      By sharing transport with other shipments
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-white/10 bg-nexus-blue/5 p-4">
                    <div className="flex items-center mb-2">
                      <Clock className="mr-2 h-5 w-5 text-nexus-blue" />
                      <h4 className="text-base font-medium text-white">Delivery Impact</h4>
                    </div>
                    <div className="text-sm text-white">
                      <span className="text-amber-400">+1-2 days</span> estimated
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Minor delay due to combined logistics
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-white/10 bg-nexus-blue/5 p-4">
                    <div className="flex items-center mb-2">
                      <Scale className="mr-2 h-5 w-5 text-nexus-blue" />
                      <h4 className="text-base font-medium text-white">Environmental Impact</h4>
                    </div>
                    <div className="text-sm text-white">
                      <span className="text-green-400">-0.8 tons CO₂</span> emissions
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Reduced carbon footprint through shared transport
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default RideSharing;
