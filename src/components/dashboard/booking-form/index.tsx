import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

import LocationSelector from "./LocationSelector";
import ShippingDatePicker from "./ShippingDatePicker";
import CargoTypeSelector from "./CargoTypeSelector";
import TransportModeSelector from "./TransportModeSelector";
import WeightInput from "./WeightInput";
import EstimatedArrival from "./EstimatedArrival";
import CargoItemsSection from "./CargoItemsSection";
import ActionButtons from "./ActionButtons";
import TermsConfirmationDialog from "./TermsConfirmationDialog";
import BookingConfirmationDocument from "./BookingConfirmationDocument";
import EmergencyShippingMode from "./EmergencyShippingMode";

import { locations, cargoTypes, transportModes } from "./data";
import { BookingFormProps, CargoItem, TemplateData } from "./types";

// List of illegal goods for validation
const illegalGoodsList = [
  "weapon", "weapons", "gun", "guns", "firearm", "firearms", "explosive", "explosives",
  "narcotics", "cocaine", "heroin", "meth", "marijuana", "cannabis", "drug", "drugs",
  "ivory", "rhino", "endangered", "hazardous", "radioactive", "uranium", "plutonium",
  "human", "organ", "organs", "biological", "virus", "toxin", "poison"
];

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
  const [isEmergencyShipment, setIsEmergencyShipment] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState("");
  const [showConfirmationDocument, setShowConfirmationDocument] = useState(false);
  const [hasIllegalGoods, setHasIllegalGoods] = useState(false);
  const [showEmergencyMode, setShowEmergencyMode] = useState(false);
  const [costOptimizationResults, setCostOptimizationResults] = useState<{ 
    originalCost: number;
    optimizedCost: number;
    savings: number;
    savingsPercent: number;
  } | null>(null);
  const [isRunningOptimization, setIsRunningOptimization] = useState(false);

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
          description: "\"" + template.name + "\" template has been applied to your new booking."
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
    
    if ((originLabel.includes("New York") || originLabel.includes("Los Angeles") || originLabel.includes("Miami")) && 
        (destinationLabel.includes("London") || destinationLabel.includes("Rotterdam") || destinationLabel.includes("Hamburg"))) {
      days = mode === "air" || mode === "express" ? "1-2" : mode === "sea" ? "8-12" : "5-7";
    }
    else if ((destinationLabel.includes("New York") || destinationLabel.includes("Los Angeles") || destinationLabel.includes("Miami")) && 
             (originLabel.includes("London") || originLabel.includes("Rotterdam") || originLabel.includes("Hamburg"))) {
      days = mode === "air" || mode === "express" ? "1-2" : mode === "sea" ? "8-12" : "5-7";
    }
    else if ((originLabel.includes("Shanghai") || originLabel.includes("Singapore") || originLabel.includes("Tokyo")) && 
             (destinationLabel.includes("New York") || destinationLabel.includes("Los Angeles") || 
              destinationLabel.includes("London") || destinationLabel.includes("Rotterdam"))) {
      days = mode === "air" || mode === "express" ? "2-3" : mode === "sea" ? "18-25" : "12-16";
    }
    else if ((destinationLabel.includes("Shanghai") || destinationLabel.includes("Singapore") || destinationLabel.includes("Tokyo")) && 
             (originLabel.includes("New York") || originLabel.includes("Los Angeles") || 
              originLabel.includes("London") || originLabel.includes("Rotterdam"))) {
      days = mode === "air" || mode === "express" ? "2-3" : mode === "sea" ? "18-25" : "12-16";
    }
    else if ((originLabel.includes("Dubai") || destinationLabel.includes("Dubai"))) {
      days = mode === "air" || mode === "express" ? "1-3" : mode === "sea" ? "12-18" : "8-12";
    }
    else if ((originLabel.includes("Sydney") || destinationLabel.includes("Sydney"))) {
      days = mode === "air" || mode === "express" ? "2-3" : mode === "sea" ? "20-30" : "15-20";
    }
    else {
      days = mode === "air" || mode === "express" ? "2-4" : mode === "sea" ? "14-28" : "7-14";
    }
    
    setEstimatedArrival(days + " days (AI optimized)");
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
          description: "Selected transport mode is not available between " + originLocation.label + " and " + destLocation.label
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
        description: value.charAt(0).toUpperCase() + value.slice(1) + " transport is not available for this route.",
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

  const handleBookingConfirmation = () => {
    if (!validateForm()) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before confirming booking.",
        variant: "destructive"
      });
      return;
    }
    
    if (hasIllegalGoods) {
      toast({
        title: "Illegal Goods Detected",
        description: "Your cargo contains items that are restricted for shipment. Please remove these items before proceeding.",
        variant: "destructive"
      });
      return;
    }
    
    setConfirmDialogOpen(true);
  };
  
  const completeBooking = () => {
    const originLocation = locations.find(loc => loc.value === origin);
    const destLocation = locations.find(loc => loc.value === destination);

    const bookingId = "BK-" + Date.now().toString().slice(-6);
    
    const bookingData = {
      id: bookingId,
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
    
    setConfirmedBookingId(bookingId);
    setBookingConfirmed(true);
    setShowConfirmationDocument(true);
    
    toast({
      title: "Booking Confirmed",
      description: "Booking #" + bookingData.id + " has been confirmed and saved to history."
    });
    
    setTimeout(() => {
      if (!showConfirmationDocument) {
        navigateToHistory();
      }
    }, 5000);
  };
  
  const navigateToHistory = () => {
    setOrigin("");
    setOriginInput("");
    setDestination("");
    setDestinationInput("");
    setDate(undefined);
    setCargoType("");
    setWeight("");
    setTransportMode("any");
    setCargoItems([]);
    
    navigate('/bookings', { state: { activeTab: 'history' } });
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
    
    const templateName = (originLocation?.label || originInput) + " to " + (destLocation?.label || destinationInput);
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
      description: "Your shipment details have been saved as \"" + templateName + "\""
    });
  };

  // Check if a cargo item contains illegal goods
  const checkForIllegalGoods = (items: CargoItem[]): boolean => {
    return items.some(item => {
      const itemNameLower = item.name.toLowerCase();
      return illegalGoodsList.some(illegalItem => 
        itemNameLower.includes(illegalItem)
      );
    });
  };

  useEffect(() => {
    // Check for illegal goods whenever cargo items change
    const hasIllegal = checkForIllegalGoods(cargoItems);
    setHasIllegalGoods(hasIllegal);
    
    if (hasIllegal) {
      toast({
        title: "Illegal Goods Detected",
        description: "Your cargo contains items that are restricted for shipment. Please remove these items.",
        variant: "destructive"
      });
    }
  }, [cargoItems]);

  // Handle emergency mode activation
  const handleEmergencyModeToggle = () => {
    // If not activated yet, show the modal
    if (!isEmergencyShipment) {
      setShowEmergencyMode(true);
    } else {
      // If turning off, just toggle it
      setIsEmergencyShipment(false);
      toast({
        title: "Emergency Mode Deactivated",
        description: "Your shipment has been returned to standard processing."
      });
    }
  };

  const activateEmergencyMode = () => {
    setIsEmergencyShipment(true);
    setShowEmergencyMode(false);
    
    // Force air transport for emergency shipments
    if (transportMode !== "air" && transportMode !== "express") {
      setTransportMode("express");
    }
    
    toast({
      title: "Emergency Mode Activated",
      description: "Your shipment has been marked for priority handling and expedited delivery.",
      variant: "default"
    });
  };

  // Run AI cost optimization
  const runCostOptimization = () => {
    if (!origin && !originInput || !destination && !destinationInput) {
      toast({
        title: "Missing Information",
        description: "Please enter origin and destination to run cost optimization.",
        variant: "destructive"
      });
      return;
    }
    
    setIsRunningOptimization(true);
    
    // Simulate an API call with a delay
    setTimeout(() => {
      // Calculate a base cost based on distance and cargo type
      const baseCost = Math.floor(Math.random() * 5000) + 3000; // Random cost between $3000-$8000
      
      // Calculate optimization percentage (15-35% savings)
      const savingsPercent = Math.floor(Math.random() * 20) + 15;
      const savings = Math.round(baseCost * (savingsPercent / 100));
      const optimizedCost = baseCost - savings;
      
      setCostOptimizationResults({
        originalCost: baseCost,
        optimizedCost: optimizedCost,
        savings: savings,
        savingsPercent: savingsPercent
      });
      
      setIsRunningOptimization(false);
      
      toast({
        title: "Cost Optimization Complete",
        description: "AI has found potential savings of $" + savings + " (" + savingsPercent + "%) on your shipment."
      });
    }, 3000);
  };

  return (
    <div className={cn("nexus-card-blue p-6", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">New Booking</h2>
        <span className="rounded-full bg-nexus-blue/20 px-3 py-1 text-xs font-medium text-nexus-blue">
          AI Optimized
        </span>
      </div>

      {showConfirmationDocument ? (
        <div className="border border-green-500/30 bg-green-500/5 rounded-lg p-4">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-green-400">Booking Confirmed!</h3>
            <p className="text-muted-foreground">Your booking #{confirmedBookingId} has been successfully processed</p>
          </div>
          
          <BookingConfirmationDocument 
            bookingId={confirmedBookingId}
            origin={origin || originInput}
            destination={destination || destinationInput}
            date={date ? format(date, 'yyyy-MM-dd') : null}
            cargoType={cargoType}
            weight={weight}
            transportMode={transportMode}
          />
          
          <Button 
            variant="outline" 
            className="w-full mt-2"
            onClick={navigateToHistory}
          >
            View Booking History
          </Button>
        </div>
      ) : (
        <>
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
              transportMode={transportMode}
            />
            
            <CargoItemsSection 
              cargoItems={cargoItems}
              setCargoItems={setCargoItems}
              onIllegalGoodsDetected={setHasIllegalGoods}
            />

            <div className="col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none ${isEmergencyShipment ? 'bg-red-500' : 'bg-white/10'}`}
                    onClick={handleEmergencyModeToggle}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isEmergencyShipment ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                  <span className={`text-sm ${isEmergencyShipment ? 'text-red-400 font-medium' : 'text-muted-foreground'}`}>
                    Emergency shipment (priority handling)
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={runCostOptimization}
                  disabled={isRunningOptimization || (!origin && !originInput) || (!destination && !destinationInput)}
                  className="bg-nexus-blue/10 text-nexus-blue-light hover:bg-nexus-blue/20"
                >
                  {isRunningOptimization ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                      Optimizing...
                    </>
                  ) : (
                    "Run AI Cost Optimization"
                  )}
                </Button>
              </div>

              {costOptimizationResults && (
                <div className="rounded-md bg-green-500/10 border border-green-500/20 p-3">
                  <h4 className="font-medium text-green-400 mb-2">Cost Optimization Results</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Original Cost:</p>
                      <p className="text-white line-through">${costOptimizationResults.originalCost}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Optimized Cost:</p>
                      <p className="text-green-400 font-semibold">${costOptimizationResults.optimizedCost}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Savings:</p>
                      <p className="text-green-400">${costOptimizationResults.savings}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Percentage:</p>
                      <p className="text-green-400">{costOptimizationResults.savingsPercent}%</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid gap-3 md:grid-cols-2">
                <Button
                  variant="outline"
                  className="border-white/10 bg-white/5 hover:bg-white/10"
                  onClick={handleSaveTemplate}
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save as Template
                </Button>
                
                <Button
                  onClick={handleBookingConfirmation}
                  className="bg-nexus-blue hover:bg-nexus-blue/90"
                  disabled={hasIllegalGoods}
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
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
          </div>
          
          <TermsConfirmationDialog
            open={confirmDialogOpen}
            onOpenChange={setConfirmDialogOpen}
            onConfirm={completeBooking}
          />
          
          {showEmergencyMode && (
            <EmergencyShippingMode
              onClose={() => setShowEmergencyMode(false)}
              onActivate={activateEmergencyMode}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BookingForm;
