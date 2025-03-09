
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, TreeDeciduous } from "lucide-react";

interface EnvironmentalImpactCardProps {
  metrics: {
    co2Saved: number;
    treesPlanted: number;
    plasticReduced: number;
  };
}

export const EnvironmentalImpactCard: React.FC<EnvironmentalImpactCardProps> = ({ metrics }) => {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="text-md">Environmental Impact</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                <Droplets className="h-4 w-4 text-green-400" />
              </div>
              <span className="text-sm font-medium">CO₂ Savings</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-white">{metrics.co2Saved.toLocaleString()}kg</span>
              <p className="text-xs text-muted-foreground">Equivalent to {Math.round(metrics.co2Saved / 100)} car trips</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                <TreeDeciduous className="h-4 w-4 text-green-400" />
              </div>
              <span className="text-sm font-medium">Carbon Offset</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-white">{metrics.treesPlanted} trees</span>
              <p className="text-xs text-muted-foreground">Planted through our partners</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
