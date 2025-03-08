
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  Globe, 
  AlertTriangle,
  BarChart,
  LineChart,
  PieChart,
  Download
} from "lucide-react";
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
  Legend
} from "recharts";

const Analytics = () => {
  const [dateRange, setDateRange] = useState("month");

  // Sample data for charts
  const performanceData = [
    { name: "Jan", shipments: 32, onTime: 28, delay: 4 },
    { name: "Feb", shipments: 40, onTime: 36, delay: 4 },
    { name: "Mar", shipments: 45, onTime: 42, delay: 3 },
    { name: "Apr", shipments: 55, onTime: 52, delay: 3 },
    { name: "May", shipments: 48, onTime: 46, delay: 2 },
    { name: "Jun", shipments: 62, onTime: 59, delay: 3 },
    { name: "Jul", shipments: 70, onTime: 67, delay: 3 },
  ];

  const costData = [
    { name: "Jan", actual: 4200, optimized: 3800 },
    { name: "Feb", actual: 4500, optimized: 4000 },
    { name: "Mar", actual: 4800, optimized: 4200 },
    { name: "Apr", actual: 5100, optimized: 4400 },
    { name: "May", actual: 4900, optimized: 4200 },
    { name: "Jun", actual: 5400, optimized: 4600 },
    { name: "Jul", actual: 5800, optimized: 4900 },
  ];

  const transportModeData = [
    { name: "Sea", value: 45 },
    { name: "Air", value: 30 },
    { name: "Rail", value: 15 },
    { name: "Road", value: 10 },
  ];

  const routeData = [
    { name: "Asia - Europe", shipments: 42 },
    { name: "Asia - North America", shipments: 28 },
    { name: "Europe - North America", shipments: 18 },
    { name: "Intra-Asia", shipments: 12 },
    { name: "Africa - Europe", shipments: 8 },
    { name: "South America - North America", shipments: 7 },
  ];

  const COLORS = ["#0062FF", "#6E36E5", "#00CFD5", "#F43F5E", "#F59E0B", "#10B981"];

  const totalSavings = costData.reduce((sum, item) => sum + (item.actual - item.optimized), 0);
  const averageSavingsPercent = Math.round((totalSavings / costData.reduce((sum, item) => sum + item.actual, 0)) * 100);
  const totalShipments = performanceData.reduce((sum, item) => sum + item.shipments, 0);
  const onTimePercentage = Math.round((performanceData.reduce((sum, item) => sum + item.onTime, 0) / totalShipments) * 100);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border border-white/10 bg-black/80 p-3 shadow-md backdrop-blur-sm">
          <p className="text-xs font-medium text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="pt-16 pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Analytics Dashboard
            </h1>
            <p className="mt-2 text-muted-foreground">
              Comprehensive metrics and insights to optimize your logistics operations
            </p>
          </div>
          
          {/* Overview Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="bg-card border-white/10 hover:border-white/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Shipments</p>
                    <h3 className="mt-2 text-3xl font-bold text-white">{totalShipments}</h3>
                    <p className="mt-1 flex items-center text-sm text-green-400">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      <span>+12.5% from last period</span>
                    </p>
                  </div>
                  <div className="rounded-full bg-nexus-blue/20 p-3">
                    <BarChart3 className="h-6 w-6 text-nexus-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-white/10 hover:border-white/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">On-Time Delivery</p>
                    <h3 className="mt-2 text-3xl font-bold text-white">{onTimePercentage}%</h3>
                    <p className="mt-1 flex items-center text-sm text-green-400">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      <span>+3.2% from last period</span>
                    </p>
                  </div>
                  <div className="rounded-full bg-nexus-teal/20 p-3">
                    <Clock className="h-6 w-6 text-nexus-teal" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-white/10 hover:border-white/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Cost Savings</p>
                    <h3 className="mt-2 text-3xl font-bold text-white">${totalSavings.toLocaleString()}</h3>
                    <p className="mt-1 flex items-center text-sm text-green-400">
                      <TrendingDown className="mr-1 h-4 w-4" />
                      <span>{averageSavingsPercent}% reduction</span>
                    </p>
                  </div>
                  <div className="rounded-full bg-nexus-purple/20 p-3">
                    <DollarSign className="h-6 w-6 text-nexus-purple" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-white/10 hover:border-white/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Routes Covered</p>
                    <h3 className="mt-2 text-3xl font-bold text-white">24</h3>
                    <p className="mt-1 flex items-center text-sm text-yellow-400">
                      <AlertTriangle className="mr-1 h-4 w-4" />
                      <span>3 with weather alerts</span>
                    </p>
                  </div>
                  <div className="rounded-full bg-nexus-blue/20 p-3">
                    <Globe className="h-6 w-6 text-nexus-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts Section */}
          <div className="mt-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Performance Metrics</h2>
              <div className="flex items-center gap-2">
                <Tabs value={dateRange} onValueChange={setDateRange}>
                  <TabsList className="bg-muted/50">
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="quarter">Quarter</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="outline" size="sm" className="gap-2 border-white/10">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-card border-white/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <LineChart className="mr-2 h-5 w-5 text-nexus-blue" />
                    <CardTitle className="text-lg">Shipment Performance</CardTitle>
                  </div>
                  <CardDescription>
                    Total shipments and on-time delivery statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={performanceData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                          dataKey="name" 
                          stroke="rgba(255,255,255,0.5)"
                          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                        />
                        <YAxis 
                          stroke="rgba(255,255,255,0.5)"
                          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="shipments" 
                          stroke="#0062FF" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                          name="Total Shipments"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="onTime" 
                          stroke="#00CFD5" 
                          strokeWidth={2}
                          name="On-Time Deliveries"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="delay" 
                          stroke="#F43F5E" 
                          strokeWidth={2} 
                          name="Delayed Shipments"
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-white/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <BarChart className="mr-2 h-5 w-5 text-nexus-purple" />
                    <CardTitle className="text-lg">Cost Optimization Impact</CardTitle>
                  </div>
                  <CardDescription>
                    Actual costs vs. AI-optimized routing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={costData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                          dataKey="name" 
                          stroke="rgba(255,255,255,0.5)"
                          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                        />
                        <YAxis 
                          stroke="rgba(255,255,255,0.5)"
                          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="actual" 
                          fill="#6E36E5" 
                          name="Actual Cost ($)"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="optimized" 
                          fill="#00CFD5" 
                          name="Optimized Cost ($)"
                          radius={[4, 4, 0, 0]}
                        />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-white/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5 text-nexus-teal" />
                    <CardTitle className="text-lg">Transport Mode Distribution</CardTitle>
                  </div>
                  <CardDescription>
                    Percentage breakdown by mode of transport
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={transportModeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {transportModeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend formatter={(value) => <span className="text-xs text-white">{value}</span>} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-white/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <Globe className="mr-2 h-5 w-5 text-nexus-blue" />
                    <CardTitle className="text-lg">Top Routes</CardTitle>
                  </div>
                  <CardDescription>
                    Most frequently used shipping routes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={routeData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                          type="number" 
                          stroke="rgba(255,255,255,0.5)"
                          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                        />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          scale="band"
                          stroke="rgba(255,255,255,0.5)"
                          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                          width={150}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="shipments" 
                          fill="#0062FF" 
                          name="Number of Shipments"
                          radius={[0, 4, 4, 0]}
                        />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* AI Insights Section */}
          <div className="mt-8">
            <h2 className="mb-6 text-xl font-semibold text-white">AI-Powered Insights</h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-gradient-to-br from-background to-nexus-blue/20 border-white/10">
                <CardContent className="p-6">
                  <div className="mb-4 rounded-full bg-nexus-blue/20 p-2 w-fit">
                    <TrendingDown className="h-5 w-5 text-nexus-blue" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Cost Reduction Opportunity</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    AI analysis suggests consolidating shipments to Mumbai and Dubai could reduce costs by 15% next month.
                  </p>
                  <Button className="mt-4 w-full nexus-button-primary">View Details</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-background to-nexus-purple/20 border-white/10">
                <CardContent className="p-6">
                  <div className="mb-4 rounded-full bg-nexus-purple/20 p-2 w-fit">
                    <AlertTriangle className="h-5 w-5 text-nexus-purple" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Weather Disruption Forecast</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Potential weather disruptions detected on Asia-Pacific routes in the next 2 weeks. Consider alternate routing.
                  </p>
                  <Button className="mt-4 w-full nexus-button-secondary">View Alternatives</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-background to-nexus-teal/20 border-white/10">
                <CardContent className="p-6">
                  <div className="mb-4 rounded-full bg-nexus-teal/20 p-2 w-fit">
                    <Globe className="h-5 w-5 text-nexus-teal" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">New Route Recommendation</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Based on your shipping patterns, a new rail route through Central Asia could be 22% more efficient.
                  </p>
                  <Button className="mt-4 w-full nexus-button-accent">Explore Route</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
