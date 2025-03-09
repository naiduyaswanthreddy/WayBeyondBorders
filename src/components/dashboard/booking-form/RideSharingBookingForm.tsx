import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { 
  Share2, 
  Users, 
  UserCheck, 
  Zap, 
  Truck, 
  ArrowDownUp, 
  Leaf,
  Calendar,
  Clock,
  Ship,
  Plane
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import LocationSelector from "./LocationSelector";
import ShippingDatePicker from "./ShippingDatePicker";
import CargoTypeSelector from "./CargoTypeSelector";
import TransportModeSelector from "./TransportModeSelector";
import WeightInput from "./WeightInput";
import CargoItemsSection from "./CargoItemsSection";
import ActionButtons from "./ActionButtons";
import TermsConfirmationDialog from "./TermsConfirmationDialog";
import EstimatedArrival from "./EstimatedArrival";

import { locations, cargoTypes, transportModes } from "./data";
import { BookingFormProps } from "./types";

// Mock data for ride sharing options
const rideSharingOptions = [
  {
    id: "rs-001",
    origin: "Shanghai, China",
    destination: "Rotterdam, Netherlands",
    departureDate: "2023-07-12",
    transportMode: "sea",
    cargoTypeCompatibility: ["general", "non-perishable", "electronics", "textiles"],
    availableSpace: "25%",
    costSaving: "28%",
    ecoSaving: "32%",
    departureWindow: "Jul 12-14",
    carrier: "Maersk Line",
    shared: 3
  },
  {
    id: "rs-002",
    origin: "Singapore",
    destination: "Hamburg, Germany",
    departureDate: "2023-07-15",
    transportMode: "sea",
    cargoTypeCompatibility: ["general", "non-perishable", "textiles", "machinery"],
    availableSpace: "40%",
    costSaving: "32%",
    ecoSaving: "35%",
    departureWindow: "Jul 15-18",
    carrier: "CMA CGM",
    shared: 2
  },
  {
    id: "rs-003",
    origin: "New York, USA",
    destination: "London, UK",
    departureDate: "2023-07-10",
    transportMode: "air",
    cargoTypeCompatibility: ["perishable", "pharmaceuticals", "express", "electronics"],
    availableSpace: "15%",
    costSaving: "18%",
    ecoSaving: "20%",
    departureWindow: "Jul 10-11",
    carrier: "FedEx",
    shared: 5
  }
];

const RideSharingBookingForm: React.FC<BookingFormProps> = ({ className }) => {
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
  
  // Ride sharing specific state
  const [enableRideSharing, setEnableRideSharing] = useState(true);
  const [availableRideShares, setAvailableRideShares] = useState<any[]>([]);
  const [selectedRideShare, setSelectedRideShare] = useState<string | null>(null);
  const [flexibleDates, setFlexibleDates] = useState(true);
  const [flexibleTiming, setFlexibleTiming] = useState(true);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [ecoPoints, setEcoPoints] = useState(0);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (origin !== "" && destination !== "") {
      calculateEstimatedArrival();
      findAvailableRideShares();
    } else {
      setEstimatedArrival("");
      setAvailableRideShares([]);
    }
  }, [origin, destination, originInput, destinationInput, transportMode, date, enableRideSharing, flexibleDates]);

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
    
    // Add a small delay for ride-sharing logistics
    if (enableRideSharing) {
      days += 0.5;
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
        isRideSharing: enableRideSharing,
        flexibleDates,
        flexibleTiming
      };
      
      sessionStorage.setItem('routeMapData', JSON.stringify(routeData));
      
      const updateEvent = new CustomEvent('routeDataUpdated', { detail: routeData });
      window.dispatchEvent(updateEvent);
    } else {
      setEstimatedArrival(`${Math.ceil(days)} days`);
    }
    
    // Set pricing for comparison
    let basePrice = 0;
    
    switch (transportMode) {
      case "air":
        basePrice = 4250;
        break;
      case "sea":
        basePrice = 2850;
        break;
      case "express":
        basePrice = 5100;
        break;
      case "road":
        basePrice = 3200;
        break;
      case "multimode":
        basePrice = 3650;
        break;
      default:
        basePrice = 3500;
    }
    
    setOriginalPrice(basePrice);
    
    // Calculate discount if ride sharing is enabled
    if (enableRideSharing) {
      const discount = basePrice * 0.28; // 28% discount for ride sharing
      setDiscountedPrice(basePrice - discount);
      setEcoPoints(Math.floor(discount / 10)); // Eco points are roughly discount / 10
    } else {
      setDiscountedPrice(0);
      setEcoPoints(0);
    }
  };
  
  const findAvailableRideShares = () => {
    if (!enableRideSharing) {
      setAvailableRideShares([]);
      setSelectedRideShare(null);
      return;
    }
    
    const originLabel = origin 
      ? locations.find(loc => loc.value === origin)?.label
      : originInput;
    
    const destinationLabel = destination
      ? locations.find(loc => loc.value === destination)?.label
      : destinationInput;
    
    if (!originLabel || !destinationLabel) {
      setAvailableRideShares([]);
      return;
    }
    
    // Filter available ride shares based on criteria
    const matchingShares = rideSharingOptions.filter(share => {
      // Check origin and destination compatibility
      const originMatch = share.origin.includes(originLabel) || originLabel.includes(share.origin);
      const destMatch = share.destination.includes(destinationLabel) || destinationLabel.includes(share.destination);
      
      // Check cargo compatibility
      const cargoMatch = !cargoType || share.cargoTypeCompatibility.includes(cargoType);
      
      // Check transport mode compatibility
      const modeMatch = transportMode === "any" || share.transportMode === transportMode;
      
      // Check date compatibility
      let dateMatch = true;
      if (date) {
        const bookingDate = format(date, 'yyyy-MM-dd');
        const shareDate = share.departureDate;
        
        if (flexibleDates) {
          // Allow booking date to be within 3 days of share date
          const bookingTimestamp = new Date(bookingDate).getTime();
          const shareTimestamp = new Date(shareDate).getTime();
          const diffDays = Math.abs(bookingTimestamp - shareTimestamp) / (1000 * 60 * 60 * 24);
          dateMatch = diffDays <= 3;
        } else {
          dateMatch = bookingDate === shareDate;
        }
      }
      
      return originMatch && destMatch && cargoMatch && modeMatch && dateMatch;
    });
    
    setAvailableRideShares(matchingShares);
    
    // Select the first ride share by default
    if (matchingShares.length > 0) {
      setSelectedRideShare(matchingShares[0].id);
    } else {
      setSelectedRideShare(null);
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
    if (enableRideSharing && !selectedRideShare && availableRideShares.length > 0) {
      errors.rideShare = "Please select a ride-sharing option";
    }
    
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
    
    const selectedShare = selectedRideShare 
      ? availableRideShares.find(share => share.id === selectedRideShare)
      : null;

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
      isRideSharing: enableRideSharing,
      rideShareId: selectedRideShare,
      rideShareDetails: selectedShare,
      flexibleDates,
      flexibleTiming,
      originalPrice,
      discountedPrice,
      ecoPoints
    };
    
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    toast({
      title: "Finding optimal routes",
      description: "Analyzing available ride-sharing routes based on your requirements..."
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
    
    const selectedShare = selectedRideShare 
      ? availableRideShares.find(share => share.id === selectedRideShare)
      : null;
    
    const bookingData = {
      id: `BK-${Date.now().toString().slice(-6)}`,
      isRideSharing: enableRideSharing,
      origin: originLabel,
      destination: destinationLabel,
      date: date ? format(date, 'yyyy-MM-dd') : null,
      cargoType,
      weight,
      transportMode,
      cargoItems,
      estimatedArrival,
      rideShareId: selectedRideShare,
      rideShareDetails: selectedShare,
      flexibleDates,
      flexibleTiming,
      originalPrice,
      discountedPrice,
      ecoPoints,
      status: "Confirmed",
      createdAt: new Date().toISOString()
    };
    
    const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    bookingHistory.push(bookingData);
    localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory));
    
    toast({
      title: "Ride-Sharing Booking Confirmed",
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
    setSelectedRideShare(null);
    
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
    
    const templateName = `${originLabel} to ${destinationLabel} (Ride-Sharing)`;
    const templates = JSON.parse(localStorage.getItem('shipmentTemplates') || '[]');
    
    templates.push({
      id: Date.now().toString(),
      name: templateName,
      isRideSharing: true,
      origin,
      originInput,
      destination,
      destinationInput,
      cargoType,
      transportMode,
      cargoItems,
      flexibleDates,
      flexibleTiming
    });
    
    localStorage.setItem('shipmentTemplates', JSON.stringify(templates));
    
    toast({
      title: "Ride-Sharing Template Saved",
      description: `Your ride-sharing details have been saved as "${templateName}"`
    });
  };
  
  const toggleRideSharing = (enabled: boolean) => {
    setEnableRideSharing(enabled);
    if (enabled) {
      findAvailableRideShares();
    } else {
      setSelectedRideShare(null);
      setAvailableRideShares([]);
    }
  };
  
  const handleRideShareSelect = (id: string) => {
    setSelectedRideShare(id);
    
    const selectedShare = availableRideShares.find(share => share.id === id);
    if (selectedShare) {
      // Update transport mode to match the share
      setTransportMode(selectedShare.transportMode);
      
      // Adjust estimated arrival based on the selected share
      calculateEstimatedArrival();
    }
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
        <h2 className="text-xl font-semibold text-white">Ride-Sharing Shipment</h2>
        <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">Eco-Friendly Shipping</span>
      </div>

      <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-green-400" />
            <div>
              <h3 className="text-base font-medium text-white">Enable Ride-Sharing</h3>
              <p className="text-xs text-muted-foreground">
                Share transportation with other compatible shipments to reduce costs and environmental impact
              </p>
            </div>
          </div>
          <Switch
            checked={enableRideSharing}
            onCheckedChange={toggleRideSharing}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
        
        {enableRideSharing && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-md bg-white/5 p-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-white">Flexible Dates</span>
              </div>
              <Switch
                checked={flexibleDates}
                onCheckedChange={setFlexibleDates}
              />
            </div>
            
            <div className="flex items-center justify-between rounded-md bg-white/5 p-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-white">Flexible Timing</span>
              </div>
              <Switch
                checked={flexibleTiming}
                onCheckedChange={setFlexibleTiming}
              />
            </div>
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
        
        {enableRideSharing && (
          <div className="col-span-2 space-y-4">
            <h3 className="text-base font-medium text-white">Available Ride-Sharing Options</h3>
            
            {availableRideShares.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/20 p-6 text-center">
                <Users className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No matching ride-sharing options available for your selected route and criteria.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try adjusting your date, cargo type, or enable flexible dates to find more options.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableRideShares.map((share) => (
                  <div
                    key={share.id}
                    className={cn(
                      "relative rounded-lg border p-4 transition-colors",
                      selectedRideShare === share.id
                        ? "border-green-500 bg-green-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    )}
                    onClick={() => handleRideShareSelect(share.id)}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {share.transportMode === "sea" ? (
                          <Ship className="h-5 w-5 text-nexus-blue" />
                        ) : share.transportMode === "air" ? (
                          <Plane className="h-5 w-5 text-nexus-purple" />
                        ) : (
                          <Truck className="h-5 w-5 text-nexus-teal" />
                        )}
                        <span className="font-medium text-white">
                          {share.carrier} - {share.origin} to {share.destination}
                        </span>
                      </div>
                      
                      {selectedRideShare === share.id && (
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400/20">
                          Selected
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <div className="text-xs text-muted-foreground">Departure Window</div>
                        <div className="text-sm text-white">{share.departureWindow}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Available Space</div>
                        <div className="text-sm text-white">{share.availableSpace}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Cost Saving</div>
                        <div className="text-sm font-medium text-green-400">{share.costSaving}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">CO₂ Reduction</div>
                        <div className="text-sm font-medium text-green-400">{share.ecoSaving}</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Sharing with {share.shared} other shipments</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {validationErrors.rideShare && (
              <p className="text-xs text-destructive">{validationErrors.rideShare}</p>
            )}
          </div>
        )}
        
        {enableRideSharing && discountedPrice > 0 && (
          <div className="col-span-2 rounded-lg border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-base font-medium text-white">
              <ArrowDownUp className="h-5 w-5 text-green-400" />
              Ride-Sharing Cost Comparison
            </h3>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Standard Shipping</div>
                <div className="text-2xl font-bold text-white">${originalPrice.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Private transportation</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Ride-Sharing</div>
                <div className="text-2xl font-bold text-green-400">${discountedPrice.toLocaleString()}</div>
                <div className="text-xs text-green-400">Save ${(originalPrice - discountedPrice).toLocaleString()}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Eco Points Reward</div>
                <div className="flex items-center gap-1 text-2xl font-bold text-nexus-blue">
                  <Leaf className="h-5 w-5" />
                  <span>{ecoPoints}</span>
                </div>
                <div className="text-xs text-nexus-blue">Redeem for future discounts</div>
              </div>
            </div>
          </div>
        )}
        
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
