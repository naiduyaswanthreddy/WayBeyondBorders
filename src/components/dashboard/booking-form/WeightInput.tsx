
import React from "react";
import { Weight } from "lucide-react";

interface WeightInputProps {
  weight: string;
  setWeight: (weight: string) => void;
}

const WeightInput: React.FC<WeightInputProps> = ({
  weight,
  setWeight,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        Total Weight (kg)
      </label>
      <div className="relative">
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-muted px-3 py-2 pr-10 text-white placeholder:text-muted-foreground focus:border-nexus-purple/50 focus:outline-none focus:ring-1 focus:ring-nexus-purple/50"
          placeholder="Enter total weight"
        />
        <Weight className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
};

export default WeightInput;
