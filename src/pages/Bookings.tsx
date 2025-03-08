
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import BookingForm from "@/components/dashboard/BookingForm";
import RouteMap from "@/components/dashboard/RouteMap";
import CostBreakdown from "@/components/dashboard/CostBreakdown";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Clock, Bookmark, History } from "lucide-react";
import { BookingHistoryList } from "@/components/bookings/BookingHistoryList";
import { ShipmentTemplates } from "@/components/bookings/ShipmentTemplates";
import { RecurringShipments } from "@/components/bookings/RecurringShipments";
import { EcoPointsCard } from "@/components/eco/EcoPointsCard";
import { useRouteAlert } from "@/components/alerts/RouteChangeAlertProvider";
import { toast } from "@/components/ui/use-toast";

const Bookings = () => {
  const [activeTab, setActiveTab] = useState<string>("new-booking");
  const { showRouteChangeAlert } = useRouteAlert();

  // Function to simulate a route change alert
  const simulateRouteAlert = () => {
    showRouteChangeAlert({
      origin: "Shanghai, China",
      destination: "Rotterdam, Netherlands",
      originalRoute: "Sea → Truck",
      newRoute: "Sea → Air",
      reason: "Severe storm warning in the Mediterranean Sea",
      costChange: "+$450",
      delay: "+1 day"
    });
  };

  // Simulated available templates for demonstration
  const hasTemplates = true;
  const hasRecurringShipments = true;
  const hasBookingHistory = true;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-6">
            <div className="animate-fade-in flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white [animation-delay:100ms]">
                  Bookings
                </h1>
                <p className="mt-2 text-muted-foreground [animation-delay:200ms]">
                  Create bookings, manage templates, and track your shipments
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="gap-2" onClick={simulateRouteAlert}>
                  <History className="h-4 w-4" />
                  Simulate Alert
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
            
            {/* Tabs for different booking features */}
            <Tabs 
              defaultValue="new-booking" 
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-4 bg-muted/20">
                <TabsTrigger value="new-booking" className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span>New Booking</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2">
                  <History className="h-4 w-4" />
                  <span>Booking History</span>
                </TabsTrigger>
                <TabsTrigger value="templates" className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span>Saved Templates</span>
                </TabsTrigger>
                <TabsTrigger value="recurring" className="gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Recurring Shipments</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="new-booking" className="space-y-6 pt-4">
                <div className="grid gap-6">
                  <div className="animate-fade-in [animation-delay:700ms]">
                    <BookingForm />
                  </div>
                  
                  <div className="animate-fade-in [animation-delay:800ms]">
                    <RouteMap />
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <CostBreakdown className="animate-fade-in [animation-delay:900ms]" />
                    <EcoPointsCard />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-6 pt-4">
                {hasBookingHistory ? (
                  <BookingHistoryList />
                ) : (
                  <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 p-8">
                    <History className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-xl font-semibold text-white">No Booking History</h3>
                    <p className="mt-2 text-center text-muted-foreground">
                      You haven't made any bookings yet. Create your first booking to see it here.
                    </p>
                    <Button 
                      className="mt-6"
                      onClick={() => setActiveTab("new-booking")}
                    >
                      Create a Booking
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="templates" className="space-y-6 pt-4">
                {hasTemplates ? (
                  <ShipmentTemplates />
                ) : (
                  <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 p-8">
                    <Bookmark className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-xl font-semibold text-white">No Saved Templates</h3>
                    <p className="mt-2 text-center text-muted-foreground">
                      You haven't saved any booking templates yet. Save templates to quickly reuse shipment details.
                    </p>
                    <Button 
                      className="mt-6"
                      onClick={() => setActiveTab("new-booking")}
                    >
                      Create a Template
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="recurring" className="space-y-6 pt-4">
                {hasRecurringShipments ? (
                  <RecurringShipments />
                ) : (
                  <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 p-8">
                    <Clock className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-xl font-semibold text-white">No Recurring Shipments</h3>
                    <p className="mt-2 text-center text-muted-foreground">
                      You haven't set up any recurring shipments. Configure recurring shipments for regular deliveries.
                    </p>
                    <Button 
                      className="mt-6"
                      onClick={() => setActiveTab("new-booking")}
                    >
                      Set Up Recurring Shipment
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Bookings;
