
import React from 'react';
import { Zap, AlertTriangle, CloudLightning, Lightbulb, ArrowRight, Calendar, Ship, Plane, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface PredictionData {
  id: string;
  title: string;
  description: string;
  impact: string;
  recommendation: string;
}

interface BestShippingDays {
  sea: string[];
  air: string[];
  road: string[];
}

interface AIPredictionsAlertsProps {
  predictionData: PredictionData[];
  bestShippingDays: BestShippingDays;
}

const AIPredictionsAlerts: React.FC<AIPredictionsAlertsProps> = ({ predictionData, bestShippingDays }) => {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="flex items-center text-xl font-semibold text-white">
          <Zap className="mr-2 h-5 w-5 text-nexus-blue" />
          AI-Powered Predictions & Alerts
        </h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {predictionData.map((prediction) => (
          <Card key={prediction.id} className={`bg-gradient-to-br from-background to-${prediction.impact === 'high' ? 'red-500' : prediction.impact === 'medium' ? 'yellow-500' : 'blue-500'}/10 border-white/10`}>
            <CardContent className="p-6">
              <div className={`mb-4 rounded-full bg-${prediction.impact === 'high' ? 'red-500' : prediction.impact === 'medium' ? 'yellow-500' : 'blue-500'}/20 p-2 w-fit`}>
                {prediction.impact === 'high' ? (
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                ) : prediction.impact === 'medium' ? (
                  <CloudLightning className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Lightbulb className="h-5 w-5 text-blue-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-white">{prediction.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {prediction.description}
              </p>
              <div className="mt-4 rounded-lg bg-white/5 p-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-nexus-blue" />
                  <h4 className="text-sm font-medium text-white">AI Recommendation</h4>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {prediction.recommendation}
                </p>
              </div>
              <Button className={`mt-4 w-full gap-2 ${
                prediction.impact === 'high' 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30' 
                  : prediction.impact === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30'
                  : 'bg-nexus-blue/20 text-nexus-blue hover:bg-nexus-blue/30 border border-nexus-blue/30'
              }`}>
                View Details 
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Best Shipping Days Recommendation */}
      <Card className="mt-6 bg-card border-white/10">
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-nexus-purple" />
            <CardTitle className="text-lg">Recommended Shipping Days</CardTitle>
          </div>
          <CardDescription>
            Best days to ship for optimal cost and efficiency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-md bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <Ship className="h-5 w-5 text-nexus-blue" />
                <h3 className="font-medium text-white">Sea Freight</h3>
              </div>
              <div className="mt-3 space-y-2">
                {bestShippingDays.sea.map((day, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{day}</span>
                    <span className="rounded-full bg-nexus-blue/20 px-2.5 py-0.5 text-xs font-medium text-nexus-blue">
                      Recommended
                    </span>
                  </div>
                ))}
                <p className="mt-2 text-xs text-muted-foreground">
                  Lower port congestion and better carrier availability.
                </p>
              </div>
            </div>
            
            <div className="rounded-md bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-nexus-purple" />
                <h3 className="font-medium text-white">Air Freight</h3>
              </div>
              <div className="mt-3 space-y-2">
                {bestShippingDays.air.map((day, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{day}</span>
                    <span className="rounded-full bg-nexus-purple/20 px-2.5 py-0.5 text-xs font-medium text-nexus-purple">
                      Recommended
                    </span>
                  </div>
                ))}
                <p className="mt-2 text-xs text-muted-foreground">
                  Lower demand periods with better rates and availability.
                </p>
              </div>
            </div>
            
            <div className="rounded-md bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-nexus-teal" />
                <h3 className="font-medium text-white">Road Transport</h3>
              </div>
              <div className="mt-3 space-y-2">
                {bestShippingDays.road.map((day, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{day}</span>
                    <span className="rounded-full bg-nexus-teal/20 px-2.5 py-0.5 text-xs font-medium text-nexus-teal">
                      Recommended
                    </span>
                  </div>
                ))}
                <p className="mt-2 text-xs text-muted-foreground">
                  Lower traffic and better driver availability.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPredictionsAlerts;
