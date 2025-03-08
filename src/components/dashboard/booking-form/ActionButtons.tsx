
import React from "react";
import { Bookmark, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  handleSaveTemplate: () => void;
  handleFindRoutes: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleSaveTemplate,
  handleFindRoutes,
}) => {
  return (
    <div className="col-span-2 mt-4 grid grid-cols-2 gap-4">
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
    </div>
  );
};

export default ActionButtons;
