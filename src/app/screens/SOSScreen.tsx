import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Video, Mic, MapPin, Phone, Share2, StopCircle,
  Shield, AlertOctagon, Radio, Siren
} from "lucide-react";
import { useApp } from "../context/AppContext";

function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function SOSScreen() {
  const navigate = useNavigate();
  const { username } = useApp();
  const [seconds, setSeconds] = useState(0);
  const [locationShared, setLocationShared] = useState(false);
  const [policeCalled, setPoliceCalled] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="flex flex-col h-full relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0d0000 0%, #200505 35%, #1a0000 70%, #0d0000 100%)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Animated pulse rings */}
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            border: `1.5px solid rgba(239,68,68,${0.25 / i})`,
            width: `${100 + i * 90}px`,
            height: `${100 + i * 90}px`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      {/* Top recording bar */}
      <div
        className="flex items-center justify-between px-5 pt-12 pb-3 relative"
        style={{ zIndex: 10 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-3 h-3 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.15, 1] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          />
          <span style={{ color: "#ff6b6b", fontSize: "11px", fontWeight: 800, letterSpacing: "2.5px" }}>
            RECORDING
          </span>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.5)" }}
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            <Radio size={11} color="#ef4444" />
          </motion.div>
          <span style={{ color: "#ff6b6b", fontSize: "12px", fontWeight: 800, letterSpacing: "1px" }}>
            {formatTime(seconds)}
          </span>
        </div>
      </div>

      {/* Emergency header */}
      <div className="flex flex-col items-center px-5 pt-2 pb-3 relative" style={{ zIndex: 10 }}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex items-center justify-center rounded-full mb-3"
          style={{
            width: "80px",
            height: "80px",
            background: "rgba(239,68,68,0.15)",
            border: "2px solid rgba(239,68,68,0.5)",
          }}
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
          >
            <AlertOctagon size={42} color="#ef4444" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ color: "#ff4444", fontSize: "22px", fontWeight: 900, textAlign: "center", letterSpacing: "0.5px" }}
        >
          Emergency Mode Activated
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ color: "rgba(255,160,160,0.9)", fontSize: "13px", marginTop: "4px", textAlign: "center" }}
        >
          Recording evidence automatically
        </motion.p>
      </div>

      {/* Active indicator pills */}
      <div className="flex gap-2 px-4 mb-3 relative" style={{ zIndex: 10 }}>
        {[
          { icon: Video, label: "Camera", sublabel: "Active", color: "#ef4444" },
          { icon: Mic, label: "Audio", sublabel: "Active", color: "#ef4444" },
          { icon: MapPin, label: "GPS", sublabel: "Locked", color: "#22c55e" },
        ].map(({ icon: Icon, label, sublabel, color }) => (
          <div
            key={label}
            className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl"
            style={{
              background: `${color}12`,
              border: `1px solid ${color}40`,
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: Math.random() * 0.5 }}
            >
              <Icon size={20} color={color} />
            </motion.div>
            <span style={{ color, fontSize: "11px", fontWeight: 700 }}>{label}</span>
            <span style={{ color, fontSize: "9px", opacity: 0.7 }}>{sublabel}</span>
          </div>
        ))}
      </div>

      {/* Live camera preview */}
      <div className="px-4 flex-1 relative" style={{ zIndex: 10 }}>
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "#0a0505",
            border: "2px solid rgba(239,68,68,0.5)",
            height: "175px",
          }}
        >
          {/* Dark camera view simulation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Video size={36} color="rgba(239,68,68,0.5)" />
              </motion.div>
              <span style={{ color: "rgba(255,100,100,0.5)", fontSize: "10px" }}>Live Camera Feed</span>
            </div>
          </div>

          {/* Scanline effect */}
          <motion.div
            className="absolute left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.5), transparent)" }}
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          {/* Corner brackets */}
          {[
            { top: "10px", left: "10px", borderTop: "2px solid #ef4444", borderLeft: "2px solid #ef4444" },
            { top: "10px", right: "10px", borderTop: "2px solid #ef4444", borderRight: "2px solid #ef4444" },
            { bottom: "10px", left: "10px", borderBottom: "2px solid #ef4444", borderLeft: "2px solid #ef4444" },
            { bottom: "10px", right: "10px", borderBottom: "2px solid #ef4444", borderRight: "2px solid #ef4444" },
          ].map((style, i) => (
            <div
              key={i}
              className="absolute"
              style={{ ...style, width: "20px", height: "20px" }}
            />
          ))}

          {/* Overlay info row */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded"
              style={{ background: "rgba(0,0,0,0.75)" }}
            >
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                style={{ color: "#ef4444", fontSize: "9px", fontWeight: 800 }}
              >
                ● REC
              </motion.span>
              <span style={{ color: "#aaa", fontSize: "9px" }}>{formatTime(seconds)}</span>
            </div>
            <div
              className="flex items-center gap-1 px-2 py-1 rounded"
              style={{ background: "rgba(0,0,0,0.75)" }}
            >
              <MapPin size={9} color="#22c55e" />
              <span style={{ color: "#22c55e", fontSize: "9px", fontWeight: 600 }}>GPS Locked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Location info */}
      <div className="px-4 mt-2 relative" style={{ zIndex: 10 }}>
        <div
          className="flex items-center gap-3 p-3 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ width: "36px", height: "36px", background: "rgba(34,197,94,0.15)" }}
          >
            <MapPin size={18} color="#22c55e" />
          </div>
          <div className="flex-1">
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "11px", fontWeight: 600 }}>
              12.9716° N, 77.5946° E
            </p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "10px" }}>
              Near Majestic Bus Stand, Bengaluru
            </p>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span style={{ color: "#22c55e", fontSize: "8px" }}>Live</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-6 pt-3 flex flex-col gap-2 relative" style={{ zIndex: 10 }}>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate("/home")}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1.5px solid rgba(255,100,100,0.35)",
              color: "#ff9999",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            <StopCircle size={15} />
            Stop Recording
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setLocationShared(true)}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3"
            style={{
              background: locationShared ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.08)",
              border: `1.5px solid ${locationShared ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.12)"}`,
              color: locationShared ? "#22c55e" : "rgba(255,255,255,0.75)",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            <Share2 size={15} />
            {locationShared ? "Shared ✓" : "Share Location"}
          </motion.button>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setPoliceCalled(true)}
          className="w-full flex items-center justify-center gap-3 rounded-2xl py-4"
          style={{
            background: policeCalled
              ? "linear-gradient(135deg, #16a34a, #15803d)"
              : "linear-gradient(135deg, #ef4444, #b91c1c)",
            color: "white",
            fontSize: "15px",
            fontWeight: 900,
            border: "none",
            cursor: "pointer",
            fontFamily: "Poppins, sans-serif",
            boxShadow: policeCalled
              ? "0 6px 24px rgba(34,197,94,0.5)"
              : "0 6px 24px rgba(239,68,68,0.65)",
            letterSpacing: "0.5px",
          }}
          animate={!policeCalled ? {
            boxShadow: ["0 6px 24px rgba(239,68,68,0.65)", "0 6px 32px rgba(239,68,68,0.85)", "0 6px 24px rgba(239,68,68,0.65)"]
          } : {}}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <Phone size={20} />
          {policeCalled ? "Police Notified ✓" : "Call Police (100)"}
        </motion.button>

        {/* Evidence note */}
        <div className="flex items-center gap-2 justify-center">
          <Shield size={11} color="rgba(255,150,150,0.5)" />
          <span style={{ color: "rgba(255,150,150,0.5)", fontSize: "10px" }}>
            Evidence stored locally · Sends when network returns
          </span>
        </div>
      </div>
    </div>
  );
}
