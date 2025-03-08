
import React from 'react';
import { TrendingDown, Leaf } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import CustomTooltip from './CustomTooltip';

interface SustainabilityAnalyticsProps {
  activeData: {
    ecoImpactData: any[];
    ecoPointsData: any[];
  };
  points: number;
}

const SustainabilityAnalytics: React.FC<SustainabilityAnalyticsProps> = ({ activeData, points }) => {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="flex items-center text-xl font-semibold text-white">
          <Leaf className="mr-2 h-5 w-5 text-green-500" />
          Sustainability & Eco-Friendly Impact
        </h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* CO2 Emissions Savings */}
        <Card className="bg-card border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <TrendingDown className="mr-2 h-5 w-5 text-green-500" />
              <CardTitle className="text-lg">CO₂ Emissions Savings</CardTitle>
            </div>
            <CardDescription>
              Standard vs eco-friendly shipping emissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activeData.ecoImpactData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    tickFormatter={(value) => `${value}t`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="standardCO2" 
                    stackId="1"
                    stroke="#F43F5E" 
                    fill="url(#colorStandard)" 
                    name="Standard Emissions (tons)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ecoCO2" 
                    stackId="2"
                    stroke="#10B981" 
                    fill="url(#colorEco)" 
                    name="Eco-Friendly Emissions (tons)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="saved" 
                    stackId="3"
                    stroke="#0062FF" 
                    fill="url(#colorSaved)" 
                    name="CO₂ Saved (tons)"
                  />
                  <defs>
                    <linearGradient id="colorStandard" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorEco" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0062FF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0062FF" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
              <div className="rounded-md bg-green-500/10 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium text-white">Total CO₂ Saved</span>
                  </div>
                  <span className="text-sm font-semibold text-green-400">
                    {activeData.ecoImpactData.reduce((sum, item) => sum + item.saved, 0).toFixed(1)} tons
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Equivalent to planting approximately {Math.round(activeData.ecoImpactData.reduce((sum, item) => sum + item.saved, 0) * 50)} trees.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Eco Points Earned & Redeemed */}
        <Card className="bg-card border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Leaf className="mr-2 h-5 w-5 text-green-500" />
                <CardTitle className="text-lg">Eco Points Activity</CardTitle>
              </div>
              <div className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                {points} Total Points
              </div>
            </div>
            <CardDescription>
              Eco points earned and redeemed over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activeData.ecoPointsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="earned" 
                    fill="#10B981" 
                    name="Points Earned"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="redeemed" 
                    fill="#6E36E5" 
                    name="Points Redeemed"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-md bg-white/5 p-2 text-center">
                <div className="text-xs text-muted-foreground">Total Earned</div>
                <div className="text-sm font-semibold text-green-400">
                  {activeData.ecoPointsData.reduce((sum, item) => sum + item.earned, 0)}
                </div>
              </div>
              <div className="rounded-md bg-white/5 p-2 text-center">
                <div className="text-xs text-muted-foreground">Total Redeemed</div>
                <div className="text-sm font-semibold text-nexus-purple">
                  {activeData.ecoPointsData.reduce((sum, item) => sum + item.redeemed, 0)}
                </div>
              </div>
              <div className="rounded-md bg-white/5 p-2 text-center">
                <div className="text-xs text-muted-foreground">Balance</div>
                <div className="text-sm font-semibold text-white">
                  {points} points
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SustainabilityAnalytics;
