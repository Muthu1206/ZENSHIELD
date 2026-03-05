/**
 * Updated AppContext with Authentication
 * Location: src/app/context/AppContext.tsx
 */

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface RideInfo {
  vehicleNumber: string;
  destination: string;
  guardianContact: string;
  startTime: Date;
  duration: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginError: string | null;
}

interface AppState {
  // User Info
  userId: string | null;
  username: string;
  setUsername: (name: string) => void;
  email: string | null;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;

  // Safe Word
  safeWord: string;
  setSafeWord: (word: string) => void;
  voiceMonitoring: boolean;
  setVoiceMonitoring: (v: boolean) => void;

  // Ride Management
  currentRide: RideInfo | null;
  setCurrentRide: (ride: RideInfo | null) => void;
  isSOSActive: boolean;
  setIsSOSActive: (v: boolean) => void;

  // Permissions
  permissions: {
    location: boolean;
    camera: boolean;
    microphone: boolean;
    contacts: boolean;
  };
  setPermission: (key: string, value: boolean) => void;

  // Authentication
  auth: AuthState;
  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;
  setLoginError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // User Info State
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("Priya");
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState("");

  // Safe Word State
  const [safeWord, setSafeWord] = useState("Lotus");
  const [voiceMonitoring, setVoiceMonitoring] = useState(true);

  // Ride State
  const [currentRide, setCurrentRide] = useState<RideInfo | null>(null);
  const [isSOSActive, setIsSOSActive] = useState(false);

  // Permissions State
  const [permissions, setPermissions] = useState({
    location: false,
    camera: false,
    microphone: false,
    contacts: false,
  });

  // Authentication State
  const [auth, setAuth] = useState<AuthState>({
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    loginError: null,
  });

  // Initialize auth state from sessionStorage
  useEffect(() => {
    const storedAccessToken = sessionStorage.getItem("accessToken");
    const storedRefreshToken = sessionStorage.getItem("refreshToken");

    if (storedAccessToken) {
      setAuth((prev) => ({
        ...prev,
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
        isAuthenticated: true,
      }));
    }
  }, []);

  // Permission Management
  const setPermission = (key: string, value: boolean) => {
    setPermissions((prev) => ({ ...prev, [key]: value }));
  };

  // Token Management
  const setTokens = (access: string, refresh: string) => {
    sessionStorage.setItem("accessToken", access);
    sessionStorage.setItem("refreshToken", refresh);

    setAuth((prev) => ({
      ...prev,
      accessToken: access,
      refreshToken: refresh,
      isAuthenticated: true,
      loginError: null,
    }));
  };

  const clearTokens = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");

    setAuth((prev) => ({
      ...prev,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    }));

    // Reset user data
    setUserId(null);
    setUsername("Priya");
    setEmail(null);
    setPhone("");
  };

  const setLoginError = (error: string | null) => {
    setAuth((prev) => ({ ...prev, loginError: error }));
  };

  const setLoading = (loading: boolean) => {
    setAuth((prev) => ({ ...prev, isLoading: loading }));
  };

  return (
    <AppContext.Provider
      value={{
        // User Info
        userId,
        username,
        setUsername,
        email,
        setEmail,
        phone,
        setPhone,

        // Safe Word
        safeWord,
        setSafeWord,
        voiceMonitoring,
        setVoiceMonitoring,

        // Ride
        currentRide,
        setCurrentRide,
        isSOSActive,
        setIsSOSActive,

        // Permissions
        permissions,
        setPermission,

        // Auth
        auth,
        setTokens,
        clearTokens,
        setLoginError,
        setLoading,
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