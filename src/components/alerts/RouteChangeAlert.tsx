
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, ArrowRight, Clock, DollarSign } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface RouteAlertProps {
  route: {
    origin: string;
    destination: string;
    originalRoute: string;
    newRoute: string;
    reason: string;
    costChange: string;
    delay: string;
  };
  onClose: () => void;
}

export const RouteChangeAlert: React.FC<RouteAlertProps> = ({ 
  route,
  onClose 
}) => {
  const handleAccept = () => {
    toast({
      title: "Route Change Accepted",
      description: "Your shipment has been rerouted to avoid delays.",
    });
    onClose();
  };

  const handleDecline = () => {
    toast({
      title: "Route Change Declined",
      description: "Your shipment will continue on the original route.",
      variant: "destructive",
    });
    onClose();
  };

  return (
    <AlertDialog defaultOpen={true} open={true} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="border-yellow-500/30 bg-gradient-to-b from-background to-yellow-950/20">
        <AlertDialogHeader>
          <div className="mb-2 flex items-center justify-center">
            <div className="rounded-full bg-yellow-500/20 p-3">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-xl text-white">
            Route Change Alert
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-white/70">
            A potential disruption has been detected on your route.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h4 className="mb-2 text-sm font-medium text-white/70">Shipment Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Origin:</div>
              <div className="text-right font-medium text-white">{route.origin}</div>
              <div className="text-muted-foreground">Destination:</div>
              <div className="text-right font-medium text-white">{route.destination}</div>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h4 className="mb-2 text-sm font-medium text-white/70">Reason for Change</h4>
            <p className="text-sm text-white">{route.reason}</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h4 className="mb-2 text-sm font-medium text-white/70">Route Change</h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Original:</span>
                <span className="text-sm font-medium text-white">{route.originalRoute}</span>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">New:</span>
                <span className="text-sm font-medium text-white">{route.newRoute}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4 text-yellow-500" />
                <span className="text-xs text-muted-foreground">Cost Change:</span>
              </div>
              <p className="mt-1 text-base font-medium text-white">{route.costChange}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                <span className="text-xs text-muted-foreground">Time Impact:</span>
              </div>
              <p className="mt-1 text-base font-medium text-white">{route.delay}</p>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel onClick={handleDecline}>
            Keep Original Route
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleAccept} className="bg-yellow-500 text-black hover:bg-yellow-600">
            Accept New Route
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
