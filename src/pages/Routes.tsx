import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock, Download, DollarSign, MapPin, Package, Shield, Truck, Wind, Zap, Anchor, Plane, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import ChatlingChatbot from "@/components/chatbot/ChatlingChatbot";

interface RouteDetails {
  id: string;
  name: string;
  duration: string;
  cost: string;
  co2: string;
  co2Savings?: string;
  modes: string[];
  weather: string;
  weatherIcon: React.ReactNode;
  weatherStatus: string;
  isEcoFriendly?: boolean;
  origin?: string;
  destination?: string;
}

interface BookingData {
  origin: string;
  destination: string;
  date: string | null;
  cargoType: string;
  weight: string;
}

// Define the locations array
const locations = [
  { value: "shanghai", label: "Shanghai, China" },
  { value: "rotterdam", label: "Rotterdam, Netherlands" },
  { value: "singapore", label: "Singapore" },
  { value: "losangeles", label: "Los Angeles, USA" },
  { value: "dubai", label: "Dubai, UAE" },
  { value: "hamburg", label: "Hamburg, Germany" },
  { value: "busan", label: "Busan, South Korea" },
  { value: "newyork", label: "New York, USA" },
  { value: "tokyo", label: "Tokyo, Japan" },
  { value: "antwerp", label: "Antwerp, Belgium" },
  { value: "miami", label: "Miami, USA" },
];

const Routes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  
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
        origin: bookingData?.origin,
        destination: bookingData?.destination
      },
      {
        id: "cheapest",
        name: "Most Economical",
        duration: "6 days, 12 hours",
        cost: "$2,780",
        co2: "1.8 tons",
        modes: ["Sea", "Truck"],
        weather: "Mild Rain",
        weatherIcon: <Wind className="h-4 w-4 text-blue-400" />,
        weatherStatus: "Minimal Delay",
        origin: bookingData?.origin,
        destination: bookingData?.destination
      },
      {
        id: "reliable",
        name: "Most Reliable",
        duration: "4 days, 8 hours",
        cost: "$3,950",
        co2: "2.1 tons",
        modes: ["Air", "Truck"],
        weather: "Stormy",
        weatherIcon: <Wind className="h-4 w-4 text-yellow-400" />,
        weatherStatus: "Alternate Route",
        origin: bookingData?.origin,
        destination: bookingData?.destination
      },
      {
        id: "eco-friendly",
        name: "Eco-Friendly Route",
        duration: "5 days, 6 hours",
        cost: "$3,450",
        co2: "0.9 tons",
        co2Savings: "1.5 tons",
        modes: ["Sea", "Electric Truck"],
        weather: "Clear",
        weatherIcon: <Wind className="h-4 w-4 text-green-400" />,
        weatherStatus: "Optimal",
        isEcoFriendly: true,
        origin: bookingData?.origin,
        destination: bookingData?.destination
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
    
    // Navigate to bookings after booking
    setTimeout(() => {
      navigate('/bookings');
    }, 1500);
  };

  const getIconForMode = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'air':
        return <Plane className="h-6 w-6 text-nexus-blue" />;
      case 'sea':
        return <Anchor className="h-6 w-6 text-nexus-blue" />;
      case 'electric truck':
        return <div className="relative">
          <Truck className="h-6 w-6 text-green-500" />
          <Leaf className="h-3 w-3 absolute -top-1 -right-1 text-green-400" />
        </div>;
      case 'truck':
      default:
        return <Truck className="h-6 w-6 text-nexus-teal" />;
    }
  };

  const handleDownloadRouteDetails = () => {
    toast({
      title: "Route Details Downloaded",
      description: "Route details have been saved to your downloads",
    });
  };

  const verifyWithAI = () => {
    setShowChatbot(true);
    
    toast({
      title: "AI Verification Initiated",
      description: "Chat with our AI assistant to verify route details",
    });
  };

  if (!routeDetails) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-16">
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
                  onClick={() => navigate('/bookings')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Bookings
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Determine the actual origin and destination for display
  const originLabel = bookingData?.origin ? 
    (locations.find(l => l.value === bookingData.origin)?.label || bookingData.origin) : 
    (routeDetails.origin || "Origin");
    
  const destinationLabel = bookingData?.destination ? 
    (locations.find(l => l.value === bookingData.destination)?.label || bookingData.destination) : 
    (routeDetails.destination || "Destination");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {showChatbot && (
        <ChatlingChatbot 
          chatbotId="clfm4a3gs00k90bl68vqfgc4m" 
          initialMessage={`Verify route from ${originLabel} to ${destinationLabel} using ${routeDetails.modes.join(', ')} transport.`}
        />
      )}
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mb-2 gap-1"
                  onClick={() => navigate('/bookings')}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Bookings
                </Button>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Route Planning
                </h1>
                <p className="mt-2 text-muted-foreground">
                  {originLabel} to {destinationLabel}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={verifyWithAI}
                >
                  <Shield className="h-4 w-4" />
                  Verify with AI
                </Button>
                <Button className="nexus-button-primary gap-2" onClick={handleBookRoute}>
                  Book This Route
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Route Summary */}
            <Card className="bg-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold flex items-center text-white">
                  {routeDetails.name} - Summary
                  {routeDetails.isEcoFriendly && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 flex items-center">
                      <Leaf className="h-3 w-3 mr-1" />
                      Eco-Friendly
                    </span>
                  )}
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
                    {routeDetails.isEcoFriendly ? (
                      <>
                        <Leaf className="h-10 w-10 text-green-500 mb-3" />
                        <h3 className="text-lg font-medium text-white">CO₂ Emissions</h3>
                        <p className="mt-2 text-2xl font-bold text-white">{routeDetails.co2}</p>
                        <p className="mt-1 text-sm text-green-400">Savings: {routeDetails.co2Savings}</p>
                      </>
                    ) : (
                      <>
                        <Shield className="h-10 w-10 text-nexus-teal mb-3" />
                        <h3 className="text-lg font-medium text-white">CO₂ Emissions</h3>
                        <p className="mt-2 text-2xl font-bold text-white">{routeDetails.co2}</p>
                        <p className="mt-1 text-sm text-muted-foreground">Carbon Footprint</p>
                      </>
                    )}
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
                            <p className="text-sm text-muted-foreground">Route Section</p>
                            <p className="text-white">
                              {index === 0 ? 
                                (mode.toLowerCase() === 'sea' ? originLabel + " to Port" : 
                                 mode.toLowerCase() === 'air' ? originLabel + " to Airport" : 
                                 originLabel + " Local Transport") : 
                                destinationLabel + " Local Delivery"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="text-white">
                              {index === 0 ? 
                                (mode.toLowerCase() === 'sea' ? "5 days, 8 hours" : 
                                 mode.toLowerCase() === 'air' ? "1 day, 6 hours" : 
                                 "12 hours") : 
                                "10 hours"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Distance</p>
                            <p className="text-white">
                              {index === 0 ? 
                                (mode.toLowerCase() === 'sea' ? "11,000 km" : 
                                 mode.toLowerCase() === 'air' ? "9,200 km" : 
                                 "50 km") : 
                                "120 km"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Carrier</p>
                            <p className="text-white">
                              {mode.toLowerCase() === 'air' ? "Global Airways" : 
                               mode.toLowerCase() === 'sea' ? "Ocean Express" : 
                               mode.toLowerCase() === 'electric truck' ? "Green Transport Inc." : 
                               "FastTruck Logistics"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Cost</p>
                            <p className="text-white">
                              {index === 0 ? 
                                (mode.toLowerCase() === 'sea' ? "$1,800" : 
                                 mode.toLowerCase() === 'air' ? "$3,500" : 
                                 "$350") : 
                                (mode.toLowerCase() === 'electric truck' ? "$550" : "$400")}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Emissions</p>
                            <p className={mode.toLowerCase() === 'electric truck' ? "text-green-400" : "text-white"}>
                              {mode.toLowerCase() === 'sea' ? "1.2 tons CO₂" : 
                               mode.toLowerCase() === 'air' ? "2.1 tons CO₂" : 
                               mode.toLowerCase() === 'electric truck' ? "0.1 tons CO₂" : 
                               "0.3 tons CO₂"}
                              {mode.toLowerCase() === 'electric truck' && " (80% reduction)"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Route Visualization */}
            <Card className="bg-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold text-white">
                  Route Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border border-white/10">
                  <div className="relative aspect-[16/9] w-full">
                    {/* Satellite Map Background */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80')] bg-cover bg-center opacity-80"></div>
                    
                    {/* Origin Point */}
                    <div className="absolute left-[15%] top-[40%] h-5 w-5 rounded-full bg-nexus-blue shadow-[0_0_15px_rgba(0,98,255,0.7)]"></div>
                    
                    {/* Destination Point */}
                    <div className="absolute right-[15%] top-[30%] h-5 w-5 rounded-full bg-nexus-purple shadow-[0_0_15px_rgba(110,54,229,0.7)]"></div>
                    
                    {/* Route Line */}
                    <svg className="absolute inset-0 h-full w-full" style={{ filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.4))' }}>
                      <path
                        d={routeDetails.id === "fastest" 
                          ? "M 15% 40% C 40% 30%, 60% 30%, 85% 30%" 
                          : routeDetails.id === "cheapest"
                          ? "M 15% 40% C 30% 50%, 70% 40%, 85% 30%"
                          : routeDetails.id === "eco-friendly"
                          ? "M 15% 40% C 50% 45%, 40% 35%, 85% 30%"
                          : "M 15% 40% C 40% 35%, 60% 35%, 85% 30%"}
                        stroke={routeDetails.id === "fastest" 
                          ? "#0062FF" 
                          : routeDetails.id === "cheapest"
                          ? "#6E36E5"
                          : routeDetails.id === "eco-friendly"
                          ? "#10B981"
                          : "#00CFD5"}
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="8,4"
                        className="animate-pulse"
                      />
                    </svg>
                    
                    {/* Transport Mode Indicators */}
                    {routeDetails.modes.map((mode, index) => {
                      const position = {
                        left: index === 0 ? '40%' : '70%',
                        top: index === 0 ? '35%' : '32%'
                      };
                      
                      return (
                        <div
                          key={index}
                          className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg"
                          style={position}
                        >
                          {getIconForMode(mode)}
                        </div>
                      );
                    })}

                    {/* Cities/Points Labels */}
                    <div className="absolute left-[10%] top-[36%] rounded-md bg-black/70 px-2 py-1 text-sm text-white backdrop-blur-sm">
                      {originLabel}
                    </div>
                    <div className="absolute right-[10%] top-[26%] rounded-md bg-black/70 px-2 py-1 text-sm text-white backdrop-blur-sm">
                      {destinationLabel}
                    </div>
                    
                    {/* Satellite map attribution */}
                    <div className="absolute bottom-1 left-1 text-[8px] text-white/70">
                      Satellite imagery © NASA/Google
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-end">
              <Button variant="outline" className="gap-2" onClick={verifyWithAI}>
                <Shield className="h-4 w-4" />
                Verify with AI
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleDownloadRouteDetails}>
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
