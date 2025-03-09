import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { 
  Zap, 
  DollarSign, 
  Shield, 
  Droplets, 
  Wind, 
  Umbrella, 
  Leaf,
  Download,
  BadgeDollarSign,
  ArrowDownUp
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { RouteMapOptions } from "./route-map/RouteMapOptions";
import { RouteMapDisplay } from "./route-map/RouteMapDisplay";
import { RouteMapDetails } from "./route-map/RouteMapDetails";
import { useEcoPoints } from "@/context/EcoPointsContext";
import { Button } from "@/components/ui/button";
import GoogleMapDisplay from "./maps/GoogleMapDisplay";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const majorLocations = [
  // Asia
  { value: "shanghai", label: "Shanghai, China" },
  { value: "singapore", label: "Singapore" },
  { value: "busan", label: "Busan, South Korea" },
  { value: "shenzhen", label: "Shenzhen, China" },
  { value: "ningbo", label: "Ningbo, China" },
  { value: "hongkong", label: "Hong Kong, China" },
  { value: "guangzhou", label: "Guangzhou, China" },
  { value: "qingdao", label: "Qingdao, China" },
  { value: "tokyo", label: "Tokyo, Japan" },
  { value: "yokohama", label: "Yokohama, Japan" },
  { value: "kaohsiung", label: "Kaohsiung, Taiwan" },
  { value: "mumbai", label: "Mumbai, India" },
  { value: "bangkok", label: "Bangkok, Thailand" },
  { value: "manila", label: "Manila, Philippines" },
  { value: "portklang", label: "Port Klang, Malaysia" },
  { value: "hochi", label: "Ho Chi Minh City, Vietnam" },
  { value: "jakarta", label: "Jakarta, Indonesia" },
  { value: "colombo", label: "Colombo, Sri Lanka" },
  { value: "dubai", label: "Dubai, UAE" },
  { value: "jeddah", label: "Jeddah, Saudi Arabia" },
  
  // Europe
  { value: "rotterdam", label: "Rotterdam, Netherlands" },
  { value: "antwerp", label: "Antwerp, Belgium" },
  { value: "hamburg", label: "Hamburg, Germany" },
  { value: "valencia", label: "Valencia, Spain" },
  { value: "barcelona", label: "Barcelona, Spain" },
  { value: "piraeus", label: "Piraeus, Greece" },
  { value: "algeciras", label: "Algeciras, Spain" },
  { value: "genoa", label: "Genoa, Italy" },
  { value: "southampton", label: "Southampton, UK" },
  { value: "felixstowe", label: "Felixstowe, UK" },
  { value: "bremerhaven", label: "Bremerhaven, Germany" },
  { value: "lemans", label: "Le Mans, France" },
  { value: "marseille", label: "Marseille, France" },
  { value: "gdansk", label: "Gdansk, Poland" },
  { value: "stpetersburg", label: "St. Petersburg, Russia" },
  
  // North America
  { value: "losangeles", label: "Los Angeles, USA" },
  { value: "longbeach", label: "Long Beach, USA" },
  { value: "newyork", label: "New York, USA" },
  { value: "savannah", label: "Savannah, USA" },
  { value: "seattle", label: "Seattle, USA" },
  { value: "vancouver", label: "Vancouver, Canada" },
  { value: "oakland", label: "Oakland, USA" },
  { value: "houston", label: "Houston, USA" },
  { value: "montreal", label: "Montreal, Canada" },
  { value: "miami", label: "Miami, USA" },
  { value: "charleston", label: "Charleston, USA" },
  { value: "norfolk", label: "Norfolk, USA" },
  { value: "halifax", label: "Halifax, Canada" },
  { value: "baltimore", label: "Baltimore, USA" },
  { value: "manzanillo", label: "Manzanillo, Mexico" },
  
  // South America
  { value: "santos", label: "Santos, Brazil" },
  { value: "cartagena", label: "Cartagena, Colombia" },
  { value: "callao", label: "Callao, Peru" },
  { value: "buenosaires", label: "Buenos Aires, Argentina" },
  { value: "guayaquil", label: "Guayaquil, Ecuador" },
  { value: "sanantonio", label: "San Antonio, Chile" },
  
  // Oceania
  { value: "sydney", label: "Sydney, Australia" },
  { value: "melbourne", label: "Melbourne, Australia" },
  { value: "brisbane", label: "Brisbane, Australia" },
  { value: "auckland", label: "Auckland, New Zealand" },
  
  // Africa
  { value: "durban", label: "Durban, South Africa" },
  { value: "tangier", label: "Tangier, Morocco" },
  { value: "capetown", label: "Cape Town, South Africa" },
  { value: "alexandria", label: "Alexandria, Egypt" },
  { value: "lagos", label: "Lagos, Nigeria" },
  { value: "mombasa", label: "Mombasa, Kenya" }
];

const RouteMap: React.FC<{ className?: string }> = ({ className }) => {
  const [selectedRoute, setSelectedRoute] = useState<"fastest" | "cheapest" | "reliable" | "eco-friendly">("fastest");
  const [origin, setOrigin] = useState<string>("shanghai");
  const [destination, setDestination] = useState<string>("rotterdam");
  const [originLabel, setOriginLabel] = useState<string>("Shanghai, China");
  const [destinationLabel, setDestinationLabel] = useState<string>("Rotterdam, Netherlands");
  const [showCostOptimizer, setShowCostOptimizer] = useState<boolean>(false);
  const [optimizationComplete, setOptimizationComplete] = useState<boolean>(false);
  const [savingsAmount, setSavingsAmount] = useState<number>(0);
  const [googleMapDialogOpen, setGoogleMapDialogOpen] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const { addPoints } = useEcoPoints();

  useEffect(() => {
    const handleRouteDataUpdate = (event: CustomEvent) => {
      const routeData = event.detail;
      if (routeData.origin) {
        setOrigin(routeData.origin);
      }
      if (routeData.destination) {
        setDestination(routeData.destination);
      }
      if (routeData.originLabel) {
        setOriginLabel(routeData.originLabel);
      }
      if (routeData.destinationLabel) {
        setDestinationLabel(routeData.destinationLabel);
      }
    };
    
    const storedRouteData = sessionStorage.getItem('routeMapData');
    if (storedRouteData) {
      try {
        const routeData = JSON.parse(storedRouteData);
        if (routeData.origin) {
          setOrigin(routeData.origin);
        }
        if (routeData.destination) {
          setDestination(routeData.destination);
        }
        if (routeData.originLabel) {
          setOriginLabel(routeData.originLabel);
        }
        if (routeData.destinationLabel) {
          setDestinationLabel(routeData.destinationLabel);
        }
      } catch (error) {
        console.error("Error parsing route data:", error);
      }
    }
    
    window.addEventListener('routeDataUpdated', handleRouteDataUpdate as EventListener);
    
    return () => {
      window.removeEventListener('routeDataUpdated', handleRouteDataUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    setOptimizationComplete(false);
    setShowCostOptimizer(false);
    setSavingsAmount(0);
  }, [selectedRoute, origin, destination]);

  const routes = [
    {
      id: "fastest",
      name: "Fastest Route",
      icon: Zap,
      color: "text-nexus-blue",
      bgColor: "bg-nexus-blue/20",
      borderColor: "border-nexus-blue/30",
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
      icon: DollarSign,
      color: "text-nexus-purple",
      bgColor: "bg-nexus-purple/20",
      borderColor: "border-nexus-purple/30",
      duration: "6 days, 12 hours",
      cost: "$2,780",
      co2: "1.8 tons",
      modes: ["Sea", "Truck"],
      weather: "Mild Rain",
      weatherIcon: <Droplets className="h-4 w-4 text-blue-400" />,
      weatherStatus: "Minimal Delay",
    },
    {
      id: "reliable",
      name: "Most Reliable",
      icon: Shield,
      color: "text-nexus-teal",
      bgColor: "bg-nexus-teal/20",
      borderColor: "border-nexus-teal/30",
      duration: "4 days, 8 hours",
      cost: "$3,950",
      co2: "2.1 tons",
      modes: ["Air", "Truck"],
      weather: "Stormy",
      weatherIcon: <Umbrella className="h-4 w-4 text-yellow-400" />,
      weatherStatus: "Alternate Route",
    },
    {
      id: "eco-friendly",
      name: "Eco-Friendly",
      icon: Leaf,
      color: "text-green-500",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30",
      duration: "5 days, 6 hours",
      cost: "$3,450",
      co2: "0.9 tons",
      co2Savings: "1.5 tons",
      modes: ["Sea", "Electric Truck"],
      weather: "Clear",
      weatherIcon: <Wind className="h-4 w-4 text-green-400" />,
      weatherStatus: "Optimal",
      ecoPoints: 125,
      isEcoFriendly: true
    }
  ];

  const handleRouteSelect = (routeId: string) => {
    setSelectedRoute(routeId as any);
    
    const selectedRouteDetails = routes.find(r => r.id === routeId);
    
    const routeWithLocations = {
      ...selectedRouteDetails,
      origin: originLabel,
      destination: destinationLabel
    };
    
    sessionStorage.setItem('selectedRoute', JSON.stringify(routeWithLocations));
    
    const bookingData = {
      origin: origin,
      destination: destination,
      date: new Date().toISOString(),
      cargoType: "General Merchandise",
      weight: "2500kg"
    };
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    if (selectedRouteDetails?.isEcoFriendly && selectedRouteDetails.ecoPoints) {
      addPoints(selectedRouteDetails.ecoPoints);
      toast({
        title: `${selectedRouteDetails?.name} Selected`,
        description: `Earned ${selectedRouteDetails.ecoPoints} Eco Points! Thank you for choosing the eco-friendly option.`,
      });
    } else {
      toast({
        title: `${selectedRouteDetails?.name} Selected`,
        description: "Review detailed breakdown below",
      });
    }
  };

  const handleDownloadRoute = () => {
    const selectedRouteDetails = routes.find((r) => r.id === selectedRoute);
    if (!selectedRouteDetails) return;
    
    const routeData = JSON.stringify({
      ...selectedRouteDetails,
      origin: originLabel,
      destination: destinationLabel
    }, null, 2);
    
    const blob = new Blob([routeData], { type: 'application/json' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `route-${selectedRouteDetails.id}-${origin}-to-${destination}.json`;
    document.body.appendChild(link);
    link.click();
    
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    toast({
      title: "Route Details Downloaded",
      description: "Route information saved to your device",
    });
  };

  const runCostOptimization = () => {
    setShowCostOptimizer(true);
    
    setTimeout(() => {
      let savings = 0;
      switch(selectedRoute) {
        case "fastest":
          savings = 320;
          break;
        case "cheapest":
          savings = 175;
          break;
        case "reliable":
          savings = 290;
          break;
        case "eco-friendly":
          savings = 210;
          break;
      }
      
      setSavingsAmount(savings);
      setOptimizationComplete(true);
      
      toast({
        title: "AI Cost Optimization Complete",
        description: `Identified potential savings of $${savings}`,
        variant: "default"
      });
    }, 1500);
  };
  
  const openFullMapView = () => {
    setGoogleMapDialogOpen(true);
  };

  const selectedRouteDetails = routes.find((r) => r.id === selectedRoute);

  return (
    <div className={cn("nexus-card-purple space-y-6 p-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Smart Route Selection</h2>
        <div className="flex gap-2">
          <span className="rounded-full bg-nexus-purple/20 px-3 py-1 text-xs font-medium text-nexus-purple">
            AI Optimized
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 text-xs"
            onClick={openFullMapView}
          >
            <ArrowDownUp className="h-3 w-3" />
            View Larger Map
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 text-xs"
            onClick={handleDownloadRoute}
          >
            <Download className="h-3 w-3" />
            Download
          </Button>
        </div>
      </div>

      <div className="rounded-md bg-white/5 p-4 border border-white/10">
        <div className="text-sm text-muted-foreground mb-2">
          Current route: <span className="text-white font-medium">{originLabel}</span> to <span className="text-white font-medium">{destinationLabel}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Update the origin and destination in the New Booking section above to see different route options.
        </p>
      </div>

      <RouteMapOptions 
        routes={routes}
        selectedRoute={selectedRoute}
        onRouteSelect={handleRouteSelect}
      />
      
      <RouteMapDetails selectedRouteDetails={selectedRouteDetails} />

      <RouteMapDisplay 
        selectedRoute={selectedRoute}
        selectedRouteDetails={selectedRouteDetails}
        origin={originLabel}
        destination={destinationLabel}
      />
      
      {!showCostOptimizer ? (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            className="gap-2 border-nexus-purple/30 bg-nexus-purple/10 text-nexus-purple hover:bg-nexus-purple/20"
            onClick={runCostOptimization}
          >
            <BadgeDollarSign className="h-4 w-4" />
            Run AI Cost Optimization
          </Button>
        </div>
      ) : (
        <div className="rounded-md border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-medium text-white">
              <BadgeDollarSign className="h-5 w-5 text-nexus-purple" />
              AI Cost Optimization
            </h3>
            {optimizationComplete && (
              <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                ${savingsAmount} Potential Savings
              </span>
            )}
          </div>
          
          {!optimizationComplete ? (
            <div className="mt-4 flex items-center justify-center py-6">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-nexus-purple"></div>
              <span className="ml-3 text-sm text-muted-foreground">Analyzing route costs and finding optimizations...</span>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-md bg-white/5 p-3">
                  <div className="text-sm font-medium text-white">Port Fee Optimization</div>
                  <div className="mt-1 text-xs text-muted-foreground">Alternative port scheduling</div>
                  <div className="mt-2 text-right text-sm font-semibold text-green-400">-$120</div>
                </div>
                
                <div className="rounded-md bg-white/5 p-3">
                  <div className="text-sm font-medium text-white">Fuel Consumption</div>
                  <div className="mt-1 text-xs text-muted-foreground">Route optimization</div>
                  <div className="mt-2 text-right text-sm font-semibold text-green-400">-${Math.floor(savingsAmount * 0.35)}</div>
                </div>
                
                <div className="rounded-md bg-white/5 p-3">
                  <div className="text-sm font-medium text-white">Carrier Selection</div>
                  <div className="mt-1 text-xs text-muted-foreground">Alternative carrier options</div>
                  <div className="mt-2 text-right text-sm font-semibold text-green-400">-${Math.floor(savingsAmount * 0.4)}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between rounded-md bg-nexus-purple/10 p-3">
                <span className="text-sm font-medium text-white">Total Potential Savings</span>
                <span className="text-base font-bold text-nexus-purple">${savingsAmount}</span>
              </div>
              
              <div className="flex justify-end">
                <Button
                  className="nexus-button-primary gap-1"
                  onClick={() => {
                    toast({
                      title: "Optimizations Applied",
                      description: `Cost savings of $${savingsAmount} have been applied to your route`,
                    });
                    
                    const route = routes.find(r => r.id === selectedRoute);
                    if (route) {
                      const currentCost = parseFloat(route.cost.replace('$', '').replace(',', ''));
                      const newCost = currentCost - savingsAmount;
                      route.cost = `$${newCost.toLocaleString()}`;
                      
                      sessionStorage.setItem('selectedRoute', JSON.stringify({
                        ...route,
                        cost: `$${newCost.toLocaleString()}`,
                        origin: originLabel,
                        destination: destinationLabel
                      }));
                    }
                    
                    setShowCostOptimizer(false);
                    setOptimizationComplete(false);
                  }}
                >
                  Apply Optimizations
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <Dialog open={googleMapDialogOpen} onOpenChange={setGoogleMapDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogTitle>Route Map: {originLabel} to {destinationLabel}</DialogTitle>
          <DialogDescription>
            Real-time route visualization with traffic, weather and customs data
          </DialogDescription>
          <div className="h-[600px] w-full">
            <GoogleMapDisplay 
              origin={originLabel}
              destination={destinationLabel}
              transportModes={selectedRouteDetails?.modes.map(m => m.toLowerCase()) || []}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setGoogleMapDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RouteMap;
