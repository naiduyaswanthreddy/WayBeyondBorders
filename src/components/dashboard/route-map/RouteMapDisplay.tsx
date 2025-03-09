
import React from "react";
import GoogleMapDisplay from "../maps/GoogleMapDisplay";

interface RouteMapDisplayProps {
  selectedRoute: string;
  selectedRouteDetails: any;
  origin: string;
  destination: string;
}

export const RouteMapDisplay: React.FC<RouteMapDisplayProps> = ({
  selectedRoute,
  selectedRouteDetails,
  origin,
  destination
}) => {
  const getMapTransportModes = () => {
    if (!selectedRouteDetails) return [];
    
    return selectedRouteDetails.modes.map((mode: string) => mode.toLowerCase());
  };

  return (
    <div className="relative rounded-lg border border-white/10 overflow-hidden">
      <GoogleMapDisplay 
        origin={origin}
        destination={destination}
        transportModes={getMapTransportModes()}
      />
      
      {/* Route details on top right corner of the map */}
      {selectedRouteDetails && (
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md rounded-lg p-3 z-10 max-w-[240px] border border-white/10">
          <div className="flex flex-col gap-1 text-sm">
            <div className="mb-1 font-medium text-white">{selectedRouteDetails.name}</div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">From:</span>
              <span className="text-white">{origin}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">To:</span>
              <span className="text-white">{destination}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Duration:</span>
              <span className="text-white">{selectedRouteDetails.duration}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Cost:</span>
              <span className="text-white">{selectedRouteDetails.cost}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">CO₂:</span>
              <span className="text-white">{selectedRouteDetails.co2}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
