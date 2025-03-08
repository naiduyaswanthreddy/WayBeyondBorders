
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
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
  ArrowRight,
  Leaf,
  DollarSign,
  Truck,
  Package,
  Calendar,
  Zap,
  CloudLightning,
  Ship,
  Plane
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
  Legend,
  Area,
  AreaChart,
  ComposedChart
} from "recharts";
import { toast } from "@/components/ui/use-toast";
import { useEcoPoints } from "@/context/EcoPointsContext";

const Analytics = () => {
  const [dateRange, setDateRange] = useState("month");
  const { points } = useEcoPoints();
  const [dataLoaded, setDataLoaded] = useState(false);

  // Disable sidebar when this component mounts
  useEffect(() => {
    // Find the sidebar element and hide it
    const sidebar = document.querySelector('[data-testid="sidebar"]');
    if (sidebar) {
      const originalDisplay = sidebar.style.display;
      sidebar.style.display = 'none';
      
      // Restore the sidebar when unmounting
      return () => {
        if (sidebar) {
          sidebar.style.display = originalDisplay;
        }
      };
    }
  }, []);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setDataLoaded(true);
      toast({
        title: "Analytics Updated",
        description: "Latest data has been loaded for your review",
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [dateRange]);

  // Sample data for charts - Section 1: Cost & Savings Analytics
  const costTrendData = {
    week: [
      { date: "Mon", actual: 4250, optimized: 3800 },
      { date: "Tue", actual: 3950, optimized: 3600 },
      { date: "Wed", actual: 4100, optimized: 3750 },
      { date: "Thu", actual: 4300, optimized: 3900 },
      { date: "Fri", actual: 4450, optimized: 4000 },
      { date: "Sat", actual: 3800, optimized: 3500 },
      { date: "Sun", actual: 3600, optimized: 3300 },
    ],
    month: [
      { date: "Week 1", actual: 28500, optimized: 25800 },
      { date: "Week 2", actual: 30200, optimized: 27500 },
      { date: "Week 3", actual: 29800, optimized: 27000 },
      { date: "Week 4", actual: 31500, optimized: 28600 },
    ],
    quarter: [
      { date: "Jan", actual: 120000, optimized: 108000 },
      { date: "Feb", actual: 115000, optimized: 104500 },
      { date: "Mar", actual: 125000, optimized: 112500 },
    ],
    year: [
      { date: "Q1", actual: 360000, optimized: 325000 },
      { date: "Q2", actual: 385000, optimized: 350000 },
      { date: "Q3", actual: 410000, optimized: 372000 },
      { date: "Q4", actual: 430000, optimized: 390000 },
    ]
  };

  const routeComparisonData = {
    week: [
      { name: "Fastest", cost: 4250, time: 3.4, co2: 2.4 },
      { name: "Economical", cost: 2780, time: 6.5, co2: 1.8 },
      { name: "Reliable", cost: 3950, time: 4.3, co2: 2.1 },
      { name: "Eco-Friendly", cost: 3450, time: 5.2, co2: 0.9 },
    ],
    month: [
      { name: "Fastest", cost: 4150, time: 3.2, co2: 2.3 },
      { name: "Economical", cost: 2680, time: 6.2, co2: 1.7 },
      { name: "Reliable", cost: 3850, time: 4.1, co2: 2.0 },
      { name: "Eco-Friendly", cost: 3350, time: 5.0, co2: 0.85 },
    ],
    quarter: [
      { name: "Fastest", cost: 4050, time: 3.1, co2: 2.2 },
      { name: "Economical", cost: 2580, time: 6.0, co2: 1.6 },
      { name: "Reliable", cost: 3750, time: 3.9, co2: 1.9 },
      { name: "Eco-Friendly", cost: 3250, time: 4.8, co2: 0.8 },
    ],
    year: [
      { name: "Fastest", cost: 3950, time: 3.0, co2: 2.1 },
      { name: "Economical", cost: 2480, time: 5.8, co2: 1.5 },
      { name: "Reliable", cost: 3650, time: 3.7, co2: 1.8 },
      { name: "Eco-Friendly", cost: 3150, time: 4.6, co2: 0.75 },
    ]
  };

  const bulkSavingsData = {
    week: [
      { category: "Single Shipments", cost: 4250, quantity: 15 },
      { category: "Bulk Shipments", cost: 2950, quantity: 45 },
      { category: "Ride Sharing", cost: 3100, quantity: 30 },
    ],
    month: [
      { category: "Single Shipments", cost: 16500, quantity: 60 },
      { category: "Bulk Shipments", cost: 11500, quantity: 180 },
      { category: "Ride Sharing", cost: 12000, quantity: 120 },
    ],
    quarter: [
      { category: "Single Shipments", cost: 48000, quantity: 180 },
      { category: "Bulk Shipments", cost: 32000, quantity: 540 },
      { category: "Ride Sharing", cost: 35000, quantity: 360 },
    ],
    year: [
      { category: "Single Shipments", cost: 185000, quantity: 720 },
      { category: "Bulk Shipments", cost: 120000, quantity: 2160 },
      { category: "Ride Sharing", cost: 135000, quantity: 1440 },
    ]
  };

  // Section 2: Shipment Volume & Route Performance
  const shipmentVolumeData = {
    week: [
      { date: "Mon", shipments: 12 },
      { date: "Tue", shipments: 18 },
      { date: "Wed", shipments: 15 },
      { date: "Thu", shipments: 22 },
      { date: "Fri", shipments: 28 },
      { date: "Sat", shipments: 16 },
      { date: "Sun", shipments: 8 },
    ],
    month: [
      { date: "Week 1", shipments: 119 },
      { date: "Week 2", shipments: 135 },
      { date: "Week 3", shipments: 142 },
      { date: "Week 4", shipments: 156 },
    ],
    quarter: [
      { date: "Jan", shipments: 552 },
      { date: "Feb", shipments: 580 },
      { date: "Mar", shipments: 615 },
    ],
    year: [
      { date: "Q1", shipments: 1747 },
      { date: "Q2", shipments: 1890 },
      { date: "Q3", shipments: 2050 },
      { date: "Q4", shipments: 2215 },
    ]
  };

  const topRoutesData = {
    week: [
      { route: "Shanghai - Rotterdam", shipments: 25, onTime: 22, delay: 3 },
      { route: "Singapore - Los Angeles", shipments: 18, onTime: 16, delay: 2 },
      { route: "Dubai - Hamburg", shipments: 15, onTime: 14, delay: 1 },
      { route: "New York - London", shipments: 12, onTime: 11, delay: 1 },
      { route: "Hong Kong - Sydney", shipments: 10, onTime: 9, delay: 1 },
    ],
    month: [
      { route: "Shanghai - Rotterdam", shipments: 95, onTime: 85, delay: 10 },
      { route: "Singapore - Los Angeles", shipments: 72, onTime: 65, delay: 7 },
      { route: "Dubai - Hamburg", shipments: 60, onTime: 55, delay: 5 },
      { route: "New York - London", shipments: 48, onTime: 44, delay: 4 },
      { route: "Hong Kong - Sydney", shipments: 40, onTime: 36, delay: 4 },
    ],
    quarter: [
      { route: "Shanghai - Rotterdam", shipments: 285, onTime: 255, delay: 30 },
      { route: "Singapore - Los Angeles", shipments: 216, onTime: 195, delay: 21 },
      { route: "Dubai - Hamburg", shipments: 180, onTime: 165, delay: 15 },
      { route: "New York - London", shipments: 144, onTime: 132, delay: 12 },
      { route: "Hong Kong - Sydney", shipments: 120, onTime: 108, delay: 12 },
    ],
    year: [
      { route: "Shanghai - Rotterdam", shipments: 1140, onTime: 1020, delay: 120 },
      { route: "Singapore - Los Angeles", shipments: 864, onTime: 780, delay: 84 },
      { route: "Dubai - Hamburg", shipments: 720, onTime: 660, delay: 60 },
      { route: "New York - London", shipments: 576, onTime: 528, delay: 48 },
      { route: "Hong Kong - Sydney", shipments: 480, onTime: 432, delay: 48 },
    ]
  };

  const transportModeData = {
    week: [
      { name: "Sea", value: 45 },
      { name: "Air", value: 30 },
      { name: "Road", value: 25 },
    ],
    month: [
      { name: "Sea", value: 48 },
      { name: "Air", value: 28 },
      { name: "Road", value: 24 },
    ],
    quarter: [
      { name: "Sea", value: 50 },
      { name: "Air", value: 27 },
      { name: "Road", value: 23 },
    ],
    year: [
      { name: "Sea", value: 52 },
      { name: "Air", value: 26 },
      { name: "Road", value: 22 },
    ]
  };

  // Section 3: Sustainability & Eco-Friendly Impact
  const ecoImpactData = {
    week: [
      { date: "Mon", standardCO2: 2.4, ecoCO2: 0.9, saved: 1.5 },
      { date: "Tue", standardCO2: 2.6, ecoCO2: 1.0, saved: 1.6 },
      { date: "Wed", standardCO2: 2.3, ecoCO2: 0.8, saved: 1.5 },
      { date: "Thu", standardCO2: 2.7, ecoCO2: 1.1, saved: 1.6 },
      { date: "Fri", standardCO2: 2.8, ecoCO2: 1.2, saved: 1.6 },
      { date: "Sat", standardCO2: 2.0, ecoCO2: 0.7, saved: 1.3 },
      { date: "Sun", standardCO2: 1.8, ecoCO2: 0.6, saved: 1.2 },
    ],
    month: [
      { date: "Week 1", standardCO2: 16.6, ecoCO2: 6.3, saved: 10.3 },
      { date: "Week 2", standardCO2: 17.5, ecoCO2: 6.8, saved: 10.7 },
      { date: "Week 3", standardCO2: 18.2, ecoCO2: 7.1, saved: 11.1 },
      { date: "Week 4", standardCO2: 19.0, ecoCO2: 7.4, saved: 11.6 },
    ],
    quarter: [
      { date: "Jan", standardCO2: 71.3, ecoCO2: 27.6, saved: 43.7 },
      { date: "Feb", standardCO2: 74.5, ecoCO2: 29.2, saved: 45.3 },
      { date: "Mar", standardCO2: 78.2, ecoCO2: 30.5, saved: 47.7 },
    ],
    year: [
      { date: "Q1", standardCO2: 224.0, ecoCO2: 87.3, saved: 136.7 },
      { date: "Q2", standardCO2: 238.5, ecoCO2: 93.5, saved: 145.0 },
      { date: "Q3", standardCO2: 250.8, ecoCO2: 98.2, saved: 152.6 },
      { date: "Q4", standardCO2: 265.2, ecoCO2: 103.8, saved: 161.4 },
    ]
  };

  const ecoPointsData = {
    week: [
      { date: "Mon", earned: 28, redeemed: 0 },
      { date: "Tue", earned: 35, redeemed: 0 },
      { date: "Wed", earned: 25, redeemed: 40 },
      { date: "Thu", earned: 42, redeemed: 0 },
      { date: "Fri", earned: 38, redeemed: 0 },
      { date: "Sat", earned: 20, redeemed: 0 },
      { date: "Sun", earned: 15, redeemed: 0 },
    ],
    month: [
      { date: "Week 1", earned: 203, redeemed: 40 },
      { date: "Week 2", earned: 215, redeemed: 80 },
      { date: "Week 3", earned: 230, redeemed: 60 },
      { date: "Week 4", earned: 245, redeemed: 120 },
    ],
    quarter: [
      { date: "Jan", earned: 893, redeemed: 300 },
      { date: "Feb", earned: 945, redeemed: 350 },
      { date: "Mar", earned: 1020, redeemed: 400 },
    ],
    year: [
      { date: "Q1", earned: 2858, redeemed: 1050 },
      { date: "Q2", earned: 3125, redeemed: 1250 },
      { date: "Q3", earned: 3420, redeemed: 1450 },
      { date: "Q4", earned: 3750, redeemed: 1650 },
    ]
  };

  // Section 4: AI-Powered Predictions & Alerts
  const predictionData = [
    {
      id: "delay-forecast",
      title: "Upcoming Congestion Alert",
      description: "Heavy port congestion expected at Singapore from June 15-20 due to seasonal volume increase. This will affect 8 of your upcoming shipments.",
      impact: "high",
      recommendation: "Consider rerouting through Port Klang for shipments during this period, which will add 1 day to transit time but avoid 3-5 day delays."
    },
    {
      id: "customs-alert",
      title: "Customs Processing Delay Warning",
      description: "Recent policy changes at Hamburg customs are causing 72-hour processing delays for non-EU shipments through July 15.",
      impact: "medium",
      recommendation: "Pre-file documentation 5 days in advance instead of the usual 3 days to avoid warehouse storage fees."
    },
    {
      id: "cost-opportunity",
      title: "Seasonal Discount Opportunity",
      description: "Air freight rates from Hong Kong to Los Angeles are predicted to drop by 15% in August based on historical trends.",
      impact: "low",
      recommendation: "Consider shifting non-urgent large shipments to August to benefit from lower rates."
    }
  ];

  const bestShippingDays = {
    sea: ["Tuesday", "Wednesday"],
    air: ["Monday", "Thursday"],
    road: ["Wednesday", "Friday"]
  };

  const activeData = {
    costTrendData: costTrendData[dateRange as keyof typeof costTrendData],
    routeComparisonData: routeComparisonData[dateRange as keyof typeof routeComparisonData],
    bulkSavingsData: bulkSavingsData[dateRange as keyof typeof bulkSavingsData],
    shipmentVolumeData: shipmentVolumeData[dateRange as keyof typeof shipmentVolumeData],
    topRoutesData: topRoutesData[dateRange as keyof typeof topRoutesData],
    transportModeData: transportModeData[dateRange as keyof typeof transportModeData],
    ecoImpactData: ecoImpactData[dateRange as keyof typeof ecoImpactData],
    ecoPointsData: ecoPointsData[dateRange as keyof typeof ecoPointsData]
  };

  const COLORS = ["#0062FF", "#6E36E5", "#00CFD5", "#10B981", "#F59E0B", "#F43F5E"];
  const ROUTE_COLORS = {
    "Shanghai - Rotterdam": "#0062FF",
    "Singapore - Los Angeles": "#6E36E5",
    "Dubai - Hamburg": "#00CFD5",
    "New York - London": "#10B981",
    "Hong Kong - Sydney": "#F59E0B"
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border border-white/10 bg-black/80 p-3 shadow-md backdrop-blur-sm">
          <p className="text-xs font-medium text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
              {entry.name.includes("Cost") || entry.name === "cost" ? " $" : ""}
              {entry.name.includes("CO2") || entry.name === "co2" ? " tons" : ""}
              {entry.name.includes("Time") || entry.name === "time" ? " days" : ""}
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
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Analytics Dashboard
            </h1>
            <p className="mt-2 text-muted-foreground">
              Explore shipping patterns and optimize your logistics with AI-powered insights
            </p>
          </div>
          
          {/* Time Range Filter */}
          <div className="mb-6 flex items-center justify-between">
            <div></div>
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
          
          {/* Loading State */}
          {!dataLoaded ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-nexus-blue"></div>
              <p className="mt-4 text-muted-foreground">Loading analytics data...</p>
            </div>
          ) : (
            <>
              {/* Section 1: Cost & Savings Analytics */}
              <div className="mb-8">
                <div className="mb-6">
                  <h2 className="flex items-center text-xl font-semibold text-white">
                    <DollarSign className="mr-2 h-5 w-5 text-nexus-purple" />
                    Cost & Savings Analytics
                  </h2>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
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
                  
                  {/* Route Type Comparison */}
                  <Card className="bg-card border-white/10">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <BarChart className="mr-2 h-5 w-5 text-nexus-purple" />
                        <CardTitle className="text-lg">Route Type Comparison</CardTitle>
                      </div>
                      <CardDescription>
                        Cost, time and emissions by route type
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
                          <BarChart
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
                          </BarChart>
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
                  
                  {/* Total Cost Breakdown */}
                  <Card className="bg-card border-white/10">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <PieChart className="mr-2 h-5 w-5 text-nexus-blue" />
                        <CardTitle className="text-lg">Cost Breakdown by Transport Mode</CardTitle>
                      </div>
                      <CardDescription>
                        Distribution of shipping costs
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
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
                              {activeData.transportModeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend formatter={(value) => <span className="text-xs text-white">{value}</span>} />
                          </PieChart>
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
                </div>
              </div>
              
              {/* Section 2: Shipment Volume & Route Performance */}
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
                        Total shipments over {dateRange === 'week' ? '7 days' : dateRange === 'month' ? '30 days' : dateRange === 'quarter' ? '90 days' : '365 days'}
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
                          <BarChart
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
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="mt-4">
                        <div className="rounded-md bg-white/5 p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">Route Reliability</span>
                            <span className="text-sm font-medium text-white">On-Time %</span>
                          </div>
                          <div className="mt-2 space-y-2">
                            {activeData.topRoutesData.map((route, idx) => (
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
              
              {/* Section 3: Sustainability & Eco-Friendly Impact */}
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
              
              {/* Section 4: AI-Powered Predictions & Alerts */}
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
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Analytics;
