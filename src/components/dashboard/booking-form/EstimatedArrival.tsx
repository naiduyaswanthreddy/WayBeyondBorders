
import React, { useState, useEffect } from "react";
import { Clock, Calendar, MapPin, AlertTriangle, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { DynamicRouteAlert } from "@/components/alerts/DynamicRouteAlert";

interface EstimatedArrivalProps {
  estimatedTime: string;
  origin: string;
  destination: string;
  transportMode?: string;
}

const EstimatedArrival = ({ estimatedTime, origin, destination, transportMode }: EstimatedArrivalProps) => {
  const [hasWeatherAlert, setHasWeatherAlert] = useState(false);
  const [hasPortCongestion, setHasPortCongestion] = useState(false);
  const [showRouteChangeAlert, setShowRouteChangeAlert] = useState(false);
  const [routeChangeData, setRouteChangeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [displayedEstimatedTime, setDisplayedEstimatedTime] = useState("");
  
  // Handle loading effect when origin/destination changes
  useEffect(() => {
    if (origin && destination && estimatedTime) {
      setIsLoading(true);
      setDisplayedEstimatedTime("");
      
      const timer = setTimeout(() => {
        setIsLoading(false);
        setDisplayedEstimatedTime(estimatedTime);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [origin, destination, estimatedTime]);
  
  // Simulate weather and port conditions when origin/destination changes
  useEffect(() => {
    if (!origin || !destination) return;
    
    // Reset alerts
    setHasWeatherAlert(false);
    setHasPortCongestion(false);
    
    // Simulate weather alerts for certain routes
    if (
      (origin.includes("Rotterdam") && destination.includes("New York")) ||
      (origin.includes("Shanghai") && destination.includes("Los Angeles")) ||
      (origin.includes("Mumbai") && destination.includes("Dubai"))
    ) {
      const randomDelay = Math.random();
      if (randomDelay > 0.7) {
        setHasWeatherAlert(true);
      }
    }
    
    // Simulate port congestion for certain routes
    if (
      (origin.includes("Shanghai") || destination.includes("Shanghai")) ||
      (origin.includes("Los Angeles") || destination.includes("Los Angeles")) ||
      (origin.includes("Rotterdam") || destination.includes("Rotterdam"))
    ) {
      const randomCongestion = Math.random();
      if (randomCongestion > 0.6) {
        setHasPortCongestion(true);
      }
    }
    
  }, [origin, destination]);
  
  // Function to handle dynamic rerouting
  const handleDynamicRerouting = () => {
    // Prepare route change data
    const routeData = {
      origin,
      destination,
      originalRoute: transportMode === "air" ? "Air → Truck" : 
                     transportMode === "sea" ? "Sea → Truck" : 
                     transportMode === "road" ? "Road" : "Sea → Truck",
      newRoute: hasWeatherAlert ? "Air → Truck" : "Rail → Truck",
      reason: hasWeatherAlert 
        ? "Severe storm warning in shipping lane" 
        : "Port congestion causing significant delays",
      costChange: hasWeatherAlert ? "+$320" : "+$150",
      delay: hasWeatherAlert ? "-2 days" : "-3 days"
    };
    
    setRouteChangeData(routeData);
    setShowRouteChangeAlert(true);
  };
  
  // Handle accepting reroute
  const handleAcceptReroute = () => {
    setShowRouteChangeAlert(false);
    setHasWeatherAlert(false);
    setHasPortCongestion(false);
    
    toast({
      title: "Route Changed Successfully",
      description: "Your shipment has been rerouted to avoid delays.",
    });
  };
  
  // Handle declining reroute
  const handleDeclineReroute = () => {
    setShowRouteChangeAlert(false);
    
    toast({
      title: "Original Route Maintained",
      description: "Your shipment will continue on the original route despite potential delays.",
      variant: "destructive",
    });
  };

  if (!origin || !destination) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Estimated Arrival
        </label>
        <div className="premium-glass px-3 py-2.5 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span>Enter origin and destination to see arrival estimate</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        Estimated Arrival
      </label>
      <div className={`premium-glass ${hasWeatherAlert || hasPortCongestion ? 'bg-amber-500/5 border border-amber-500/20' : 'bg-nexus-blue/5'} px-3 py-2.5 text-sm`}>
        <div className="flex flex-col">
          <div className="flex items-center text-nexus-blue-light font-medium">
            <Clock className="mr-2 h-4 w-4" />
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Calculating arrival time...</span>
              </div>
            ) : (
              <span>{displayedEstimatedTime}</span>
            )}
            
            {!isLoading && (hasWeatherAlert || hasPortCongestion) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {hasWeatherAlert 
                        ? "Weather alert: Potential delays due to storms" 
                        : "Port congestion alert: Delays expected"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="mt-1 flex items-center text-xs text-muted-foreground">
            <MapPin className="mr-2 h-3 w-3" />
            <span>
              From {origin} to {destination}
            </span>
          </div>
          
          {!isLoading && (hasWeatherAlert || hasPortCongestion) && (
            <div className="mt-2 pt-2 border-t border-amber-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-amber-500">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  <span>
                    {hasWeatherAlert 
                      ? "Weather disruption detected" 
                      : "Port congestion detected"}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 px-2 text-xs gap-1 border-amber-500/20 text-amber-500 hover:bg-amber-500/10"
                  onClick={handleDynamicRerouting}
                >
                  <RefreshCw className="h-3 w-3" />
                  Reroute
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showRouteChangeAlert && routeChangeData && (
        <DynamicRouteAlert 
          route={routeChangeData}
          onClose={handleDeclineReroute}
          onAccept={handleAcceptReroute}
        />
      )}
    </div>
  );
};

export default EstimatedArrival;
