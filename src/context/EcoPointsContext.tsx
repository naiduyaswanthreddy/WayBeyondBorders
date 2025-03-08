
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";

interface EcoPointsContextType {
  points: number;
  addPoints: (amount: number) => void;
  redeemPoints: (amount: number) => void;
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

  // Load points from localStorage on mount
  useEffect(() => {
    const savedPoints = localStorage.getItem('ecoPoints');
    if (savedPoints) {
      setPoints(parseInt(savedPoints, 10));
    }
  }, []);

  // Save points to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ecoPoints', points.toString());
  }, [points]);

  const addPoints = (amount: number) => {
    setPoints(prevPoints => {
      const newPoints = prevPoints + amount;
      toast({
        title: "Eco Points Earned!",
        description: `You've earned ${amount} Eco Points. Total: ${newPoints} points.`,
      });
      return newPoints;
    });
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

  return (
    <EcoPointsContext.Provider value={{ points, addPoints, redeemPoints }}>
      {children}
    </EcoPointsContext.Provider>
  );
};
