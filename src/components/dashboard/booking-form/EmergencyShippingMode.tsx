
import React from "react";
import { X, ShieldAlert, Clock, Zap, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmergencyShippingModeProps {
  onClose: () => void;
  onActivate: () => void;
}

const EmergencyShippingMode: React.FC<EmergencyShippingModeProps> = ({ onClose, onActivate }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-sidebar rounded-lg border border-red-500/30 max-w-md w-full overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <ShieldAlert className="w-6 h-6 text-red-500 mr-2" />
              <h3 className="text-lg font-bold text-white">Emergency Shipping Mode</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <img 
                src="https://img.freepik.com/premium-photo/cargo-ships-loaded-with-containers-dock-port-maritime-trade-logistics-global-shipping-business_117255-3129.jpg" 
                alt="Emergency Shipping" 
                className="w-full h-32 object-cover rounded-md opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/30 flex items-end p-3">
                <p className="text-white text-sm font-medium">
                  Priority shipping with expedited processing
                </p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Activating emergency mode will prioritize your shipment with the fastest possible delivery at premium rates.
            </p>
            
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-black/20 rounded-md p-3">
                <Clock className="h-4 w-4 text-red-400 mb-1" />
                <h4 className="text-xs font-medium text-white">Processing Time</h4>
                <p className="text-sm font-bold text-red-400">-70%</p>
              </div>
              
              <div className="bg-black/20 rounded-md p-3">
                <DollarSign className="h-4 w-4 text-amber-400 mb-1" />
                <h4 className="text-xs font-medium text-white">Premium Fee</h4>
                <p className="text-sm font-bold text-amber-400">+120%</p>
              </div>
            </div>
            
            <div className="bg-red-900/20 border border-red-900/30 rounded-md p-3">
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-red-500 mr-1" />
                <h4 className="text-xs font-medium text-white">Features</h4>
              </div>
              <ul className="mt-1 text-xs text-muted-foreground space-y-1">
                <li>• 24/7 dedicated tracking support</li>
                <li>• Expedited customs clearance</li>
                <li>• Priority loading/unloading</li>
                <li>• Rush handling at all transit points</li>
                <li>• Guaranteed delivery timeframe</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex p-4 bg-black/20 border-t border-white/5">
          <Button variant="outline" className="flex-1 mr-2" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 bg-red-500 hover:bg-red-600" onClick={onActivate}>
            Activate Emergency Mode
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyShippingMode;
