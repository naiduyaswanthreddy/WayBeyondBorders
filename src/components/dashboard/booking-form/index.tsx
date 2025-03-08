
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

// Import sub-components
import LocationSelector from "./LocationSelector";
import ShippingDatePicker from "./ShippingDatePicker";
import CargoTypeSelector from "./CargoTypeSelector";
import TransportModeSelector from "./TransportModeSelector";
import WeightInput from "./WeightInput";
import EstimatedArrival from "./EstimatedArrival";
import CargoItemsSection from "./CargoItemsSection";
import ActionButtons from "./ActionButtons";

// Import data and types
import { locations, cargoTypes, transportModes } from "./data";
import { BookingFormProps, CargoItem, TemplateData } from "./types";

const BookingForm: React.FC<BookingFormProps> = ({ className }) => {
  const [date, setDate] = useState<Date | undefined>();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [weight, setWeight] = useState("");
  const [transportMode, setTransportMode] = useState("any");
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [restrictionWarning, setRestrictionWarning] = useState("");
  const [availableRoutes, setAvailableRoutes] = useState<string[]>([]);
  const [cargoItems, setCargoItems] = useState<CargoItem[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const templateString = sessionStorage.getItem('selectedTemplate');
    if (templateString) {
      try {
        const template: TemplateData = JSON.parse(templateString);
        
        if (template.origin) setOrigin(template.origin);
        if (template.destination) setDestination(template.destination);
        if (template.cargoType) setCargoType(template.cargoType);
        if (template.weight) setWeight(template.weight);
        if (template.transportMode) setTransportMode(template.transportMode);
        if (template.date) {
          const templateDate = new Date(template.date);
          if (!isNaN(templateDate.getTime())) {
            setDate(templateDate);
          }
        }
        if (template.cargoItems && template.cargoItems.length > 0) {
          setCargoItems(template.cargoItems);
        }
        
        sessionStorage.removeItem('selectedTemplate');
        
        toast({
          title: "Template Loaded",
          description: `"${template.name}" template has been applied to your new booking.`
        });
      } catch (error) {
        console.error("Error parsing template data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (origin && destination) {
      const originLocation = locations.find(loc => loc.value === origin);
      const destLocation = locations.find(loc => loc.value === destination);
      
      const routeData = {
        origin,
        originLabel: originLocation?.label || origin,
        destination,
        destinationLabel: destLocation?.label || destination,
        date: date ? format(date, 'yyyy-MM-dd') : null,
        cargoType,
        weight,
        transportMode,
        cargoItems,
        availableRoutes
      };
      
      sessionStorage.setItem('routeMapData', JSON.stringify(routeData));
      
      const updateEvent = new CustomEvent('routeDataUpdated', { detail: routeData });
      window.dispatchEvent(updateEvent);
    }
  }, [origin, destination, date, cargoType, weight, transportMode, cargoItems, availableRoutes]);

  useEffect(() => {
    if (!cargoType) return;
    
    const selectedCargo = cargoTypes.find(c => c.value === cargoType);
    if (selectedCargo) {
      setRestrictions(selectedCargo.restrictions);
      
      if (selectedCargo.restrictions.includes("no-air") && (transportMode === "air" || transportMode === "express")) {
        setTransportMode("sea");
        setRestrictionWarning("This cargo type cannot be transported by air. Switched to sea freight.");
      } 
      else if (selectedCargo.restrictions.includes("prioritize-air") && transportMode !== "air" && transportMode !== "express") {
        setTransportMode("air");
        setRestrictionWarning("Perishable goods are best transported by air for faster delivery.");
      }
      else {
        setRestrictionWarning("");
      }
    }
  }, [cargoType]);

  useEffect(() => {
    if (!origin || !destination) return;
    
    const originLocation = locations.find(loc => loc.value === origin);
    const destLocation = locations.find(loc => loc.value === destination);
    
    if (!originLocation || !destLocation) return;
    
    const availableModes = [];
    
    if (originLocation.port && destLocation.port) {
      availableModes.push("sea");
    }
    
    if (originLocation.airport && destLocation.airport) {
      availableModes.push("air");
      availableModes.push("express");
    }
    
    if (originLocation.roadHub && destLocation.roadHub) {
      availableModes.push("road");
    }
    
    setAvailableRoutes(availableModes);
    
    if (transportMode !== "any" && !availableModes.includes(transportMode)) {
      setTransportMode("any");
      toast({
        title: "Transport Mode Reset",
        description: `Selected transport mode is not available between ${originLocation.label} and ${destLocation.label}`,
      });
    }
  }, [origin, destination]);

  const handleTransportModeChange = (value: string) => {
    const selectedCargo = cargoTypes.find(c => c.value === cargoType);
    
    if (selectedCargo?.restrictions.includes("no-air") && (value === "air" || value === "express")) {
      toast({
        title: "Transport Mode Restricted",
        description: "This cargo type cannot be transported by air.",
        variant: "destructive"
      });
      return;
    }
    
    if (value !== "any" && !availableRoutes.includes(value)) {
      toast({
        title: "Transport Mode Unavailable",
        description: `${value.charAt(0).toUpperCase() + value.slice(1)} transport is not available for this route.`,
        variant: "destructive"
      });
      return;
    }
    
    setTransportMode(value);
  };

  const handleFindRoutes = () => {
    if (!origin || !destination || !date || !cargoType || (!weight && cargoItems.length === 0)) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields to find optimal routes.",
        variant: "destructive"
      });
      return;
    }

    const originLocation = locations.find(loc => loc.value === origin);
    const destLocation = locations.find(loc => loc.value === destination);

    const bookingData = {
      origin,
      originLabel: originLocation?.label || origin,
      destination,
      destinationLabel: destLocation?.label || destination,
      date: date ? format(date, 'yyyy-MM-dd') : null,
      cargoType,
      weight,
      transportMode,
      cargoItems,
      availableRoutes
    };
    
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    toast({
      title: "Finding optimal routes",
      description: "Analyzing available routes based on your requirements...",
    });
    
    setTimeout(() => {
      navigate('/routes');
    }, 500);
  };

  const handleSaveTemplate = () => {
    if (!origin || !destination || !cargoType) {
      toast({
        title: "Incomplete Template",
        description: "Please fill in at least origin, destination and cargo type to save a template.",
        variant: "destructive"
      });
      return;
    }
    
    const templateName = `${locations.find(loc => loc.value === origin)?.label} to ${locations.find(loc => loc.value === destination)?.label}`;
    const templates = JSON.parse(localStorage.getItem('shipmentTemplates') || '[]');
    
    templates.push({
      id: Date.now().toString(),
      name: templateName,
      origin,
      destination,
      cargoType,
      transportMode,
      cargoItems
    });
    
    localStorage.setItem('shipmentTemplates', JSON.stringify(templates));
    
    toast({
      title: "Template Saved",
      description: `Your shipment details have been saved as "${templateName}"`
    });
  };

  return (
    <div className={cn("nexus-card-blue p-6", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">New Booking</h2>
        <span className="rounded-full bg-nexus-blue/20 px-3 py-1 text-xs font-medium text-nexus-blue">
          AI Optimized
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <LocationSelector 
          label="Origin"
          value={origin}
          onChange={setOrigin}
          locations={locations}
          placeholder="Select origin location"
        />

        <LocationSelector 
          label="Destination"
          value={destination}
          onChange={setDestination}
          locations={locations}
          placeholder="Select destination location"
        />

        <ShippingDatePicker 
          date={date}
          setDate={setDate}
        />

        <CargoTypeSelector 
          cargoType={cargoType}
          setCargoType={setCargoType}
          cargoTypes={cargoTypes}
          restrictions={restrictions}
        />

        <TransportModeSelector 
          transportMode={transportMode}
          handleTransportModeChange={handleTransportModeChange}
          transportModes={transportModes}
          cargoType={cargoType}
          cargoTypes={cargoTypes}
          availableRoutes={availableRoutes}
          restrictionWarning={restrictionWarning}
        />

        <WeightInput 
          weight={weight}
          setWeight={setWeight}
        />
        
        <EstimatedArrival 
          origin={origin}
          destination={destination}
        />
        
        <CargoItemsSection 
          cargoItems={cargoItems}
          setCargoItems={setCargoItems}
        />

        <ActionButtons 
          handleSaveTemplate={handleSaveTemplate}
          handleFindRoutes={handleFindRoutes}
        />
      </div>
    </div>
  );
};

export default BookingForm;
