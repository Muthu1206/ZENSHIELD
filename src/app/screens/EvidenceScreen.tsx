import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft, Shield, MapPin, Clock, HardDrive,
  Video, Mic, FileText, Upload, CheckCircle, Wifi, WifiOff
} from "lucide-react";
import { useApp } from "../context/AppContext";

function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

const evidenceFiles = [
  {
    id: "EVD-001",
    type: "video",
    label: "Video Recording",
    size: "48.2 MB",
    duration: "00:12:08",
    timestamp: "Today, 09:32 AM",
    status: "stored",
  },
  {
    id: "EVD-002",
    type: "audio",
    label: "Audio Recording",
    size: "3.1 MB",
    duration: "00:12:08",
    timestamp: "Today, 09:32 AM",
    status: "stored",
  },
  {
    id: "EVD-003",
    type: "log",
    label: "GPS Log & Route",
    size: "0.4 MB",
    duration: "—",
    timestamp: "Today, 09:32 AM",
    status: "stored",
  },
];

export function EvidenceScreen() {
  const navigate = useNavigate();
  const { currentRide } = useApp();
  const [seconds, setSeconds] = useState(728); // start at 12:08
  const [isRecording, setIsRecording] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isRecording) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isRecording]);

  const handleUpload = (id: string) => {
    setUploadStatus((p) => ({ ...p, [id]: true }));
  };

  const rideId = currentRide
    ? `ZS-${Date.now().toString().slice(-6)}`
    : "ZS-229841";

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#f0fdf4", fontFamily: "Poppins, sans-serif" }}
    >
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{
          background: "linear-gradient(160deg, #22c55e 0%, #4ade80 100%)",
          borderBottomLeftRadius: "28px",
          borderBottomRightRadius: "28px",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center justify-center rounded-full"
            style={{
              width: "36px",
              height: "36px",
              background: "rgba(255,255,255,0.25)",
              border: "none",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={18} color="white" />
          </button>
          <div>
            <h1 style={{ color: "white", fontSize: "18px", fontWeight: 700 }}>Evidence Panel</h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>
              Secure offline storage
            </p>
          </div>
          <div className="ml-auto">
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <WifiOff size={10} color="white" />
              <span style={{ color: "white", fontSize: "9px", fontWeight: 600 }}>Offline</span>
            </div>
          </div>
        </div>

        {/* Recording card */}
        <motion.div
          className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}
          animate={isRecording ? { boxShadow: ["0 0 0 0 rgba(255,255,255,0.2)", "0 0 0 8px rgba(255,255,255,0)", "0 0 0 0 rgba(255,255,255,0.2)"] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-red-400"
                animate={isRecording ? { opacity: [1, 0.2, 1] } : { opacity: 0.3 }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <span style={{ color: "white", fontSize: "12px", fontWeight: 700, letterSpacing: "1px" }}>
                {isRecording ? "RECORDING" : "PAUSED"}
              </span>
            </div>
            <span style={{ color: "white", fontSize: "22px", fontWeight: 800, letterSpacing: "2px" }}>
              {formatTime(seconds)}
            </span>
          </div>

          <div className="flex gap-4 mt-1">
            <div className="flex items-center gap-1">
              <MapPin size={11} color="rgba(255,255,255,0.85)" />
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "10px" }}>GPS Active</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={11} color="rgba(255,255,255,0.85)" />
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "10px" }}>Ride ID: {rideId}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Evidence files */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1">
          <h3 style={{ color: "#1f2937", fontSize: "14px", fontWeight: 700 }}>Stored Evidence</h3>
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{ background: "#f0fdf4" }}
          >
            <HardDrive size={11} color="#22c55e" />
            <span style={{ color: "#22c55e", fontSize: "10px", fontWeight: 600 }}>51.7 MB Used</span>
          </div>
        </div>

        {evidenceFiles.map((file, i) => {
          const Icon = file.type === "video" ? Video : file.type === "audio" ? Mic : FileText;
          const iconColor = file.type === "video" ? "#ef4444" : file.type === "audio" ? "#8b5cf6" : "#3b82f6";
          const iconBg = file.type === "video" ? "#fef2f2" : file.type === "audio" ? "#f5f3ff" : "#eff6ff";
          const uploaded = uploadStatus[file.id];

          return (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-4"
              style={{
                background: "white",
                boxShadow: "0 4px 16px rgba(255,79,163,0.08)",
                border: uploaded ? "1.5px solid #bbf7d0" : "1.5px solid transparent",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-2xl flex-shrink-0"
                  style={{ width: "44px", height: "44px", background: iconBg }}
                >
                  <Icon size={20} color={iconColor} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p style={{ color: "#1f2937", fontSize: "13px", fontWeight: 600 }}>
                      {file.label}
                    </p>
                    <span
                      className="px-1.5 py-0.5 rounded"
                      style={{ background: "#f0fdf4", color: "#22c55e", fontSize: "9px", fontWeight: 700 }}
                    >
                      {file.id}
                    </span>
                  </div>
                  <p style={{ color: "#9ca3af", fontSize: "11px" }}>
                    {file.size} • {file.duration} • {file.timestamp}
                  </p>
                </div>

                {uploaded ? (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <CheckCircle size={16} color="#22c55e" />
                    <span style={{ color: "#22c55e", fontSize: "10px", fontWeight: 600 }}>Sent</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleUpload(file.id)}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-xl flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #22c55e, #4ade80)",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    <Upload size={12} color="white" />
                    <span style={{ color: "white", fontSize: "10px", fontWeight: 600 }}>Upload</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Upload all */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            const all: Record<string, boolean> = {};
            evidenceFiles.forEach((f) => { all[f.id] = true; });
            setUploadStatus(all);
          }}
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 mt-1"
          style={{
            background: "linear-gradient(135deg, #22c55e, #4ade80)",
            border: "none",
            color: "white",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "Poppins, sans-serif",
            boxShadow: "0 6px 20px rgba(255,79,163,0.35)",
          }}
        >
          <Upload size={16} />
          Upload All Evidence
        </motion.button>

        {/* Alert */}
        <div
          className="flex items-start gap-2 p-3 rounded-2xl"
          style={{ background: "#fffbeb", border: "1px solid #fde68a" }}
        >
          <Wifi size={14} color="#f59e0b" className="mt-0.5 flex-shrink-0" />
          <p style={{ color: "#92400e", fontSize: "11px", lineHeight: "1.5" }}>
            <span style={{ fontWeight: 600 }}>Alerts Will Send When Network Returns.</span>{" "}
            All evidence is encrypted and stored locally until connectivity is restored.
          </p>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
