import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

import LocationSelector from "./LocationSelector";
import ShippingDatePicker from "./ShippingDatePicker";
import CargoTypeSelector from "./CargoTypeSelector";
import TransportModeSelector from "./TransportModeSelector";
import WeightInput from "./WeightInput";
import CargoItemsSection from "./CargoItemsSection";
import ActionButtons from "./ActionButtons";
import TermsConfirmationDialog from "./TermsConfirmationDialog";
import EstimatedArrival from "./EstimatedArrival";
import RecommendedShippingDays from "../RecommendedShippingDays";

import { locations, cargoTypes, transportModes } from "./data";
import { BookingFormProps } from "./types";

const SingleBookingForm: React.FC<BookingFormProps> = ({ className }) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [cargoType, setCargoType] = useState("");
  const [weight, setWeight] = useState("");
  const [transportMode, setTransportMode] = useState("any");
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [restrictionWarning, setRestrictionWarning] = useState("");
  const [availableRoutes, setAvailableRoutes] = useState<string[]>([]);
  const [estimatedArrival, setEstimatedArrival] = useState("");
  const [cargoItems, setCargoItems] = useState<any[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isEmergencyShipment, setIsEmergencyShipment] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (origin !== "" && destination !== "") {
      calculateEstimatedArrival();
    } else {
      setEstimatedArrival("");
    }
  }, [origin, destination, originInput, destinationInput, transportMode]);

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

  const calculateEstimatedArrival = () => {
    const originLabel = origin 
      ? locations.find(loc => loc.value === origin)?.label
      : originInput;
    
    const destinationLabel = destination
      ? locations.find(loc => loc.value === destination)?.label
      : destinationInput;
    
    if (!originLabel || !destinationLabel) {
      setEstimatedArrival("");
      return;
    }
    
    let days = 0;
    
    if ((originLabel.includes("New York") || originLabel.includes("Los Angeles") || originLabel.includes("Miami")) && 
        (destinationLabel.includes("London") || destinationLabel.includes("Rotterdam") || destinationLabel.includes("Hamburg"))) {
      days = transportMode === "air" || transportMode === "express" ? 1.5 : transportMode === "sea" ? 10 : 6;
    }
    else if ((destinationLabel.includes("New York") || destinationLabel.includes("Los Angeles") || destinationLabel.includes("Miami")) && 
             (originLabel.includes("London") || originLabel.includes("Rotterdam") || originLabel.includes("Hamburg"))) {
      days = transportMode === "air" || transportMode === "express" ? 1.5 : transportMode === "sea" ? 10 : 6;
    }
    else if ((originLabel.includes("Shanghai") || originLabel.includes("Singapore") || originLabel.includes("Tokyo")) && 
             (destinationLabel.includes("New York") || destinationLabel.includes("Los Angeles") || 
              destinationLabel.includes("London") || destinationLabel.includes("Rotterdam"))) {
      days = transportMode === "air" || transportMode === "express" ? 2.5 : transportMode === "sea" ? 21 : 14;
    }
    else if ((destinationLabel.includes("Shanghai") || destinationLabel.includes("Singapore") || destinationLabel.includes("Tokyo")) && 
             (originLabel.includes("New York") || originLabel.includes("Los Angeles") || 
              originLabel.includes("London") || originLabel.includes("Rotterdam"))) {
      days = transportMode === "air" || transportMode === "express" ? 2.5 : transportMode === "sea" ? 21 : 14;
    }
    else if ((originLabel.includes("Dubai") || destinationLabel.includes("Dubai"))) {
      days = transportMode === "air" || transportMode === "express" ? 2 : transportMode === "sea" ? 15 : 10;
    }
    else if ((originLabel.includes("Sydney") || destinationLabel.includes("Sydney"))) {
      days = transportMode === "air" || transportMode === "express" ? 2.5 : transportMode === "sea" ? 25 : 17.5;
    }
    else {
      days = transportMode === "air" || transportMode === "express" ? 3 : transportMode === "sea" ? 21 : 10.5;
    }
    
    if (date) {
      const arrivalDate = new Date(date);
      arrivalDate.setDate(arrivalDate.getDate() + Math.ceil(days));
      
      const formattedArrival = format(arrivalDate, 'MMM d, yyyy');
      setEstimatedArrival(`${Math.ceil(days)} days (${formattedArrival})`);
      
      const routeData = {
        origin: originLabel,
        destination: destinationLabel,
        date: format(date, 'yyyy-MM-dd'),
        arrivalDate: format(arrivalDate, 'yyyy-MM-dd'),
        cargoType,
        weight,
        transportMode,
        isMultiStop: false
      };
      
      sessionStorage.setItem('routeMapData', JSON.stringify(routeData));
      
      const updateEvent = new CustomEvent('routeDataUpdated', { detail: routeData });
      window.dispatchEvent(updateEvent);
    } else {
      setEstimatedArrival(`${Math.ceil(days)} days`);
    }
  };

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
    
    setTransportMode(value);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!origin && !originInput) errors.origin = "Origin is required";
    if (!destination && !destinationInput) errors.destination = "Destination is required";
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

    const originLabel = origin 
      ? locations.find(loc => loc.value === origin)?.label
      : originInput;
    
    const destinationLabel = destination
      ? locations.find(loc => loc.value === destination)?.label
      : destinationInput;

    const bookingData = {
      origin,
      originInput,
      originLabel,
      destination,
      destinationInput,
      destinationLabel,
      date: date ? format(date, 'yyyy-MM-dd') : null,
      cargoType,
      weight,
      transportMode,
      cargoItems,
      estimatedArrival,
      isMultiStop: false
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
    const originLabel = origin 
      ? locations.find(loc => loc.value === origin)?.label
      : originInput;
    
    const destinationLabel = destination
      ? locations.find(loc => loc.value === destination)?.label
      : destinationInput;
    
    const bookingData = {
      id: `BK-${Date.now().toString().slice(-6)}`,
      isMultiStop: false,
      origin: originLabel,
      destination: destinationLabel,
      date: date ? format(date, 'yyyy-MM-dd') : null,
      cargoType,
      weight,
      transportMode,
      cargoItems,
      estimatedArrival,
      status: "Confirmed",
      createdAt: new Date().toISOString()
    };
    
    const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    bookingHistory.push(bookingData);
    localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory));
    
    toast({
      title: "Booking Confirmed",
      description: `Booking #${bookingData.id} has been confirmed and saved to history.`
    });
    
    setOrigin("");
    setDestination("");
    setOriginInput("");
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
    if (!validateForm()) {
      toast({
        title: "Incomplete Template",
        description: "Please fill in all required fields to save a template.",
        variant: "destructive"
      });
      return;
    }
    
    const originLabel = origin 
      ? locations.find(loc => loc.value === origin)?.label
      : originInput;
    
    const destinationLabel = destination
      ? locations.find(loc => loc.value === destination)?.label
      : destinationInput;
    
    const templateName = `${originLabel} to ${destinationLabel}`;
    const templates = JSON.parse(localStorage.getItem('shipmentTemplates') || '[]');
    
    templates.push({
      id: Date.now().toString(),
      name: templateName,
      isMultiStop: false,
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

  const originLabel = origin 
    ? locations.find(loc => loc.value === origin)?.label
    : originInput;
  
  const destinationLabel = destination
    ? locations.find(loc => loc.value === destination)?.label
    : destinationInput;

  return (
    <div className={cn("nexus-card-blue p-6", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Shipment Details</h2>
        <span className="rounded-full bg-nexus-blue/20 px-3 py-1 text-xs font-medium text-nexus-blue">AI Route Optimizer</span>
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
        
        <CargoItemsSection 
          cargoItems={cargoItems}
          setCargoItems={setCargoItems}
        />

        <EstimatedArrival 
          estimatedTime={estimatedArrival} 
          origin={originLabel || ""} 
          destination={destinationLabel || ""} 
          transportMode={transportMode}
        />
        
        <ActionButtons 
          handleSaveTemplate={handleSaveTemplate}
          handleBookingConfirmation={handleBookingConfirmation}
          handleFindRoutes={handleFindRoutes}
          origin={origin || originInput}
          destination={destination || destinationInput}
          weight={weight}
          isEmergencyShipment={isEmergencyShipment}
          setIsEmergencyShipment={setIsEmergencyShipment}
          isMultiStop={false}
        />
      </div>
      
      <div className="mt-8">
        <RecommendedShippingDays />
      </div>
      
      <TermsConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={completeBooking}
      />
    </div>
  );
};

export default SingleBookingForm;
