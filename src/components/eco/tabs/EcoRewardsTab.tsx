
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, BadgeCheck, BadgePercent, ArrowRight, TreeDeciduous } from "lucide-react";
import { useEcoPoints } from "@/context/EcoPointsContext";

export const EcoRewardsTab: React.FC = () => {
  const { points, redeemPoints } = useEcoPoints();

  const handleRedeem100 = () => {
    redeemPoints(100);
  };

  const handleRedeem250 = () => {
    redeemPoints(250);
  };

  const handleRedeem500 = () => {
    redeemPoints(500);
  };

  return (
    <Card className="bg-gradient-to-br from-background to-green-500/10 border-white/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
              <Leaf className="h-5 w-5 text-green-400" />
            </div>
            <CardTitle className="text-lg">Eco Rewards</CardTitle>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1.5 text-sm font-semibold text-green-400">
            <BadgeCheck className="mr-1 h-4 w-4" />
            {points} Points
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Redeem your points for discounts on future shipments and contribute to environmental initiatives.
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-500/20 p-2">
                <BadgePercent className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium">5% Discount</h4>
                <p className="text-xs text-muted-foreground">100 points</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 border-green-500/20 hover:bg-green-500/10 hover:text-green-400"
              onClick={handleRedeem100}
              disabled={points < 100}
            >
              Redeem 
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-500/20 p-2">
                <BadgePercent className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium">15% Discount</h4>
                <p className="text-xs text-muted-foreground">250 points</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 border-green-500/20 hover:bg-green-500/10 hover:text-green-400"
              onClick={handleRedeem250}
              disabled={points < 250}
            >
              Redeem 
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-500/20 p-2">
                <BadgePercent className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium">30% Discount</h4>
                <p className="text-xs text-muted-foreground">500 points</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 border-green-500/20 hover:bg-green-500/10 hover:text-green-400"
              onClick={handleRedeem500}
              disabled={points < 500}
            >
              Redeem 
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-gradient-to-b from-green-500/10 to-green-500/5 p-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-500/20 p-2">
                <TreeDeciduous className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Plant 5 Trees</h4>
                <p className="text-xs text-muted-foreground">200 points</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 border-green-500/20 hover:bg-green-500/10 hover:text-green-400"
              disabled={points < 200}
            >
              Donate 
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
