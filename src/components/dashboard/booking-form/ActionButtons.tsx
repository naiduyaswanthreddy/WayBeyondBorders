
import React from "react";
import { Zap, Save, Route as RouteIcon, Calendar, CalendarClock, Users } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ActionButtonsProps {
  handleSaveTemplate: () => void;
  handleBookingConfirmation: () => void;
  handleFindRoutes: () => void;
  origin: string;
  destination: string;
  weight: string;
  isEmergencyShipment: boolean;
  setIsEmergencyShipment: (value: boolean) => void;
  isMultiStop?: boolean;
  isRideSharing?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleSaveTemplate,
  handleBookingConfirmation,
  handleFindRoutes,
  origin,
  destination,
  weight,
  isEmergencyShipment,
  setIsEmergencyShipment,
  isMultiStop = false,
  isRideSharing = false
}) => {
  return (
    <div className="col-span-2 space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-2">
          {isEmergencyShipment ? (
            <Zap className="h-5 w-5 text-amber-400" />
          ) : (
            <Calendar className="h-5 w-5 text-muted-foreground" />
          )}
          <div>
            <h3 className="text-sm font-medium text-white">Emergency Shipment</h3>
            <p className="text-xs text-muted-foreground">
              Priority processing and expedited delivery
            </p>
          </div>
        </div>
        <Switch
          checked={isEmergencyShipment}
          onCheckedChange={setIsEmergencyShipment}
          className="data-[state=checked]:bg-amber-500"
        />
      </div>

      <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={handleSaveTemplate}
        >
          <Save className="h-4 w-4" />
          <span>Save Template</span>
        </Button>

        <Button
          variant="outline"
          className="w-full gap-2 border-nexus-purple/30 bg-nexus-purple/10 text-nexus-purple hover:bg-nexus-purple/20"
          onClick={handleFindRoutes}
        >
          <RouteIcon className="h-4 w-4" />
          <span>Find Routes</span>
        </Button>

        <Button
          className="w-full gap-2 bg-nexus-blue hover:bg-nexus-blue/90"
          onClick={handleBookingConfirmation}
        >
          {isMultiStop ? (
            <CalendarClock className="h-4 w-4" />
          ) : isRideSharing ? (
            <Users className="h-4 w-4" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
          
          <span>Confirm Booking</span>
          
          {isMultiStop && (
            <Badge variant="outline" className="ml-1 border-white/30 bg-white/10">
              Multi-Stop
            </Badge>
          )}
          
          {isRideSharing && (
            <Badge variant="outline" className="ml-1 border-green-500/30 bg-green-500/10 text-green-400">
              Shared
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
