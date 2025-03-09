
import React from "react";
import { Progress } from "@/components/ui/progress";

interface TierProgressBarProps {
  points: number;
}

export const TierProgressBar: React.FC<TierProgressBarProps> = ({ points }) => {
  // Calculate next tier progress
  const nextTier = points < 200 ? "Silver" : points < 500 ? "Gold" : points < 1000 ? "Platinum" : "Diamond";
  const tierThreshold = points < 200 ? 200 : points < 500 ? 500 : points < 1000 ? 1000 : 2000;
  const progress = (points / tierThreshold) * 100;

  return (
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
  );
};
