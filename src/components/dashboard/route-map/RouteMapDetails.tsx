
import React from "react";
import { CheckCircle2, Clock, DollarSign, Droplets, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface RouteDetailsProps {
  selectedRouteDetails: {
    id: string;
    name: string;
    icon: any;
    color: string;
    bgColor: string;
    borderColor: string;
    duration: string;
    cost: string;
    co2: string;
    modes: string[];
    weather: string;
    weatherIcon: React.ReactNode;
    weatherStatus: string;
    ecoPoints?: number;
    isEcoFriendly?: boolean;
  } | undefined;
}

export const RouteMapDetails: React.FC<RouteDetailsProps> = ({ selectedRouteDetails }) => {
  const navigate = useNavigate();

  const navigateToRoutePlanning = () => {
    toast({
      title: "Navigating to Route Planning",
      description: "Loading detailed route information...",
    });
    
    // Navigate to routes page with selected route info
    setTimeout(() => {
      navigate('/routes', { state: { selectedRoute: selectedRouteDetails?.id } });
    }, 500);
  };

  if (!selectedRouteDetails) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">
        {selectedRouteDetails.name} - Detailed Breakdown
        {selectedRouteDetails.isEcoFriendly && (
          <span className="ml-2 inline-flex items-center rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-400">
            Eco-Friendly
          </span>
        )}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Transit Time</h4>
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-nexus-blue" />
            <span className="text-lg font-medium text-white">{selectedRouteDetails.duration}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {selectedRouteDetails.id === "fastest" 
              ? "Priority processing at all checkpoints" 
              : selectedRouteDetails.id === "cheapest"
              ? "Standard processing with some wait times"
              : selectedRouteDetails.id === "eco-friendly"
              ? "Optimized for minimal environmental impact"
              : "Reliable checkpoints with dedicated handlers"}
          </p>
        </div>
        
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Cost</h4>
          <div className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-nexus-purple" />
            <span className="text-lg font-medium text-white">{selectedRouteDetails.cost}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {selectedRouteDetails.id === "fastest" 
              ? "Premium rate for expedited service" 
              : selectedRouteDetails.id === "cheapest"
              ? "Cost-optimized with bulk shipping discounts"
              : selectedRouteDetails.id === "eco-friendly"
              ? "Balanced cost with environmental optimization"
              : "Balanced cost with contingency included"}
          </p>
        </div>
        
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Transport Modes</h4>
          <div className="flex items-center gap-2">
            {selectedRouteDetails.modes.map((mode, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white"
              >
                {mode}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {selectedRouteDetails.modes.length} transfer points with optimized handling
          </p>
        </div>
      </div>

      {selectedRouteDetails.isEcoFriendly && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
          <div className="flex items-start">
            <div className="mr-3 mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                className="h-5 w-5 text-green-400"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13.13c0-1.6 0-2.4.44-3.06a3 3 0 0 1 1.13-1.13c.67-.44 1.47-.44 3.06-.44.7 0 1.22 0 1.66.04.15.01.29.03.43.06" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 13a4 4 0 1 0 8 0a4 4 0 0 0-8 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13h-6" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.43 5.57l.23-.23a.58.58 0 0 1 1 .41v2.83c0 .32-.26.58-.58.58h-2.83a.58.58 0 0 1-.4-1l.22-.22" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 7c-1.5-1.5-3.5-2-5.74-2H9.74a5.5 5.5 0 0 0-5.5 5.5v6c0 .87.06 1.7.22 2.5h9.04" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">Eco-Friendly Benefits</h4>
              <p className="mt-1 text-xs text-muted-foreground">CO₂ Reduction: {selectedRouteDetails.co2}</p>
              <p className="text-xs text-muted-foreground">
                This route earns you <span className="font-medium text-green-400">{selectedRouteDetails.ecoPoints} Eco Points</span> to redeem for discounts
              </p>
            </div>
          </div>
        </div>
      )}
      
      <Button 
        className="nexus-button-primary w-full"
        onClick={navigateToRoutePlanning}
      >
        Choose This Route
      </Button>
    </div>
  );
};
