
import React from 'react';
import { AlertCircle, Lightbulb, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AIPredictionsAlertsProps {
  predictionData: {
    id: string;
    title: string;
    description: string;
    impact: string;
    recommendation: string;
  }[];
  bestShippingDays?: {
    sea: string[];
    air: string[];
    road: string[];
  };
}

const AIPredictionsAlerts: React.FC<AIPredictionsAlertsProps> = ({ 
  predictionData,
  bestShippingDays
}) => {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="flex items-center text-xl font-semibold text-white">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
          AI-Powered Predictions & Alerts
        </h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1">
        {/* Shipment Alerts & Predictions */}
        <Card className="bg-card border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-yellow-400" />
              <CardTitle className="text-lg">Shipment Alerts & Predictions</CardTitle>
            </div>
            <CardDescription>
              AI-generated alerts and recommendations for upcoming shipments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictionData.map((prediction) => (
                <div 
                  key={prediction.id} 
                  className="rounded-md border border-white/10 bg-white/5 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium text-white">{prediction.title}</h3>
                    <span 
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        prediction.impact === 'high' 
                          ? 'bg-red-500/20 text-red-400' 
                          : prediction.impact === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {prediction.impact.charAt(0).toUpperCase() + prediction.impact.slice(1)} Impact
                    </span>
                  </div>
                  
                  <p className="mb-3 text-sm text-muted-foreground">
                    {prediction.description}
                  </p>
                  
                  <div className="rounded-md bg-card p-3">
                    <div className="flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4 text-green-400" />
                      <span className="text-sm font-medium text-white">Recommendation:</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {prediction.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIPredictionsAlerts;
