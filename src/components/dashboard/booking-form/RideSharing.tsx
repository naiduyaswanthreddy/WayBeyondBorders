
import React, { useState, useEffect } from "react";
import { Share2, TrendingDown, Users, Calendar, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format, addDays, addHours } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { useEcoPoints } from "@/context/EcoPointsContext";

interface SharedRideOption {
  id: string;
  departureDate: Date;
  participants: number;
  costSaving: number;
  co2Saving: number;
  timeAdjustment: number; // in hours
}

interface RideSharingProps {
  className?: string;
  origin: string;
  destination: string;
  cargoType: string;
  transportMode: string;
  weight: string;
  onRideSharingToggle: (enabled: boolean) => void;
  onRideSharingDetailsChange: (details: any) => void;
}

const RideSharing: React.FC<RideSharingProps> = ({
  className,
  origin,
  destination,
  cargoType,
  transportMode,
  weight,
  onRideSharingToggle,
  onRideSharingDetailsChange
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [availableOptions, setAvailableOptions] = useState<SharedRideOption[]>([]);
  const [fillRate, setFillRate] = useState<string>("medium");
  
  const { addPoints } = useEcoPoints();
  
  // Generate sample shared ride options based on origin, destination, and other factors
  useEffect(() => {
    if (!isEnabled || !origin || !destination) {
      setAvailableOptions([]);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      // Generate random options based on route
      const options: SharedRideOption[] = [];
      
      // Option 1: Departing soon with few participants
      options.push({
        id: "option-1",
        departureDate: addDays(new Date(), 1),
        participants: 2,
        costSaving: calculateBaseSaving(25),
        co2Saving: 420,
        timeAdjustment: 2, // 2 hours delay
      });
      
      // Option 2: Departing later with more participants (bigger savings)
      options.push({
        id: "option-2",
        departureDate: addDays(new Date(), 3),
        participants: 4,
        costSaving: calculateBaseSaving(40),
        co2Saving: 750,
        timeAdjustment: 5, // 5 hours delay
      });
      
      // Option 3: Express shared option
      options.push({
        id: "option-3",
        departureDate: addDays(new Date(), 2),
        participants: 3,
        costSaving: calculateBaseSaving(30),
        co2Saving: 580,
        timeAdjustment: -1, // 1 hour faster (express)
      });
      
      setAvailableOptions(options);
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [isEnabled, origin, destination, transportMode, fillRate]);
  
  // Calculate base saving percentage based on transport mode and other factors
  const calculateBaseSaving = (basePercentage: number): number => {
    // Start with the base percentage of the original cost
    let percentage = basePercentage;
    
    // Adjust based on fill rate
    if (fillRate === "low") {
      percentage -= 10;
    } else if (fillRate === "high") {
      percentage += 10;
    }
    
    // Adjust based on transport mode
    if (transportMode === "air") {
      percentage += 5; // Air freight is expensive, so shared savings are higher
    } else if (transportMode === "sea") {
      percentage -= 5; // Sea freight is already cheaper, so smaller savings
    }
    
    // Ensure percentage is reasonable
    percentage = Math.min(Math.max(percentage, 10), 60);
    
    // Convert to actual amount based on a typical shipping cost range
    const baseCost = transportMode === "air" ? 4200 : 
                    transportMode === "sea" ? 2800 : 3500;
    
    return Math.round(baseCost * (percentage / 100));
  };
  
  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    onRideSharingToggle(checked);
    
    if (checked) {
      toast({
        title: "Ride-Sharing Mode Enabled",
        description: "Searching for compatible shipments on your route...",
      });
    } else {
      setSelectedOption("");
      onRideSharingDetailsChange(null);
    }
  };
  
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    
    const option = availableOptions.find(opt => opt.id === optionId);
    if (option) {
      onRideSharingDetailsChange({
        ...option,
        fillRate
      });
      
      toast({
        title: "Shared Ride Option Selected",
        description: `You'll save $${option.costSaving} with this shared transport option.`,
      });
      
      // Add eco points for using ride sharing
      addPoints(Math.round(option.co2Saving / 10));
    }
  };
  
  const handleFillRateChange = (value: string) => {
    setFillRate(value);
  };
  
  const getSelectedOption = () => {
    return availableOptions.find(opt => opt.id === selectedOption);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Share2 className="h-4 w-4 text-nexus-purple" />
          <h3 className="text-sm font-medium text-white">Shipment Ride-Sharing</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Enable ride-sharing to share transport with other compatible shipments. 
                  This reduces costs and environmental impact.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="ride-sharing-toggle" 
            checked={isEnabled}
            onCheckedChange={handleToggle}
          />
          <Label 
            htmlFor="ride-sharing-toggle"
            className={cn(
              "text-sm cursor-pointer",
              isEnabled ? "text-white" : "text-muted-foreground"
            )}
          >
            Enable Ride-Sharing
          </Label>
        </div>
      </div>
      
      {isEnabled && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-3 md:col-span-1">
              <Label htmlFor="fill-rate" className="text-xs">
                Cargo Fill Priority
              </Label>
              <Select
                value={fillRate}
                onValueChange={handleFillRateChange}
              >
                <SelectTrigger id="fill-rate" className="mt-1 bg-white/5">
                  <SelectValue placeholder="Select fill priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Maximum Speed)</SelectItem>
                  <SelectItem value="medium">Medium (Balanced)</SelectItem>
                  <SelectItem value="high">High (Maximum Savings)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 rounded-full border-2 border-t-nexus-purple border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                <span className="mt-2 text-sm text-muted-foreground">Searching for shared shipments...</span>
              </div>
            </div>
          ) : availableOptions.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-muted-foreground">
                Available Shared Transport Options
              </h4>
              
              <div className="grid gap-3">
                {availableOptions.map((option) => (
                  <Card 
                    key={option.id}
                    className={cn(
                      "cursor-pointer border border-white/10 hover:border-nexus-purple/50 transition-all",
                      selectedOption === option.id && "border-nexus-purple bg-nexus-purple/10"
                    )}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Share2 className={cn(
                            "h-4 w-4",
                            selectedOption === option.id ? "text-nexus-purple" : "text-muted-foreground"
                          )} />
                          <h5 className={cn(
                            "text-sm font-medium",
                            selectedOption === option.id ? "text-white" : "text-muted-foreground"
                          )}>
                            Shared Transport
                          </h5>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "px-2 py-0.5 text-xs",
                            selectedOption === option.id 
                              ? "bg-nexus-purple/20 border-nexus-purple/50 text-nexus-purple-light" 
                              : "bg-white/5 border-white/10"
                          )}
                        >
                          {format(option.departureDate, "MMM d")}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Participants</span>
                          <div className="flex items-center mt-1">
                            <Users className="h-3.5 w-3.5 text-blue-400 mr-1" />
                            <span className="text-sm font-medium text-white">{option.participants}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Cost Saving</span>
                          <div className="flex items-center mt-1">
                            <TrendingDown className="h-3.5 w-3.5 text-green-400 mr-1" />
                            <span className="text-sm font-medium text-white">${option.costSaving}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Time Adjustment</span>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3.5 w-3.5 text-amber-400 mr-1" />
                            <span className="text-sm font-medium text-white">
                              {option.timeAdjustment > 0 
                                ? `+${option.timeAdjustment}h` 
                                : option.timeAdjustment < 0 
                                  ? `${option.timeAdjustment}h` 
                                  : "No change"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        CO₂ Reduction: <span className="text-green-400">{option.co2Saving}kg</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {selectedOption && (
                <div className="rounded-md bg-nexus-purple/10 border border-nexus-purple/30 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-white">Selected Shared Transport</h4>
                    <Badge variant="outline" className="bg-nexus-purple/20 border-nexus-purple/50 text-nexus-purple-light px-2 py-0.5 text-xs">
                      {getSelectedOption()?.costSaving} Saved
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your shipment will be combined with {getSelectedOption()?.participants - 1} other compatible 
                    shipments, reducing your cost and environmental impact.
                    {getSelectedOption()?.timeAdjustment !== 0 && getSelectedOption()?.timeAdjustment !== undefined && (
                      <>
                        {" "}
                        {getSelectedOption()?.timeAdjustment > 0 
                          ? `This will add approximately ${getSelectedOption()?.timeAdjustment} hours to your delivery time.`
                          : `This will reduce your delivery time by approximately ${Math.abs(getSelectedOption()?.timeAdjustment)} hours.`}
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-white/10 rounded-md p-6 text-center">
              <Share2 className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <h4 className="text-sm font-medium text-white">No Shared Options Available</h4>
              <p className="text-xs text-muted-foreground mt-2 max-w-md mx-auto">
                We couldn't find any compatible shipments for sharing at this time.
                Try adjusting your cargo details or check back later.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RideSharing;
