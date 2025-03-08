
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Leaf, 
  BadgeCheck, 
  BadgePercent, 
  ArrowRight, 
  TreeDeciduous, 
  Droplets, 
  Wind, 
  Share2 
} from "lucide-react";
import { useEcoPoints } from "@/context/EcoPointsContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SharedShipmentsList } from "./SharedShipmentsList";

export const EcoDashboard: React.FC = () => {
  const { points, metrics, redeemPoints, sharedShipments } = useEcoPoints();

  const handleRedeem100 = () => {
    redeemPoints(100);
  };

  const handleRedeem250 = () => {
    redeemPoints(250);
  };

  const handleRedeem500 = () => {
    redeemPoints(500);
  };

  // Calculate next tier progress
  const currentTier = points < 200 ? "Bronze" : points < 500 ? "Silver" : points < 1000 ? "Gold" : "Platinum";
  const nextTier = points < 200 ? "Silver" : points < 500 ? "Gold" : points < 1000 ? "Platinum" : "Diamond";
  const tierThreshold = points < 200 ? 200 : points < 500 ? 500 : points < 1000 ? 1000 : 2000;
  const progress = (points / tierThreshold) * 100;

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
              <div className="mb-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Progress to {nextTier} Tier
                </p>
                <div className="mt-2">
                  <Progress value={progress} className="h-2 bg-white/10" indicatorClassName="bg-gradient-to-r from-green-400 to-emerald-500" />
                </div>
                <p className="mt-1 text-xs text-right text-muted-foreground">
                  {points} / {tierThreshold} points
                </p>
              </div>

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
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
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
                      <span className="text-sm font-bold text-white">{sharedShipments.length}</span>
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
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6 pt-4">
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
        </TabsContent>

        <TabsContent value="shared" className="space-y-6 pt-4">
          <SharedShipmentsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};
