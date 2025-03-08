
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { 
  Zap, 
  DollarSign, 
  Shield, 
  Droplets, 
  Wind, 
  Umbrella, 
  Leaf
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { RouteMapOptions } from "./route-map/RouteMapOptions";
import { RouteMapDisplay } from "./route-map/RouteMapDisplay";
import { RouteMapDetails } from "./route-map/RouteMapDetails";

const RouteMap: React.FC<{ className?: string }> = ({ className }) => {
  const [selectedRoute, setSelectedRoute] = useState<"fastest" | "cheapest" | "reliable" | "eco-friendly">("fastest");
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
    {
      id: "eco-friendly",
      name: "Eco-Friendly",
      icon: Leaf,
      color: "text-green-500",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30",
      duration: "5 days, 6 hours",
      cost: "$3,450",
      co2: "0.9 tons",
      modes: ["Rail", "Electric Truck"],
      weather: "Clear",
      weatherIcon: <Wind className="h-4 w-4 text-green-400" />,
      weatherStatus: "Optimal",
      ecoPoints: 125,
      isEcoFriendly: true
    }
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

    // Add eco points notification if eco-friendly route is selected
    if (selectedRouteDetails?.isEcoFriendly) {
      toast({
        title: "Eco Points Earned!",
        description: `You've earned ${selectedRouteDetails.ecoPoints} Eco Points for selecting an eco-friendly route.`,
      });
    }
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

      <RouteMapOptions 
        routes={routes}
        selectedRoute={selectedRoute}
        onRouteSelect={handleRouteSelect}
      />

      <RouteMapDisplay 
        selectedRoute={selectedRoute}
        selectedRouteDetails={selectedRouteDetails}
      />
      
      <RouteMapDetails selectedRouteDetails={selectedRouteDetails} />
    </div>
  );
};

export default RouteMap;
