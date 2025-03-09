import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import BookingForm from "@/components/dashboard/BookingForm";
import RouteMap from "@/components/dashboard/RouteMap";
import CostBreakdown from "@/components/dashboard/CostBreakdown";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Clock, Bookmark, History, Leaf, Route as RouteIcon, Share2 } from "lucide-react";
import { BookingHistoryList } from "@/components/bookings/BookingHistoryList";
import { ShipmentTemplates } from "@/components/bookings/ShipmentTemplates";
import { RecurringShipments } from "@/components/bookings/RecurringShipments";
import { EcoPointsCard } from "@/components/eco/EcoPointsCard";
import { EcoDashboard } from "@/components/eco/EcoDashboard";
import { useRouteAlert } from "@/components/alerts/RouteChangeAlertProvider";
import { toast } from "@/components/ui/use-toast";

const Bookings = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("new-booking");
  const [activeSubTab, setActiveSubTab] = useState<string>("booking");
  const { showRouteChangeAlert } = useRouteAlert();

  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const simulateRouteAlert = () => {
    showRouteChangeAlert({
      origin: "Shanghai, China",
      destination: "Rotterdam, Netherlands",
      originalRoute: "Sea → Truck",
      newRoute: "Air → Truck ",
      reason: "Severe storm warning in the Mediterranean Sea",
      costChange: "+$450",
      delay: "+1 day"
    });
  };

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
            
            <Tabs 
              defaultValue="new-booking" 
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-5 bg-white text-gray-700">
                <TabsTrigger value="new-booking" className="gap-2 data-[state=active]:bg-nexus-blue data-[state=active]:text-white">
                  <RouteIcon className="h-4 w-4" />
                  <span>New Booking</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-nexus-blue data-[state=active]:text-white">
                  <History className="h-4 w-4" />
                  <span>Booking History</span>
                </TabsTrigger>
                <TabsTrigger value="templates" className="gap-2 data-[state=active]:bg-nexus-blue data-[state=active]:text-white">
                  <Bookmark className="h-4 w-4" />
                  <span>Saved Templates</span>
                </TabsTrigger>
                <TabsTrigger value="recurring" className="gap-2 data-[state=active]:bg-nexus-blue data-[state=active]:text-white">
                  <Clock className="h-4 w-4" />
                  <span>Recurring Shipments</span>
                </TabsTrigger>
                <TabsTrigger value="eco" className="gap-2 data-[state=active]:bg-nexus-blue data-[state=active]:text-white">
                  <Leaf className="h-4 w-4" />
                  <span>Eco Dashboard</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="new-booking" className="space-y-6 pt-4">
                <Tabs
                  defaultValue="booking"
                  value={activeSubTab}
                  onValueChange={setActiveSubTab}
                  className="w-full"
                >
                  <TabsList className="w-auto mb-4 bg-white text-gray-700">
                    <TabsTrigger value="booking" className="text-sm data-[state=active]:bg-nexus-blue data-[state=active]:text-white">Single Booking</TabsTrigger>
                    <TabsTrigger value="multi-stop" className="text-sm data-[state=active]:bg-nexus-blue data-[state=active]:text-white">Multi-Stop</TabsTrigger>
                    <TabsTrigger value="shared" className="text-sm data-[state=active]:bg-nexus-blue data-[state=active]:text-white">
                      <Share2 className="h-3.5 w-3.5 mr-1" />
                      Ride-Sharing
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="booking" className="space-y-6">
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

                    <div className="nexus-card-blue p-6 animate-fade-in">
                      <h3 className="text-xl font-semibold text-white mb-4">Recommended Shipping Days</h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                          <h4 className="font-medium text-nexus-blue-light">Asia to Europe</h4>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Best Day:</span>
                              <span className="text-sm font-medium text-white">Tuesday</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Avoid:</span>
                              <span className="text-sm font-medium text-white">Friday</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Cost Saving:</span>
                              <span className="text-sm font-medium text-green-400">Up to 12%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                          <h4 className="font-medium text-nexus-blue-light">Americas to Asia</h4>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Best Day:</span>
                              <span className="text-sm font-medium text-white">Wednesday</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Avoid:</span>
                              <span className="text-sm font-medium text-white">Monday</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Cost Saving:</span>
                              <span className="text-sm font-medium text-green-400">Up to 8%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                          <h4 className="font-medium text-nexus-blue-light">Europe to Americas</h4>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Best Day:</span>
                              <span className="text-sm font-medium text-white">Thursday</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Avoid:</span>
                              <span className="text-sm font-medium text-white">Sunday</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Cost Saving:</span>
                              <span className="text-sm font-medium text-green-400">Up to 15%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="multi-stop" className="pt-4">
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 p-8">
                      <RouteIcon className="h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-xl font-semibold text-white">Multi-Stop Shipping</h3>
                      <p className="mt-2 text-center text-muted-foreground">
                        Plan complex routes with multiple pickup and delivery locations.
                      </p>
                      <Button 
                        className="mt-6"
                        onClick={() => setActiveSubTab("booking")}
                      >
                        Switch to Single Booking
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="shared" className="pt-4">
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 p-8">
                      <Share2 className="h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-xl font-semibold text-white">Shipment Ride-Sharing</h3>
                      <p className="mt-2 text-center text-muted-foreground">
                        Share transportation with others to reduce costs and environmental impact.
                      </p>
                      <Button 
                        className="mt-6"
                        onClick={() => setActiveSubTab("booking")}
                      >
                        Switch to Single Booking
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
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
              
              <TabsContent value="eco" className="space-y-6 pt-4">
                <EcoDashboard />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Bookings;
