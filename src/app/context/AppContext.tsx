import React, { createContext, useContext, useState, ReactNode } from "react";

interface RideInfo {
  vehicleNumber: string;
  destination: string;
  guardianContact: string;
  startTime: Date;
  duration: string;
}

interface AppState {
  username: string;
  setUsername: (name: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  safeWord: string;
  setSafeWord: (word: string) => void;
  voiceMonitoring: boolean;
  setVoiceMonitoring: (v: boolean) => void;
  currentRide: RideInfo | null;
  setCurrentRide: (ride: RideInfo | null) => void;
  isSOSActive: boolean;
  setIsSOSActive: (v: boolean) => void;
  permissions: {
    location: boolean;
    camera: boolean;
    microphone: boolean;
    contacts: boolean;
  };
  setPermission: (key: string, value: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState("Priya");
  const [phone, setPhone] = useState("");
  const [safeWord, setSafeWord] = useState("Lotus");
  const [voiceMonitoring, setVoiceMonitoring] = useState(true);
  const [currentRide, setCurrentRide] = useState<RideInfo | null>(null);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [permissions, setPermissions] = useState({
    location: false,
    camera: false,
    microphone: false,
    contacts: false,
  });

  const setPermission = (key: string, value: boolean) => {
    setPermissions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AppContext.Provider
      value={{
        username,
        setUsername,
        phone,
        setPhone,
        safeWord,
        setSafeWord,
        voiceMonitoring,
        setVoiceMonitoring,
        currentRide,
        setCurrentRide,
        isSOSActive,
        setIsSOSActive,
        permissions,
        setPermission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
