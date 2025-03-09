
import React from 'react';
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  DollarSign, 
  Lightbulb, 
  Package, 
  Ship, 
  Plane, 
  Truck 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
  Legend
} from "recharts";
import CustomTooltip from './CustomTooltip';
import { COLORS } from './ChartColors';
import { useLocation } from 'react-router-dom';

interface CostSavingsAnalyticsProps {
  activeData: {
    costTrendData: any[];
    routeComparisonData: any[];
    bulkSavingsData: any[];
    transportModeData: any[];
  };
  dateRange: string;
}

const CostSavingsAnalytics: React.FC<CostSavingsAnalyticsProps> = ({ activeData, dateRange }) => {
  const location = useLocation();
  const bookingData = location.state?.bookingData || null;
  
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="flex items-center text-xl font-semibold text-white">
          <DollarSign className="mr-2 h-5 w-5 text-nexus-purple" />
          Cost & Savings Analytics
        </h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Route Type Comparison - Now shown first */}
        <Card className="bg-card border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-nexus-purple" />
              <CardTitle className="text-lg">Route Type Comparison</CardTitle>
            </div>
            <CardDescription>
              {bookingData ? 
                `Cost, time and emissions for ${bookingData.origin} to ${bookingData.destination}` : 
                'Cost, time and emissions by route type'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={activeData.routeComparisonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="cost"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <YAxis 
                    yAxisId="time"
                    orientation="right"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    tickFormatter={(value) => `${value}d`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    yAxisId="cost"
                    dataKey="cost" 
                    fill="#6E36E5" 
                    name="Cost ($)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="time"
                    type="monotone"
                    dataKey="time"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    name="Time (days)"
                  />
                  <Line
                    yAxisId="time"
                    type="monotone"
                    dataKey="co2"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="CO2 (tons)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-4 gap-2">
              <div className="rounded-md bg-white/5 p-2 text-center">
                <div className="text-xs text-muted-foreground">Fastest</div>
                <div className="text-sm font-semibold text-nexus-blue">${activeData.routeComparisonData[0].cost}</div>
              </div>
              <div className="rounded-md bg-white/5 p-2 text-center">
                <div className="text-xs text-muted-foreground">Economical</div>
                <div className="text-sm font-semibold text-nexus-purple">${activeData.routeComparisonData[1].cost}</div>
              </div>
              <div className="rounded-md bg-white/5 p-2 text-center">
                <div className="text-xs text-muted-foreground">Reliable</div>
                <div className="text-sm font-semibold text-nexus-teal">${activeData.routeComparisonData[2].cost}</div>
              </div>
              <div className="rounded-md bg-white/5 p-2 text-center">
                <div className="text-xs text-muted-foreground">Eco-Friendly</div>
                <div className="text-sm font-semibold text-green-500">${activeData.routeComparisonData[3].cost}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Total Cost Breakdown by Transport Mode - Now second */}
        <Card className="bg-card border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <PieChart className="mr-2 h-5 w-5 text-nexus-blue" />
              <CardTitle className="text-lg">Cost Breakdown by Transport Mode</CardTitle>
            </div>
            <CardDescription>
              {bookingData ? 
                `Distribution for ${bookingData.transportMode || 'suggested route'}` : 
                'Distribution of shipping costs'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={activeData.transportModeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {activeData.transportModeData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={(value) => <span className="text-xs text-white">{value}</span>} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center rounded-md bg-white/5 p-3">
                <Ship className="h-6 w-6 text-nexus-blue" />
                <div className="mt-1 text-xs text-muted-foreground">Sea</div>
                <div className="text-sm font-semibold text-white">${Math.round(activeData.bulkSavingsData.reduce((sum, item) => sum + item.cost, 0) * activeData.transportModeData[0].value / 100).toLocaleString()}</div>
              </div>
              <div className="flex flex-col items-center rounded-md bg-white/5 p-3">
                <Plane className="h-6 w-6 text-nexus-purple" />
                <div className="mt-1 text-xs text-muted-foreground">Air</div>
                <div className="text-sm font-semibold text-white">${Math.round(activeData.bulkSavingsData.reduce((sum, item) => sum + item.cost, 0) * activeData.transportModeData[1].value / 100).toLocaleString()}</div>
              </div>
              <div className="flex flex-col items-center rounded-md bg-white/5 p-3">
                <Truck className="h-6 w-6 text-nexus-teal" />
                <div className="mt-1 text-xs text-muted-foreground">Road</div>
                <div className="text-sm font-semibold text-white">${Math.round(activeData.bulkSavingsData.reduce((sum, item) => sum + item.cost, 0) * activeData.transportModeData[2].value / 100).toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Cost Trends Over Time */}
        <Card className="bg-card border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <LineChart className="mr-2 h-5 w-5 text-nexus-blue" />
                <CardTitle className="text-lg">Cost Trends Over Time</CardTitle>
              </div>
              <span className="rounded-full bg-nexus-blue/20 px-3 py-1 text-xs font-medium text-nexus-blue">
                {dateRange === 'week' ? '7 Days' : dateRange === 'month' ? '30 Days' : dateRange === 'quarter' ? '90 Days' : '365 Days'}
              </span>
            </div>
            <CardDescription>
              Actual vs AI-optimized shipping costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={activeData.costTrendData}
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
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#F43F5E" 
                    strokeWidth={2}
                    name="Actual Cost"
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="optimized" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Optimized Cost"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 rounded-md bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-nexus-purple" />
                  <span className="text-sm font-medium text-white">AI Cost Insight</span>
                </div>
                <span className="text-sm font-semibold text-green-400">
                  {Math.round(100 - (activeData.costTrendData.reduce((sum, item) => sum + item.optimized, 0) / 
                                activeData.costTrendData.reduce((sum, item) => sum + item.actual, 0) * 100))}% Savings
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                AI-optimized routing has consistently reduced costs by scheduling during off-peak times and identifying lower-cost carriers.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Bulk Shipment Savings */}
        <Card className="bg-card border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-nexus-teal" />
              <CardTitle className="text-lg">Bulk vs Single Shipment Analysis</CardTitle>
            </div>
            <CardDescription>
              Cost effectiveness by shipment type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={activeData.bulkSavingsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="category" 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="cost"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <YAxis 
                    yAxisId="quantity"
                    orientation="right"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    yAxisId="cost"
                    dataKey="cost" 
                    fill="#00CFD5" 
                    name="Total Cost ($)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    yAxisId="quantity"
                    dataKey="quantity" 
                    fill="#F59E0B" 
                    name="Shipment Quantity"
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 rounded-md bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-nexus-teal" />
                  <span className="text-sm font-medium text-white">Cost per Shipment</span>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Single</div>
                  <div className="text-sm font-semibold text-white">
                    ${Math.round(activeData.bulkSavingsData[0].cost / activeData.bulkSavingsData[0].quantity)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Bulk</div>
                  <div className="text-sm font-semibold text-green-400">
                    ${Math.round(activeData.bulkSavingsData[1].cost / activeData.bulkSavingsData[1].quantity)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Ride Sharing</div>
                  <div className="text-sm font-semibold text-nexus-purple">
                    ${Math.round(activeData.bulkSavingsData[2].cost / activeData.bulkSavingsData[2].quantity)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CostSavingsAnalytics;
