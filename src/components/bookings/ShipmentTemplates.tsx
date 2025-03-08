
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
    origin: "Shanghai, China",
    destination: "Rotterdam, Netherlands",
    cargoType: "Electronics",
    weight: "1,200 kg",
    transportMode: "Eco-Friendly Route"
  },
  {
    id: "TPL-002",
    name: "Medical Supplies",
    origin: "New York, USA",
    destination: "Hamburg, Germany",
    cargoType: "Pharmaceuticals",
    weight: "850 kg",
    transportMode: "Fastest Route"
  },
  {
    id: "TPL-003",
    name: "Luxury Goods",
    origin: "Dubai, UAE",
    destination: "Mumbai, India",
    cargoType: "Luxury Goods",
    weight: "450 kg",
    transportMode: "Most Reliable"
  },
  {
    id: "TPL-004",
    name: "Auto Parts",
    origin: "Tokyo, Japan",
    destination: "Los Angeles, USA",
    cargoType: "Automotive",
    weight: "3,200 kg",
    transportMode: "Most Economical"
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
      
      toast({
        title: "Template Selected",
        description: `Using "${template.name}" template for new shipment.`,
      });
      
      // Navigate to new booking form
      navigate('/bookings');
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
                {template.origin} → {template.destination}
              </p>
              <div className="mt-2 flex gap-2">
                <span className="rounded-full bg-nexus-blue/20 px-2 py-0.5 text-xs text-nexus-blue">
                  {template.cargoType}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {template.weight}
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
