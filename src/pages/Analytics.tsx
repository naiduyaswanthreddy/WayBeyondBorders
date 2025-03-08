
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  AlertTriangle,
  BarChart,
  LineChart,
  PieChart,
  Download,
  Lightbulb,
  ArrowRight
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
  const performanceData = {
    week: [
      { name: "Mon", shipments: 12, onTime: 11, delay: 1 },
      { name: "Tue", shipments: 18, onTime: 17, delay: 1 },
      { name: "Wed", shipments: 15, onTime: 14, delay: 1 },
      { name: "Thu", shipments: 22, onTime: 20, delay: 2 },
      { name: "Fri", shipments: 28, onTime: 26, delay: 2 },
      { name: "Sat", shipments: 16, onTime: 15, delay: 1 },
      { name: "Sun", shipments: 8, onTime: 8, delay: 0 },
    ],
    month: [
      { name: "Week 1", shipments: 32, onTime: 28, delay: 4 },
      { name: "Week 2", shipments: 40, onTime: 36, delay: 4 },
      { name: "Week 3", shipments: 45, onTime: 42, delay: 3 },
      { name: "Week 4", shipments: 55, onTime: 52, delay: 3 },
    ],
    quarter: [
      { name: "Jan", shipments: 120, onTime: 108, delay: 12 },
      { name: "Feb", shipments: 135, onTime: 125, delay: 10 },
      { name: "Mar", shipments: 150, onTime: 140, delay: 10 },
    ],
    year: [
      { name: "Q1", shipments: 405, onTime: 373, delay: 32 },
      { name: "Q2", shipments: 520, onTime: 488, delay: 32 },
      { name: "Q3", shipments: 480, onTime: 456, delay: 24 },
      { name: "Q4", shipments: 550, onTime: 528, delay: 22 },
    ]
  };

  const costData = {
    week: [
      { name: "Mon", actual: 1200, optimized: 1050 },
      { name: "Tue", actual: 1400, optimized: 1200 },
      { name: "Wed", actual: 1300, optimized: 1100 },
      { name: "Thu", actual: 1600, optimized: 1350 },
      { name: "Fri", actual: 1800, optimized: 1500 },
      { name: "Sat", actual: 1200, optimized: 1000 },
      { name: "Sun", actual: 800, optimized: 700 },
    ],
    month: [
      { name: "Week 1", actual: 4200, optimized: 3800 },
      { name: "Week 2", actual: 4500, optimized: 4000 },
      { name: "Week 3", actual: 4800, optimized: 4200 },
      { name: "Week 4", actual: 5100, optimized: 4400 },
    ],
    quarter: [
      { name: "Jan", actual: 18000, optimized: 15500 },
      { name: "Feb", actual: 19500, optimized: 16800 },
      { name: "Mar", actual: 21000, optimized: 18000 },
    ],
    year: [
      { name: "Q1", actual: 58500, optimized: 50300 },
      { name: "Q2", actual: 65000, optimized: 56000 },
      { name: "Q3", actual: 61000, optimized: 53000 },
      { name: "Q4", actual: 70000, optimized: 61000 },
    ]
  };

  const transportModeData = {
    week: [
      { name: "Sea", value: 42 },
      { name: "Air", value: 35 },
      { name: "Rail", value: 13 },
      { name: "Road", value: 10 },
    ],
    month: [
      { name: "Sea", value: 45 },
      { name: "Air", value: 30 },
      { name: "Rail", value: 15 },
      { name: "Road", value: 10 },
    ],
    quarter: [
      { name: "Sea", value: 48 },
      { name: "Air", value: 27 },
      { name: "Rail", value: 15 },
      { name: "Road", value: 10 },
    ],
    year: [
      { name: "Sea", value: 50 },
      { name: "Air", value: 25 },
      { name: "Rail", value: 15 },
      { name: "Road", value: 10 },
    ]
  };

  const routeData = {
    week: [
      { name: "Asia - Europe", shipments: 15 },
      { name: "Asia - North America", shipments: 12 },
      { name: "Europe - North America", shipments: 8 },
      { name: "Intra-Asia", shipments: 6 },
      { name: "Africa - Europe", shipments: 4 },
      { name: "South America - North America", shipments: 3 },
    ],
    month: [
      { name: "Asia - Europe", shipments: 42 },
      { name: "Asia - North America", shipments: 28 },
      { name: "Europe - North America", shipments: 18 },
      { name: "Intra-Asia", shipments: 12 },
      { name: "Africa - Europe", shipments: 8 },
      { name: "South America - North America", shipments: 7 },
    ],
    quarter: [
      { name: "Asia - Europe", shipments: 125 },
      { name: "Asia - North America", shipments: 95 },
      { name: "Europe - North America", shipments: 65 },
      { name: "Intra-Asia", shipments: 45 },
      { name: "Africa - Europe", shipments: 30 },
      { name: "South America - North America", shipments: 25 },
    ],
    year: [
      { name: "Asia - Europe", shipments: 520 },
      { name: "Asia - North America", shipments: 380 },
      { name: "Europe - North America", shipments: 260 },
      { name: "Intra-Asia", shipments: 180 },
      { name: "Africa - Europe", shipments: 120 },
      { name: "South America - North America", shipments: 100 },
    ]
  };

  const COLORS = ["#0062FF", "#6E36E5", "#00CFD5", "#F43F5E", "#F59E0B", "#10B981"];

  const activeData = {
    performanceData: performanceData[dateRange as keyof typeof performanceData],
    costData: costData[dateRange as keyof typeof costData],
    transportModeData: transportModeData[dateRange as keyof typeof transportModeData],
    routeData: routeData[dateRange as keyof typeof routeData]
  };

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
              Analytics
            </h1>
            <p className="mt-2 text-muted-foreground">
              Explore shipping patterns and optimize your logistics with AI-powered insights
            </p>
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
                        data={activeData.performanceData}
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
                        data={activeData.costData}
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
                          data={activeData.transportModeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {activeData.transportModeData.map((entry, index) => (
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
                        data={activeData.routeData}
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
          
          {/* AI Insights Section - Improved with better predictions */}
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
                    AI analysis shows you could save 18% on Shanghai-Hamburg routes by switching to rail for the middle segment. Estimated savings: $12,450 over the next quarter.
                  </p>
                  <div className="mt-4 rounded-lg bg-white/5 p-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-nexus-blue" />
                      <h4 className="text-sm font-medium text-white">AI Recommendation</h4>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Schedule bulk shipments during off-peak season (Aug-Oct) to leverage better rates. This pattern alone saved similar customers 22% last year.
                    </p>
                  </div>
                  <Button className="mt-4 w-full nexus-button-primary gap-2">
                    View Details 
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-background to-nexus-purple/20 border-white/10">
                <CardContent className="p-6">
                  <div className="mb-4 rounded-full bg-nexus-purple/20 p-2 w-fit">
                    <AlertTriangle className="h-5 w-5 text-nexus-purple" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Weather Disruption Forecast</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Severe typhoon warning detected in South China Sea for June 12-18. This will impact 16 of your scheduled shipments with potential delays of 4-7 days.
                  </p>
                  <div className="mt-4 rounded-lg bg-white/5 p-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-nexus-purple" />
                      <h4 className="text-sm font-medium text-white">AI Recommendation</h4>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Reroute through Taiwan Strait earlier than planned to avoid 89% of projected delays. Cost impact: +8% but avoiding 5-day delays.
                    </p>
                  </div>
                  <Button className="mt-4 w-full nexus-button-secondary gap-2">
                    View Alternatives 
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-background to-nexus-teal/20 border-white/10">
                <CardContent className="p-6">
                  <div className="mb-4 rounded-full bg-nexus-teal/20 p-2 w-fit">
                    <Globe className="h-5 w-5 text-nexus-teal" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">New Route Opportunity</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    A new rail route through Kazakhstan is opening next month. For your India-Europe shipments, this will reduce transit time by 35% and costs by 18% compared to sea routes.
                  </p>
                  <div className="mt-4 rounded-lg bg-white/5 p-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-nexus-teal" />
                      <h4 className="text-sm font-medium text-white">AI Recommendation</h4>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Lock in capacity now at introductory rates - historical data shows new route prices increase by 25% after the first 3 months of operation.
                    </p>
                  </div>
                  <Button className="mt-4 w-full nexus-button-accent gap-2">
                    Explore Route 
                    <ArrowRight className="h-4 w-4" />
                  </Button>
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
