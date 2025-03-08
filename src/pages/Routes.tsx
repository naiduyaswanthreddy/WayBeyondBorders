
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock, Download, DollarSign, MapPin, Package, Shield, Truck, Wind, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface RouteDetails {
  id: string;
  name: string;
  duration: string;
  cost: string;
  co2: string;
  modes: string[];
  weather: string;
  weatherIcon: React.ReactNode;
  weatherStatus: string;
}

interface BookingData {
  origin: string;
  destination: string;
  date: string | null;
  cargoType: string;
  weight: string;
}

const Routes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  
  useEffect(() => {
    // Try to get selected route from sessionStorage
    const storedRoute = sessionStorage.getItem('selectedRoute');
    const storedBooking = sessionStorage.getItem('bookingData');
    
    if (storedRoute) {
      try {
        const parsedRoute = JSON.parse(storedRoute);
        setRouteDetails(parsedRoute);
      } catch (error) {
        console.error("Error parsing stored route:", error);
      }
    }
    
    if (storedBooking) {
      try {
        const parsedBooking = JSON.parse(storedBooking);
        setBookingData(parsedBooking);
      } catch (error) {
        console.error("Error parsing stored booking:", error);
      }
    }
    
    // Check if we have route info from navigation state
    if (location.state?.selectedRoute) {
      const routeId = location.state.selectedRoute;
      // This would typically be an API call to get details
      // We're simulating with predefined data
      fetchRouteDetails(routeId);
    }
  }, [location]);

  const fetchRouteDetails = (routeId: string) => {
    // This simulates an API call - in a real app, you would fetch this data from a backend
    const routes = [
      {
        id: "fastest",
        name: "Fastest Route",
        duration: "3 days, 4 hours",
        cost: "$4,250",
        co2: "2.4 tons",
        modes: ["Air", "Truck"],
        weather: "Clear",
        weatherIcon: <Wind className="h-4 w-4 text-green-400" />,
        weatherStatus: "Optimal",
      },
      {
        id: "cheapest",
        name: "Most Economical",
        duration: "6 days, 12 hours",
        cost: "$2,780",
        co2: "1.8 tons",
        modes: ["Sea", "Rail", "Truck"],
        weather: "Mild Rain",
        weatherIcon: <Wind className="h-4 w-4 text-blue-400" />,
        weatherStatus: "Minimal Delay",
      },
      {
        id: "reliable",
        name: "Most Reliable",
        duration: "4 days, 8 hours",
        cost: "$3,950",
        co2: "2.1 tons",
        modes: ["Air", "Rail", "Truck"],
        weather: "Stormy",
        weatherIcon: <Wind className="h-4 w-4 text-yellow-400" />,
        weatherStatus: "Alternate Route",
      },
    ];
    
    const route = routes.find(r => r.id === routeId);
    if (route) {
      setRouteDetails(route);
    }
  };

  const handleBookRoute = () => {
    toast({
      title: "Route Booked Successfully!",
      description: "Your shipment has been scheduled. You can track it in the shipments section.",
    });
    
    // Navigate to dashboard after booking
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const getIconForMode = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'air':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-nexus-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>;
      case 'sea':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-nexus-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 16.016c1.245.529 2 1.223 2 1.984 0 1.657-3.582 3-8 3s-8-1.343-8-3c0-.76.755-1.456 2-1.984"/><path d="M6 12v4c0 1.657 3.582 3 8 3s8-1.343 8-3v-4"/><path d="M12 12c4.418 0 8-1.343 8-3V4.5C20 3.12 16.418 2 12 2S4 3.12 4 4.5V9c0 1.657 3.582 3 8 3z"/><path d="M4.5 9C4.5 10.38 8.082 11.5 12.5 11.5s8-1.12 8-2.5"/></svg>;
      case 'rail':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-nexus-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v16"/><path d="m4 19 4 2"/><path d="m16 21 4-2"/></svg>;
      case 'truck':
      default:
        return <Truck className="h-6 w-6 text-nexus-teal" />;
    }
  };

  if (!routeDetails) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Sidebar />
        <main className="pt-16 pl-64">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <div className="animate-pulse text-center">
                <div className="h-12 w-12 mx-auto rounded-full bg-nexus-blue/20 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-nexus-blue" />
                </div>
                <h2 className="text-xl font-semibold text-white">No Route Selected</h2>
                <p className="mt-2 text-muted-foreground">
                  Please select a route from the dashboard or create a new booking.
                </p>
                <Button 
                  className="nexus-button-primary mt-6"
                  onClick={() => navigate('/dashboard')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="pt-16 pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mb-2 gap-1"
                  onClick={() => navigate('/dashboard')}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Route Planning
                </h1>
                <p className="mt-2 text-muted-foreground">
                  {bookingData ? 
                    `${locations.find(l => l.value === bookingData.origin)?.label || 'Origin'} to 
                     ${locations.find(l => l.value === bookingData.destination)?.label || 'Destination'}` : 
                    'Selected route details and breakdown'}
                </p>
              </div>
              <Button className="nexus-button-primary gap-2" onClick={handleBookRoute}>
                Book This Route
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Route Summary */}
            <Card className="bg-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold text-white">
                  {routeDetails.name} - Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 p-6">
                    <Clock className="h-10 w-10 text-nexus-blue mb-3" />
                    <h3 className="text-lg font-medium text-white">Transit Time</h3>
                    <p className="mt-2 text-2xl font-bold text-white">{routeDetails.duration}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Door to Door</p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 p-6">
                    <DollarSign className="h-10 w-10 text-nexus-purple mb-3" />
                    <h3 className="text-lg font-medium text-white">Total Cost</h3>
                    <p className="mt-2 text-2xl font-bold text-white">{routeDetails.cost}</p>
                    <p className="mt-1 text-sm text-muted-foreground">All Inclusive</p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 p-6">
                    <Shield className="h-10 w-10 text-nexus-teal mb-3" />
                    <h3 className="text-lg font-medium text-white">CO₂ Emissions</h3>
                    <p className="mt-2 text-2xl font-bold text-white">{routeDetails.co2}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Carbon Footprint</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Transport Modes */}
            <Card className="bg-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold text-white">
                  Transport Modes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-6 top-0 h-full w-0.5 bg-white/10"></div>
                  
                  {routeDetails.modes.map((mode, index) => (
                    <div key={index} className="relative mb-8 pl-12">
                      <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-sidebar">
                        {getIconForMode(mode)}
                      </div>
                      
                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <h3 className="text-lg font-medium text-white">{mode} Transport</h3>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="text-white">
                              {index === 0 ? "1 day, 8 hours" : index === 1 ? "2 days" : "12 hours"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Distance</p>
                            <p className="text-white">
                              {index === 0 ? "4,500 km" : index === 1 ? "6,500 km" : "425 km"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Carrier</p>
                            <p className="text-white">
                              {mode === "Air" ? "Global Airways" : 
                               mode === "Sea" ? "Ocean Express" : 
                               mode === "Rail" ? "Continental Rail" : "FastTruck Logistics"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Cost</p>
                            <p className="text-white">
                              {mode === "Air" ? "$2,800" : 
                               mode === "Sea" ? "$1,500" : 
                               mode === "Rail" ? "$1,200" : "$450"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-end">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Route Details
              </Button>
              <Button className="nexus-button-primary gap-2" onClick={handleBookRoute}>
                Book This Route
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Routes;
