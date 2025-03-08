
import React from "react";
import { Package, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

// Sample template data
const templateData = [
  {
    id: "TPL-001",
    name: "Electronics Shipment",
    origin: "shanghai",
    originLabel: "Shanghai, China",
    destination: "rotterdam",
    destinationLabel: "Rotterdam, Netherlands",
    cargoType: "electronics",
    weight: "1200",
    transportMode: "eco-friendly"
  },
  {
    id: "TPL-002",
    name: "Medical Supplies",
    origin: "newyork",
    originLabel: "New York, USA",
    destination: "hamburg",
    destinationLabel: "Hamburg, Germany",
    cargoType: "perishable",
    weight: "850",
    transportMode: "fastest"
  },
  {
    id: "TPL-003",
    name: "Luxury Goods",
    origin: "dubai",
    originLabel: "Dubai, UAE",
    destination: "mumbai",
    destinationLabel: "Mumbai, India",
    cargoType: "fragile",
    weight: "450",
    transportMode: "reliable"
  },
  {
    id: "TPL-004",
    name: "Auto Parts",
    origin: "tokyo",
    originLabel: "Tokyo, Japan",
    destination: "losangeles",
    destinationLabel: "Los Angeles, USA",
    cargoType: "machinery",
    weight: "3200",
    transportMode: "cheapest"
  }
];

export const ShipmentTemplates = () => {
  const navigate = useNavigate();

  const useTemplate = (templateId: string) => {
    // Find the selected template
    const template = templateData.find(t => t.id === templateId);
    
    // Store the template in session storage to use it for pre-filling the form
    if (template) {
      sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
      
      // Also update the route map data to immediately reflect the template's route
      const routeMapData = {
        origin: template.origin,
        originLabel: template.originLabel,
        destination: template.destination,
        destinationLabel: template.destinationLabel,
        cargoType: template.cargoType,
        weight: template.weight,
        transportMode: template.transportMode
      };
      sessionStorage.setItem('routeMapData', JSON.stringify(routeMapData));
      
      // Trigger a custom event to update the route map
      const updateEvent = new CustomEvent('routeDataUpdated', { detail: routeMapData });
      window.dispatchEvent(updateEvent);
      
      toast({
        title: "Template Selected",
        description: `Using "${template.name}" template for new shipment.`,
      });
      
      // Navigate to bookings page with activeTab=new-booking to focus on the form
      // Use the navigate state to indicate we want to show the new booking tab
      navigate('/bookings', { state: { activeTab: 'new-booking' } });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {templateData.map((template) => (
          <div 
            key={template.id}
            className="flex cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
          >
            <Package className="mr-4 h-6 w-6 text-nexus-purple" />
            <div className="flex-1">
              <h3 className="font-medium text-white">{template.name}</h3>
              <p className="text-sm text-muted-foreground">
                {template.originLabel} → {template.destinationLabel}
              </p>
              <div className="mt-2 flex gap-2">
                <span className="rounded-full bg-nexus-blue/20 px-2 py-0.5 text-xs text-nexus-blue">
                  {template.cargoType}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {template.weight} kg
                </span>
              </div>
              <div className="mt-3">
                <Button 
                  size="sm" 
                  className="w-full gap-1" 
                  onClick={() => useTemplate(template.id)}
                >
                  <Check className="h-4 w-4" />
                  Use Template
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
