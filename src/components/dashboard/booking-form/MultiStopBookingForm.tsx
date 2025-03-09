import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { PlusCircle, Trash2, GripVertical, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
import { BookingFormProps, StopType } from "./types";

const MultiStopBookingForm: React.FC<BookingFormProps> = ({ className }) => {
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
  const [totalDistance, setTotalDistance] = useState(0);
  const [cargoItems, setCargoItems] = useState<any[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isEmergencyShipment, setIsEmergencyShipment] = useState(false);
  
  const [stops, setStops] = useState<StopType[]>([]);
  const [nextStopId, setNextStopId] = useState(1);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (origin !== "" && destination !== "") {
      calculateEstimatedArrival();
    } else {
      setEstimatedArrival("");
    }
  }, [origin, destination, originInput, destinationInput, transportMode, stops]);

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
    
    let totalDays = 0;
    let totalDistanceKm = 0;
    let allStops = [
      { location: originLabel, type: "pickup" as const },
      ...stops.map(stop => {
        const stopLabel = locations.find(loc => loc.value === stop.location)?.label || stop.locationInput;
        return { location: stopLabel, type: stop.type };
      }),
      { location: destinationLabel, type: "dropoff" as const }
    ];
    
    for (let i = 0; i < allStops.length - 1; i++) {
      const currentStop = allStops[i].location;
      const nextStop = allStops[i + 1].location;
      
      let segmentDays = 0;
      let segmentDistance = 0;
      
      if ((currentStop.includes("New York") || currentStop.includes("Los Angeles")) && 
          (nextStop.includes("London") || nextStop.includes("Rotterdam"))) {
        segmentDays = transportMode === "air" ? 1.5 : transportMode === "sea" ? 10 : 6;
        segmentDistance = transportMode === "air" ? 5500 : 6500;
      }
      else if ((currentStop.includes("Shanghai") || currentStop.includes("Singapore")) && 
               (nextStop.includes("Los Angeles") || nextStop.includes("Rotterdam"))) {
        segmentDays = transportMode === "air" ? 2.5 : transportMode === "sea" ? 21 : 14;
        segmentDistance = transportMode === "air" ? 9000 : 11000;
      }
      else if ((currentStop.includes("Dubai") || nextStop.includes("Dubai"))) {
        segmentDays = transportMode === "air" ? 2 : transportMode === "sea" ? 15 : 10;
        segmentDistance = transportMode === "air" ? 6000 : 7500;
      }
      else {
        segmentDays = transportMode === "air" ? 1.5 : transportMode === "sea" ? 7 : 5;
        segmentDistance = transportMode === "air" ? 4000 : 5000;
      }
      
      totalDays += segmentDays;
      totalDistanceKm += segmentDistance;
    }
    
    setTotalDistance(totalDistanceKm);
    
    if (date) {
      const arrivalDate = new Date(date);
      arrivalDate.setDate(arrivalDate.getDate() + Math.ceil(totalDays));
      
      const formattedArrival = format(arrivalDate, 'MMM d, yyyy');
      setEstimatedArrival(`${Math.ceil(totalDays)} days (${formattedArrival})`);
      
      const routeData = {
        origin: originLabel,
        destination: destinationLabel,
        stops: stops.map(stop => {
          const stopLabel = locations.find(loc => loc.value === stop.location)?.label || stop.locationInput;
          return { ...stop, locationLabel: stopLabel };
        }),
        date: format(date, 'yyyy-MM-dd'),
        arrivalDate: format(arrivalDate, 'yyyy-MM-dd'),
        cargoType,
        weight,
        transportMode,
        isMultiStop: true,
        totalDistance: totalDistanceKm
      };
      
      sessionStorage.setItem('routeMapData', JSON.stringify(routeData));
      
      const updateEvent = new CustomEvent('routeDataUpdated', { detail: routeData });
      window.dispatchEvent(updateEvent);
    } else {
      setEstimatedArrival(`${Math.ceil(totalDays)} days`);
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
      stops: stops.map(stop => {
        const stopLabel = locations.find(loc => loc.value === stop.location)?.label || stop.locationInput;
        return { ...stop, locationLabel: stopLabel };
      }),
      estimatedArrival,
      totalDistance,
      isMultiStop: true
    };
    
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    toast({
      title: "Finding optimal routes",
      description: "Analyzing available routes based on your multi-stop requirements..."
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
      isMultiStop: true,
      origin: originLabel,
      destination: destinationLabel,
      stops: stops.map(stop => {
        const stopLabel = locations.find(loc => loc.value === stop.location)?.label || stop.locationInput;
        return { ...stop, locationLabel: stopLabel };
      }),
      date: date ? format(date, 'yyyy-MM-dd') : null,
      cargoType,
      weight,
      transportMode,
      cargoItems,
      estimatedArrival,
      totalDistance,
      status: "Confirmed",
      createdAt: new Date().toISOString()
    };
    
    const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    bookingHistory.push(bookingData);
    localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory));
    
    toast({
      title: "Multi-Stop Booking Confirmed",
      description: `Booking #${bookingData.id} with ${stops.length} additional stops has been confirmed and saved to history.`
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
    setStops([]);
    
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
    
    const stopsText = stops.length > 0 
      ? ` with ${stops.length} stops` 
      : '';
    
    const templateName = `${originLabel} to ${destinationLabel}${stopsText}`;
    const templates = JSON.parse(localStorage.getItem('shipmentTemplates') || '[]');
    
    templates.push({
      id: Date.now().toString(),
      name: templateName,
      isMultiStop: true,
      origin,
      originInput,
      destination,
      destinationInput,
      stops: [...stops],
      cargoType,
      transportMode,
      cargoItems
    });
    
    localStorage.setItem('shipmentTemplates', JSON.stringify(templates));
    
    toast({
      title: "Multi-Stop Template Saved",
      description: `Your multi-stop shipment details have been saved as "${templateName}"`
    });
  };

  const addStop = () => {
    const newStop: StopType = {
      id: `stop-${nextStopId}`,
      location: "",
      locationInput: "",
      type: "both",
      order: stops.length + 1
    };
    
    setStops([...stops, newStop]);
    setNextStopId(nextStopId + 1);
  };

  const removeStop = (id: string) => {
    const updatedStops = stops.filter(stop => stop.id !== id);
    const reorderedStops = updatedStops.map((stop, index) => ({
      ...stop,
      order: index + 1
    }));
    
    setStops(reorderedStops);
  };

  const updateStopLocation = (id: string, value: string) => {
    const updatedStops = stops.map(stop => {
      if (stop.id === id) {
        return { ...stop, location: value, locationInput: "" };
      }
      return stop;
    });
    
    setStops(updatedStops);
  };

  const updateStopLocationInput = (id: string, value: string) => {
    const updatedStops = stops.map(stop => {
      if (stop.id === id) {
        return { ...stop, location: "", locationInput: value };
      }
      return stop;
    });
    
    setStops(updatedStops);
  };

  const updateStopType = (id: string, value: "pickup" | "dropoff" | "both") => {
    const updatedStops = stops.map(stop => {
      if (stop.id === id) {
        return { ...stop, type: value };
      }
      return stop;
    });
    
    setStops(updatedStops);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(stops);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    setStops(updatedItems);
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
        <h2 className="text-xl font-semibold text-white">Multi-Stop Shipment</h2>
        <span className="rounded-full bg-nexus-purple px-3 py-1 text-xs font-medium text-white">Multi-Stop Route Planner</span>
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
            label="Final Destination"
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
        
        <div className="col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-white">Intermediate Stops</h3>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={addStop}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Stop</span>
            </Button>
          </div>
          
          {stops.length === 0 ? (
            <div className="rounded-lg border border-dashed border-white/20 p-6 text-center">
              <p className="text-sm text-muted-foreground">No intermediate stops added. Click "Add Stop" to include stops between origin and destination.</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="stops">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {stops.map((stop, index) => (
                      <Draggable key={stop.id} draggableId={stop.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="rounded-lg border border-white/10 bg-white/5 p-4"
                          >
                            <div className="mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <MapPin className="h-4 w-4 text-nexus-purple" />
                                <span className="text-sm font-medium text-white">Stop {index + 1}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive"
                                onClick={() => removeStop(stop.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid gap-4 md:grid-cols-3">
                              <div className="md:col-span-2">
                                <LocationSelector
                                  label="Stop Location"
                                  value={stop.location}
                                  onChange={(value) => updateStopLocation(stop.id, value)}
                                  manualInput={stop.locationInput}
                                  onManualInputChange={(value) => updateStopLocationInput(stop.id, value)}
                                  locations={locations}
                                />
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Stop Type
                                </label>
                                <Select 
                                  value={stop.type} 
                                  onValueChange={(value: any) => updateStopType(stop.id, value)}
                                >
                                  <SelectTrigger className="w-full border-white/10 bg-muted">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pickup">Pickup</SelectItem>
                                    <SelectItem value="dropoff">Dropoff</SelectItem>
                                    <SelectItem value="both">Both</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
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
        
        {stops.length > 0 && (
          <div className="col-span-2 rounded-lg border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 text-base font-medium text-white">Multi-Stop Journey Details</h3>
            
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-md bg-white/5 p-3">
                  <div className="text-sm font-medium text-white">Total Distance</div>
                  <div className="mt-1 text-xl font-semibold text-nexus-blue">{totalDistance.toLocaleString()} km</div>
                </div>
                
                <div className="rounded-md bg-white/5 p-3">
                  <div className="text-sm font-medium text-white">Stops</div>
                  <div className="mt-1 text-xl font-semibold text-nexus-purple">{stops.length}</div>
                </div>
                
                <div className="rounded-md bg-white/5 p-3">
                  <div className="text-sm font-medium text-white">Estimated Duration</div>
                  <div className="mt-1 text-xl font-semibold text-nexus-teal">{estimatedArrival}</div>
                </div>
              </div>
              
              <div className="relative mt-6 pl-6">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-nexus-blue/30"></div>
                
                <div className="relative mb-6">
                  <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-nexus-blue"></div>
                  <div className="rounded-md bg-white/5 p-3">
                    <div className="font-medium text-white">{originLabel}</div>
                    <div className="text-xs text-muted-foreground">Origin</div>
                  </div>
                </div>
                
                {stops.map((stop, index) => {
                  const stopLabel = locations.find(loc => loc.value === stop.location)?.label || stop.locationInput;
                  return (
                    <div key={stop.id} className="relative mb-6">
                      <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-nexus-purple"></div>
                      <div className="rounded-md bg-white/5 p-3">
                        <div className="font-medium text-white">{stopLabel}</div>
                        <div className="text-xs text-muted-foreground">
                          {stop.type === "pickup" ? "Pickup" : 
                           stop.type === "dropoff" ? "Dropoff" : 
                           "Pickup & Dropoff"}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <div className="relative">
                  <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-green-500"></div>
                  <div className="rounded-md bg-white/5 p-3">
                    <div className="font-medium text-white">{destinationLabel}</div>
                    <div className="text-xs text-muted-foreground">Final Destination</div>
                  </div>
                </div>
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
          isMultiStop={true}
        />
      </div>
      
      <TermsConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={completeBooking}
      />
      
      <div className="mt-8">
        <RecommendedShippingDays />
      </div>
    </div>
  );
};

export default MultiStopBookingForm;
