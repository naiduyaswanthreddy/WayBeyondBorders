
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  CreditCard, 
  DollarSign, 
  Clock, 
  Info, 
  ArrowRight, 
  Ship, 
  Plane, 
  Truck, 
  RefreshCw,
  Euro,
  PoundSterling,
  JapaneseYen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsList, 
  TabsContent, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  FinancialBreakdown, 
  AirTransportCost, 
  SeaTransportCost, 
  RoadTransportCost 
} from "@/components/dashboard/booking-form/types";
import { exchangeRates } from "@/components/dashboard/booking-form/data";
import { toast } from "@/components/ui/use-toast";

interface CostBreakdownProps {
  className?: string;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({ className }) => {
  const [routeData, setRouteData] = useState<any>(null);
  const [selectedTransportMode, setSelectedTransportMode] = useState<string>("any");
  const [userCurrency, setUserCurrency] = useState<string>("USD");
  const [financialBreakdown, setFinancialBreakdown] = useState<FinancialBreakdown | null>(null);
  
  // Listen for route data updates
  useEffect(() => {
    const handleRouteDataUpdate = (event: CustomEvent<any>) => {
      setRouteData(event.detail);
      
      if (event.detail.transportMode && event.detail.transportMode !== "any") {
        setSelectedTransportMode(event.detail.transportMode);
      }
    };
    
    window.addEventListener('routeDataUpdated' as any, handleRouteDataUpdate);
    
    // Try to load data from sessionStorage on initial render
    const storedData = sessionStorage.getItem('routeMapData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setRouteData(parsedData);
        
        if (parsedData.transportMode && parsedData.transportMode !== "any") {
          setSelectedTransportMode(parsedData.transportMode);
        }
      } catch (e) {
        console.error("Failed to parse stored route data:", e);
      }
    }
    
    return () => {
      window.removeEventListener('routeDataUpdated' as any, handleRouteDataUpdate);
    };
  }, []);
  
  // Generate financial breakdown when route data or currency changes
  useEffect(() => {
    if (!routeData || !routeData.origin || !routeData.destination) return;
    
    generateFinancialBreakdown(routeData, selectedTransportMode, userCurrency);
  }, [routeData, selectedTransportMode, userCurrency]);
  
  const generateFinancialBreakdown = (
    data: any, 
    transportMode: string, 
    currency: string
  ) => {
    // Default costs for demonstration
    const defaultBreakdown: FinancialBreakdown = {
      transportMode,
      userCurrency: currency,
      exchangeRates: exchangeRates,
      totalCost: 0,
      profitMargin: 0.12, // 12% profit margin
      companyCost: 0
    };
    
    let originIsAsia = false;
    let destIsEurope = false;
    let originIsUSA = false;
    let destIsUSA = false;
    
    // Determine region based on location names
    if (data.originLabel) {
      if (data.originLabel.includes("Shanghai") || 
          data.originLabel.includes("Singapore") || 
          data.originLabel.includes("Tokyo")) {
        originIsAsia = true;
      }
      
      if (data.originLabel.includes("New York") || 
          data.originLabel.includes("Los Angeles") || 
          data.originLabel.includes("Chicago")) {
        originIsUSA = true;
      }
    }
    
    if (data.destinationLabel) {
      if (data.destinationLabel.includes("London") || 
          data.destinationLabel.includes("Rotterdam") || 
          data.destinationLabel.includes("Hamburg")) {
        destIsEurope = true;
      }
      
      if (data.destinationLabel.includes("New York") || 
          data.destinationLabel.includes("Los Angeles") || 
          data.destinationLabel.includes("Chicago")) {
        destIsUSA = true;
      }
    }
    
    // Calculate distance factor (simplified)
    let distanceFactor = 1.0;
    if ((originIsAsia && destIsEurope) || (destIsAsia && originIsEurope)) {
      distanceFactor = 2.5; // Long distance
    } else if ((originIsUSA && destIsEurope) || (destIsEurope && originIsUSA)) {
      distanceFactor = 1.8; // Medium distance
    }
    
    // Calculate weight factor
    let weightFactor = 1.0;
    if (data.weight) {
      const weightNum = parseFloat(data.weight);
      if (!isNaN(weightNum)) {
        if (weightNum > 1000) weightFactor = 0.85; // Discount for large shipments
        else if (weightNum < 100) weightFactor = 1.15; // Premium for small shipments
      }
    }
    
    // Apply cargo type factor
    let cargoTypeFactor = 1.0;
    if (data.cargoType) {
      if (data.cargoType.includes("hazmat") || 
          data.cargoType.includes("flammable") || 
          data.cargoType.includes("toxic")) {
        cargoTypeFactor = 1.75; // Hazardous materials premium
      } else if (data.cargoType.includes("perishable") || 
                data.cargoType.includes("frozen") || 
                data.cargoType.includes("flowers")) {
        cargoTypeFactor = 1.5; // Perishable goods premium
      }
    }
    
    // Generate mode-specific costs
    if (transportMode === "air" || transportMode === "express" || transportMode === "any") {
      const airCost: AirTransportCost = {
        baseFare: Math.round(1200 * distanceFactor * weightFactor * cargoTypeFactor),
        baseFareCurrency: originIsUSA ? "USD" : (originIsAsia ? "JPY" : "EUR"),
        airportTaxes: Math.round(250 * distanceFactor),
        fuelSurcharge: Math.round(180 * distanceFactor * weightFactor),
        securityFee: transportMode === "express" ? 120 : 85,
        bankCharges: 35,
        seasonalFactor: 1.0, // No seasonal adjustment
        totalInOriginalCurrency: 0,
        airline: originIsAsia ? "ANA Airlines" : (originIsUSA ? "American Airlines" : "Lufthansa")
      };
      
      airCost.totalInOriginalCurrency = airCost.baseFare + airCost.airportTaxes + 
                                       airCost.fuelSurcharge + airCost.securityFee + 
                                       airCost.bankCharges;
                                       
      // Convert to user currency
      if (airCost.baseFareCurrency !== currency) {
        const rate = exchangeRates[currency] / exchangeRates[airCost.baseFareCurrency];
        airCost.totalConverted = Math.round(airCost.totalInOriginalCurrency * rate);
      } else {
        airCost.totalConverted = airCost.totalInOriginalCurrency;
      }
      
      defaultBreakdown.airCosts = airCost;
      defaultBreakdown.totalCost = airCost.totalConverted || airCost.totalInOriginalCurrency;
    }
    
    if (transportMode === "sea" || transportMode === "any") {
      const seaCost: SeaTransportCost = {
        baseFreight: Math.round(800 * distanceFactor * weightFactor * cargoTypeFactor),
        containerType: weightFactor > 1.0 ? "LCL" : "FCL",
        portHandling: Math.round(350 * distanceFactor),
        customDuties: Math.round(200 * cargoTypeFactor),
        fuelSurcharge: Math.round(150 * distanceFactor),
        documentationFees: 120,
        insurance: Math.round(100 * cargoTypeFactor),
        totalInUSD: 0,
        carrier: originIsAsia ? "COSCO Shipping" : (originIsUSA ? "Maersk Line" : "MSC")
      };
      
      seaCost.totalInUSD = seaCost.baseFreight + seaCost.portHandling + 
                          seaCost.customDuties + seaCost.fuelSurcharge + 
                          seaCost.documentationFees + seaCost.insurance;
                          
      // Convert to user currency
      if (currency !== "USD") {
        const rate = exchangeRates[currency] / exchangeRates["USD"];
        seaCost.totalConverted = Math.round(seaCost.totalInUSD * rate);
      } else {
        seaCost.totalConverted = seaCost.totalInUSD;
      }
      
      defaultBreakdown.seaCosts = seaCost;
      
      if (!defaultBreakdown.totalCost) {
        defaultBreakdown.totalCost = seaCost.totalConverted || seaCost.totalInUSD;
      }
    }
    
    if (transportMode === "road" || transportMode === "any") {
      const roadCost: RoadTransportCost = {
        baseFare: Math.round(500 * distanceFactor * weightFactor * cargoTypeFactor),
        distanceKm: Math.round(800 * distanceFactor),
        tollCharges: Math.round(80 * distanceFactor),
        borderCrossing: (originIsUSA && !destIsUSA) || (!originIsUSA && destIsUSA) ? 150 : 0,
        fuelSurcharge: Math.round(120 * distanceFactor),
        driverAllowance: Math.round(100 * distanceFactor),
        totalInOriginalCurrency: 0,
        carrier: originIsUSA ? "US Trucking Inc." : (originIsAsia ? "Asian Express" : "Euro Transport")
      };
      
      roadCost.totalInOriginalCurrency = roadCost.baseFare + roadCost.tollCharges + 
                                        (roadCost.borderCrossing || 0) + roadCost.fuelSurcharge + 
                                        roadCost.driverAllowance;
                                        
      // Convert to user currency if needed
      const originCurrency = originIsUSA ? "USD" : (originIsAsia ? "JPY" : "EUR");
      if (originCurrency !== currency) {
        const rate = exchangeRates[currency] / exchangeRates[originCurrency];
        roadCost.totalConverted = Math.round(roadCost.totalInOriginalCurrency * rate);
      } else {
        roadCost.totalConverted = roadCost.totalInOriginalCurrency;
      }
      
      defaultBreakdown.roadCosts = roadCost;
      
      if (!defaultBreakdown.totalCost) {
        defaultBreakdown.totalCost = roadCost.totalConverted || roadCost.totalInOriginalCurrency;
      }
    }
    
    // Calculate company cost (cost price)
    defaultBreakdown.companyCost = Math.round(defaultBreakdown.totalCost / (1 + defaultBreakdown.profitMargin));
    
    setFinancialBreakdown(defaultBreakdown);
  };
  
  const changeCurrency = (newCurrency: string) => {
    setUserCurrency(newCurrency);
    toast({
      title: "Currency Changed",
      description: `All prices now shown in ${newCurrency}`
    });
  };
  
  // If no route is selected yet
  if (!routeData || !routeData.origin || !routeData.destination) {
    return (
      <div className={cn("nexus-card-teal p-6", className)}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Cost Breakdown</h2>
          <span className="rounded-full bg-nexus-teal/20 px-3 py-1 text-xs font-medium text-nexus-teal">
            AI Optimized
          </span>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <DollarSign className="mb-4 h-12 w-12 text-white/40" />
          <h3 className="text-lg font-medium text-white">Select Origin and Destination</h3>
          <p className="mt-2 text-sm text-white/60">
            Complete your booking details to see a detailed cost analysis
          </p>
        </div>
      </div>
    );
  }
  
  // If we have route data but no financial breakdown yet
  if (!financialBreakdown) {
    return (
      <div className={cn("nexus-card-teal p-6", className)}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Cost Breakdown</h2>
          <span className="rounded-full bg-nexus-teal/20 px-3 py-1 text-xs font-medium text-nexus-teal">
            AI Optimized
          </span>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <RefreshCw className="mb-4 h-12 w-12 text-white/40 animate-spin" />
          <h3 className="text-lg font-medium text-white">Calculating Costs</h3>
          <p className="mt-2 text-sm text-white/60">
            Analyzing financial data for your shipment...
          </p>
        </div>
      </div>
    );
  }
  
  // Currency symbol mapping
  const currencySymbols: Record<string, React.ReactNode> = {
    USD: <DollarSign className="h-4 w-4" />,
    EUR: <Euro className="h-4 w-4" />,
    GBP: <PoundSterling className="h-4 w-4" />,
    JPY: <JapaneseYen className="h-4 w-4" />
  };
  
  // With a completed financial breakdown
  return (
    <div className={cn("nexus-card-teal p-6", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Financial Analysis</h2>
        <div className="flex items-center space-x-2">
          <span className="rounded-full bg-nexus-teal/20 px-3 py-1 text-xs font-medium text-nexus-teal">
            AI Optimized
          </span>
          <div className="flex">
            <Button 
              variant="ghost" 
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full",
                userCurrency === "USD" ? "bg-white/20" : "hover:bg-white/10"
              )}
              onClick={() => changeCurrency("USD")}
            >
              <DollarSign className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full",
                userCurrency === "EUR" ? "bg-white/20" : "hover:bg-white/10"
              )}
              onClick={() => changeCurrency("EUR")}
            >
              <Euro className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full",
                userCurrency === "GBP" ? "bg-white/20" : "hover:bg-white/10"
              )}
              onClick={() => changeCurrency("GBP")}
            >
              <PoundSterling className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-white/70">
          From <span className="font-medium text-white">{routeData.originLabel}</span> to{" "}
          <span className="font-medium text-white">{routeData.destinationLabel}</span>
        </p>
      </div>
      
      <Tabs defaultValue={selectedTransportMode} onValueChange={setSelectedTransportMode} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10">
          <TabsTrigger value="air" className="gap-2" disabled={!financialBreakdown.airCosts}>
            <Plane className="h-4 w-4" />
            <span>Air Freight</span>
          </TabsTrigger>
          <TabsTrigger value="sea" className="gap-2" disabled={!financialBreakdown.seaCosts}>
            <Ship className="h-4 w-4" />
            <span>Sea Freight</span>
          </TabsTrigger>
          <TabsTrigger value="road" className="gap-2" disabled={!financialBreakdown.roadCosts}>
            <Truck className="h-4 w-4" />
            <span>Road Transport</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Air Transport Costs */}
        <TabsContent value="air" className="mt-4 space-y-4">
          {financialBreakdown.airCosts && (
            <>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-medium text-white">Air Freight Details</h3>
                  <span className="text-sm text-white/70">
                    {financialBreakdown.airCosts.airline}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Base Fare</span>
                    <div className="flex items-center">
                      {currencySymbols[financialBreakdown.airCosts.baseFareCurrency] || null}
                      <span className="ml-1 text-sm font-medium text-white">
                        {financialBreakdown.airCosts.baseFare.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Airport Taxes</span>
                    <div className="flex items-center">
                      {currencySymbols[financialBreakdown.airCosts.baseFareCurrency] || null}
                      <span className="ml-1 text-sm font-medium text-white">
                        {financialBreakdown.airCosts.airportTaxes.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Fuel Surcharge</span>
                    <div className="flex items-center">
                      {currencySymbols[financialBreakdown.airCosts.baseFareCurrency] || null}
                      <span className="ml-1 text-sm font-medium text-white">
                        {financialBreakdown.airCosts.fuelSurcharge.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Security Fee</span>
                    <div className="flex items-center">
                      {currencySymbols[financialBreakdown.airCosts.baseFareCurrency] || null}
                      <span className="ml-1 text-sm font-medium text-white">
                        {financialBreakdown.airCosts.securityFee.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Bank Charges</span>
                    <div className="flex items-center">
                      {currencySymbols[financialBreakdown.airCosts.baseFareCurrency] || null}
                      <span className="ml-1 text-sm font-medium text-white">
                        {financialBreakdown.airCosts.bankCharges.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-white">Total</span>
                      <div className="flex items-center">
                        {currencySymbols[financialBreakdown.airCosts.baseFareCurrency] || null}
                        <span className="ml-1 text-sm font-bold text-white">
                          {financialBreakdown.airCosts.totalInOriginalCurrency.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    {financialBreakdown.airCosts.totalConverted && (
                      <div className="mt-1 flex justify-between">
                        <span className="text-xs text-white/70">Converted Total</span>
                        <div className="flex items-center">
                          {currencySymbols[userCurrency] || null}
                          <span className="ml-1 text-sm font-bold text-white">
                            {financialBreakdown.airCosts.totalConverted.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border border-nexus-blue/20 bg-nexus-blue/10 p-4">
                <div className="flex">
                  <Info className="mr-3 h-5 w-5 flex-shrink-0 text-nexus-blue" />
                  <div>
                    <h4 className="text-sm font-medium text-white">Air Freight Insights</h4>
                    <p className="mt-1 text-xs text-white/70">
                      Air freight is typically 4-5x more expensive than sea freight but delivers 5-6x faster.
                      Current fuel prices and seasonal demand are affecting rates by approximately 
                      {financialBreakdown.airCosts.seasonalFactor > 1 ? 
                        `+${Math.round((financialBreakdown.airCosts.seasonalFactor - 1) * 100)}%` : 
                        `${Math.round((1 - financialBreakdown.airCosts.seasonalFactor) * 100)}% reduction`}.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </TabsContent>
        
        {/* Sea Transport Costs */}
        <TabsContent value="sea" className="mt-4 space-y-4">
          {financialBreakdown.seaCosts && (
            <>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-medium text-white">Sea Freight Details</h3>
                  <div className="flex items-center">
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white">
                      {financialBreakdown.seaCosts.containerType}
                    </span>
                    <span className="ml-2 text-sm text-white/70">
                      {financialBreakdown.seaCosts.carrier}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Base Freight</span>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4" />
                      <span className="ml-1 text-sm font-medium text-white">
                        {financialBreakdown.seaCosts.baseFreight.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Port Handling</span>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4" />
                      <span className="ml-1 text-sm font-medium text-white">
                        {financialBreakdown.seaCosts.portHandling.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Custom Duties</span>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4" />
                      <span className="ml-1 text-sm font-medium text-white">
                        {financialBreakdown.seaCosts.customDuties.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Fuel Surcharge</span>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4" />
                      <span className="ml-1 text-sm font-medium text-white">
                        {financialBreakdown.seaCosts.fuelSurcharge.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Documentation</span>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4" />
                      <span className="ml-1 text-sm font-medium text-white">
                        {financialBreakdown.seaCosts.documentationFees.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Insurance</span>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4" />
                      <span className="ml-1 text-sm font-medium text-white">
                        {financialBreakdown.seaCosts.insurance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-white">Total (USD)</span>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4" />
                        <span className="ml-1 text-sm font-bold text-white">
                          {financialBreakdown.seaCosts.totalInUSD.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    {financialBreakdown.seaCosts.totalConverted && userCurrency !== "USD" && (
                      <div className="mt-1 flex justify-between">
                        <span className="text-xs text-white/70">Converted Total</span>
                        <div className="flex items-center">
                          {currencySymbols[userCurrency] || null}
                          <span className="ml-1 text-sm font-bold text-white">
                            {financialBreakdown.seaCosts.totalConverted.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border border-nexus-blue/20 bg-nexus-blue/10 p-4">
                <div className="flex">
                  <Info className="mr-3 h-5 w-5 flex-shrink-0 text-nexus-blue" />
                  <div>
                    <h4 className="text-sm font-medium text-white">Sea Freight Insights</h4>
                    <p className="mt-1 text-xs text-white/70">
                      International shipping is priced in USD. The {financialBreakdown.seaCosts.containerType} rate includes 
                      standard container loading costs. Port congestion at {routeData.destinationLabel} may add 1-2 days 
                      to delivery times. Consider booking 3 weeks in advance for best rates.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </TabsContent>
        
        {/* Road Transport Costs */}
        <TabsContent value="road" className="mt-4 space-y-4">
          {financialBreakdown.roadCosts && (
            <>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-medium text-white">Road Transport Details</h3>
                  <span className="text-sm text-white/70">
                    {financialBreakdown.roadCosts.carrier}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Base Fare</span>
                    <span className="text-sm font-medium text-white">
                      {financialBreakdown.roadCosts.baseFare.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Distance</span>
                    <span className="text-sm font-medium text-white">
                      {financialBreakdown.roadCosts.distanceKm.toLocaleString()} km
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Toll Charges</span>
                    <span className="text-sm font-medium text-white">
                      {financialBreakdown.roadCosts.tollCharges.toLocaleString()}
                    </span>
                  </div>
                  
                  {financialBreakdown.roadCosts.borderCrossing && financialBreakdown.roadCosts.borderCrossing > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-white/70">Border Crossing</span>
                      <span className="text-sm font-medium text-white">
                        {financialBreakdown.roadCosts.borderCrossing.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Fuel Surcharge</span>
                    <span className="text-sm font-medium text-white">
                      {financialBreakdown.roadCosts.fuelSurcharge.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Driver Allowance</span>
                    <span className="text-sm font-medium text-white">
                      {financialBreakdown.roadCosts.driverAllowance.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="border-t border-white/10 pt-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-white">Total</span>
                      <span className="text-sm font-bold text-white">
                        {financialBreakdown.roadCosts.totalInOriginalCurrency.toLocaleString()}
                      </span>
                    </div>
                    
                    {financialBreakdown.roadCosts.totalConverted && (
                      <div className="mt-1 flex justify-between">
                        <span className="text-xs text-white/70">Converted Total</span>
                        <div className="flex items-center">
                          {currencySymbols[userCurrency] || null}
                          <span className="ml-1 text-sm font-bold text-white">
                            {financialBreakdown.roadCosts.totalConverted.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border border-nexus-blue/20 bg-nexus-blue/10 p-4">
                <div className="flex">
                  <Info className="mr-3 h-5 w-5 flex-shrink-0 text-nexus-blue" />
                  <div>
                    <h4 className="text-sm font-medium text-white">Road Transport Insights</h4>
                    <p className="mt-1 text-xs text-white/70">
                      Road transport covers {financialBreakdown.roadCosts.distanceKm} km between 
                      {routeData.originLabel} and {routeData.destinationLabel}.
                      {financialBreakdown.roadCosts.borderCrossing && financialBreakdown.roadCosts.borderCrossing > 0 ? 
                        " International border crossing fees and wait times are included in the estimate." : 
                        " No border crossings on this route."}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Summary Cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm border border-white/10">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Customer Cost</h3>
            <CreditCard className="h-4 w-4 text-nexus-teal" />
          </div>
          <div className="flex items-center">
            {currencySymbols[userCurrency] || null}
            <p className="text-2xl font-bold text-white ml-1">
              {financialBreakdown.totalCost.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm border border-white/10">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Company Cost</h3>
            <DollarSign className="h-4 w-4 text-nexus-purple" />
          </div>
          <div className="flex items-center">
            {currencySymbols[userCurrency] || null}
            <p className="text-2xl font-bold text-white ml-1">
              {financialBreakdown.companyCost.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm border border-white/10">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Profit Margin</h3>
            <Clock className="h-4 w-4 text-nexus-blue" />
          </div>
          <div className="flex items-baseline space-x-2">
            <div className="flex items-center">
              {currencySymbols[userCurrency] || null}
              <p className="text-2xl font-bold text-white ml-1">
                {(financialBreakdown.totalCost - financialBreakdown.companyCost).toLocaleString()}
              </p>
            </div>
            <span className="text-sm font-medium text-green-400">
              +{Math.round(financialBreakdown.profitMargin * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Optimization Notice */}
      <div className="mt-4 rounded-lg bg-nexus-blue/10 p-4 border border-nexus-blue/20">
        <div className="flex">
          <Info className="mr-3 h-5 w-5 flex-shrink-0 text-nexus-blue" />
          <div>
            <h4 className="text-sm font-medium text-white">AI Cost Optimization</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Our AI has identified potential savings of {currencySymbols[userCurrency] || null} 
              {Math.round(financialBreakdown.totalCost * 0.12).toLocaleString()} through alternative routing and carrier selection.
            </p>
            <Button variant="link" size="sm" className="mt-2 h-auto p-0 text-xs text-nexus-blue">
              View optimization details
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostBreakdown;
