
import React from "react";
import { Input } from "@/components/ui/input";
import { Package2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeightInputProps {
  weight: string;
  setWeight: (weight: string) => void;
  error?: string;
}

const WeightInput: React.FC<WeightInputProps> = ({
  weight,
  setWeight,
  error
}) => {
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers, decimal point, and units like kg, lb, etc.
    if (/^[0-9]*\.?[0-9]*( ?(kg|t|lb|ton|g))?$/.test(value)) {
      setWeight(value);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        Weight
      </label>
      <div className={cn("flex items-center rounded-md border border-white/10 bg-muted px-3 py-2 has-[input:focus]:border-input",
                          error && "border-destructive")}>
        <Package2 className="mr-2 h-4 w-4 text-nexus-purple" />
        <Input
          type="text"
          placeholder="Enter weight (e.g. 500 kg)"
          value={weight}
          onChange={handleWeightChange}
          className="border-0 bg-transparent p-0 text-white focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
};

export default WeightInput;
