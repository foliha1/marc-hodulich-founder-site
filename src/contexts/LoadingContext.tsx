import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface LoadingContextType {
  isPageReady: boolean;
  setPageReady: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isPageReady, setIsPageReady] = useState(false);
  const location = useLocation();

  // Reset loading state on route changes
  useEffect(() => {
    setIsPageReady(false);
  }, [location.pathname]);

  const handleSetPageReady = () => {
    setIsPageReady(true);
  };

  return (
    <LoadingContext.Provider value={{ isPageReady, setPageReady: handleSetPageReady }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoadingContext = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoadingContext must be used within a LoadingProvider");
  }
  return context;
};
