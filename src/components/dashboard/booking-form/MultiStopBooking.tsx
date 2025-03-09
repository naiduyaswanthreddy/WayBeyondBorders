
import React, { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, Trash2, GripVertical, AlertTriangle, Clock } from "lucide-react";
import LocationSelector from "./LocationSelector";
import { locations } from "./data";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

export interface Stop {
  id: string;
  location: string;
  locationInput: string;
  type: 'pickup' | 'dropoff' | 'both';
}

interface MultiStopBookingProps {
  origin: string;
  originInput: string;
  destination: string;
  destinationInput: string;
  stops: Stop[];
  onOriginChange: (value: string) => void;
  onOriginInputChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onDestinationInputChange: (value: string) => void;
  onStopsChange: (stops: Stop[]) => void;
}

const MultiStopBooking: React.FC<MultiStopBookingProps> = ({
  origin,
  originInput,
  destination,
  destinationInput,
  stops,
  onOriginChange,
  onOriginInputChange,
  onDestinationChange,
  onDestinationInputChange,
  onStopsChange
}) => {
  // Calculate estimated time based on number of stops
  const estimateMultiStopTime = () => {
    if (!origin && !originInput || !destination && !destinationInput) {
      return "";
    }
    
    // Base time calculation (simplified for demonstration)
    let baseTime = "3-5 days";
    
    // Add time for each stop (extremely simplified)
    if (stops.length > 0) {
      const extraDays = stops.length * 0.5;
      baseTime = `${3 + extraDays}-${5 + extraDays} days`;
    }
    
    return baseTime;
  };
  
  // Handle adding a new stop
  const handleAddStop = () => {
    const newStop: Stop = {
      id: `stop-${Date.now()}`,
      location: "",
      locationInput: "",
      type: "both"
    };
    
    onStopsChange([...stops, newStop]);
  };
  
  // Handle removing a stop
  const handleRemoveStop = (id: string) => {
    onStopsChange(stops.filter(stop => stop.id !== id));
  };
  
  // Handle changing stop type
  const handleStopTypeChange = (id: string, type: 'pickup' | 'dropoff' | 'both') => {
    onStopsChange(
      stops.map(stop => 
        stop.id === id ? { ...stop, type } : stop
      )
    );
  };
  
  // Handle changing stop location
  const handleStopLocationChange = (id: string, value: string) => {
    onStopsChange(
      stops.map(stop => 
        stop.id === id ? { ...stop, location: value } : stop
      )
    );
  };
  
  // Handle changing stop manual input
  const handleStopLocationInputChange = (id: string, value: string) => {
    onStopsChange(
      stops.map(stop => 
        stop.id === id ? { ...stop, locationInput: value } : stop
      )
    );
  };
  
  // Handle drag and drop reordering
  const onDragEnd = useCallback((result: any) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }
    
    const items = Array.from(stops);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onStopsChange(items);
  }, [stops, onStopsChange]);
  
  return (
    <div className="space-y-6">
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
            error=""
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
            error=""
          />
        </div>
      </div>
      
      {/* Estimated Time Display */}
      <div className="premium-glass px-4 py-3 bg-nexus-blue/5 rounded-md">
        <div className="flex items-center text-nexus-blue-light">
          <Clock className="mr-2 h-4 w-4" />
          <span className="font-medium">Estimated Total Time: {estimateMultiStopTime()}</span>
        </div>
        
        {stops.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            <AlertTriangle className="inline-block mr-1 h-3 w-3" />
            Each additional stop may add 0.5-1 day to your total shipment time.
          </div>
        )}
      </div>
      
      {/* Intermediate Stops Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-white">Intermediate Stops</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddStop}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
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
                {stops.map((stop, index) => (
                  <Draggable key={stop.id} draggableId={stop.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="rounded-md border border-white/10 bg-white/5 p-3"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div
                              {...provided.dragHandleProps}
                              className="mr-2 text-muted-foreground cursor-move hover:text-white transition-colors"
                            >
                              <GripVertical className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-white">Stop {index + 1}</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Select 
                              value={stop.type}
                              onValueChange={(value) => handleStopTypeChange(stop.id, value as any)}
                            >
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue placeholder="Stop Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pickup">Pickup</SelectItem>
                                <SelectItem value="dropoff">Dropoff</SelectItem>
                                <SelectItem value="both">Pickup & Dropoff</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveStop(stop.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <LocationSelector 
                          label=""
                          value={stop.location}
                          onChange={(value) => handleStopLocationChange(stop.id, value)}
                          manualInput={stop.locationInput}
                          onManualInputChange={(value) => handleStopLocationInputChange(stop.id, value)}
                          locations={locations}
                          placeholder="Select or enter stop location"
                          error=""
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        {stops.length === 0 && (
          <div className="text-center p-6 border border-dashed border-white/10 rounded-md">
            <p className="text-muted-foreground">
              Add intermediate stops to create a multi-point route
            </p>
          </div>
        )}
      </div>
      
      {stops.length > 0 && (
        <div className="nexus-card-blue p-4 rounded-md">
          <h4 className="mb-3 text-sm font-medium text-white">Route Summary</h4>
          <div className="space-y-2">
            <div className="flex items-center text-xs">
              <div className="h-3 w-3 rounded-full bg-nexus-blue mr-2"></div>
              <span className="text-muted-foreground">Origin:</span>
              <span className="ml-2 text-white">{origin || originInput}</span>
            </div>
            
            {stops.map((stop, idx) => (
              <div key={stop.id} className="flex items-center text-xs">
                <div className={`h-3 w-3 rounded-full mr-2 ${
                  stop.type === 'pickup' ? 'bg-green-500' : 
                  stop.type === 'dropoff' ? 'bg-red-500' : 
                  'bg-amber-500'
                }`}></div>
                <span className="text-muted-foreground">
                  {stop.type === 'pickup' ? 'Pickup:' : 
                   stop.type === 'dropoff' ? 'Dropoff:' : 
                   'Stop:'}
                </span>
                <span className="ml-2 text-white">{stop.location || stop.locationInput}</span>
              </div>
            ))}
            
            <div className="flex items-center text-xs">
              <div className="h-3 w-3 rounded-full bg-nexus-purple mr-2"></div>
              <span className="text-muted-foreground">Destination:</span>
              <span className="ml-2 text-white">{destination || destinationInput}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiStopBooking;
