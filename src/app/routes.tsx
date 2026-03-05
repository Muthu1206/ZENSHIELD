import { createBrowserRouter, Outlet } from "react-router";
import { AppProvider } from "./context/AppContext";
import { SplashScreen } from "./screens/SplashScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { PermissionScreen } from "./screens/PermissionScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { StartRideScreen } from "./screens/StartRideScreen";
import { LiveRideScreen } from "./screens/LiveRideScreen";
import { SOSScreen } from "./screens/SOSScreen";
import { EvidenceScreen } from "./screens/EvidenceScreen";
import { HeatmapScreen } from "./screens/HeatmapScreen";
import { SafeCircleScreen } from "./screens/SafeCircleScreen";
import { VoiceSafeWordScreen } from "./screens/VoiceSafeWordScreen";
import { AIAnalysisScreen } from "./screens/AIAnalysisScreen";
import React from "react";

function MobileWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8d7e8 0%, #e8d5e8 50%, #d5d5e8 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "390px",
          height: "100vh",
          maxHeight: "844px",
          background: "#f0fdf4",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
          borderRadius: "0px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Root() {
  return (
    <AppProvider>
      <MobileWrapper>
        <Outlet />
      </MobileWrapper>
    </AppProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: SplashScreen },
      { path: "login", Component: LoginScreen },
      { path: "permissions", Component: PermissionScreen },
      { path: "home", Component: HomeScreen },
      { path: "start-ride", Component: StartRideScreen },
      { path: "live-ride", Component: LiveRideScreen },
      { path: "sos", Component: SOSScreen },
      { path: "evidence", Component: EvidenceScreen },
      { path: "heatmap", Component: HeatmapScreen },
      { path: "safe-circle", Component: SafeCircleScreen },
      { path: "voice-safeword", Component: VoiceSafeWordScreen },
      { path: "ai-analysis", Component: AIAnalysisScreen },
    ],
  },
]);
