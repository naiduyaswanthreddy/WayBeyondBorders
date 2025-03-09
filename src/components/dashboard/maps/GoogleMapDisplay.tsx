
import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface GoogleMapDisplayProps {
  origin: string;
  destination: string;
  transportModes?: string[];
}

const GoogleMapDisplay: React.FC<GoogleMapDisplayProps> = ({ 
  origin, 
  destination, 
  transportModes = ["driving"]
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Simple map rendering for demo purposes
    // In a production app, you would use the actual Google Maps API
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [origin, destination, transportModes]);

  // In a real implementation, you would use the Google Maps JavaScript API
  // For now, we'll simulate the map with a placeholder
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-white/10 relative">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-nexus-blue-light" />
            <span className="mt-2 text-sm text-muted-foreground">Loading map data...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Map background - in a real app, this would be replaced by the Google Maps API */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1527489377706-5bf97e608852?ixlib=rb-4.0.3')] bg-cover bg-center opacity-70"></div>
          
          {/* Route visualization */}
          <div className="absolute inset-0 p-4">
            {/* Origin marker */}
            <div className="absolute left-[15%] top-[40%] z-10">
              <div className="h-4 w-4 rounded-full bg-nexus-blue shadow-[0_0_10px_rgba(0,98,255,0.7)]"></div>
              <div className="mt-1 px-2 py-1 rounded text-xs text-white bg-black/70 whitespace-nowrap">
                {origin}
              </div>
            </div>
            
            {/* Destination marker */}
            <div className="absolute right-[15%] top-[30%] z-10">
              <div className="h-4 w-4 rounded-full bg-nexus-purple shadow-[0_0_10px_rgba(110,54,229,0.7)]"></div>
              <div className="mt-1 px-2 py-1 rounded text-xs text-white bg-black/70 whitespace-nowrap">
                {destination}
              </div>
            </div>
            
            {/* Transport mode visualization */}
            {transportModes && transportModes.length > 0 && (
              <div className="absolute inset-0">
                {/* First leg - for example Air */}
                {transportModes.includes("air") && (
                  <svg className="absolute inset-0 h-full w-full" style={{ filter: 'drop-shadow(0 0 4px rgba(0, 98, 255, 0.7))' }}>
                    <path
                      d="M 15% 40% C 30% 25%, 45% 25%, 60% 30%"
                      stroke="#0062FF"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="4,2"
                    />
                  </svg>
                )}
                
                {/* Second leg - for example Truck */}
                {transportModes.includes("truck") && (
                  <svg className="absolute inset-0 h-full w-full" style={{ filter: 'drop-shadow(0 0 4px rgba(0, 207, 213, 0.7))' }}>
                    <path
                      d="M 60% 30% C 70% 30%, 75% 30%, 85% 30%"
                      stroke="#00CFD5"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                )}
                
                {/* Transition point */}
                {transportModes.includes("air") && transportModes.includes("truck") && (
                  <div className="absolute left-[60%] top-[30%] z-20">
                    <div className="h-3 w-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]"></div>
                    <div className="mt-1 px-2 py-1 rounded text-xs text-white bg-black/70 whitespace-nowrap">
                      Transfer Point
                    </div>
                  </div>
                )}
                
                {/* Transport icons */}
                {transportModes.includes("air") && (
                  <div className="absolute left-[40%] top-[25%] z-10">
                    <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0062FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
                      </svg>
                    </div>
                  </div>
                )}
                
                {transportModes.includes("truck") && (
                  <div className="absolute left-[75%] top-[30%] z-10">
                    <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00CFD5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 17h4V5H2v12h3m12-5h4l3 5v5h-3m-5 0h8m-16 0h4M5 9h5m-5 4h3"></path>
                        <circle cx="7" cy="17" r="2"></circle>
                        <circle cx="17" cy="17" r="2"></circle>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Map attribution - important for Google Maps */}
          <div className="absolute bottom-1 left-1 text-[8px] text-white/70">
            Map data visualization (Google Maps API integration)
          </div>
        </>
      )}
    </div>
  );
};

export default GoogleMapDisplay;
