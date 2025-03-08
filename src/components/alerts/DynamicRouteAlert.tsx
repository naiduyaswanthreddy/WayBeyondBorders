
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
import { AlertTriangle, ArrowRight, Clock, DollarSign, Route } from "lucide-react";

interface DynamicRouteAlertProps {
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
  onAccept: () => void;
}

export const DynamicRouteAlert: React.FC<DynamicRouteAlertProps> = ({ 
  route,
  onClose,
  onAccept
}) => {
  return (
    <AlertDialog defaultOpen={true} open={true} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="border-amber-500/30 bg-gradient-to-b from-background to-amber-950/20">
        <AlertDialogHeader>
          <div className="mb-2 flex items-center justify-center">
            <div className="rounded-full bg-amber-500/20 p-3">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-xl text-white">
            Route Change Recommendation
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-white/70">
            A potential disruption requires a route change.
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
                <ArrowRight className="h-4 w-4 text-amber-500" />
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
                <DollarSign className="mr-2 h-4 w-4 text-amber-500" />
                <span className="text-xs text-muted-foreground">Cost Impact:</span>
              </div>
              <p className="mt-1 text-base font-medium text-white">{route.costChange}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-amber-500" />
                <span className="text-xs text-muted-foreground">Time Impact:</span>
              </div>
              <p className="mt-1 text-base font-medium text-white">{route.delay}</p>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel onClick={onClose} className="border-white/10 bg-white/5">
            Keep Original Route
          </AlertDialogCancel>
          <AlertDialogAction onClick={onAccept} className="bg-amber-500 text-black hover:bg-amber-600">
            Accept New Route
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
