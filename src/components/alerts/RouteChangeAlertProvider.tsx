
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RouteChangeAlert } from './RouteChangeAlert';

interface RouteAlert {
  origin: string;
  destination: string;
  originalRoute: string;
  newRoute: string;
  reason: string;
  costChange: string;
  delay: string;
}

interface RouteAlertContextType {
  showRouteChangeAlert: (alert: RouteAlert) => void;
}

const RouteAlertContext = createContext<RouteAlertContextType | undefined>(undefined);

export const useRouteAlert = (): RouteAlertContextType => {
  const context = useContext(RouteAlertContext);
  if (!context) {
    throw new Error('useRouteAlert must be used within a RouteChangeAlertProvider');
  }
  return context;
};

export const RouteChangeAlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [routeAlert, setRouteAlert] = useState<RouteAlert | null>(null);

  const showRouteChangeAlert = (alert: RouteAlert) => {
    setRouteAlert(alert);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <RouteAlertContext.Provider value={{ showRouteChangeAlert }}>
      {children}
      {showAlert && routeAlert && (
        <RouteChangeAlert 
          route={routeAlert} 
          onClose={handleCloseAlert}
        />
      )}
    </RouteAlertContext.Provider>
  );
};
