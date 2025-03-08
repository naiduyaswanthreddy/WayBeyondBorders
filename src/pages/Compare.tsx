
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Map, Clock, DollarSign, ShieldCheck, Zap, AlertTriangle, ArrowLeftRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
  { value: "antwerp", label: "Antwerp, Belgium" }
];

// Route options for demonstration
const routeOptions = [
  {
    id: "fastest",
    name: "Fastest Route",
    icon: Zap,
    color: "text-nexus-blue",
    bgColor: "bg-nexus-blue/20",
    duration: "3 days, 4 hours",
    cost: "$4,250",
    co2: "2.4 tons",
    risk: "Medium",
    riskColor: "text-yellow-500",
    modes: ["Air", "Truck"],
    weather: "Clear",
    weatherStatus: "Optimal",
    customsClearance: "Fast Track",
    portCongestion: "Low",
    rerouting: "Available",
  },
  {
    id: "cheapest",
    name: "Most Economical",
    icon: DollarSign,
    color: "text-nexus-purple",
    bgColor: "bg-nexus-purple/20",
    duration: "6 days, 12 hours",
    cost: "$2,780",
    co2: "1.8 tons",
    risk: "Low",
    riskColor: "text-green-500",
    modes: ["Sea", "Rail", "Truck"],
    weather: "Mild Rain",
    weatherStatus: "Minimal Delay",
    customsClearance: "Standard",
    portCongestion: "Medium",
    rerouting: "Available",
  },
  {
    id: "reliable",
    name: "Most Reliable",
    icon: ShieldCheck,
    color: "text-nexus-teal",
    bgColor: "bg-nexus-teal/20",
    duration: "4 days, 8 hours",
    cost: "$3,950",
    co2: "2.1 tons",
    risk: "Very Low",
    riskColor: "text-green-500",
    modes: ["Air", "Rail", "Truck"],
    weather: "Stormy",
    weatherStatus: "Alternate Route",
    customsClearance: "Priority",
    portCongestion: "Bypassed",
    rerouting: "Premium",
  },
];

const ComparePage = () => {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [showComparison, setShowComparison] = useState(false);

  const handleCompare = () => {
    if (!origin || !destination) {
      toast({
        title: "Missing Information",
        description: "Please select both origin and destination to compare routes.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would fetch data based on the selected locations
    setShowComparison(true);
    
    toast({
      title: "Routes Compared",
      description: "Showing all available options between selected locations.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="pt-16 pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Route Comparison
            </h1>
            <p className="mt-2 text-muted-foreground">
              Compare different route options side-by-side to find the optimal solution
            </p>
          </div>
          
          <Card className="bg-card border-white/10 mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-white">
                Select Locations to Compare
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Origin
                  </label>
                  <Select value={origin} onValueChange={setOrigin}>
                    <SelectTrigger className="bg-muted border-white/10">
                      <SelectValue placeholder="Select origin" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Destination
                  </label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger className="bg-muted border-white/10">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={handleCompare}
                    className="nexus-button-primary w-full"
                  >
                    <ArrowLeftRight className="mr-2 h-4 w-4" />
                    Compare Routes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {showComparison && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden rounded-lg border border-white/10">
                    <table className="min-w-full divide-y divide-white/10">
                      <thead className="bg-white/5">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-white">
                            Criteria
                          </th>
                          {routeOptions.map(option => (
                            <th key={option.id} scope="col" className="px-6 py-3 text-left text-sm font-semibold text-white">
                              <div className="flex items-center">
                                <div className={`mr-2 p-1 rounded-full ${option.bgColor}`}>
                                  <option.icon className={`h-4 w-4 ${option.color}`} />
                                </div>
                                {option.name}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 bg-transparent">
                        <tr>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              Transit Time
                            </div>
                          </td>
                          {routeOptions.map(option => (
                            <td key={option.id} className="whitespace-nowrap px-6 py-4 text-sm text-white">
                              {option.duration}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                            <div className="flex items-center">
                              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                              Total Cost
                            </div>
                          </td>
                          {routeOptions.map(option => (
                            <td key={option.id} className="whitespace-nowrap px-6 py-4 text-sm text-white">
                              {option.cost}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                            <div className="flex items-center">
                              <AlertTriangle className="mr-2 h-4 w-4 text-muted-foreground" />
                              Risk Level
                            </div>
                          </td>
                          {routeOptions.map(option => (
                            <td key={option.id} className="whitespace-nowrap px-6 py-4 text-sm">
                              <span className={option.riskColor}>{option.risk}</span>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                            <div className="flex items-center">
                              <Map className="mr-2 h-4 w-4 text-muted-foreground" />
                              Transport Modes
                            </div>
                          </td>
                          {routeOptions.map(option => (
                            <td key={option.id} className="whitespace-nowrap px-6 py-4 text-sm text-white">
                              {option.modes.join(", ")}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                            Customs Clearance
                          </td>
                          {routeOptions.map(option => (
                            <td key={option.id} className="whitespace-nowrap px-6 py-4 text-sm text-white">
                              {option.customsClearance}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                            Port Congestion
                          </td>
                          {routeOptions.map(option => (
                            <td key={option.id} className="whitespace-nowrap px-6 py-4 text-sm text-white">
                              {option.portCongestion}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                            Rerouting Options
                          </td>
                          {routeOptions.map(option => (
                            <td key={option.id} className="whitespace-nowrap px-6 py-4 text-sm text-white">
                              {option.rerouting}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                            Action
                          </td>
                          {routeOptions.map(option => (
                            <td key={option.id} className="whitespace-nowrap px-6 py-4 text-sm text-white">
                              <Button 
                                className={`text-white ${option.bgColor.replace("/20", "/80")}`}
                                variant="outline"
                                onClick={() => {
                                  // Store selected route in sessionStorage
                                  sessionStorage.setItem('selectedRoute', JSON.stringify(option));
                                  // Navigate to route details page
                                  window.location.href = '/routes';
                                }}
                              >
                                Select This Route
                              </Button>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <Card className="bg-card border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold text-white">
                    Route Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
                    <div className="text-center">
                      <Map className="h-10 w-10 mx-auto mb-4 text-muted-foreground opacity-40" />
                      <p className="text-muted-foreground">Interactive map comparison coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ComparePage;
