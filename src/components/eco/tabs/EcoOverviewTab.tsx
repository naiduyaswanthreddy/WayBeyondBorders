
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, BadgeCheck, Droplets, TreeDeciduous, Wind, Share2, BadgePercent } from "lucide-react";
import { useEcoPoints } from "@/context/EcoPointsContext";
import { TierProgressBar } from "../components/TierProgressBar";
import { ImpactMetricsGrid } from "../components/ImpactMetricsGrid";
import { EnvironmentalImpactCard } from "../components/EnvironmentalImpactCard";
import { SustainabilityStatsCard } from "../components/SustainabilityStatsCard";

export const EcoOverviewTab: React.FC = () => {
  const { points, metrics, sharedShipments } = useEcoPoints();

  return (
    <>
      <Card className="bg-gradient-to-br from-background to-green-500/10 border-white/10">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                <Leaf className="h-6 w-6 text-green-400" />
              </div>
              <CardTitle className="text-xl">Eco Impact</CardTitle>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1.5 text-sm font-semibold text-green-400">
              <BadgeCheck className="mr-1 h-4 w-4" />
              {points} Points
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TierProgressBar points={points} />
          <ImpactMetricsGrid metrics={metrics} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <EnvironmentalImpactCard metrics={metrics} />
        <SustainabilityStatsCard points={points} sharedShipmentsCount={sharedShipments.length} />
      </div>
    </>
  );
};
