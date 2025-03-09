
import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmergencyShippingModeProps {
  onClose: () => void;
  onActivate: () => void;
}

const EmergencyShippingMode: React.FC<EmergencyShippingModeProps> = ({
  onClose,
  onActivate
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h3 className="text-xl font-semibold text-white">Emergency Shipping Mode</h3>
        <p className="mt-2 text-muted-foreground">
          Activate emergency shipping for time-critical cargo.
        </p>
        
        <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <div className="flex items-start">
            <AlertTriangle className="mr-3 h-5 w-5 text-red-400" />
            <div>
              <h4 className="font-medium text-red-400">Emergency Transport Options</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Emergency shipping prioritizes air transport for medical supplies, urgent goods, and time-sensitive materials.
              </p>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Delivery Time:</span>
                  <span className="text-sm font-medium text-white">2-4 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cost Premium:</span>
                  <span className="text-sm font-medium text-white">+200-350%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Priority Level:</span>
                  <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                    Maximum
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-end gap-x-3">
          <Button 
            variant="ghost" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            onClick={onActivate}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Activate Emergency Mode
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyShippingMode;
