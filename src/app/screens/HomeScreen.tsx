import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Shield, Bell, MapPin, Navigation, Activity,
  ChevronRight, WifiOff, AlertTriangle, FileVideo,
  Mic, Users, Brain, Clock
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { SafetyGauge } from "../components/SafetyGauge";
import { BottomNav } from "../components/BottomNav";

const recentRides = [
  { id: 1, from: "Koramangala", to: "MG Road", date: "Today, 9:20 AM", score: 85, safe: true, duration: "32 min" },
  { id: 2, from: "Indiranagar", to: "Whitefield", date: "Yesterday, 6:15 PM", score: 62, safe: false, duration: "48 min" },
];

const quickAlerts = [
  { id: 1, text: "High risk zone reported near Bus Stand 14", time: "10 min ago", color: "#ef4444" },
  { id: 2, text: "Safe route updated for MG Road corridor", time: "1 hr ago", color: "#22c55e" },
];

export function HomeScreen() {
  const navigate = useNavigate();
  const { username } = useApp();
  const safetyScore = 78;

  const getTimeGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#f0fdf4", fontFamily: "Poppins, sans-serif" }}
    >
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div
          className="px-5 pt-12 pb-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #22c55e 0%, #4ade80 60%, #86efac 100%)",
            borderBottomLeftRadius: "36px",
            borderBottomRightRadius: "36px",
          }}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full opacity-15 bg-white" style={{ transform: "translate(35%, -35%)" }} />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10 bg-white" style={{ transform: "translate(-25%, 40%)" }} />
          <div className="absolute top-1/2 right-8 w-16 h-16 rounded-full opacity-10 bg-white" style={{ transform: "translateY(-50%)" }} />

          <div className="relative z-10">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>{getTimeGreeting()},</p>
                <h1 style={{ color: "white", fontSize: "24px", fontWeight: 800, lineHeight: 1.2 }}>
                  Hello, {username} 👋
                </h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/evidence")}
                  className="flex items-center justify-center rounded-full relative"
                  style={{ width: "42px", height: "42px", background: "rgba(255,255,255,0.22)", border: "none", cursor: "pointer" }}
                >
                  <Bell size={18} color="white" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-400 border border-red-300 animate-pulse" />
                </button>
                <button
                  className="flex items-center justify-center rounded-full"
                  style={{ width: "42px", height: "42px", background: "rgba(255,255,255,0.22)", border: "none", cursor: "pointer" }}
                >
                  <Shield size={18} color="white" fill="rgba(255,255,255,0.3)" />
                </button>
              </div>
            </div>

            {/* Badges row */}
            <div className="flex gap-2 mb-4">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                <WifiOff size={10} color="white" />
                <span style={{ color: "white", fontSize: "10px", fontWeight: 600 }}>
                  Offline Mode Active
                </span>
              </div>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                style={{ background: "rgba(34,197,94,0.3)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                <span style={{ color: "white", fontSize: "10px", fontWeight: 600 }}>
                  AI Shield ON
                </span>
              </div>
            </div>

            {/* Safety Score Card */}
            <div
              className="rounded-3xl p-4 flex items-center justify-between"
              style={{
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <div>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>Today's Safety Score</p>
                <p style={{ color: "white", fontSize: "36px", fontWeight: 900, lineHeight: 1 }}>
                  {safetyScore}%
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 rounded-full bg-green-300" />
                  <span style={{ color: "rgba(255,255,255,0.95)", fontSize: "12px", fontWeight: 600 }}>
                    Safe to travel
                  </span>
                </div>
                <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)", width: "120px" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${safetyScore}%`,
                      background: "linear-gradient(90deg, #bbf7d0, #86efac)",
                      transition: "width 1s ease",
                    }}
                  />
                </div>
              </div>
              <SafetyGauge score={safetyScore} size={120} showLabel={false} />
            </div>
          </div>
        </div>

        <div className="px-4 py-4 flex flex-col gap-4">
          {/* Start Safe Ride Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/start-ride")}
            className="w-full rounded-3xl p-5 flex items-center justify-between"
            style={{
              background: "linear-gradient(135deg, #22c55e, #4ade80)",
              boxShadow: "0 10px 36px rgba(255,79,163,0.45)",
              border: "none",
              cursor: "pointer",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center rounded-2xl"
                style={{ width: "56px", height: "56px", background: "rgba(255,255,255,0.25)" }}
              >
                <Navigation size={28} color="white" />
              </div>
              <div className="text-left">
                <p style={{ color: "white", fontSize: "17px", fontWeight: 800 }}>
                  Start Safe Ride
                </p>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px" }}>
                  Activate journey monitoring
                </p>
              </div>
            </div>
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: "38px", height: "38px", background: "rgba(255,255,255,0.25)" }}
            >
              <ChevronRight size={22} color="white" />
            </div>
          </motion.button>

          {/* Quick actions grid */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: MapPin, label: "Heatmap", path: "/heatmap", color: "#f59e0b", bg: "#fffbeb" },
              { icon: Brain, label: "AI Safety", path: "/ai-analysis", color: "#8b5cf6", bg: "#f5f3ff" },
              { icon: Users, label: "Safe Circle", path: "/safe-circle", color: "#22c55e", bg: "#f0fdf4" },
              { icon: Mic, label: "SafeWord", path: "/voice-safeword", color: "#22c55e", bg: "#f0fdf4" },
            ].map(({ icon: Icon, label, path, color, bg }) => (
              <motion.button
                key={path}
                whileTap={{ scale: 0.93 }}
                onClick={() => navigate(path)}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl"
                style={{
                  background: "white",
                  boxShadow: "0 4px 14px rgba(255,79,163,0.08)",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{ width: "42px", height: "42px", background: bg }}
                >
                  <Icon size={20} color={color} />
                </div>
                <span style={{ color: "#374151", fontSize: "10px", fontWeight: 600 }}>
                  {label}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Evidence stored note */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/evidence")}
            className="flex items-center gap-3 p-3 rounded-2xl"
            style={{
              background: "white",
              border: "1.5px dashed #86efac",
              boxShadow: "0 2px 10px rgba(255,79,163,0.06)",
              cursor: "pointer",
              fontFamily: "Poppins, sans-serif",
              textAlign: "left",
            }}
          >
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ width: "38px", height: "38px", background: "#f0fdf4" }}
            >
              <FileVideo size={18} color="#22c55e" />
            </div>
            <div className="flex-1">
              <p style={{ color: "#1f2937", fontSize: "12px", fontWeight: 600 }}>
                <span style={{ color: "#22c55e" }}>2 evidence files</span> stored locally
              </p>
              <p style={{ color: "#9ca3af", fontSize: "10px" }}>
                Alerts will send when network returns
              </p>
            </div>
            <ChevronRight size={16} color="#86efac" />
          </motion.button>

          {/* Recent Rides */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 style={{ color: "#1f2937", fontSize: "15px", fontWeight: 700 }}>Recent Rides</h3>
              <span style={{ color: "#22c55e", fontSize: "12px", fontWeight: 600 }}>View all</span>
            </div>
            <div className="flex flex-col gap-2">
              {recentRides.map((ride, i) => (
                <motion.div
                  key={ride.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{
                    background: "white",
                    boxShadow: "0 2px 10px rgba(255,79,163,0.06)",
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{
                      width: "42px",
                      height: "42px",
                      background: ride.safe ? "#f0fdf4" : "#fff7ed",
                    }}
                  >
                    <Navigation size={18} color={ride.safe ? "#22c55e" : "#f59e0b"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ color: "#1f2937", fontSize: "13px", fontWeight: 600 }}>
                      {ride.from} → {ride.to}
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock size={10} color="#9ca3af" />
                      <p style={{ color: "#9ca3af", fontSize: "10px" }}>{ride.date} • {ride.duration}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span style={{
                      color: ride.score >= 70 ? "#22c55e" : "#f59e0b",
                      fontSize: "15px",
                      fontWeight: 800
                    }}>
                      {ride.score}%
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded"
                      style={{
                        fontSize: "9px",
                        color: ride.safe ? "#22c55e" : "#f59e0b",
                        background: ride.safe ? "#f0fdf4" : "#fffbeb",
                        fontWeight: 700,
                      }}
                    >
                      {ride.safe ? "SAFE" : "MODERATE"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Safety Alerts */}
          <div>
            <h3 style={{ color: "#1f2937", fontSize: "15px", fontWeight: 700, marginBottom: "10px" }}>
              Safety Alerts
            </h3>
            <div className="flex flex-col gap-2">
              {quickAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-2xl"
                  style={{
                    background: "white",
                    boxShadow: "0 2px 10px rgba(255,79,163,0.06)",
                    borderLeft: `3px solid ${alert.color}`,
                  }}
                >
                  <AlertTriangle size={14} color={alert.color} className="mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p style={{ color: "#374151", fontSize: "12px", lineHeight: "1.4" }}>
                      {alert.text}
                    </p>
                    <p style={{ color: "#9ca3af", fontSize: "10px", marginTop: "2px" }}>
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spacer for FAB + nav */}
          <div className="h-20" />
        </div>
      </div>

      {/* Floating SOS Button */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => navigate("/sos")}
        className="absolute flex flex-col items-center justify-center rounded-full"
        style={{
          bottom: "68px",
          right: "16px",
          width: "68px",
          height: "68px",
          background: "linear-gradient(135deg, #ef4444, #dc2626)",
          boxShadow: "0 8px 28px rgba(239,68,68,0.55)",
          border: "3px solid white",
          cursor: "pointer",
          zIndex: 50,
        }}
        animate={{
          boxShadow: [
            "0 8px 28px rgba(239,68,68,0.55)",
            "0 8px 36px rgba(239,68,68,0.75)",
            "0 8px 28px rgba(239,68,68,0.55)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span style={{ color: "white", fontSize: "13px", fontWeight: 900, fontFamily: "Poppins, sans-serif", lineHeight: 1 }}>
          SOS
        </span>
        <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "8px", fontFamily: "Poppins, sans-serif" }}>
          HELP
        </span>
      </motion.button>

      <BottomNav />
    </div>
  );
}
