import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, MapPin, AlertTriangle, Shield, Clock,
  TrendingUp, Info, WifiOff
} from "lucide-react";
import { MockMap } from "../components/MockMap";
import { BottomNav } from "../components/BottomNav";

const zones = [
  {
    id: 1,
    name: "Koramangala Market",
    safetyScore: 82,
    incidents: 3,
    riskHours: "10 PM – 2 AM",
    level: "safe",
    color: "#22c55e",
    bg: "#f0fdf4",
    badge: "Safe Zone",
    cx: "16%",
    cy: "55%",
  },
  {
    id: 2,
    name: "Majestic Bus Stand",
    safetyScore: 54,
    incidents: 12,
    riskHours: "8 PM – 11 PM",
    level: "moderate",
    color: "#f59e0b",
    bg: "#fffbeb",
    badge: "Moderate Risk",
    cx: "50%",
    cy: "50%",
  },
  {
    id: 3,
    name: "Shivajinagar Junction",
    safetyScore: 28,
    incidents: 21,
    riskHours: "6 PM – Midnight",
    level: "danger",
    color: "#ef4444",
    bg: "#fef2f2",
    badge: "High Risk",
    cx: "82%",
    cy: "35%",
  },
  {
    id: 4,
    name: "Indiranagar 100ft Road",
    safetyScore: 78,
    incidents: 5,
    riskHours: "11 PM – 3 AM",
    level: "safe",
    color: "#22c55e",
    bg: "#f0fdf4",
    badge: "Safe Zone",
    cx: "16%",
    cy: "20%",
  },
  {
    id: 5,
    name: "BTM Layout Bus Stop",
    safetyScore: 69,
    incidents: 8,
    riskHours: "9 PM – 1 AM",
    level: "safe",
    color: "#22c55e",
    bg: "#f0fdf4",
    badge: "Generally Safe",
    cx: "65%",
    cy: "80%",
  },
];

export function HeatmapScreen() {
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState<typeof zones[0] | null>(null);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#f0fdf4", fontFamily: "Poppins, sans-serif" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 pt-12 pb-5"
        style={{
          background: "linear-gradient(160deg, #22c55e 0%, #4ade80 100%)",
          borderBottomLeftRadius: "28px",
          borderBottomRightRadius: "28px",
        }}
      >
        <button
          onClick={() => navigate("/home")}
          className="flex items-center justify-center rounded-full"
          style={{
            width: "36px", height: "36px",
            background: "rgba(255,255,255,0.25)",
            border: "none", cursor: "pointer",
          }}
        >
          <ArrowLeft size={18} color="white" />
        </button>
        <div className="flex-1">
          <h1 style={{ color: "white", fontSize: "18px", fontWeight: 700 }}>Safety Heatmap</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>
            Tap a zone to see details
          </p>
        </div>
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          <WifiOff size={10} color="white" />
          <span style={{ color: "white", fontSize: "9px", fontWeight: 600 }}>Offline Map</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Legend */}
        <div className="flex gap-3">
          {[
            { color: "#22c55e", label: "Safe" },
            { color: "#f59e0b", label: "Moderate" },
            { color: "#ef4444", label: "Unsafe" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: color }} />
              <span style={{ color: "#6b7280", fontSize: "11px" }}>{label}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1">
            <Info size={12} color="#9ca3af" />
            <span style={{ color: "#9ca3af", fontSize: "10px" }}>Live data</span>
          </div>
        </div>

        {/* Map */}
        <div className="relative">
          <MockMap showHeatmap height={240} />

          {/* Clickable zone overlays */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            {zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                className="absolute"
                style={{
                  left: `calc(${zone.cx} - 18px)`,
                  top: `calc(${zone.cy} - 18px)`,
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: `${zone.color}30`,
                  border: `2px solid ${zone.color}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: zone.color }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Selected zone card */}
        <AnimatePresence>
          {selectedZone && (
            <motion.div
              key={selectedZone.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="rounded-3xl p-5"
              style={{
                background: "white",
                boxShadow: "0 8px 32px rgba(255,79,163,0.15)",
                border: `2px solid ${selectedZone.color}30`,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center rounded-xl"
                    style={{ width: "40px", height: "40px", background: selectedZone.bg }}
                  >
                    <MapPin size={20} color={selectedZone.color} />
                  </div>
                  <div>
                    <h3 style={{ color: "#1f2937", fontSize: "14px", fontWeight: 700 }}>
                      {selectedZone.name}
                    </h3>
                    <div
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full mt-0.5"
                      style={{ background: selectedZone.bg }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: selectedZone.color }} />
                      <span style={{ color: selectedZone.color, fontSize: "10px", fontWeight: 600 }}>
                        {selectedZone.badge}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedZone(null)}
                  style={{
                    background: "#f3f4f6",
                    border: "none",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    cursor: "pointer",
                    color: "#6b7280",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    icon: Shield,
                    label: "Safety Score",
                    value: `${selectedZone.safetyScore}%`,
                    color: selectedZone.color,
                  },
                  {
                    icon: AlertTriangle,
                    label: "Incidents",
                    value: String(selectedZone.incidents),
                    color: selectedZone.incidents > 10 ? "#ef4444" : "#f59e0b",
                  },
                  {
                    icon: Clock,
                    label: "Risk Hours",
                    value: selectedZone.riskHours,
                    color: "#6b7280",
                  },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl"
                    style={{ background: "#fafafa" }}
                  >
                    <Icon size={14} color={color} />
                    <span style={{ color, fontSize: label === "Risk Hours" ? "8px" : "13px", fontWeight: 700, textAlign: "center", lineHeight: "1.2" }}>
                      {value}
                    </span>
                    <span style={{ color: "#9ca3af", fontSize: "9px", textAlign: "center" }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Safety bar */}
              <div className="mt-3">
                <div className="flex justify-between mb-1">
                  <span style={{ color: "#6b7280", fontSize: "11px" }}>Safety level</span>
                  <span style={{ color: selectedZone.color, fontSize: "11px", fontWeight: 600 }}>
                    {selectedZone.safetyScore}%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "#f3f4f6" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: selectedZone.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedZone.safetyScore}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zone list */}
        <div>
          <h3 style={{ color: "#1f2937", fontSize: "14px", fontWeight: 700, marginBottom: "10px" }}>
            All Zones
          </h3>
          <div className="flex flex-col gap-2">
            {zones.map((zone) => (
              <motion.button
                key={zone.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedZone(zone)}
                className="flex items-center gap-3 p-3 rounded-2xl text-left"
                style={{
                  background: "white",
                  boxShadow: "0 2px 10px rgba(255,79,163,0.06)",
                  border: selectedZone?.id === zone.id ? `1.5px solid ${zone.color}` : "1.5px solid transparent",
                  cursor: "pointer",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: zone.color }}
                />
                <div className="flex-1 min-w-0">
                  <p style={{ color: "#1f2937", fontSize: "13px", fontWeight: 600 }}>
                    {zone.name}
                  </p>
                  <p style={{ color: "#9ca3af", fontSize: "10px" }}>
                    {zone.incidents} incidents • Risk: {zone.riskHours}
                  </p>
                </div>
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ background: zone.bg }}
                >
                  <TrendingUp size={10} color={zone.color} />
                  <span style={{ color: zone.color, fontSize: "11px", fontWeight: 700 }}>
                    {zone.safetyScore}%
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="h-20" />
      </div>

      <BottomNav />
    </div>
  );
}
