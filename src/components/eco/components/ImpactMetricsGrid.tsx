
import React from "react";
import { Droplets, TreeDeciduous, Wind } from "lucide-react";

interface ImpactMetricsGridProps {
  metrics: {
    co2Saved: number;
    treesPlanted: number;
    plasticReduced: number;
  };
}

export const ImpactMetricsGrid: React.FC<ImpactMetricsGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
          <Droplets className="h-4 w-4 text-green-400" />
        </div>
        <h4 className="text-sm font-medium text-white">{metrics.co2Saved.toLocaleString()}kg</h4>
        <p className="mt-1 text-xs text-muted-foreground">CO₂ Saved</p>
      </div>
      
      <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
          <TreeDeciduous className="h-4 w-4 text-green-400" />
        </div>
        <h4 className="text-sm font-medium text-white">{metrics.treesPlanted}</h4>
        <p className="mt-1 text-xs text-muted-foreground">Trees Planted</p>
      </div>
      
      <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
          <Wind className="h-4 w-4 text-green-400" />
        </div>
        <h4 className="text-sm font-medium text-white">{metrics.plasticReduced.toLocaleString()}kg</h4>
        <p className="mt-1 text-xs text-muted-foreground">Plastic Reduced</p>
      </div>
    </div>
  );
};
