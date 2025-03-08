
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Award, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface EcoPointsCardProps {
  points: number;
  className?: string;
}

export const EcoPointsCard: React.FC<EcoPointsCardProps> = ({ points, className }) => {
  const handleRedeem = () => {
    toast({
      title: "Redeeming Eco Points",
      description: "Your discount will be applied to your next shipment.",
    });
  };

  return (
    <Card className={`bg-gradient-to-br from-background to-green-500/20 border-white/10 ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Leaf className="mr-2 h-5 w-5 text-green-400" />
            Eco Points
          </CardTitle>
          <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
            <Award className="h-3.5 w-3.5 mr-1" />
            Level {Math.floor(points / 100) + 1}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-white">{points}</p>
            <p className="text-xs text-muted-foreground">Available points</p>
          </div>
          <div className="rounded-full bg-white/10 p-3">
            <Leaf className="h-6 w-6 text-green-400" />
          </div>
        </div>

        <div className="mt-4">
          <div className="relative pt-1">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">{points % 100}/100 to next level</span>
              <span className="text-xs font-semibold text-green-400">{Math.floor(points / 100) + 1}</span>
            </div>
            <div className="mb-4 h-2 rounded-full bg-white/10">
              <div
                style={{ width: `${points % 100}%` }}
                className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-500"
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-2 space-y-3">
          <div className="rounded-lg border border-white/10 bg-white/5 p-3 flex items-center">
            <Gift className="h-5 w-5 mr-3 text-green-400" />
            <div>
              <p className="text-sm font-medium text-white">10% Shipping Discount</p>
              <p className="text-xs text-muted-foreground">100 points</p>
            </div>
            <Button 
              size="sm" 
              className="ml-auto" 
              disabled={points < 100}
              onClick={handleRedeem}
            >
              Redeem
            </Button>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-3 flex items-center">
            <Gift className="h-5 w-5 mr-3 text-green-400" />
            <div>
              <p className="text-sm font-medium text-white">20% Shipping Discount</p>
              <p className="text-xs text-muted-foreground">200 points</p>
            </div>
            <Button 
              size="sm" 
              className="ml-auto" 
              disabled={points < 200}
              onClick={handleRedeem}
            >
              Redeem
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
