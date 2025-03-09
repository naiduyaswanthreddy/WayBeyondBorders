
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { Users, Leaf, CreditCard, BadgePercent, Check, AlertCircle } from "lucide-react";

import LocationSelector from "./LocationSelector";
import ShippingDatePicker from "./ShippingDatePicker";
import CargoTypeSelector from "./CargoTypeSelector";
import TransportModeSelector from "./TransportModeSelector";
import WeightInput from "./WeightInput";
import EstimatedArrival from "./EstimatedArrival";
import CargoItemsSection from "./CargoItemsSection";
import ActionButtons from "./ActionButtons";
import TermsConfirmationDialog from "./TermsConfirmationDialog";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { locations, cargoTypes, transportModes } from "./data";
import { BookingFormProps, CargoItem } from "./types";

const RideSharingBookingForm: React.FC<BookingFormProps> = ({ className }) => {
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
  
  // Ride-sharing specific state
  const [enableRideSharing, setEnableRideSharing] = useState(true);
  const [availableSharedOptions, setAvailableSharedOptions] = useState<any[]>([]);
  const [selectedSharedOption, setSelectedSharedOption] = useState<string>("");
  const [costSavings, setCostSavings] = useState<number>(0);
  const [ecoImpact, setEcoImpact] = useState<number>(0);
  const [isSearchingSharedOptions, setIsSearchingSharedOptions] = useState(false);

  const navigate = useNavigate();

  // Effect to update available routes when origin/destination changes
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

  // Effect to calculate estimated arrival and update route data
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
        availableRoutes,
        isRideSharing: enableRideSharing,
        selectedSharedOption
      };
      
      sessionStorage.setItem('routeMapData', JSON.stringify(routeData));
      
      const updateEvent = new CustomEvent('routeDataUpdated', { detail: routeData });
      window.dispatchEvent(updateEvent);
      
      // Find shared options if ride-sharing is enabled
      if (enableRideSharing && finalOriginLabel && finalDestinationLabel && date) {
        findSharedOptions(finalOriginLabel, finalDestinationLabel);
      }
    }
  }, [origin, destination, originInput, destinationInput, date, cargoType, weight, transportMode, cargoItems, availableRoutes, enableRideSharing]);

  // Effect to handle cargo type restrictions
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
      
      // Some cargo types may not be eligible for ride-sharing
      if (selectedCargo.restrictions.includes("no-sharing")) {
        setEnableRideSharing(false);
        toast({
          title: "Ride-sharing Disabled",
          description: "This cargo type is not eligible for ride-sharing.",
        });
      }
    }
  }, [cargoType]);

  // Calculate estimated arrival time
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
    
    // Adjust for ride-sharing if enabled (might add 1-2 days)
    if (enableRideSharing && selectedSharedOption) {
      // Split days range
      const [minDays, maxDays] = days.split('-').map(d => parseInt(d, 10));
      
      // Add 1-2 days for shared transport
      const adjustedMinDays = minDays + 1;
      const adjustedMaxDays = maxDays + 2;
      
      days = `${adjustedMinDays}-${adjustedMaxDays}`;
    }
    
    setEstimatedArrival(`${days} days (AI optimized)`);
  };

  // Handle transport mode change
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
    
    // Reset shared options when transport mode changes
    setSelectedSharedOption("");
    findSharedOptions(originInput || locations.find(loc => loc.value === origin)?.label || "", 
                      destinationInput || locations.find(loc => loc.value === destination)?.label || "");
  };

  // Find available shared options
  const findSharedOptions = (originLabel: string, destinationLabel: string) => {
    if (!enableRideSharing || !originLabel || !destinationLabel) {
      setAvailableSharedOptions([]);
      return;
    }
    
    setIsSearchingSharedOptions(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate mock shared shipment options
      const mockOptions = [
        {
          id: "shared-1",
          carrier: "EcoCargo Partners",
          departureDate: new Date(Date.now() + 86400000), // Tomorrow
          arrivalEstimate: transportMode === "air" ? "2-4 days" : transportMode === "sea" ? "10-14 days" : "6-9 days",
          capacity: "65% available",
          costSaving: 22, // percentage
          co2Reduction: 35, // percentage
          participants: 3
        },
        {
          id: "shared-2",
          carrier: "GreenFreight Express",
          departureDate: new Date(Date.now() + 172800000), // Day after tomorrow
          arrivalEstimate: transportMode === "air" ? "2-3 days" : transportMode === "sea" ? "9-12 days" : "5-8 days",
          capacity: "40% available",
          costSaving: 18, // percentage
          co2Reduction: 30, // percentage
          participants: 5
        },
        {
          id: "shared-3",
          carrier: "Nexus Shared Logistics",
          departureDate: new Date(Date.now() + 259200000), // 3 days from now
          arrivalEstimate: transportMode === "air" ? "1-3 days" : transportMode === "sea" ? "8-11 days" : "4-7 days",
          capacity: "80% available",
          costSaving: 25, // percentage
          co2Reduction: 40, // percentage
          participants: 2
        }
      ];
      
      // Filter based on cargo type compatibility
      const filteredOptions = mockOptions.filter(option => {
        const selectedCargo = cargoTypes.find(c => c.value === cargoType);
        if (!selectedCargo) return true;
        
        // Some cargo might be incompatible with ride-sharing
        return !selectedCargo.restrictions.includes("no-sharing");
      });
      
      setAvailableSharedOptions(filteredOptions);
      setIsSearchingSharedOptions(false);
      
      if (filteredOptions.length > 0) {
        setSelectedSharedOption(filteredOptions[0].id);
        setCostSavings(filteredOptions[0].costSaving);
        setEcoImpact(filteredOptions[0].co2Reduction);
        
        toast({
          title: "Shared Shipment Options Found",
          description: `Found ${filteredOptions.length} compatible shared shipments for your route.`
        });
      } else {
        setSelectedSharedOption("");
        setCostSavings(0);
        setEcoImpact(0);
        
        if (cargoType) {
          toast({
            title: "No Shared Options Available",
            description: "No compatible shared shipments found for your route and cargo type."
          });
        }
      }
    }, 1500);
  };

  // Handle ride-sharing toggle
  const handleRideSharingToggle = (enabled: boolean) => {
    setEnableRideSharing(enabled);
    
    if (enabled) {
      findSharedOptions(
        originInput || locations.find(loc => loc.value === origin)?.label || "", 
        destinationInput || locations.find(loc => loc.value === destination)?.label || ""
      );
      
      toast({
        title: "Ride-Sharing Enabled",
        description: "Looking for compatible shared shipments for your route..."
      });
    } else {
      setSelectedSharedOption("");
      setCostSavings(0);
      setEcoImpact(0);
    }
  };

  // Select a specific shared option
  const selectSharedOption = (optionId: string) => {
    const option = availableSharedOptions.find(opt => opt.id === optionId);
    if (!option) return;
    
    setSelectedSharedOption(optionId);
    setCostSavings(option.costSaving);
    setEcoImpact(option.co2Reduction);
    
    // Recalculate ETA with the selected option
    const originLocation = locations.find(loc => loc.value === origin);
    const destLocation = locations.find(loc => loc.value === destination);
    
    const finalOriginLabel = originLocation?.label || originInput;
    const finalDestinationLabel = destLocation?.label || destinationInput;
    
    calculateEstimatedArrival(finalOriginLabel, finalDestinationLabel, transportMode);
  };

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!origin && !originInput) errors.origin = "Source location is required";
    if (!destination && !destinationInput) errors.destination = "Destination location is required";
    if (!date) errors.date = "Shipping date is required";
    if (!cargoType) errors.cargoType = "Cargo type is required";
    if (!weight && cargoItems.length === 0) errors.weight = "Weight or cargo items are required";
    
    if (enableRideSharing && !selectedSharedOption && availableSharedOptions.length > 0) {
      errors.sharedOption = "Please select a shared shipment option";
    }
    
    setValidationErrors(errors);
    
    return Object.keys(errors).length === 0;
  };

  // Handler for find routes button
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
      availableRoutes,
      isRideSharing: enableRideSharing,
      selectedSharedOption: enableRideSharing ? selectedSharedOption : "",
      costSavings: enableRideSharing ? costSavings : 0,
      ecoImpact: enableRideSharing ? ecoImpact : 0
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
  
  // Handler for booking confirmation
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
  
  // Complete booking process
  const completeBooking = () => {
    const originLocation = locations.find(loc => loc.value === origin);
    const destLocation = locations.find(loc => loc.value === destination);

    const sharedOption = availableSharedOptions.find(opt => opt.id === selectedSharedOption);

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
      createdAt: new Date().toISOString(),
      isRideSharing: enableRideSharing,
      
      // Ride-sharing specific data
      sharedDetails: enableRideSharing && sharedOption ? {
        carrier: sharedOption.carrier,
        departureDate: format(sharedOption.departureDate, 'yyyy-MM-dd'),
        arrivalEstimate: sharedOption.arrivalEstimate,
        capacity: sharedOption.capacity,
        costSaving: sharedOption.costSaving,
        co2Reduction: sharedOption.co2Reduction,
        participants: sharedOption.participants
      } : null
    };
    
    const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    bookingHistory.push(bookingData);
    localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory));

    // If ride-sharing is enabled, add this to shared shipments
    if (enableRideSharing && sharedOption) {
      const { ecoPoints } = JSON.parse(localStorage.getItem('ecoData') || '{"ecoPoints": 0, "metrics": {"co2Saved": 0, "treesPlanted": 0, "plasticReduced": 0}, "sharedShipments": []}');
      
      const newPoints = ecoPoints + 50; // Award points for using ride-sharing
      
      // Create a new shared shipment record
      const sharedShipment = {
        id: bookingData.id,
        origin: originLocation?.label || originInput,
        destination: destLocation?.label || destinationInput,
        date: date ? format(date, 'yyyy-MM-dd') : new Date().toISOString(),
        departureDate: format(sharedOption.departureDate, 'yyyy-MM-dd'),
        participants: sharedOption.participants,
        savings: Math.round((parseFloat(weight) || 1000) * 0.01 * sharedOption.costSaving),
        co2Reduction: Math.round((parseFloat(weight) || 1000) * 0.005 * sharedOption.co2Reduction)
      };
      
      // Get existing shared shipments and add the new one
      const ecoData = JSON.parse(localStorage.getItem('ecoData') || '{"ecoPoints": 0, "metrics": {"co2Saved": 0, "treesPlanted": 0, "plasticReduced": 0}, "sharedShipments": []}');
      ecoData.ecoPoints = newPoints;
      ecoData.sharedShipments = [...ecoData.sharedShipments, sharedShipment];
      
      // Update metrics
      ecoData.metrics.co2Saved += sharedShipment.co2Reduction;
      ecoData.metrics.treesPlanted += Math.floor(sharedShipment.co2Reduction / 50);
      
      localStorage.setItem('ecoData', JSON.stringify(ecoData));
      
      toast({
        title: "Eco Points Awarded",
        description: `You've earned 50 eco points for using ride-sharing!`
      });
    }
    
    toast({
      title: "Booking Confirmed",
      description: `Booking #${bookingData.id} has been confirmed and saved to history.`
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
    setEnableRideSharing(true);
    setSelectedSharedOption("");
    
    setTimeout(() => {
      navigate('/bookings', { state: { activeTab: 'history' } });
    }, 1000);
  };

  // Save booking as template
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
    
    const templateName = `${originLocation?.label || originInput} to ${destLocation?.label || destinationInput} ${enableRideSharing ? "(Shared)" : ""}`;
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
      cargoItems,
      isRideSharing: enableRideSharing
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
        <h2 className="text-xl font-semibold text-white">Ride-Sharing Booking</h2>
        <span className="rounded-full bg-nexus-blue/20 px-3 py-1 text-xs font-medium text-nexus-blue">
          AI Optimized
        </span>
      </div>

      <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-400" />
            <h3 className="text-base font-medium text-white">Ride-Sharing</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Enable</span>
            <Switch 
              checked={enableRideSharing} 
              onCheckedChange={handleRideSharingToggle} 
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>
        
        <p className="mt-2 text-sm text-muted-foreground">
          Share transportation with others going to similar destinations to reduce costs and environmental impact.
        </p>
        
        {enableRideSharing && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Available Shared Shipments</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                Up to {costSavings}% Cost Savings
              </Badge>
            </div>
            
            {isSearchingSharedOptions ? (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
                <div className="mb-2 inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Searching for compatible shared shipments...</p>
              </div>
            ) : availableSharedOptions.length > 0 ? (
              <div className="space-y-3">
                {availableSharedOptions.map((option) => (
                  <div 
                    key={option.id}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-lg border p-3",
                      selectedSharedOption === option.id
                        ? "border-green-500/30 bg-green-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    )}
                    onClick={() => selectSharedOption(option.id)}
                  >
                    <div className="flex items-center gap-3">
                      {selectedSharedOption === option.id && (
                        <Check className="h-4 w-4 text-green-400" />
                      )}
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-white">{option.carrier}</span>
                          <Badge className="ml-2 bg-nexus-blue/20 text-nexus-blue-light">
                            {option.capacity}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Departs: {format(option.departureDate, 'MMM d, yyyy')}</span>
                          <span>Arrives: {option.arrivalEstimate}</span>
                          <span>Participants: {option.participants}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-3.5 w-3.5 text-purple-400" />
                        <span className="text-sm font-medium text-white">-{option.costSaving}%</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <Leaf className="h-3.5 w-3.5 text-green-400" />
                        <span className="text-xs text-muted-foreground">-{option.co2Reduction}% CO₂</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
                <AlertCircle className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No shared shipments available for your route at this time.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Complete your booking information to find compatible options.
                </p>
              </div>
            )}
            
            {validationErrors.sharedOption && (
              <p className="mt-2 text-xs text-destructive">{validationErrors.sharedOption}</p>
            )}
            
            {selectedSharedOption && costSavings > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Cost Savings</span>
                    <BadgePercent className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="mt-1 text-xl font-bold text-purple-400">
                    {costSavings}%
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Compared to individual shipping
                  </div>
                </div>
                
                <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">CO₂ Reduction</span>
                    <Leaf className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="mt-1 text-xl font-bold text-green-400">
                    {ecoImpact}%
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Lower carbon footprint
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
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
          transportMode={transportMode}
        />
        
        <CargoItemsSection 
          cargoItems={cargoItems}
          setCargoItems={setCargoItems}
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
          isRideSharing={true}
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

export default RideSharingBookingForm;
