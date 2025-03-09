
import React, { useState } from "react";
import { Bookmark, ArrowRight, CheckCircle2, Share2, MapPin, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useEcoPoints } from "@/context/EcoPointsContext";
import { Badge } from "@/components/ui/badge";

interface ActionButtonsProps {
  handleSaveTemplate: () => void;
  handleFindRoutes: () => void;
  handleBookingConfirmation: () => void;
  origin?: string;
  destination?: string;
  weight?: string;
  isEmergencyShipment?: boolean;
  setIsEmergencyShipment?: (value: boolean) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleSaveTemplate,
  handleFindRoutes,
  handleBookingConfirmation,
  origin,
  destination,
  weight,
  isEmergencyShipment = false,
  setIsEmergencyShipment,
}) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [emergencyDialogOpen, setEmergencyDialogOpen] = useState(false);
  const { shareShipment, hasAvailableShares } = useEcoPoints();
  
  const canShare = origin && destination && weight && hasAvailableShares(origin, destination);
  
  const handleShareShipment = () => {
    if (origin && destination && weight) {
      shareShipment(origin, destination, weight);
      setShareDialogOpen(false);
      
      toast({
        title: "Shipment Shared!",
        description: "Your shipment has been added to our ride-sharing pool.",
      });
    }
  };
  
  const handleEmergencyToggle = () => {
    if (setIsEmergencyShipment) {
      setIsEmergencyShipment(!isEmergencyShipment);
    }
    setEmergencyDialogOpen(false);
    
    if (!isEmergencyShipment) {
      toast({
        title: "Emergency Shipping Activated",
        description: "Your shipment will be prioritized with air and express options.",
      });
    }
  };

  return (
    <div className="col-span-2 mt-4 grid grid-cols-3 gap-4">
      <div className="flex gap-2">
        <Button 
          variant="premium-outline"
          className="border-white/10 flex-1"
          onClick={handleSaveTemplate}
        >
          <Bookmark className="h-4 w-4 mr-2" />
          Save Template
        </Button>
        
        {canShare && (
          <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20 hover:text-green-300"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-white/10 bg-background">
              <DialogHeader>
                <DialogTitle>Share Your Shipment</DialogTitle>
                <DialogDescription>
                  Reduce costs and environmental impact by sharing your shipment with others.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <h4 className="font-medium">Route Details</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    From: <span className="text-white">{origin}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    To: <span className="text-white">{destination}</span>
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Share2 className="h-4 w-4 text-green-400" />
                      <span className="text-sm">Ride-sharing available</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      2-4 matches
                    </Badge>
                  </div>
                </div>
                
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <h4 className="font-medium mb-2">Benefits</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-400" />
                      <span>Estimated 15-30% cost reduction</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-400" />
                      <span>Reduced carbon footprint (CO₂ emissions)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-400" />
                      <span>Earn 50 Eco Points</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setShareDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleShareShipment}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Share Shipment
                  <Share2 className="ml-2 h-4 w-4" />
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <Button 
        variant="premium-blue"
        onClick={handleFindRoutes}
        className="animated-border"
      >
        Find Optimal Routes
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      
      <div className="flex gap-2">
        <Button 
          variant="premium"
          className="bg-gradient-to-r from-nexus-green to-nexus-green-dark flex-1"
          onClick={handleBookingConfirmation}
        >
          Confirm Booking
          <CheckCircle2 className="ml-2 h-4 w-4" />
        </Button>
        
        <Dialog open={emergencyDialogOpen} onOpenChange={setEmergencyDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant={isEmergencyShipment ? "destructive" : "outline"}
              className={!isEmergencyShipment ? "border-red-500/20 text-red-400 hover:bg-red-500/10" : ""}
            >
              <Plane className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md border-white/10 bg-background">
            <DialogHeader>
              <DialogTitle>Emergency Shipping Mode</DialogTitle>
              <DialogDescription>
                Activate emergency shipping for time-critical cargo.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Plane className="h-4 w-4 text-red-400" />
                  <h4 className="font-medium text-white">Emergency Transport Options</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Emergency shipping prioritizes air transport for medical supplies, urgent goods, and time-sensitive materials.
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Delivery Time:</span>
                    <span className="font-medium text-white">2-4 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cost Premium:</span>
                    <span className="font-medium text-white">+200-350%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Priority Level:</span>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      Maximum
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setEmergencyDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEmergencyToggle}
                variant={isEmergencyShipment ? "outline" : "destructive"}
              >
                {isEmergencyShipment ? "Deactivate Emergency Mode" : "Activate Emergency Mode"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ActionButtons;
