
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import BookingForm from "@/components/dashboard/BookingForm";
import RouteMap from "@/components/dashboard/RouteMap";
import CostBreakdown from "@/components/dashboard/CostBreakdown";
import CargoClassification from "@/components/dashboard/CargoClassification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Truck, 
  Clock, 
  AlertTriangle,
  BarChart,
  RefreshCw,
  ChevronRight,
  ArrowRight
} from "lucide-react";

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
                  Command Center
                </h1>
                <p className="mt-2 text-muted-foreground [animation-delay:200ms]">
                  Monitor shipments, optimize routes, and manage logistics operations with AI-powered insights.
                </p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  Last Updated: 2 mins ago
                </Button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="bg-card border-white/10 hover:border-white/20 transition-colors animate-fade-in [animation-delay:300ms]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Shipments</p>
                      <h3 className="mt-1 text-2xl font-bold text-white">24</h3>
                    </div>
                    <div className="rounded-full bg-nexus-blue/20 p-2">
                      <Package className="h-5 w-5 text-nexus-blue" />
                    </div>
                  </div>
                  <div className="mt-1 flex items-center text-xs text-green-400">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    <span>+3 since yesterday</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-white/10 hover:border-white/20 transition-colors animate-fade-in [animation-delay:400ms]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">In Transit</p>
                      <h3 className="mt-1 text-2xl font-bold text-white">18</h3>
                    </div>
                    <div className="rounded-full bg-nexus-purple/20 p-2">
                      <Truck className="h-5 w-5 text-nexus-purple" />
                    </div>
                  </div>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <span>12 by sea, 6 by air</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-white/10 hover:border-white/20 transition-colors animate-fade-in [animation-delay:500ms]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Arriving Today</p>
                      <h3 className="mt-1 text-2xl font-bold text-white">6</h3>
                    </div>
                    <div className="rounded-full bg-nexus-teal/20 p-2">
                      <Clock className="h-5 w-5 text-nexus-teal" />
                    </div>
                  </div>
                  <div className="mt-1 flex items-center text-xs text-green-400">
                    <span>All on schedule</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-white/10 hover:border-white/20 transition-colors animate-fade-in [animation-delay:600ms]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Alerts</p>
                      <h3 className="mt-1 text-2xl font-bold text-white">2</h3>
                    </div>
                    <div className="rounded-full bg-red-500/20 p-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                  </div>
                  <div className="mt-1 flex items-center text-xs text-yellow-400">
                    <span>Weather delays (Shanghai)</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <BookingForm className="animate-fade-in [animation-delay:700ms]" />
              <RouteMap className="animate-fade-in [animation-delay:800ms]" />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <CostBreakdown className="animate-fade-in [animation-delay:900ms]" />
              <CargoClassification className="animate-fade-in [animation-delay:1000ms]" />
            </div>
            
            {/* Recent Shipments */}
            <div className="animate-fade-in [animation-delay:1100ms]">
              <Card className="bg-card border-white/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-semibold text-white">Recent Shipments</CardTitle>
                  <Button variant="link" className="gap-1 p-0 text-nexus-blue hover:text-nexus-blue/80">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-x-auto rounded-md">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-white/10 text-xs uppercase text-muted-foreground">
                        <tr>
                          <th scope="col" className="px-6 py-3">ID</th>
                          <th scope="col" className="px-6 py-3">Route</th>
                          <th scope="col" className="px-6 py-3">Cargo</th>
                          <th scope="col" className="px-6 py-3">Status</th>
                          <th scope="col" className="px-6 py-3">ETA</th>
                          <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { 
                            id: "WBB-1234", 
                            route: "Shanghai → Rotterdam", 
                            cargo: "Electronics", 
                            status: "In Transit", 
                            eta: "Jun 15, 2023",
                            statusColor: "text-nexus-blue bg-nexus-blue/10" 
                          },
                          { 
                            id: "WBB-1235", 
                            route: "Los Angeles → Sydney", 
                            cargo: "Machinery", 
                            status: "Customs", 
                            eta: "Jun 12, 2023",
                            statusColor: "text-yellow-500 bg-yellow-500/10" 
                          },
                          { 
                            id: "WBB-1236", 
                            route: "Dubai → Mumbai", 
                            cargo: "Textiles", 
                            status: "Delivered", 
                            eta: "Jun 8, 2023",
                            statusColor: "text-green-500 bg-green-500/10" 
                          },
                          { 
                            id: "WBB-1237", 
                            route: "Hamburg → New York", 
                            cargo: "Chemicals", 
                            status: "Delayed", 
                            eta: "Jun 20, 2023",
                            statusColor: "text-red-500 bg-red-500/10" 
                          },
                        ].map((shipment, index) => (
                          <tr key={index} className="border-b border-white/5 bg-transparent hover:bg-white/5">
                            <td className="px-6 py-4 font-medium text-white">{shipment.id}</td>
                            <td className="px-6 py-4">{shipment.route}</td>
                            <td className="px-6 py-4">{shipment.cargo}</td>
                            <td className="px-6 py-4">
                              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${shipment.statusColor}`}>
                                {shipment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">{shipment.eta}</td>
                            <td className="px-6 py-4">
                              <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                                Details
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
