
import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Leaf } from "lucide-react";

interface RouteOption {
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
}

interface RouteMapOptionsProps {
  routes: RouteOption[];
  selectedRoute: string;
  onRouteSelect: (routeId: string) => void;
}

export const RouteMapOptions: React.FC<RouteMapOptionsProps> = ({ 
  routes,
  selectedRoute,
  onRouteSelect
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      {routes.map((route) => {
        const RouteIcon = route.icon;
        const isSelected = selectedRoute === route.id;
        
        return (
          <button
            key={route.id}
            onClick={() => onRouteSelect(route.id)}
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
            
            {route.isEcoFriendly && (
              <span className="mt-1 inline-flex items-center rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                Eco-Friendly
              </span>
            )}
            
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
  );
};
