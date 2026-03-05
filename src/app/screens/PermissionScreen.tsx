import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MapPin, Camera, Mic, Users, CheckCircle, Shield, Lock } from "lucide-react";
import { useApp } from "../context/AppContext";

const permissionList = [
  {
    key: "location",
    icon: MapPin,
    title: "Location Access",
    desc: "Real-time GPS tracking and safe route monitoring",
    color: "#22c55e",
    bg: "#f0fdf4",
    bgActive: "#dcfce7",
  },
  {
    key: "camera",
    icon: Camera,
    title: "Camera Access",
    desc: "Automatic evidence recording during SOS emergency",
    color: "#3b82f6",
    bg: "#eff6ff",
    bgActive: "#dbeafe",
  },
  {
    key: "microphone",
    icon: Mic,
    title: "Microphone Access",
    desc: "Voice SafeWord detection & audio evidence recording",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    bgActive: "#ede9fe",
  },
  {
    key: "contacts",
    icon: Users,
    title: "Contacts Access",
    desc: "Notify trusted Safe Circle during emergencies",
    color: "#f59e0b",
    bg: "#fffbeb",
    bgActive: "#fef3c7",
  },
];

export function PermissionScreen() {
  const navigate = useNavigate();
  const { permissions: perms, setPermission } = useApp();
  const allEnabled = Object.values(perms).every(Boolean);
  const enabledCount = Object.values(perms).filter(Boolean).length;

  const handleEnableAll = () => {
    permissionList.forEach((p) => setPermission(p.key, true));
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#f0fdf4", fontFamily: "Poppins, sans-serif" }}
    >
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #22c55e 0%, #4ade80 60%, #86efac 100%)",
          borderBottomLeftRadius: "32px",
          borderBottomRightRadius: "32px",
        }}
      >
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-20 bg-white" style={{ transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full opacity-15 bg-white" style={{ transform: "translate(-30%, 40%)" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{ width: "46px", height: "46px", background: "rgba(255,255,255,0.25)" }}
            >
              <Shield size={24} color="white" fill="rgba(255,255,255,0.3)" />
            </div>
            <div>
              <h1 style={{ color: "white", fontSize: "19px", fontWeight: 700 }}>
                Enable Safety Permissions
              </h1>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px" }}>
                Required for full protection features
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex gap-1.5 mb-2">
              {permissionList.map((p) => (
                <div
                  key={p.key}
                  className="flex-1 rounded-full transition-all duration-500"
                  style={{
                    height: "5px",
                    background: perms[p.key as keyof typeof perms]
                      ? "white"
                      : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>
                {enabledCount} of 4 permissions enabled
              </p>
              {!allEnabled && (
                <button
                  onClick={handleEnableAll}
                  className="px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.25)",
                    border: "1px solid rgba(255,255,255,0.4)",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Enable All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Permission Cards */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3">
        {permissionList.map((perm, i) => {
          const Icon = perm.icon;
          const enabled = perms[perm.key as keyof typeof perms];

          return (
            <motion.div
              key={perm.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-3xl p-4 flex items-center gap-4"
              style={{
                background: "white",
                boxShadow: enabled
                  ? `0 6px 20px ${perm.color}18`
                  : "0 4px 16px rgba(255,79,163,0.06)",
                border: enabled ? `1.5px solid ${perm.color}30` : "1.5px solid #f0fdf4",
                transition: "all 0.3s ease",
              }}
            >
              {/* Icon */}
              <motion.div
                animate={enabled ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center rounded-2xl flex-shrink-0"
                style={{
                  width: "52px",
                  height: "52px",
                  background: enabled ? perm.bgActive : perm.bg,
                  transition: "background 0.3s ease",
                }}
              >
                <Icon size={24} color={perm.color} />
              </motion.div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p style={{ color: "#1f2937", fontSize: "14px", fontWeight: 600 }}>
                  {perm.title}
                </p>
                <p style={{ color: "#6b7280", fontSize: "11px", lineHeight: "1.4", marginTop: "2px" }}>
                  {perm.desc}
                </p>
              </div>

              {/* Enable / Enabled */}
              {enabled ? (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full flex-shrink-0"
                  style={{ background: perm.bgActive }}
                >
                  <CheckCircle size={16} color={perm.color} />
                  <span style={{ color: perm.color, fontSize: "11px", fontWeight: 700 }}>
                    Active
                  </span>
                </motion.div>
              ) : (
                <button
                  onClick={() => setPermission(perm.key, true)}
                  className="px-3 py-2 rounded-full flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #22c55e, #4ade80)",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                    boxShadow: "0 4px 12px rgba(255,79,163,0.35)",
                  }}
                >
                  Enable
                </button>
              )}
            </motion.div>
          );
        })}

        {/* Privacy note */}
        <div
          className="rounded-2xl p-4 flex gap-3 items-start"
          style={{ background: "#f0fdf4", border: "1px solid #dcfce7" }}
        >
          <Lock size={16} color="#22c55e" className="flex-shrink-0 mt-0.5" />
          <div>
            <p style={{ color: "#1f2937", fontSize: "12px", fontWeight: 600, marginBottom: "2px" }}>
              Your Privacy is Protected
            </p>
            <p style={{ color: "#6b7280", fontSize: "11px", lineHeight: "1.5" }}>
              All data stays on-device. ZenSHIELD operates 100% offline. Nothing is shared without your explicit consent.
            </p>
          </div>
        </div>

        <div className="h-2" />
      </div>

      {/* Bottom CTA */}
      <div className="px-4 pb-6 pt-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/home")}
          className="w-full flex items-center justify-center gap-2 rounded-3xl"
          style={{
            height: "56px",
            background: "linear-gradient(135deg, #22c55e, #4ade80)",
            color: "white",
            fontSize: "16px",
            fontWeight: 700,
            boxShadow: "0 8px 28px rgba(255,79,163,0.4)",
            border: "none",
            cursor: "pointer",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <Shield size={20} />
          {allEnabled ? "Activate ZenSHIELD 🛡️" : "Continue to App →"}
        </motion.button>
      </div>
    </div>
  );
}
