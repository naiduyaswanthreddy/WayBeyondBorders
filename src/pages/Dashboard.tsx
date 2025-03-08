
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import BookingForm from "@/components/dashboard/BookingForm";
import RouteMap from "@/components/dashboard/RouteMap";
import CostBreakdown from "@/components/dashboard/CostBreakdown";
import CargoClassification from "@/components/dashboard/CargoClassification";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="pt-16 pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-6">
            <div className="animate-fade-in flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white [animation-delay:100ms]">
                  Dashboard
                </h1>
                <p className="mt-2 text-muted-foreground [animation-delay:200ms]">
                  Create bookings and optimize routes with AI-powered insights.
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
            
            {/* Combined Booking and Route Selection */}
            <div className="grid gap-6">
              <div className="animate-fade-in [animation-delay:700ms]">
                <BookingForm />
              </div>
              
              <div className="animate-fade-in [animation-delay:800ms]">
                <RouteMap />
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <CostBreakdown className="animate-fade-in [animation-delay:900ms]" />
                <CargoClassification className="animate-fade-in [animation-delay:1000ms]" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
