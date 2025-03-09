
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, Trash2, GripVertical, Clock, MapPin } from "lucide-react";

import LocationSelector from "./LocationSelector";
import ShippingDatePicker from "./ShippingDatePicker";
import CargoTypeSelector from "./CargoTypeSelector";
import TransportModeSelector from "./TransportModeSelector";
import WeightInput from "./WeightInput";
import CargoItemsSection from "./CargoItemsSection";
import ActionButtons from "./ActionButtons";
import TermsConfirmationDialog from "./TermsConfirmationDialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { locations, cargoTypes, transportModes } from "./data";
import { BookingFormProps, StopType } from "./types";

const MultiStopBookingForm: React.FC<BookingFormProps> = ({ className }) => {
  const [date, setDate] = useState<Date | undefined>();
  const [cargoType, setCargoType] = useState("");
  const [weight, setWeight] = useState("");
  const [transportMode, setTransportMode] = useState("any");
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [restrictionWarning, setRestrictionWarning] = useState("");
  const [availableRoutes, setAvailableRoutes] = useState<string[]>([]);
  const [cargoItems, setCargoItems] = useState<any[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isEmergencyShipment, setIsEmergencyShipment] = useState(false);
  
  // New state for multi-stop functionality
  const [stops, setStops] = useState<StopType[]>([
    { id: "origin", location: "", locationInput: "", type: "pickup", order: 0 },
    { id: "destination", location: "", locationInput: "", type: "dropoff", order: 1 }
  ]);
  const [totalEstimatedTime, setTotalEstimatedTime] = useState("");
  const [segmentDetails, setSegmentDetails] = useState<any[]>([]);

  const navigate = useNavigate();

  // Handle drag and drop reordering of stops
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(stops);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));
    
    setStops(updatedItems);
    updateRouteDetails(updatedItems);
  };

  // Add a new stop between origin and destination
  const addStop = () => {
    // If there are only origin and destination, add first intermediate stop
    if (stops.length === 2) {
      const newStop = {
        id: `stop-${Date.now()}`,
        location: "",
        locationInput: "",
        type: "both" as const,
        order: 1
      };
      
      const updatedStops = [
        stops[0],
        newStop,
        { ...stops[1], order: 2 }
      ];
      
      setStops(updatedStops);
    } else {
      // Add a stop before the destination
      const destinationStop = stops[stops.length - 1];
      const newStopOrder = stops.length - 1;
      
      const newStop = {
        id: `stop-${Date.now()}`,
        location: "",
        locationInput: "",
        type: "both" as const,
        order: newStopOrder
      };
      
      const updatedStops = [
        ...stops.slice(0, -1),
        newStop,
        { ...destinationStop, order: stops.length }
      ];
      
      setStops(updatedStops);
    }
  };

  // Remove a stop (can't remove origin or destination)
  const removeStop = (stopId: string) => {
    if (stopId === "origin" || stopId === "destination") {
      toast({
        title: "Cannot remove origin or destination",
        description: "You cannot remove the origin or final destination stops.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedStops = stops.filter(stop => stop.id !== stopId);
    
    // Update order property
    const reorderedStops = updatedStops.map((stop, index) => ({
      ...stop,
      order: index
    }));
    
    setStops(reorderedStops);
    updateRouteDetails(reorderedStops);
  };

  // Change stop type (pickup, dropoff, both)
  const changeStopType = (stopId: string, type: StopType["type"]) => {
    const updatedStops = stops.map(stop => 
      stop.id === stopId ? { ...stop, type } : stop
    );
    
    setStops(updatedStops);
  };

  // Update route details when stops change
  const updateRouteDetails = (currentStops: StopType[]) => {
    if (currentStops.length < 2) return;
    
    let totalTime = 0;
    const segments: any[] = [];
    
    // Calculate details for each segment
    for (let i = 0; i < currentStops.length - 1; i++) {
      const start = currentStops[i];
      const end = currentStops[i + 1];
      
      const startLabel = getLocationLabel(start);
      const endLabel = getLocationLabel(end);
      
      if (!startLabel || !endLabel) continue;
      
      // Calculate segment time (this is simplified - in a real app you would use API data)
      const segmentTimeInDays = calculateEstimatedTimeInDays(startLabel, endLabel, transportMode);
      totalTime += segmentTimeInDays;
      
      // Calculate distance (simplified)
      const distance = Math.floor(Math.random() * 1000) + 100; // Random distance between 100-1100 km
      
      // Determine transport mode for segment
      const segmentTransportMode = determineTransportMode(startLabel, endLabel, transportMode);
      
      segments.push({
        startLabel,
        endLabel,
        time: `${segmentTimeInDays} days`,
        distance: `${distance} km`,
        transportMode: segmentTransportMode,
        cost: `$${Math.floor(distance * 1.5)}`
      });
    }
    
    setSegmentDetails(segments);
    setTotalEstimatedTime(`${totalTime} days (AI optimized)`);
    
    // Update session storage with route map data
    const routeData = {
      stops: currentStops.map(stop => ({
        id: stop.id,
        label: getLocationLabel(stop),
        type: stop.type
      })),
      date: date ? format(date, 'yyyy-MM-dd') : null,
      cargoType,
      weight,
      transportMode,
      segments,
      totalEstimatedTime: `${totalTime} days`,
      isMultiStop: true
    };
    
    sessionStorage.setItem('routeMapData', JSON.stringify(routeData));
    
    const updateEvent = new CustomEvent('routeDataUpdated', { detail: routeData });
    window.dispatchEvent(updateEvent);
  };

  // Helper function to get location label
  const getLocationLabel = (stop: StopType) => {
    if (stop.location) {
      const locationObj = locations.find(loc => loc.value === stop.location);
      return locationObj?.label || "";
    }
    return stop.locationInput || "";
  };

  // Helper function to calculate estimated time between two locations
  const calculateEstimatedTimeInDays = (originLabel: string, destinationLabel: string, mode: string) => {
    if (!originLabel || !destinationLabel) {
      return 0;
    }
    
    let days = 0;
    
    if ((originLabel.includes("New York") || originLabel.includes("Los Angeles") || originLabel.includes("Miami")) && 
        (destinationLabel.includes("London") || destinationLabel.includes("Rotterdam") || destinationLabel.includes("Hamburg"))) {
      days = mode === "air" || mode === "express" ? 1.5 : mode === "sea" ? 10 : 6;
    }
    else if ((destinationLabel.includes("New York") || destinationLabel.includes("Los Angeles") || destinationLabel.includes("Miami")) && 
             (originLabel.includes("London") || originLabel.includes("Rotterdam") || originLabel.includes("Hamburg"))) {
      days = mode === "air" || mode === "express" ? 1.5 : mode === "sea" ? 10 : 6;
    }
    else if ((originLabel.includes("Shanghai") || originLabel.includes("Singapore") || originLabel.includes("Tokyo")) && 
             (destinationLabel.includes("New York") || destinationLabel.includes("Los Angeles") || 
              destinationLabel.includes("London") || destinationLabel.includes("Rotterdam"))) {
      days = mode === "air" || mode === "express" ? 2.5 : mode === "sea" ? 21 : 14;
    }
    else if ((destinationLabel.includes("Shanghai") || destinationLabel.includes("Singapore") || destinationLabel.includes("Tokyo")) && 
             (originLabel.includes("New York") || originLabel.includes("Los Angeles") || 
              originLabel.includes("London") || originLabel.includes("Rotterdam"))) {
      days = mode === "air" || mode === "express" ? 2.5 : mode === "sea" ? 21 : 14;
    }
    else if ((originLabel.includes("Dubai") || destinationLabel.includes("Dubai"))) {
      days = mode === "air" || mode === "express" ? 2 : mode === "sea" ? 15 : 10;
    }
    else if ((originLabel.includes("Sydney") || destinationLabel.includes("Sydney"))) {
      days = mode === "air" || mode === "express" ? 2.5 : mode === "sea" ? 25 : 17.5;
    }
    else {
      days = mode === "air" || mode === "express" ? 3 : mode === "sea" ? 21 : 10.5;
    }
    
    return days;
  };

  // Helper function to determine transport mode for a segment
  const determineTransportMode = (originLabel: string, destinationLabel: string, mode: string) => {
    // If specific mode is selected, use it
    if (mode !== "any") {
      return mode;
    }
    
    // For air transport between major cities with airports
    if ((originLabel.includes("New York") || originLabel.includes("London") || 
         originLabel.includes("Tokyo") || originLabel.includes("Shanghai") ||
         originLabel.includes("Dubai") || originLabel.includes("Singapore")) &&
        (destinationLabel.includes("New York") || destinationLabel.includes("London") || 
         destinationLabel.includes("Tokyo") || destinationLabel.includes("Shanghai") ||
         destinationLabel.includes("Dubai") || destinationLabel.includes("Singapore"))) {
      return "air";
    }
    
    // For sea transport between major ports
    if ((originLabel.includes("Rotterdam") || originLabel.includes("Shanghai") || 
         originLabel.includes("Singapore") || originLabel.includes("Los Angeles")) &&
        (destinationLabel.includes("Rotterdam") || destinationLabel.includes("Shanghai") || 
         destinationLabel.includes("Singapore") || destinationLabel.includes("Los Angeles"))) {
      return "sea";
    }
    
    // Default to road for shorter distances or when other options aren't appropriate
    return "road";
  };

  // Update location for a specific stop
  const updateStopLocation = (stopId: string, location: string) => {
    const updatedStops = stops.map(stop => 
      stop.id === stopId ? { ...stop, location, locationInput: "" } : stop
    );
    setStops(updatedStops);
    updateRouteDetails(updatedStops);
  };

  // Update manual input for a specific stop
  const updateStopLocationInput = (stopId: string, locationInput: string) => {
    const updatedStops = stops.map(stop => 
      stop.id === stopId ? { ...stop, locationInput, location: "" } : stop
    );
    setStops(updatedStops);
    updateRouteDetails(updatedStops);
  };

  // Effect to update route details when cargo type or transport mode changes
  useEffect(() => {
    updateRouteDetails(stops);
  }, [transportMode, cargoType]);

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
    }
  }, [cargoType]);

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
    
    setTransportMode(value);
  };

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Check if origin and destination have values
    const origin = stops.find(stop => stop.id === "origin");
    const destination = stops.find(stop => stop.id === "destination");
    
    if (!origin || (!origin.location && !origin.locationInput)) 
      errors.origin = "Origin location is required";
    
    if (!destination || (!destination.location && !destination.locationInput)) 
      errors.destination = "Destination location is required";
    
    // Check if all intermediate stops have values
    const intermediateStops = stops.filter(stop => stop.id !== "origin" && stop.id !== "destination");
    const emptyStops = intermediateStops.filter(stop => !stop.location && !stop.locationInput);
    
    if (emptyStops.length > 0) {
      errors.intermediateStops = "All stops must have locations";
    }
    
    if (!date) errors.date = "Shipping date is required";
    if (!cargoType) errors.cargoType = "Cargo type is required";
    if (!weight && cargoItems.length === 0) errors.weight = "Weight or cargo items are required";
    
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

    const bookingData = {
      stops: stops.map(stop => ({
        id: stop.id,
        location: stop.location,
        locationInput: stop.locationInput,
        locationLabel: getLocationLabel(stop),
        type: stop.type,
        order: stop.order
      })),
      date: date ? format(date, 'yyyy-MM-dd') : null,
      cargoType,
      weight,
      transportMode,
      cargoItems,
      segments: segmentDetails,
      totalEstimatedTime,
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
    const bookingData = {
      id: `BK-${Date.now().toString().slice(-6)}`,
      isMultiStop: true,
      stops: stops.map(stop => ({
        id: stop.id,
        locationLabel: getLocationLabel(stop),
        type: stop.type,
        order: stop.order
      })),
      segments: segmentDetails,
      totalEstimatedTime,
      date: date ? format(date, 'yyyy-MM-dd') : null,
      cargoType,
      weight,
      transportMode,
      cargoItems,
      status: "Confirmed",
      createdAt: new Date().toISOString()
    };
    
    const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    bookingHistory.push(bookingData);
    localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory));
    
    toast({
      title: "Multi-Stop Booking Confirmed",
      description: `Booking #${bookingData.id} has been confirmed and saved to history.`
    });
    
    // Reset form
    setStops([
      { id: "origin", location: "", locationInput: "", type: "pickup", order: 0 },
      { id: "destination", location: "", locationInput: "", type: "dropoff", order: 1 }
    ]);
    setDate(undefined);
    setCargoType("");
    setWeight("");
    setTransportMode("any");
    setCargoItems([]);
    
    setTimeout(() => {
      navigate('/bookings', { state: { activeTab: 'history' } });
    }, 1000);
  };

  // Save booking as template
  const handleSaveTemplate = () => {
    if (!validateForm()) {
      toast({
        title: "Incomplete Template",
        description: "Please fill in all required fields to save a template.",
        variant: "destructive"
      });
      return;
    }
    
    const origin = stops.find(stop => stop.id === "origin");
    const destination = stops.find(stop => stop.id === "destination");
    
    if (!origin || !destination) return;
    
    const originLabel = getLocationLabel(origin);
    const destinationLabel = getLocationLabel(destination);
    
    const templateName = `${originLabel} to ${destinationLabel} (${stops.length - 2} stops)`;
    const templates = JSON.parse(localStorage.getItem('shipmentTemplates') || '[]');
    
    templates.push({
      id: Date.now().toString(),
      name: templateName,
      isMultiStop: true,
      stops,
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

  return (
    <div className={cn("nexus-card-blue p-6", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Multi-Stop Booking</h2>
        <span className="rounded-full bg-nexus-blue/20 px-3 py-1 text-xs font-medium text-nexus-blue">
          AI Route Optimizer
        </span>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">
            Route Stops
          </label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addStop}
            className="gap-1 text-xs"
          >
            <Plus className="h-3 w-3" />
            Add Stop
          </Button>
        </div>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="stops">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {stops.map((stop, index) => (
                  <Draggable 
                    key={stop.id} 
                    draggableId={stop.id} 
                    index={index}
                    isDragDisabled={stop.id === "origin" || stop.id === "destination"}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "rounded-lg border p-3",
                          stop.id === "origin" 
                            ? "border-nexus-blue/30 bg-nexus-blue/10" 
                            : stop.id === "destination" 
                              ? "border-nexus-purple/30 bg-nexus-purple/10"
                              : "border-white/10 bg-white/5"
                        )}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center">
                            <div 
                              {...provided.dragHandleProps}
                              className="mr-2 cursor-move rounded p-1 hover:bg-white/10"
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="font-medium text-white">
                              {stop.id === "origin" 
                                ? "Origin" 
                                : stop.id === "destination" 
                                  ? "Final Destination" 
                                  : `Stop ${index}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Stop type selector */}
                            {stop.id !== "origin" && stop.id !== "destination" && (
                              <Select
                                value={stop.type}
                                onValueChange={(value) => 
                                  changeStopType(stop.id, value as StopType["type"])
                                }
                              >
                                <SelectTrigger className="h-7 w-24 text-xs">
                                  <SelectValue placeholder="Stop type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pickup">Pickup</SelectItem>
                                  <SelectItem value="dropoff">Drop-off</SelectItem>
                                  <SelectItem value="both">Both</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                            
                            {/* Origin and destination have fixed type badges */}
                            {stop.id === "origin" && (
                              <Badge variant="outline" className="bg-nexus-blue/20 text-nexus-blue border-nexus-blue/30">
                                Pickup
                              </Badge>
                            )}
                            {stop.id === "destination" && (
                              <Badge variant="outline" className="bg-nexus-purple/20 text-nexus-purple border-nexus-purple/30">
                                Drop-off
                              </Badge>
                            )}

                            {/* Remove button - only for intermediate stops */}
                            {stop.id !== "origin" && stop.id !== "destination" && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => removeStop(stop.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <LocationSelector 
                          label=""
                          value={stop.location}
                          onChange={(value) => updateStopLocation(stop.id, value)}
                          manualInput={stop.locationInput}
                          onManualInputChange={(value) => updateStopLocationInput(stop.id, value)}
                          locations={locations}
                          placeholder={`Select or enter ${stop.id === "origin" ? "origin" : stop.id === "destination" ? "destination" : "stop"} location`}
                          error={stop.id === "origin" ? validationErrors.origin : stop.id === "destination" ? validationErrors.destination : undefined}
                        />
                        
                        {index < stops.length - 1 && (
                          <div className="mt-3 flex items-center justify-center">
                            <div className="h-6 w-px bg-white/10"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        {validationErrors.intermediateStops && (
          <p className="mt-2 text-xs text-destructive">{validationErrors.intermediateStops}</p>
        )}
        
        {/* Display route segment details if available */}
        {segmentDetails.length > 0 && (
          <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Route Segments</h3>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Total Estimated Time: {totalEstimatedTime}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              {segmentDetails.map((segment, index) => (
                <div 
                  key={index} 
                  className="rounded-md border border-white/10 bg-white/5 p-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-medium text-white">
                        {segment.startLabel} → {segment.endLabel}
                      </span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        segment.transportMode === "air" 
                          ? "bg-nexus-blue/10 text-nexus-blue-light border-nexus-blue/30" 
                          : segment.transportMode === "sea" 
                            ? "bg-nexus-teal/10 text-nexus-teal border-nexus-teal/30"
                            : "bg-white/10 text-white border-white/30"
                      }
                    >
                      {segment.transportMode}
                    </Badge>
                  </div>
                  
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Time: {segment.time}</span>
                    <span>Distance: {segment.distance}</span>
                    <span>Cost: {segment.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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

        <ActionButtons 
          handleSaveTemplate={handleSaveTemplate}
          handleBookingConfirmation={handleBookingConfirmation}
          handleFindRoutes={handleFindRoutes}
          origin=""
          destination=""
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
    </div>
  );
};

export default MultiStopBookingForm;
