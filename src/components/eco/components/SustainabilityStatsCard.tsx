
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, BadgePercent } from "lucide-react";

interface SustainabilityStatsCardProps {
  points: number;
  sharedShipmentsCount: number;
}

export const SustainabilityStatsCard: React.FC<SustainabilityStatsCardProps> = ({ 
  points, 
  sharedShipmentsCount 
}) => {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="text-md">Sustainability Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                <Share2 className="h-4 w-4 text-green-400" />
              </div>
              <span className="text-sm font-medium">Shared Shipments</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-white">{sharedShipmentsCount}</span>
              <p className="text-xs text-muted-foreground">Total shared bookings</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                <BadgePercent className="h-4 w-4 text-green-400" />
              </div>
              <span className="text-sm font-medium">Eco-Friendly Routes</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-white">{Math.floor(points / 25)}</span>
              <p className="text-xs text-muted-foreground">Routes chosen</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
