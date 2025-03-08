
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, DollarSign, Droplets, Zap, Shield, Umbrella, Wind, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const RouteMap: React.FC<{ className?: string }> = ({ className }) => {
  const [selectedRoute, setSelectedRoute] = useState<"fastest" | "cheapest" | "reliable">("fastest");
  const navigate = useNavigate();

  const routes = [
    {
      id: "fastest",
      name: "Fastest Route",
      icon: Zap,
      color: "text-nexus-blue",
      bgColor: "bg-nexus-blue/20",
      borderColor: "border-nexus-blue/30",
      duration: "3 days, 4 hours",
      cost: "$4,250",
      co2: "2.4 tons",
      modes: ["Air", "Truck"],
      weather: "Clear",
      weatherIcon: <Wind className="h-4 w-4 text-green-400" />,
      weatherStatus: "Optimal",
    },
    {
      id: "cheapest",
      name: "Most Economical",
      icon: DollarSign,
      color: "text-nexus-purple",
      bgColor: "bg-nexus-purple/20",
      borderColor: "border-nexus-purple/30",
      duration: "6 days, 12 hours",
      cost: "$2,780",
      co2: "1.8 tons",
      modes: ["Sea", "Rail", "Truck"],
      weather: "Mild Rain",
      weatherIcon: <Droplets className="h-4 w-4 text-blue-400" />,
      weatherStatus: "Minimal Delay",
    },
    {
      id: "reliable",
      name: "Most Reliable",
      icon: Shield,
      color: "text-nexus-teal",
      bgColor: "bg-nexus-teal/20",
      borderColor: "border-nexus-teal/30",
      duration: "4 days, 8 hours",
      cost: "$3,950",
      co2: "2.1 tons",
      modes: ["Air", "Rail", "Truck"],
      weather: "Stormy",
      weatherIcon: <Umbrella className="h-4 w-4 text-yellow-400" />,
      weatherStatus: "Alternate Route",
    },
  ];

  const handleRouteSelect = (routeId: string) => {
    setSelectedRoute(routeId as any);
    
    // Store selected route in sessionStorage for use on the routes page
    const selectedRouteDetails = routes.find(r => r.id === routeId);
    sessionStorage.setItem('selectedRoute', JSON.stringify(selectedRouteDetails));
    
    // Show toast notification
    toast({
      title: `${selectedRouteDetails?.name} Selected`,
      description: "Review detailed breakdown below",
    });
  };

  const navigateToRoutePlanning = () => {
    toast({
      title: "Navigating to Route Planning",
      description: "Loading detailed route information...",
    });
    
    // Navigate to routes page with selected route info
    setTimeout(() => {
      navigate('/routes', { state: { selectedRoute } });
    }, 500);
  };

  const selectedRouteDetails = routes.find((r) => r.id === selectedRoute);

  return (
    <div className={cn("nexus-card-purple space-y-6 p-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Smart Route Selection</h2>
        <span className="rounded-full bg-nexus-purple/20 px-3 py-1 text-xs font-medium text-nexus-purple">
          AI Optimized
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {routes.map((route) => {
          const RouteIcon = route.icon;
          const isSelected = selectedRoute === route.id;
          
          return (
            <button
              key={route.id}
              onClick={() => handleRouteSelect(route.id)}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-lg border p-4 transition-all duration-300 hover:scale-[1.02]",
                isSelected
                  ? `${route.borderColor} ${route.bgColor} shadow-lg`
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              )}
            >
              {isSelected && (
                <div className="absolute right-2 top-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
              )}
              
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full",
                route.bgColor
              )}>
                <RouteIcon className={cn("h-6 w-6", route.color)} />
              </div>
              
              <h3 className="mt-3 text-base font-medium text-white">{route.name}</h3>
              
              <div className="mt-2 flex w-full items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>{route.duration}</span>
                </div>
                <div className="flex items-center font-medium">
                  <span className={route.color}>{route.cost}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Map Display with Satellite View */}
      <div className="relative overflow-hidden rounded-lg bg-muted/50 p-1">
        <div className="aspect-[16/9] w-full overflow-hidden rounded-lg border border-white/10">
          {/* Satellite Map Background - using an image that looks like satellite view */}
          <div className="h-full w-full p-4">
            <div className="flex h-full flex-col items-center justify-center">
              <div className="relative flex h-full w-full items-center justify-center">
                {/* Satellite Map Background */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80')] bg-cover bg-center opacity-40"></div>
                
                {/* Origin Point */}
                <div className="absolute left-[15%] top-[40%] h-4 w-4 rounded-full bg-nexus-blue shadow-[0_0_10px_rgba(0,98,255,0.7)]"></div>
                
                {/* Destination Point */}
                <div className="absolute right-[15%] top-[60%] h-4 w-4 rounded-full bg-nexus-purple shadow-[0_0_10px_rgba(110,54,229,0.7)]"></div>
                
                {/* Route Line */}
                <svg className="absolute inset-0 h-full w-full" style={{ filter: 'drop-shadow(0 0 4px rgba(110, 54, 229, 0.4))' }}>
                  <path
                    d={selectedRoute === "fastest" 
                      ? "M 15% 40% C 40% 30%, 60% 70%, 85% 60%" 
                      : selectedRoute === "cheapest"
                      ? "M 15% 40% C 30% 60%, 70% 80%, 85% 60%"
                      : "M 15% 40% C 40% 50%, 60% 50%, 85% 60%"}
                    stroke={selectedRoute === "fastest" 
                      ? "#0062FF" 
                      : selectedRoute === "cheapest"
                      ? "#6E36E5"
                      : "#00CFD5"}
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="6,3"
                    className="animate-pulse"
                  />
                </svg>
                
                {/* Transport Mode Indicators */}
                {selectedRouteDetails?.modes.map((mode, index) => {
                  const position = {
                    left: `${25 + (index * 25)}%`,
                    top: selectedRoute === "cheapest" ? "70%" : selectedRoute === "fastest" ? "40%" : "50%"
                  };
                  
                  return (
                    <div
                      key={index}
                      className={`absolute flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                        selectedRoute === "fastest" 
                          ? "bg-nexus-blue text-white" 
                          : selectedRoute === "cheapest"
                          ? "bg-nexus-purple text-white"
                          : "bg-nexus-teal text-white"
                      }`}
                      style={position}
                    >
                      {mode.charAt(0)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Route Details Overlay */}
        <div className="absolute bottom-4 right-4 max-w-xs rounded-lg bg-background/90 p-4 shadow-lg backdrop-blur-md border border-white/10">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white">Route Details</h4>
            <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs">
              {selectedRouteDetails?.weatherIcon}
              <span>{selectedRouteDetails?.weatherStatus}</span>
            </div>
          </div>
          
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Origin:</span>
              <span className="font-medium text-white">Shanghai, China</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Destination:</span>
              <span className="font-medium text-white">Rotterdam, Netherlands</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Distance:</span>
              <span className="font-medium text-white">11,425 km</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">CO₂ Emissions:</span>
              <span className="font-medium text-white">{selectedRouteDetails?.co2}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed breakdown of selected route */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">
          {selectedRouteDetails?.name} - Detailed Breakdown
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Transit Time</h4>
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-nexus-blue" />
              <span className="text-lg font-medium text-white">{selectedRouteDetails?.duration}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {selectedRoute === "fastest" 
                ? "Priority processing at all checkpoints" 
                : selectedRoute === "cheapest"
                ? "Standard processing with some wait times"
                : "Reliable checkpoints with dedicated handlers"}
            </p>
          </div>
          
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Cost</h4>
            <div className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-nexus-purple" />
              <span className="text-lg font-medium text-white">{selectedRouteDetails?.cost}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {selectedRoute === "fastest" 
                ? "Premium rate for expedited service" 
                : selectedRoute === "cheapest"
                ? "Cost-optimized with bulk shipping discounts"
                : "Balanced cost with contingency included"}
            </p>
          </div>
          
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Transport Modes</h4>
            <div className="flex items-center gap-2">
              {selectedRouteDetails?.modes.map((mode, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white"
                >
                  {mode}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {selectedRouteDetails?.modes.length} transfer points with optimized handling
            </p>
          </div>
        </div>
        
        <Button 
          className="nexus-button-primary w-full"
          onClick={navigateToRoutePlanning}
        >
          Choose This Route
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RouteMap;
