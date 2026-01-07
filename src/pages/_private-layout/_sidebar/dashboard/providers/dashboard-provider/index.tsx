import React, { useContext, useMemo } from "react";

const DashboardContext = React.createContext({});

interface DashboardProviderProps {
  children: React.ReactNode;
}

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const value = useMemo(() => ({}), []);

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }

  return context;
} 
