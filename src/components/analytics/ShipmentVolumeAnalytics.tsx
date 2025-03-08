
import React from 'react';
import { BarChart, Globe, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar
} from "recharts";
import CustomTooltip from './CustomTooltip';
import { ROUTE_COLORS } from './ChartColors';

interface ShipmentVolumeAnalyticsProps {
  activeData: {
    shipmentVolumeData: any[];
    topRoutesData: any[];
  };
}

const ShipmentVolumeAnalytics: React.FC<ShipmentVolumeAnalyticsProps> = ({ activeData }) => {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="flex items-center text-xl font-semibold text-white">
          <Package className="mr-2 h-5 w-5 text-nexus-blue" />
          Shipment Volume & Route Performance
        </h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Shipment Volume Over Time */}
        <Card className="bg-card border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-nexus-blue" />
              <CardTitle className="text-lg">Shipment Volume Over Time</CardTitle>
            </div>
            <CardDescription>
              Total shipments over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activeData.shipmentVolumeData}
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
                  <Area 
                    type="monotone" 
                    dataKey="shipments" 
                    stroke="#0062FF" 
                    fill="url(#colorShipments)" 
                    name="Shipments"
                  />
                  <defs>
                    <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0062FF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0062FF" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-md bg-white/5 p-2 text-center">
                <div className="text-xs text-muted-foreground">Total</div>
                <div className="text-sm font-semibold text-white">
                  {activeData.shipmentVolumeData.reduce((sum, item) => sum + item.shipments, 0)}
                </div>
              </div>
              <div className="rounded-md bg-white/5 p-2 text-center">
                <div className="text-xs text-muted-foreground">Average</div>
                <div className="text-sm font-semibold text-white">
                  {Math.round(activeData.shipmentVolumeData.reduce((sum, item) => sum + item.shipments, 0) / activeData.shipmentVolumeData.length)}
                </div>
              </div>
              <div className="rounded-md bg-white/5 p-2 text-center">
                <div className="text-xs text-muted-foreground">Growth</div>
                <div className="text-sm font-semibold text-green-400">
                  +{Math.round((activeData.shipmentVolumeData[activeData.shipmentVolumeData.length - 1].shipments / 
                    activeData.shipmentVolumeData[0].shipments - 1) * 100)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Top Routes Performance */}
        <Card className="bg-card border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Globe className="mr-2 h-5 w-5 text-nexus-purple" />
              <CardTitle className="text-lg">Top Routes Performance</CardTitle>
            </div>
            <CardDescription>
              Most used shipping routes and their reliability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={activeData.topRoutesData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    type="number"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  />
                  <YAxis 
                    dataKey="route" 
                    type="category"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    width={150}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="onTime" 
                    stackId="a"
                    fill="#10B981" 
                    name="On-Time Deliveries"
                  />
                  <Bar 
                    dataKey="delay" 
                    stackId="a"
                    fill="#F43F5E" 
                    name="Delayed Shipments"
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
              <div className="rounded-md bg-white/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Route Reliability</span>
                  <span className="text-sm font-medium text-white">On-Time %</span>
                </div>
                <div className="mt-2 space-y-2">
                  {activeData.topRoutesData.map((route: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="mr-2 h-3 w-3 rounded-full" 
                          style={{ backgroundColor: ROUTE_COLORS[route.route as keyof typeof ROUTE_COLORS] }}
                        ></div>
                        <span className="text-xs text-muted-foreground">{route.route}</span>
                      </div>
                      <span className="text-xs font-medium text-white">
                        {Math.round((route.onTime / route.shipments) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShipmentVolumeAnalytics;
