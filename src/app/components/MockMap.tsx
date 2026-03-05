import React from "react";
import { motion } from "motion/react";

interface MockMapProps {
  showRoute?: boolean;
  showHeatmap?: boolean;
  height?: number;
}

export function MockMap({ showRoute = false, showHeatmap = false, height = 220 }: MockMapProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{ height, background: "#e8f5e9" }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
        <defs>
          {/* Base grid */}
          <pattern id="mapgrid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#c8e6c9" strokeWidth="0.7" />
          </pattern>

          {/* Heatmap gradients */}
          {showHeatmap && (
            <>
              <radialGradient id="safe1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.55" />
                <stop offset="60%" stopColor="#22c55e" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="warn1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
                <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="danger1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.65" />
                <stop offset="60%" stopColor="#ef4444" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="safe2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.5" />
                <stop offset="60%" stopColor="#22c55e" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="safe3" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </radialGradient>
            </>
          )}

          {/* Route glow */}
          {showRoute && (
            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        {/* Map background */}
        <rect width="100%" height="100%" fill="#e8f5e9" />
        <rect width="100%" height="100%" fill="url(#mapgrid)" />

        {/* Parks / green areas */}
        <rect x="5%" y="8%" width="18%" height="22%" rx="6" fill="#a5d6a7" opacity="0.5" />
        <rect x="72%" y="60%" width="20%" height="18%" rx="6" fill="#a5d6a7" opacity="0.5" />
        <rect x="40%" y="72%" width="22%" height="20%" rx="6" fill="#a5d6a7" opacity="0.5" />

        {/* Building blocks */}
        <rect x="5%" y="42%" width="20%" height="14%" rx="3" fill="#b0bec5" opacity="0.3" />
        <rect x="73%" y="8%" width="20%" height="20%" rx="3" fill="#b0bec5" opacity="0.3" />
        <rect x="33%" y="8%" width="30%" height="22%" rx="3" fill="#b0bec5" opacity="0.3" />
        <rect x="5%" y="65%" width="20%" height="20%" rx="3" fill="#b0bec5" opacity="0.25" />
        <rect x="73%" y="38%" width="20%" height="15%" rx="3" fill="#b0bec5" opacity="0.25" />

        {/* Main roads */}
        <line x1="0" y1="38%" x2="100%" y2="38%" stroke="#ffffff" strokeWidth="6" opacity="0.9" />
        <line x1="0" y1="38%" x2="100%" y2="38%" stroke="#cfd8dc" strokeWidth="4" />

        <line x1="0" y1="62%" x2="100%" y2="62%" stroke="#ffffff" strokeWidth="5" opacity="0.9" />
        <line x1="0" y1="62%" x2="100%" y2="62%" stroke="#cfd8dc" strokeWidth="3" />

        <line x1="28%" y1="0" x2="28%" y2="100%" stroke="#ffffff" strokeWidth="6" opacity="0.9" />
        <line x1="28%" y1="0" x2="28%" y2="100%" stroke="#cfd8dc" strokeWidth="4" />

        <line x1="68%" y1="0" x2="68%" y2="100%" stroke="#ffffff" strokeWidth="5" opacity="0.9" />
        <line x1="68%" y1="0" x2="68%" y2="100%" stroke="#cfd8dc" strokeWidth="3" />

        {/* Secondary roads */}
        <line x1="0" y1="18%" x2="28%" y2="38%" stroke="#e0e0e0" strokeWidth="2.5" />
        <line x1="68%" y1="62%" x2="100%" y2="80%" stroke="#e0e0e0" strokeWidth="2" />
        <line x1="28%" y1="38%" x2="68%" y2="62%" stroke="#e0e0e0" strokeWidth="2" />
        <line x1="0" y1="80%" x2="28%" y2="62%" stroke="#e0e0e0" strokeWidth="2" />

        {/* Road labels */}
        <text x="5" y="36%" fontSize="7" fill="#607d8b" fontFamily="Poppins, sans-serif" fontWeight="500">MG Road</text>
        <text x="5" y="60%" fontSize="7" fill="#607d8b" fontFamily="Poppins, sans-serif">Ring Road</text>
        <text x="29%" y="15%" fontSize="7" fill="#607d8b" fontFamily="Poppins, sans-serif">NH-48</text>

        {/* Heatmap blobs */}
        {showHeatmap && (
          <>
            <ellipse cx="16%" cy="53%" rx="16%" ry="11%" fill="url(#safe1)" />
            <ellipse cx="50%" cy="50%" rx="20%" ry="14%" fill="url(#warn1)" />
            <ellipse cx="82%" cy="33%" rx="16%" ry="12%" fill="url(#danger1)" />
            <ellipse cx="16%" cy="20%" rx="15%" ry="11%" fill="url(#safe2)" />
            <ellipse cx="65%" cy="80%" rx="14%" ry="10%" fill="url(#safe3)" />
          </>
        )}

        {/* Route line */}
        {showRoute && (
          <>
            {/* Route glow */}
            <polyline
              points="22%,76% 28%,62% 28%,38% 48%,38% 68%,38% 68%,22%"
              fill="none"
              stroke="#22c55e"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.2"
            />
            {/* Route line */}
            <polyline
              points="22%,76% 28%,62% 28%,38% 48%,38% 68%,38% 68%,22%"
              fill="none"
              stroke="#22c55e"
              strokeWidth="3"
              strokeDasharray="8,4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Midpoint dots */}
            <circle cx="28%" cy="62%" r="4" fill="#22c55e" opacity="0.6" />
            <circle cx="48%" cy="38%" r="4" fill="#22c55e" opacity="0.6" />
          </>
        )}

        {/* User location marker */}
        <circle cx="22%" cy="76%" r="12" fill="#22c55e" opacity="0.15" />
        <circle cx="22%" cy="76%" r="8" fill="#22c55e" opacity="0.3" />
        <circle cx="22%" cy="76%" r="5" fill="#22c55e" />
        <circle cx="22%" cy="76%" r="2.5" fill="white" />

        {/* Destination marker */}
        {showRoute && (
          <>
            <circle cx="68%" cy="22%" r="10" fill="#22c55e" opacity="0.2" />
            <circle cx="68%" cy="22%" r="6" fill="#22c55e" />
            <circle cx="68%" cy="22%" r="3" fill="white" />
            {/* Flag pole */}
            <line x1="68%" y1="22%" x2="68%" y2="12%" stroke="#22c55e" strokeWidth="1.5" />
            <polygon points="68%,12% 74%,15% 68%,18%" fill="#22c55e" />
          </>
        )}

        {/* Area label pins */}
        {showHeatmap && (
          <>
            <rect x="3%" y="45%" width="22%" height="10%" rx="4" fill="white" opacity="0.85" />
            <text x="4%" y="52%" fontSize="6" fill="#22c55e" fontFamily="Poppins, sans-serif" fontWeight="600">Koramangala</text>
            <text x="4%" y="57%" fontSize="5.5" fill="#6b7280" fontFamily="Poppins, sans-serif">Safe Zone</text>

            <rect x="36%" y="43%" width="26%" height="10%" rx="4" fill="white" opacity="0.85" />
            <text x="37%" y="50%" fontSize="6" fill="#f59e0b" fontFamily="Poppins, sans-serif" fontWeight="600">Majestic Bus Stand</text>
            <text x="37%" y="55%" fontSize="5.5" fill="#6b7280" fontFamily="Poppins, sans-serif">Moderate Risk</text>

            <rect x="67%" y="25%" width="26%" height="10%" rx="4" fill="white" opacity="0.85" />
            <text x="68%" y="32%" fontSize="6" fill="#ef4444" fontFamily="Poppins, sans-serif" fontWeight="600">Shivajinagar</text>
            <text x="68%" y="37%" fontSize="5.5" fill="#6b7280" fontFamily="Poppins, sans-serif">High Risk</text>
          </>
        )}
      </svg>

      {/* Map attribution */}
      <div
        className="absolute bottom-2 right-2"
        style={{ fontSize: "9px", color: "#90a4ae", fontFamily: "Poppins, sans-serif" }}
      >
        ZenSHIELD Map
      </div>

      {/* Offline badge */}
      <div
        className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full"
        style={{
          background: "rgba(255,255,255,0.92)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
        <span style={{ fontSize: "9px", color: "#6b7280", fontFamily: "Poppins, sans-serif" }}>
          Offline Map
        </span>
      </div>

      {/* Compass */}
      <div
        className="absolute top-2 right-2 flex items-center justify-center rounded-full"
        style={{
          width: "26px",
          height: "26px",
          background: "rgba(255,255,255,0.92)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          fontSize: "12px",
        }}
      >
        <span style={{ fontSize: "11px" }}>🧭</span>
      </div>
    </div>
  );
}
