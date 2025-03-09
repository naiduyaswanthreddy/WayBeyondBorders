
import React from "react";
import { Zap, Save, SendToBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ActionButtonsProps {
  handleSaveTemplate: () => void;
  handleBookingConfirmation: () => void;
  origin: string;
  destination: string;
  weight: string;
  isEmergencyShipment: boolean;
  setIsEmergencyShipment: (value: boolean) => void;
  hasIllegalGoods?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleSaveTemplate,
  handleBookingConfirmation,
  origin,
  destination,
  weight,
  isEmergencyShipment,
  setIsEmergencyShipment,
  hasIllegalGoods = false
}) => {
  return (
    <div className="col-span-2 space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="emergency-mode"
          checked={isEmergencyShipment}
          onCheckedChange={setIsEmergencyShipment}
        />
        <Label
          htmlFor="emergency-mode"
          className="cursor-pointer text-muted-foreground text-sm"
        >
          Emergency shipment (priority handling)
        </Label>
      </div>
      
      <div className="grid gap-3 md:grid-cols-2">
        <Button
          variant="outline"
          className="border-white/10 bg-white/5 hover:bg-white/10"
          onClick={handleSaveTemplate}
        >
          <Save className="mr-2 h-4 w-4" />
          Save as Template
        </Button>
        
        <Button
          onClick={handleBookingConfirmation}
          className="bg-nexus-blue hover:bg-nexus-blue/90"
          disabled={hasIllegalGoods}
        >
          <SendToBack className="mr-2 h-4 w-4" />
          {hasIllegalGoods ? "Remove Illegal Items" : "Confirm Booking"}
        </Button>
      </div>
      
      {hasIllegalGoods && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-md p-2 mt-2">
          <p className="text-xs text-red-300">
            Illegal or restricted items detected. Please remove these items before confirming the booking.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
