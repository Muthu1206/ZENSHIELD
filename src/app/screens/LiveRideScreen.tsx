import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Phone, Shield, CheckCircle, Mic, Navigation,
  Clock, MapPin, Bus, WifiOff
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { MockMap } from "../components/MockMap";

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function LiveRideScreen() {
  const navigate = useNavigate();
  const { currentRide, setCurrentRide } = useApp();
  const [seconds, setSeconds] = useState(0);
  const [riskLevel, setRiskLevel] = useState("Low");

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const riskColor = riskLevel === "Low" ? "#22c55e" : riskLevel === "Medium" ? "#f59e0b" : "#ef4444";
  const riskBg = riskLevel === "Low" ? "#f0fdf4" : riskLevel === "Medium" ? "#fffbeb" : "#fef2f2";
  const safetyStatusText = riskLevel === "Low" ? "Safe Travel ✓" : riskLevel === "Medium" ? "Moderate Risk" : "High Risk!";

  const handleReachedSafely = () => {
    setCurrentRide(null);
    navigate("/home");
  };

  return (
    <div
      className="flex flex-col h-full relative"
      style={{ background: "#f0fdf4", fontFamily: "Poppins, sans-serif" }}
    >
      {/* Top Info Card */}
      <div
        className="px-4 pt-12 pb-4 relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #22c55e 0%, #4ade80 100%)",
          borderBottomLeftRadius: "28px",
          borderBottomRightRadius: "28px",
        }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-15 bg-white" style={{ transform: "translate(30%, -30%)" }} />

        {/* Live indicator row */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2.5 h-2.5 rounded-full bg-red-300"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <span style={{ color: "white", fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px" }}>
              LIVE MONITORING
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
              <WifiOff size={9} color="white" />
              <span style={{ color: "white", fontSize: "9px", fontWeight: 600 }}>Offline</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
              <Clock size={10} color="white" />
              <span style={{ color: "white", fontSize: "11px", fontWeight: 600 }}>{formatDuration(seconds)}</span>
            </div>
          </div>
        </div>

        {/* Vehicle info card */}
        <motion.div
          className="rounded-2xl p-4 relative z-10"
          style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-2xl flex-shrink-0"
              style={{ width: "48px", height: "48px", background: "rgba(255,255,255,0.25)" }}
            >
              <Bus size={24} color="white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p style={{ color: "white", fontSize: "18px", fontWeight: 800, letterSpacing: "0.5px" }}>
                  {currentRide?.vehicleNumber || "KA 57 F 2341"}
                </p>
                <div className="px-2 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.35)" }}>
                  <span style={{ color: "#bbf7d0", fontSize: "9px", fontWeight: 700 }}>✓ VERIFIED</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={12} color="rgba(255,255,255,0.8)" />
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "12px" }}>
                  Destination: {currentRide?.destination || "MG Road, Bengaluru"}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Navigation size={16} color="rgba(255,255,255,0.8)" />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "9px" }}>GPS Active</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Map */}
      <div className="px-4 mt-3">
        <MockMap showRoute height={180} />
      </div>

      {/* Risk Level Selector (demo only) */}
      <div className="flex gap-2 px-4 mt-3">
        <span style={{ color: "#9ca3af", fontSize: "10px", alignSelf: "center", marginRight: "2px" }}>
          Demo:
        </span>
        {["Low", "Medium", "High"].map((level) => (
          <button
            key={level}
            onClick={() => setRiskLevel(level)}
            className="flex-1 py-1.5 rounded-xl text-center"
            style={{
              background: riskLevel === level
                ? (level === "Low" ? "#22c55e" : level === "Medium" ? "#f59e0b" : "#ef4444")
                : "white",
              color: riskLevel === level ? "white" : "#6b7280",
              fontSize: "10px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              fontFamily: "Poppins, sans-serif",
              boxShadow: riskLevel === level ? "0 3px 10px rgba(0,0,0,0.15)" : "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Safety Status + Duration grid */}
      <div className="px-4 mt-3">
        <div
          className="rounded-2xl p-4"
          style={{ background: "white", boxShadow: "0 4px 16px rgba(255,79,163,0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ color: "#1f2937", fontSize: "14px", fontWeight: 700 }}>Safety Status</h3>
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{ background: riskBg }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: riskColor }} />
              <span style={{ color: riskColor, fontSize: "11px", fontWeight: 700 }}>
                {safetyStatusText}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Risk Level", value: riskLevel, color: riskColor, bg: riskBg },
              { label: "Duration", value: formatDuration(seconds), color: "#6b7280", bg: "#f9fafb" },
              { label: "AI Safety", value: "Active", color: "#8b5cf6", bg: "#f5f3ff" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-2.5 rounded-xl" style={{ background: bg }}>
                <span style={{ color, fontSize: "13px", fontWeight: 800 }}>{value}</span>
                <span style={{ color: "#9ca3af", fontSize: "9px", fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Voice monitoring indicator */}
      <div className="px-4 mt-2">
        <motion.div
          className="flex items-center gap-2 p-3 rounded-2xl"
          animate={{ opacity: [1, 0.85, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ background: "#f5f3ff", border: "1px solid #ddd6fe" }}
        >
          <div className="flex items-center gap-1.5">
            <Mic size={14} color="#8b5cf6" />
            <span style={{ color: "#7c3aed", fontSize: "11px", fontWeight: 700 }}>
              Voice SafeWord Monitoring Active
            </span>
          </div>
          <motion.div
            className="ml-auto flex gap-0.5 items-center"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            {[5, 10, 7, 12, 6].map((h, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: "2.5px",
                  height: `${h}px`,
                  background: "#8b5cf6",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom controls */}
      <div className="flex gap-2 px-4 mt-3 pb-5">
        <button
          onClick={() => {}}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3"
          style={{
            background: "white",
            border: "1.5px solid #dcfce7",
            color: "#22c55e",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "Poppins, sans-serif",
            boxShadow: "0 3px 10px rgba(255,79,163,0.08)",
          }}
        >
          <Phone size={16} />
          Guardian
        </button>

        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => navigate("/sos")}
          className="flex items-center justify-center rounded-2xl py-3 px-5"
          style={{
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "white",
            fontSize: "15px",
            fontWeight: 900,
            border: "none",
            cursor: "pointer",
            fontFamily: "Poppins, sans-serif",
            boxShadow: "0 6px 22px rgba(239,68,68,0.5)",
            letterSpacing: "1px",
          }}
          animate={{ boxShadow: ["0 6px 22px rgba(239,68,68,0.5)", "0 6px 28px rgba(239,68,68,0.7)", "0 6px 22px rgba(239,68,68,0.5)"] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          SOS
        </motion.button>

        <button
          onClick={handleReachedSafely}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl py-3"
          style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "white",
            fontSize: "11px",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            fontFamily: "Poppins, sans-serif",
            boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
          }}
        >
          <CheckCircle size={15} />
          Reached
        </button>
      </div>
    </div>
  );
}
