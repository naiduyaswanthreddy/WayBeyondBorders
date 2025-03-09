
import React from "react";
import { Clock, Zap } from "lucide-react";

interface EstimatedArrivalProps {
  estimatedTime: string;
  origin: string;
  destination: string;
  transportMode: string;
}

const EstimatedArrival: React.FC<EstimatedArrivalProps> = ({
  estimatedTime,
  origin,
  destination,
  transportMode
}) => {
  if (!estimatedTime || !origin || !destination) {
    return null;
  }

  return (
    <div className="col-span-2 rounded-lg border border-white/10 bg-white/5 p-4">
      <h3 className="flex items-center gap-2 text-base font-medium text-white">
        <Clock className="h-5 w-5 text-nexus-blue" />
        Estimated Transit Time
      </h3>
      
      <div className="mt-2 grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-sm text-muted-foreground">From</p>
          <p className="font-medium text-white">{origin}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">To</p>
          <p className="font-medium text-white">{destination}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Via</p>
          <p className="font-medium text-white">
            {transportMode === "air" ? "Air Freight" : 
             transportMode === "sea" ? "Sea Freight" : 
             transportMode === "road" ? "Road Transport" : 
             transportMode === "express" ? "Express Air" : 
             transportMode === "multimode" ? "Multi-modal Transport" : 
             "Any Transport Mode"}
          </p>
        </div>
      </div>
      
      <div className="mt-4 rounded-md bg-nexus-blue/20 p-3">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-nexus-blue" />
          <div>
            <p className="font-medium text-white">Estimated Time: <span className="text-nexus-blue">{estimatedTime}</span></p>
            <p className="text-xs text-muted-foreground">
              This is an estimate based on current conditions. Actual transit time may vary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimatedArrival;
