
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RouteChangeAlert } from './RouteChangeAlert';

interface AlertInfo {
  show: boolean;
  route?: {
    origin: string;
    destination: string;
    originalRoute: string;
    newRoute: string;
    reason: string;
    costChange: string;
    delay: string;
  };
}

interface RouteAlertContextType {
  alertInfo: AlertInfo;
  showRouteChangeAlert: (routeInfo: Omit<AlertInfo['route'], 'show'>) => void;
  hideRouteChangeAlert: () => void;
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
  const [alertInfo, setAlertInfo] = useState<AlertInfo>({ show: false });

  const showRouteChangeAlert = (routeInfo: Omit<AlertInfo['route'], 'show'>) => {
    setAlertInfo({
      show: true,
      route: routeInfo
    });
  };

  const hideRouteChangeAlert = () => {
    setAlertInfo({ show: false });
  };

  return (
    <RouteAlertContext.Provider value={{ alertInfo, showRouteChangeAlert, hideRouteChangeAlert }}>
      {children}
      {alertInfo.show && alertInfo.route && (
        <RouteChangeAlert
          route={alertInfo.route}
          onClose={hideRouteChangeAlert}
        />
      )}
    </RouteAlertContext.Provider>
  );
};
