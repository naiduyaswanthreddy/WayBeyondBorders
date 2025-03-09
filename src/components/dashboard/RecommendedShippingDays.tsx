
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Ship, Plane, Truck } from "lucide-react";

interface RecommendedShippingDaysProps {
  className?: string;
}

const RecommendedShippingDays: React.FC<RecommendedShippingDaysProps> = ({ className }) => {
  const bestShippingDays = {
    sea: ["Tuesday", "Wednesday"],
    air: ["Monday", "Thursday"],
    road: ["Wednesday", "Friday"]
  };

  return (
    <Card className={`border-white/10 bg-card ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-nexus-blue" />
          <CardTitle className="text-lg">Recommended Shipping Days</CardTitle>
        </div>
        <CardDescription>
          AI-recommended optimal booking days by transport mode
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-md bg-white/5 px-4 py-3">
            <div className="flex items-center">
              <Ship className="mr-2 h-5 w-5 text-blue-400" />
              <span className="font-medium text-white">Sea Freight</span>
            </div>
            <div className="flex gap-2">
              {bestShippingDays.sea.map((day, index) => (
                <span
                  key={index}
                  className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md bg-white/5 px-4 py-3">
            <div className="flex items-center">
              <Plane className="mr-2 h-5 w-5 text-purple-400" />
              <span className="font-medium text-white">Air Freight</span>
            </div>
            <div className="flex gap-2">
              {bestShippingDays.air.map((day, index) => (
                <span
                  key={index}
                  className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-400"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md bg-white/5 px-4 py-3">
            <div className="flex items-center">
              <Truck className="mr-2 h-5 w-5 text-green-400" />
              <span className="font-medium text-white">Road Freight</span>
            </div>
            <div className="flex gap-2">
              {bestShippingDays.road.map((day, index) => (
                <span
                  key={index}
                  className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            These recommendations are based on historical data analysis, port congestion patterns, and optimal carrier schedules.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedShippingDays;
