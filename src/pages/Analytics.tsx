import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { toast } from "@/components/ui/use-toast";
import { useEcoPoints } from "@/context/EcoPointsContext";
import CostSavingsAnalytics from "@/components/analytics/CostSavingsAnalytics";
import SustainabilityAnalytics from "@/components/analytics/SustainabilityAnalytics";
import AIPredictionsAlerts from "@/components/analytics/AIPredictionsAlerts";
import AnalyticsTimeRangeFilter from "@/components/analytics/AnalyticsTimeRangeFilter";

const Analytics = () => {
  const [dateRange, setDateRange] = useState("month");
  const { points } = useEcoPoints();
  const [dataLoaded, setDataLoaded] = useState(false);

  // Disable sidebar when this component mounts
  useEffect(() => {
    // Find the sidebar element and hide it
    const sidebar = document.querySelector('[data-testid="sidebar"]');
    if (sidebar) {
      sidebar.setAttribute('style', 'display: none');
      
      // Restore the sidebar when unmounting
      return () => {
        if (sidebar) {
          sidebar.removeAttribute('style');
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

  // Section 2: Sustainability & Eco-Friendly Impact
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

  // Section 3: AI-Powered Predictions & Alerts
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

  const activeData = {
    costTrendData: costTrendData[dateRange as keyof typeof costTrendData],
    routeComparisonData: routeComparisonData[dateRange as keyof typeof routeComparisonData],
    bulkSavingsData: bulkSavingsData[dateRange as keyof typeof bulkSavingsData],
    ecoImpactData: ecoImpactData[dateRange as keyof typeof ecoImpactData],
    ecoPointsData: ecoPointsData[dateRange as keyof typeof ecoPointsData]
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
          <AnalyticsTimeRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
          
          {/* Loading State */}
          {!dataLoaded ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-nexus-blue"></div>
              <p className="mt-4 text-muted-foreground">Loading analytics data...</p>
            </div>
          ) : (
            <>
              {/* Section 1: Cost & Savings Analytics */}
              <CostSavingsAnalytics activeData={activeData} dateRange={dateRange} />
              
              {/* Section 2: Sustainability & Eco-Friendly Impact */}
              <SustainabilityAnalytics activeData={activeData} points={points} />
              
              {/* Section 3: AI-Powered Predictions & Alerts (without recommended shipping days) */}
              <AIPredictionsAlerts 
                predictionData={predictionData} 
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Analytics;
