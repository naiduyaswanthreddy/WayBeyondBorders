
import React from "react";
import { Bookmark, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  handleSaveTemplate: () => void;
  handleFindRoutes: () => void;
  handleBookingConfirmation: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleSaveTemplate,
  handleFindRoutes,
  handleBookingConfirmation,
}) => {
  return (
    <div className="col-span-2 mt-4 grid grid-cols-3 gap-4">
      <Button 
        variant="outline"
        className="border-white/10"
        onClick={handleSaveTemplate}
      >
        <Bookmark className="h-4 w-4 mr-2" />
        Save as Template
      </Button>
      <Button 
        className="nexus-button-primary"
        onClick={handleFindRoutes}
      >
        Find Optimal Routes
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      <Button 
        className="bg-green-600 hover:bg-green-700"
        onClick={handleBookingConfirmation}
      >
        Confirm Booking
        <CheckCircle2 className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default ActionButtons;
