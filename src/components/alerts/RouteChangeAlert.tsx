
import React from "react";
import { AlertTriangle, X, Truck, Clock, DollarSign, Route, Navigation } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface RouteChangeAlertProps {
  isOpen: boolean;
  onClose: () => void;
  alertDetails: {
    reason: string;
    newRoute: string;
    additionalCost: string;
    delay: string;
    originalEta: string;
    newEta: string;
  };
}

export const RouteChangeAlert: React.FC<RouteChangeAlertProps> = ({
  isOpen,
  onClose,
  alertDetails
}) => {
  const handleAccept = () => {
    toast({
      title: "Route Change Accepted",
      description: "Your shipment has been rerouted and is back on track.",
    });
    onClose();
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 py-6 sm:items-start sm:justify-end">
      <div className="w-full max-w-sm rounded-lg border border-red-500/20 bg-background/95 p-4 shadow-lg backdrop-blur-sm sm:mt-16 sm:mr-6">
        <div className="flex items-start">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-500/20">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-white">Route Change Required</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {alertDetails.reason}
            </p>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <Route className="mr-1 h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">New Route:</span>
                </div>
                <span className="font-medium text-white">{alertDetails.newRoute}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <DollarSign className="mr-1 h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Additional Cost:</span>
                </div>
                <span className="font-medium text-red-400">{alertDetails.additionalCost}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Delay:</span>
                </div>
                <span className="font-medium text-yellow-400">{alertDetails.delay}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <Navigation className="mr-1 h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Original ETA:</span>
                </div>
                <span className="line-through font-medium text-muted-foreground">{alertDetails.originalEta}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <Truck className="mr-1 h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">New ETA:</span>
                </div>
                <span className="font-medium text-white">{alertDetails.newEta}</span>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button 
                size="sm" 
                className="w-full"
                onClick={handleAccept}
              >
                Accept Change
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={onClose}
              >
                Details
              </Button>
            </div>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              className="inline-flex rounded-md text-muted-foreground hover:text-white focus:outline-none"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility function to simulate a route change alert
export const simulateRouteChangeAlert = (callback: (isOpen: boolean, details: any) => void) => {
  const reasons = [
    "Severe weather conditions ahead on current route",
    "Port congestion detected at destination",
    "Customs delay at transit point",
    "Traffic congestion on land route segment",
    "Mechanical issue with transport vehicle"
  ];
  
  const routes = [
    "Via Singapore - Bangkok - Dubai",
    "Northern Sea Route",
    "Trans-Siberian Rail Route",
    "Panama Canal Alternative",
    "Southern African Route"
  ];
  
  // Choose random reason and route
  const reason = reasons[Math.floor(Math.random() * reasons.length)];
  const newRoute = routes[Math.floor(Math.random() * routes.length)];
  
  // Generate random additional cost between $100-500
  const additionalCost = `$${Math.floor(Math.random() * 400) + 100}`;
  
  // Generate random delay between 4-48 hours
  const delayHours = Math.floor(Math.random() * 44) + 4;
  const delay = `${delayHours} hours`;
  
  // Calculate ETAs
  const now = new Date();
  const originalEta = new Date(now);
  originalEta.setDate(originalEta.getDate() + 5);
  
  const newEta = new Date(originalEta);
  newEta.setHours(newEta.getHours() + delayHours);
  
  const alertDetails = {
    reason,
    newRoute,
    additionalCost,
    delay,
    originalEta: originalEta.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    newEta: newEta.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
  
  callback(true, alertDetails);
  
  toast({
    title: "Alert: Route Change Required",
    description: reason,
    variant: "destructive",
  });
};
