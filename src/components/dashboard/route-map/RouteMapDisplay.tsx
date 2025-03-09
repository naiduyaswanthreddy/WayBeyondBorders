
import React, { useState, useEffect } from "react";
import GoogleMapDisplay from "../maps/GoogleMapDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, ExternalLink, Clock, Ruler, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface RouteSegment {
  from: string;
  to: string;
  mode: string;
  distance: string;
  duration: string;
}

interface RouteMapDisplayProps {
  selectedRoute: string;
  selectedRouteDetails: any;
  origin: string;
  destination: string;
  className?: string;
}

export const RouteMapDisplay: React.FC<RouteMapDisplayProps> = ({
  selectedRoute,
  selectedRouteDetails,
  origin,
  destination,
  className
}) => {
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [intermediateStops, setIntermediateStops] = useState<any[]>([]);
  const [isSharedRide, setIsSharedRide] = useState(false);
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  
  useEffect(() => {
    // Check for multi-stop data in session storage
    const multiStopData = sessionStorage.getItem('multiStopData');
    
    if (multiStopData) {
      try {
        const parsedData = JSON.parse(multiStopData);
        if (parsedData.intermediateStops && Array.isArray(parsedData.intermediateStops)) {
          setIntermediateStops(parsedData.intermediateStops.map((stop: any) => ({
            location: stop.location || stop.manualLocation,
            type: stop.type
          })));
        }
      } catch (error) {
        console.error("Error parsing multi-stop data:", error);
      }
    }
    
    // Check for ride-sharing data
    const rideSharingDetails = sessionStorage.getItem('rideSharingDetails');
    
    if (rideSharingDetails) {
      try {
        const parsedData = JSON.parse(rideSharingDetails);
        setIsSharedRide(!!parsedData);
      } catch (error) {
        console.error("Error parsing ride-sharing data:", error);
      }
    }
    
    // Generate route segments based on available data
    generateRouteSegments();
  }, [origin, destination, intermediateStops, selectedRouteDetails]);

  const getMapTransportModes = () => {
    if (!selectedRouteDetails) return [];
    
    return selectedRouteDetails.modes.map((mode: string) => mode.toLowerCase());
  };
  
  const generateRouteSegments = () => {
    const segments: RouteSegment[] = [];
    const modes = selectedRouteDetails?.modes || [];
    
    if (intermediateStops.length === 0) {
      // Direct route without stops
      segments.push({
        from: origin,
        to: destination,
        mode: modes[0] || "Unknown",
        distance: "Calculate distance...",
        duration: selectedRouteDetails?.duration || "Unknown"
      });
    } else {
      // Multi-stop route
      const allStops = [
        origin,
        ...intermediateStops.map(stop => stop.location),
        destination
      ];
      
      // Create segments between each consecutive pair of stops
      for (let i = 0; i < allStops.length - 1; i++) {
        const modeIndex = Math.min(i, modes.length - 1);
        segments.push({
          from: allStops[i],
          to: allStops[i + 1],
          mode: modes[modeIndex] || "Unknown",
          distance: `~${Math.floor(Math.random() * 1000) + 100}km`,
          duration: `${Math.floor(Math.random() * 24) + 1}h ${Math.floor(Math.random() * 60)}m`
        });
      }
    }
    
    setRouteSegments(segments);
  };

  return (
    <div className={cn("relative rounded-lg border border-white/10 overflow-hidden", className)}>
      {/* Map display component */}
      <GoogleMapDisplay 
        origin={origin}
        destination={destination}
        transportModes={getMapTransportModes()}
        intermediateStops={intermediateStops.map(stop => ({
          location: stop.location,
          type: stop.type
        }))}
        isSharedRide={isSharedRide}
      />
      
      {/* Route details on top right corner of the map */}
      {selectedRouteDetails && (
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md rounded-lg p-3 z-10 max-w-[240px] border border-white/10">
          <div className="flex flex-col gap-1 text-sm">
            <div className="mb-1 font-medium text-white flex items-center justify-between">
              {selectedRouteDetails.name}
              {isSharedRide && (
                <Badge variant="outline" className="ml-2 h-5 px-1 text-[10px] bg-green-500/20 text-green-400 border-green-500/30">
                  <Share2 className="h-3 w-3 mr-1" />
                  Shared
                </Badge>
              )}
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Duration:</span>
              <span className="text-white">{selectedRouteDetails.duration}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Cost:</span>
              <span className="text-white">{selectedRouteDetails.cost}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">CO₂:</span>
              <span className="text-white">{selectedRouteDetails.co2}</span>
            </div>
            
            {/* Toggle for detailed route segment view */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-1 h-7 text-xs"
              onClick={() => setShowRouteDetails(!showRouteDetails)}
            >
              {showRouteDetails ? (
                <>
                  <ArrowUp className="h-3 w-3 mr-1" />
                  Hide Details
                </>
              ) : (
                <>
                  <ArrowDown className="h-3 w-3 mr-1" />
                  Show Details
                </>
              )}
            </Button>
          </div>
        </div>
      )}
      
      {/* Detailed segment breakdown */}
      {showRouteDetails && (
        <div className="absolute bottom-16 right-3 left-3 md:left-auto md:w-1/3 bg-black/80 backdrop-blur-md rounded-lg p-3 z-10 border border-white/10 max-h-[300px] overflow-y-auto">
          <h4 className="text-sm font-medium text-white mb-2">Route Segments</h4>
          
          <div className="space-y-2">
            {routeSegments.map((segment, index) => (
              <Card key={index} className="bg-white/5 border-white/10">
                <CardContent className="p-2">
                  <div className="flex justify-between items-center text-xs">
                    <div className="font-medium text-nexus-blue-light">{segment.mode}</div>
                    <Badge variant="outline" className="h-5 px-1 text-[10px]">
                      Segment {index + 1}
                    </Badge>
                  </div>
                  
                  <div className="mt-1.5 space-y-1">
                    <div className="text-xs">
                      <span className="text-muted-foreground">From: </span>
                      <span className="text-white">{segment.from}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">To: </span>
                      <span className="text-white">{segment.to}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-2 pt-1.5 border-t border-white/10">
                    <div className="flex items-center text-[10px] text-muted-foreground">
                      <Ruler className="h-3 w-3 mr-1" />
                      {segment.distance}
                    </div>
                    <div className="flex items-center text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {segment.duration}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Total Segments: {routeSegments.length}
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              Export Route
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
