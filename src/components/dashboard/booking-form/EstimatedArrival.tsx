
import React from "react";
import { Clock, Calendar } from "lucide-react";

interface EstimatedArrivalProps {
  estimatedTime: string;
  origin: string;
  destination: string;
}

const EstimatedArrival = ({ estimatedTime, origin, destination }: EstimatedArrivalProps) => {
  if (!origin || !destination || !estimatedTime) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Estimated Arrival
        </label>
        <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm">
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
      <div className="rounded-md border border-white/10 bg-blue-500/5 px-3 py-2.5 text-sm">
        <div className="flex flex-col">
          <div className="flex items-center text-blue-400 font-medium">
            <Clock className="mr-2 h-4 w-4" />
            <span>{estimatedTime}</span>
          </div>
          <div className="mt-1 flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-2 h-3 w-3" />
            <span>
              From {origin} to {destination}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimatedArrival;
