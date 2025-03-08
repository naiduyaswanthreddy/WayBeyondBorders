
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
import TermsConfirmationDialog from "./TermsConfirmationDialog";

// Import data and types
import { locations, cargoTypes, transportModes } from "./data";
import { BookingFormProps, CargoItem, TemplateData } from "./types";

const BookingForm: React.FC<BookingFormProps> = ({ className }) => {
  const [date, setDate] = useState<Date | undefined>();
  const [origin, setOrigin] = useState("");
  const [originInput, setOriginInput] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [weight, setWeight] = useState("");
  const [transportMode, setTransportMode] = useState("any");
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [restrictionWarning, setRestrictionWarning] = useState("");
  const [availableRoutes, setAvailableRoutes] = useState<string[]>([]);
  const [cargoItems, setCargoItems] = useState<CargoItem[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [estimatedArrival, setEstimatedArrival] = useState<string>("");

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
    if ((origin || originInput) && (destination || destinationInput)) {
      const originLocation = locations.find(loc => loc.value === origin);
      const destLocation = locations.find(loc => loc.value === destination);
      
      const finalOriginLabel = originLocation?.label || originInput;
      const finalDestinationLabel = destLocation?.label || destinationInput;
      
      calculateEstimatedArrival(finalOriginLabel, finalDestinationLabel, transportMode);
      
      const routeData = {
        origin: origin || "manual",
        originLabel: finalOriginLabel,
        destination: destination || "manual",
        destinationLabel: finalDestinationLabel,
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
  }, [origin, destination, originInput, destinationInput, date, cargoType, weight, transportMode, cargoItems, availableRoutes]);

  const calculateEstimatedArrival = (originLabel: string, destinationLabel: string, mode: string) => {
    if (!originLabel || !destinationLabel) {
      setEstimatedArrival("");
      return;
    }
    
    let days = "";
    
    if ((originLabel.includes("Shanghai") && destinationLabel.includes("Rotterdam")) ||
        (originLabel.includes("Rotterdam") && destinationLabel.includes("Shanghai"))) {
      days = mode === "air" || mode === "express" ? "2-3" : mode === "sea" ? "30-35" : "15-20";
    }
    else if ((originLabel.includes("New York") && destinationLabel.includes("Hamburg")) ||
             (originLabel.includes("Hamburg") && destinationLabel.includes("New York"))) {
      days = mode === "air" || mode === "express" ? "1-2" : mode === "sea" ? "10-14" : "5-8";
    }
    else if ((originLabel.includes("Dubai") && destinationLabel.includes("Mumbai")) ||
             (originLabel.includes("Mumbai") && destinationLabel.includes("Dubai"))) {
      days = mode === "air" || mode === "express" ? "1" : mode === "sea" ? "4-6" : "3-4";
    }
    else if ((originLabel.includes("Tokyo") && destinationLabel.includes("Los Angeles")) ||
             (originLabel.includes("Los Angeles") && destinationLabel.includes("Tokyo"))) {
      days = mode === "air" || mode === "express" ? "1-2" : mode === "sea" ? "12-15" : "7-10";
    }
    else {
      days = mode === "air" || mode === "express" ? "2-4" : mode === "sea" ? "14-28" : "7-14";
    }
    
    setEstimatedArrival(`${days} days (AI optimized)`);
  };

  useEffect(() => {
    if ((!origin && !originInput) || (!destination && !destinationInput)) return;
    
    const originLocation = locations.find(loc => loc.value === origin);
    const destLocation = locations.find(loc => loc.value === destination);
    
    if ((!originLocation && originInput) || (!destLocation && destinationInput)) {
      setAvailableRoutes(["sea", "air", "road", "express"]);
      return;
    }
    
    if (originLocation && destLocation) {
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
          description: `Selected transport mode is not available between ${originLocation.label} and ${destLocation.label}`
        });
      }
    }
  }, [origin, destination, originInput, destinationInput]);

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

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!origin && !originInput) errors.origin = "Source location is required";
    if (!destination && !destinationInput) errors.destination = "Destination location is required";
    if (!date) errors.date = "Shipping date is required";
    if (!cargoType) errors.cargoType = "Cargo type is required";
    if (!weight && cargoItems.length === 0) errors.weight = "Weight or cargo items are required";
    
    setValidationErrors(errors);
    
    return Object.keys(errors).length === 0;
  };

  const handleFindRoutes = () => {
    if (!validateForm()) {
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
      origin: origin || "manual",
      originLabel: originLocation?.label || originInput,
      destination: destination || "manual",
      destinationLabel: destLocation?.label || destinationInput,
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
      description: "Analyzing available routes based on your requirements..."
    });
    
    setTimeout(() => {
      navigate('/routes');
    }, 500);
  };
  
  const handleBookingConfirmation = () => {
    if (!validateForm()) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before confirming booking.",
        variant: "destructive"
      });
      return;
    }
    
    setConfirmDialogOpen(true);
  };
  
  const completeBooking = () => {
    const originLocation = locations.find(loc => loc.value === origin);
    const destLocation = locations.find(loc => loc.value === destination);

    const bookingData = {
      id: `BK-${Date.now().toString().slice(-6)}`,
      origin,
      originLabel: originLocation?.label || originInput,
      destination,
      destinationLabel: destLocation?.label || destinationInput,
      date: date ? format(date, 'yyyy-MM-dd') : null,
      cargoType,
      weight,
      transportMode,
      cargoItems,
      availableRoutes,
      status: "Confirmed",
      createdAt: new Date().toISOString()
    };
    
    const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    bookingHistory.push(bookingData);
    localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory));
    
    toast({
      title: "Booking Confirmed",
      description: `Booking #${bookingData.id} has been confirmed successfully.`
    });
    
    setOrigin("");
    setOriginInput("");
    setDestination("");
    setDestinationInput("");
    setDate(undefined);
    setCargoType("");
    setWeight("");
    setTransportMode("any");
    setCargoItems([]);
    
    setTimeout(() => {
      navigate('/bookings', { state: { activeTab: 'history' } });
    }, 1000);
  };

  const handleSaveTemplate = () => {
    if (!origin && !originInput || !destination && !destinationInput || !cargoType) {
      toast({
        title: "Incomplete Template",
        description: "Please fill in at least origin, destination and cargo type to save a template.",
        variant: "destructive"
      });
      return;
    }
    
    const originLocation = locations.find(loc => loc.value === origin);
    const destLocation = locations.find(loc => loc.value === destination);
    
    const templateName = `${originLocation?.label || originInput} to ${destLocation?.label || destinationInput}`;
    const templates = JSON.parse(localStorage.getItem('shipmentTemplates') || '[]');
    
    templates.push({
      id: Date.now().toString(),
      name: templateName,
      origin,
      originInput,
      destination,
      destinationInput,
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
        <div className="space-y-2">
          <LocationSelector 
            label="Origin"
            value={origin}
            onChange={setOrigin}
            manualInput={originInput}
            onManualInputChange={setOriginInput}
            locations={locations}
            placeholder="Select or enter origin location"
            error={validationErrors.origin}
          />
          {validationErrors.origin && (
            <p className="text-xs text-destructive">{validationErrors.origin}</p>
          )}
        </div>

        <div className="space-y-2">
          <LocationSelector 
            label="Destination"
            value={destination}
            onChange={setDestination}
            manualInput={destinationInput}
            onManualInputChange={setDestinationInput}
            locations={locations}
            placeholder="Select or enter destination location"
            error={validationErrors.destination}
          />
          {validationErrors.destination && (
            <p className="text-xs text-destructive">{validationErrors.destination}</p>
          )}
        </div>

        <div className="space-y-2">
          <ShippingDatePicker 
            date={date}
            setDate={setDate}
            error={validationErrors.date}
          />
          {validationErrors.date && (
            <p className="text-xs text-destructive">{validationErrors.date}</p>
          )}
        </div>

        <div className="space-y-2">
          <CargoTypeSelector 
            cargoType={cargoType}
            setCargoType={setCargoType}
            cargoTypes={cargoTypes}
            restrictions={restrictions}
            error={validationErrors.cargoType}
          />
          {validationErrors.cargoType && (
            <p className="text-xs text-destructive">{validationErrors.cargoType}</p>
          )}
        </div>

        <TransportModeSelector 
          transportMode={transportMode}
          handleTransportModeChange={handleTransportModeChange}
          transportModes={transportModes}
          cargoType={cargoType}
          cargoTypes={cargoTypes}
          availableRoutes={availableRoutes}
          restrictionWarning={restrictionWarning}
        />

        <div className="space-y-2">
          <WeightInput 
            weight={weight}
            setWeight={setWeight}
            error={validationErrors.weight}
          />
          {validationErrors.weight && (
            <p className="text-xs text-destructive">{validationErrors.weight}</p>
          )}
        </div>
        
        <EstimatedArrival 
          estimatedTime={estimatedArrival}
          origin={origin || originInput}
          destination={destination || destinationInput}
        />
        
        <CargoItemsSection 
          cargoItems={cargoItems}
          setCargoItems={setCargoItems}
        />

        <ActionButtons 
          handleSaveTemplate={handleSaveTemplate}
          handleBookingConfirmation={handleBookingConfirmation}
          handleFindRoutes={handleFindRoutes}
        />
      </div>
      
      <TermsConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={completeBooking}
      />
    </div>
  );
};

export default BookingForm;
