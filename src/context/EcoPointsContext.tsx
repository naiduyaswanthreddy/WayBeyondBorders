
import React, { createContext, useContext, useState, useEffect } from 'react';

interface EcoPointsContextType {
  points: number;
  addPoints: (amount: number) => void;
  redeemPoints: (amount: number) => boolean;
  shareShipment: (origin: string, destination: string, weight: string) => void;
  hasAvailableShares: (origin: string, destination: string) => boolean;
  sharedShipments: SharedShipment[];
  metrics: {
    co2Saved: number;
    treesPlanted: number;
    plasticReduced: number;
  };
}

interface SharedShipment {
  id: string;
  origin: string;
  destination: string;
  weight: string;
  date: string;
  matches: number;
  participants: number;    // Added missing property
  savings: number;         // Added missing property
  co2Reduction: number;    // Added missing property
}

const EcoPointsContext = createContext<EcoPointsContextType | undefined>(undefined);

export const EcoPointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [points, setPoints] = useState<number>(0);
  const [sharedShipments, setSharedShipments] = useState<SharedShipment[]>([]);
  
  // Define metrics for eco dashboard
  const metrics = {
    co2Saved: 1250,  // kg of CO2
    treesPlanted: 25,
    plasticReduced: 75 // kg of plastic
  };
  
  useEffect(() => {
    // Load points from localStorage
    const savedPoints = localStorage.getItem('ecoPoints');
    if (savedPoints) {
      setPoints(parseInt(savedPoints, 10));
    }
    
    // Load shared shipments from localStorage
    const savedShipments = localStorage.getItem('sharedShipments');
    if (savedShipments) {
      setSharedShipments(JSON.parse(savedShipments));
    } else {
      // Initialize with default data if no saved shipments
      const demoShipments: SharedShipment[] = [];
      setSharedShipments(demoShipments);
    }
  }, []);
  
  const addPoints = (amount: number) => {
    const newTotal = points + amount;
    setPoints(newTotal);
    localStorage.setItem('ecoPoints', newTotal.toString());
  };
  
  const redeemPoints = (amount: number): boolean => {
    if (points >= amount) {
      const newTotal = points - amount;
      setPoints(newTotal);
      localStorage.setItem('ecoPoints', newTotal.toString());
      return true;
    }
    return false;
  };
  
  const shareShipment = (origin: string, destination: string, weight: string) => {
    // Generate random values for the demo
    const matches = Math.floor(Math.random() * 3) + 2; // Random 2-4 matches
    const participants = matches + 1; // Including the user
    const savings = Math.floor(Math.random() * 150) + 50; // Random $50-$200 savings
    const co2Reduction = Math.floor(Math.random() * 500) + 100; // Random 100-600kg CO2 reduction
    
    const newShipment: SharedShipment = {
      id: Date.now().toString(),
      origin,
      destination,
      weight,
      date: new Date().toISOString(),
      matches,
      participants,
      savings,
      co2Reduction
    };
    
    const updatedShipments = [...sharedShipments, newShipment];
    setSharedShipments(updatedShipments);
    localStorage.setItem('sharedShipments', JSON.stringify(updatedShipments));
    
    // Add eco points for sharing
    addPoints(50);
  };
  
  const hasAvailableShares = (origin: string, destination: string): boolean => {
    // This would typically check with a backend API
    // For now, we'll simulate certain routes having sharing capability
    
    return origin.toLowerCase().includes('shanghai') || 
           destination.toLowerCase().includes('rotterdam') ||
           origin.toLowerCase().includes('new york') ||
           destination.toLowerCase().includes('singapore');
  };
  
  return (
    <EcoPointsContext.Provider 
      value={{ 
        points, 
        addPoints, 
        redeemPoints, 
        shareShipment, 
        hasAvailableShares,
        sharedShipments,
        metrics
      }}
    >
      {children}
    </EcoPointsContext.Provider>
  );
};

export const useEcoPoints = (): EcoPointsContextType => {
  const context = useContext(EcoPointsContext);
  if (context === undefined) {
    throw new Error('useEcoPoints must be used within an EcoPointsProvider');
  }
  return context;
};
