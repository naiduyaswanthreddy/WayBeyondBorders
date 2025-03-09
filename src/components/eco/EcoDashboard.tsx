
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Leaf, BadgeCheck, BadgePercent, Share2 } from "lucide-react";
import { useEcoPoints } from "@/context/EcoPointsContext";
import { SharedShipmentsList } from "./SharedShipmentsList";
import { EcoOverviewTab } from "./tabs/EcoOverviewTab";
import { EcoRewardsTab } from "./tabs/EcoRewardsTab";

export const EcoDashboard: React.FC = () => {
  const { points } = useEcoPoints();
  const currentTier = points < 200 ? "Bronze" : points < 500 ? "Silver" : points < 1000 ? "Gold" : "Platinum";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-white">Eco Dashboard</h2>
        <div className="flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1.5 text-sm font-semibold text-green-400">
          <BadgeCheck className="mr-1 h-4 w-4" />
          {currentTier} Tier
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/20">
          <TabsTrigger value="overview" className="gap-2">
            <Leaf className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="gap-2">
            <BadgePercent className="h-4 w-4" />
            <span>Rewards</span>
          </TabsTrigger>
          <TabsTrigger value="shared" className="gap-2">
            <Share2 className="h-4 w-4" />
            <span>Shared Shipments</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-4">
          <EcoOverviewTab />
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6 pt-4">
          <EcoRewardsTab />
        </TabsContent>

        <TabsContent value="shared" className="space-y-6 pt-4">
          <SharedShipmentsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};
