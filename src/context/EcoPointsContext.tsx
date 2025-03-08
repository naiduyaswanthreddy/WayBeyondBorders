
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";

interface EcoMetrics {
  co2Saved: number; // in kg
  treesPlanted: number;
  plasticReduced: number; // in kg
}

interface EcoPointsContextType {
  points: number;
  addPoints: (amount: number, metrics?: Partial<EcoMetrics>) => void;
  redeemPoints: (amount: number) => void;
  metrics: EcoMetrics;
  shareShipment: (origin: string, destination: string, weight: string) => void;
  sharedShipments: SharedShipment[];
  hasAvailableShares: (origin: string, destination: string) => boolean;
}

export interface SharedShipment {
  id: string;
  origin: string;
  destination: string;
  date: string;
  weight: string;
  participants: number;
  savings: number;
  co2Reduction: number;
}

const EcoPointsContext = createContext<EcoPointsContextType | undefined>(undefined);

export const useEcoPoints = (): EcoPointsContextType => {
  const context = useContext(EcoPointsContext);
  if (!context) {
    throw new Error('useEcoPoints must be used within an EcoPointsProvider');
  }
  return context;
};

export const EcoPointsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [points, setPoints] = useState<number>(0);
  const [metrics, setMetrics] = useState<EcoMetrics>({
    co2Saved: 0,
    treesPlanted: 0,
    plasticReduced: 0
  });
  const [sharedShipments, setSharedShipments] = useState<SharedShipment[]>([]);

  // Load points and metrics from localStorage on mount
  useEffect(() => {
    const savedPoints = localStorage.getItem('ecoPoints');
    const savedMetrics = localStorage.getItem('ecoMetrics');
    const savedSharedShipments = localStorage.getItem('sharedShipments');
    
    if (savedPoints) {
      setPoints(parseInt(savedPoints, 10));
    }
    
    if (savedMetrics) {
      try {
        setMetrics(JSON.parse(savedMetrics));
      } catch (e) {
        console.error("Failed to parse saved eco metrics:", e);
      }
    }
    
    if (savedSharedShipments) {
      try {
        setSharedShipments(JSON.parse(savedSharedShipments));
      } catch (e) {
        console.error("Failed to parse saved shared shipments:", e);
      }
    }
  }, []);

  // Save points, metrics, and shared shipments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ecoPoints', points.toString());
    localStorage.setItem('ecoMetrics', JSON.stringify(metrics));
    localStorage.setItem('sharedShipments', JSON.stringify(sharedShipments));
  }, [points, metrics, sharedShipments]);

  const addPoints = (amount: number, newMetrics?: Partial<EcoMetrics>) => {
    setPoints(prevPoints => {
      const newPoints = prevPoints + amount;
      return newPoints;
    });
    
    if (newMetrics) {
      setMetrics(prev => {
        const updatedMetrics = {
          co2Saved: prev.co2Saved + (newMetrics.co2Saved || 0),
          treesPlanted: prev.treesPlanted + (newMetrics.treesPlanted || 0),
          plasticReduced: prev.plasticReduced + (newMetrics.plasticReduced || 0)
        };
        
        return updatedMetrics;
      });
      
      // Only show toast if there are actual metrics to report
      const hasMetrics = Object.values(newMetrics).some(value => value > 0);
      
      if (hasMetrics) {
        toast({
          title: "Eco Impact Updated!",
          description: `You've earned ${amount} Eco Points and saved ${newMetrics.co2Saved || 0}kg of CO₂!`,
        });
      } else {
        toast({
          title: "Eco Points Earned!",
          description: `You've earned ${amount} Eco Points. Total: ${points + amount} points.`,
        });
      }
    } else {
      toast({
        title: "Eco Points Earned!",
        description: `You've earned ${amount} Eco Points. Total: ${points + amount} points.`,
      });
    }
  };

  const redeemPoints = (amount: number) => {
    setPoints(prevPoints => {
      if (prevPoints >= amount) {
        const newPoints = prevPoints - amount;
        toast({
          title: "Eco Points Redeemed!",
          description: `You've redeemed ${amount} Eco Points. Remaining: ${newPoints} points.`,
        });
        return newPoints;
      } else {
        toast({
          title: "Not Enough Eco Points",
          description: `You need ${amount} points, but only have ${prevPoints}.`,
          variant: "destructive",
        });
        return prevPoints;
      }
    });
  };
  
  const shareShipment = (origin: string, destination: string, weight: string) => {
    // Generate a random savings amount between 15-30% of a base cost
    const baseCost = parseInt(weight) * 0.5; 
    const savingsPercent = Math.random() * (0.3 - 0.15) + 0.15;
    const savings = Math.round(baseCost * savingsPercent);
    
    // Calculate CO2 reduction (simplified model)
    const co2Reduction = Math.round(parseInt(weight) * 0.2); // 0.2kg CO2 saved per kg of cargo in shared shipment
    
    const newSharedShipment: SharedShipment = {
      id: `share-${Date.now()}`,
      origin,
      destination,
      date: new Date().toISOString(),
      weight,
      participants: Math.floor(Math.random() * 3) + 2, // 2-4 participants
      savings,
      co2Reduction
    };
    
    setSharedShipments(prev => [...prev, newSharedShipment]);
    
    // Add eco points for sharing
    addPoints(50, { co2Saved: co2Reduction });
    
    toast({
      title: "Shipment Shared Successfully!",
      description: `Your shipment has been shared with ${newSharedShipment.participants - 1} other customers, saving $${savings} and ${co2Reduction}kg of CO₂!`,
    });
  };
  
  const hasAvailableShares = (origin: string, destination: string): boolean => {
    // Check if there are potential shipments to share based on origin/destination
    // This is a simplified implementation - in a real system, you would check against 
    // actual data from a backend or algorithm
    
    // For demo purposes, return true for common shipping routes
    const commonRoutes = [
      { origin: "Shanghai, China", destination: "Rotterdam, Netherlands" },
      { origin: "Los Angeles, USA", destination: "New York, USA" },
      { origin: "Singapore", destination: "Dubai, UAE" },
      { origin: "Tokyo, Japan", destination: "Long Beach, USA" }
    ];
    
    return commonRoutes.some(route => 
      (route.origin.includes(origin) || origin.includes(route.origin)) && 
      (route.destination.includes(destination) || destination.includes(route.destination))
    );
  };

  return (
    <EcoPointsContext.Provider value={{ 
      points, 
      addPoints, 
      redeemPoints, 
      metrics,
      shareShipment,
      sharedShipments,
      hasAvailableShares
    }}>
      {children}
    </EcoPointsContext.Provider>
  );
};
