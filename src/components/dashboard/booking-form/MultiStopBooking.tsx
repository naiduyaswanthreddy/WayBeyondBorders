import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { PlusCircle, Trash2, GripVertical, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { locations } from "./data";
import LocationSelector from "./LocationSelector";

export interface Stop {
  id: string;
  location: string;
  manualLocation: string;
  type: "pickup" | "dropoff" | "both";
  estimatedTime?: string;
  notes?: string;
}

interface MultiStopBookingProps {
  className?: string;
  origin: string;
  destination: string;
  originInput: string;
  destinationInput: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onOriginInputChange: (value: string) => void;
  onDestinationInputChange: (value: string) => void;
}

const MultiStopBooking: React.FC<MultiStopBookingProps> = ({
  className,
  origin,
  destination,
  originInput,
  destinationInput,
  onOriginChange,
  onDestinationChange,
  onOriginInputChange,
  onDestinationInputChange
}) => {
  const [stops, setStops] = useState<Stop[]>([]);
  const [totalEstimatedTime, setTotalEstimatedTime] = useState<string>("");

  useEffect(() => {
    calculateTotalEstimatedTime();
  }, [origin, destination, stops]);

  const calculateTotalEstimatedTime = () => {
    if (stops.length === 0) {
      setTotalEstimatedTime("");
      return;
    }

    const baseTime = 2;
    const stopFactor = stops.length * 0.5;
    
    setTotalEstimatedTime(`${baseTime + stopFactor} days (estimated)`);
  };

  const addStop = () => {
    const newStop: Stop = {
      id: `stop-${Date.now()}`,
      location: "",
      manualLocation: "",
      type: "both",
    };
    
    setStops([...stops, newStop]);
    
    toast({
      title: "Stop Added",
      description: "Configure this stop's details below"
    });
  };

  const removeStop = (stopId: string) => {
    setStops(stops.filter(stop => stop.id !== stopId));
    
    toast({
      title: "Stop Removed",
      description: "Your route has been updated"
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(stops);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setStops(items);
  };

  const updateStop = (id: string, field: keyof Stop, value: string) => {
    setStops(stops.map(stop => 
      stop.id === id ? { ...stop, [field]: value } : stop
    ));
  };

  useEffect(() => {
    const stopsData = {
      origin,
      originInput,
      destination, 
      destinationInput,
      intermediateStops: stops
    };
    
    sessionStorage.setItem('multiStopData', JSON.stringify(stopsData));
    
    const updateEvent = new CustomEvent('multiStopDataUpdated', { detail: stopsData });
    window.dispatchEvent(updateEvent);
  }, [origin, destination, originInput, destinationInput, stops]);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Multi-Stop Shipping</h3>
        <Badge variant="outline" className="bg-nexus-blue/10 text-nexus-blue-light px-2 py-1">
          {stops.length} Stops
        </Badge>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <LocationSelector 
            label="Origin"
            value={origin}
            onChange={onOriginChange}
            manualInput={originInput}
            onManualInputChange={onOriginInputChange}
            locations={locations}
            placeholder="Select or enter origin location"
          />
        </div>

        <div className="space-y-2">
          <LocationSelector 
            label="Final Destination"
            value={destination}
            onChange={onDestinationChange}
            manualInput={destinationInput}
            onManualInputChange={onDestinationInputChange}
            locations={locations}
            placeholder="Select or enter destination location"
          />
        </div>
      </div>
      
      {totalEstimatedTime && (
        <div className="nexus-card-blue p-3 flex items-center justify-between rounded-md">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-nexus-blue-light" />
            <span className="text-sm font-medium">Total Estimated Time:</span>
          </div>
          <span className="text-sm font-medium text-nexus-blue-light">{totalEstimatedTime}</span>
        </div>
      )}
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Intermediate Stops</Label>
          <Button 
            onClick={addStop}
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-xs"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Add Stop
          </Button>
        </div>
        
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="stops">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {stops.length === 0 ? (
                  <div className="border border-dashed border-white/10 rounded-md p-6 flex flex-col items-center justify-center text-center">
                    <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
                    <h4 className="text-sm font-medium text-white">No Stops Added</h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                      Add intermediate stops to create a multi-stop route between your origin and destination
                    </p>
                    <Button 
                      onClick={addStop}
                      variant="outline" 
                      size="sm" 
                      className="mt-4 gap-1"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Add First Stop
                    </Button>
                  </div>
                ) : (
                  stops.map((stop, index) => (
                    <Draggable key={stop.id} draggableId={stop.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="nexus-card-blue p-4 rounded-md"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-move p-1 rounded-md hover:bg-white/10"
                              >
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <h4 className="text-sm font-medium text-white">
                                Stop {index + 1}
                              </h4>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeStop(stop.id)}
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove stop</span>
                            </Button>
                          </div>
                          
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor={`stop-${stop.id}-location`} className="text-xs">
                                Location
                              </Label>
                              <LocationSelector
                                label={`Stop ${index + 1} Location`}
                                value={stop.location}
                                onChange={(value) => updateStop(stop.id, "location", value)}
                                manualInput={stop.manualLocation}
                                onManualInputChange={(value) => updateStop(stop.id, "manualLocation", value)}
                                locations={locations}
                                placeholder="Enter stop location"
                                hideLabel
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`stop-${stop.id}-type`} className="text-xs">
                                Stop Type
                              </Label>
                              <Select
                                value={stop.type}
                                onValueChange={(value) => updateStop(stop.id, "type", value)}
                              >
                                <SelectTrigger id={`stop-${stop.id}-type`} className="bg-white/5">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pickup">Pickup Only</SelectItem>
                                  <SelectItem value="dropoff">Drop-off Only</SelectItem>
                                  <SelectItem value="both">Pickup & Drop-off</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="mt-3 space-y-2">
                            <Label htmlFor={`stop-${stop.id}-notes`} className="text-xs">
                              Notes (Optional)
                            </Label>
                            <Input
                              id={`stop-${stop.id}-notes`}
                              placeholder="Special instructions for this stop"
                              className="bg-white/5"
                              value={stop.notes || ""}
                              onChange={(e) => updateStop(stop.id, "notes", e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default MultiStopBooking;
