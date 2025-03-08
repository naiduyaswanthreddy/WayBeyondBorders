
import React from "react";
import { Clock } from "lucide-react";

interface EstimatedArrivalProps {
  origin: string;
  destination: string;
}

const EstimatedArrival: React.FC<EstimatedArrivalProps> = ({
  origin,
  destination,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        Estimated Arrival
      </label>
      <div className="flex items-center rounded-md border border-white/10 bg-muted px-3 py-2 text-white">
        <Clock className="mr-2 h-4 w-4 text-nexus-teal" />
        <span>
          {origin && destination ? "3-5 days (AI optimized)" : "Select origin & destination"}
        </span>
      </div>
    </div>
  );
};

export default EstimatedArrival;
