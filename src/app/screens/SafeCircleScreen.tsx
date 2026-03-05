import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft, Shield, Phone, MapPin, Users, UserCheck,
  Building2, CheckCircle, Bell, Plus, Heart
} from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useApp } from "../context/AppContext";

const guardians = [
  {
    id: 1,
    name: "Ananya (Sister)",
    phone: "+91 98765 43210",
    relation: "Sister",
    status: "active",
    lastPing: "2 min ago",
    avatar: "A",
    color: "#22c55e",
  },
  {
    id: 2,
    name: "Mom",
    phone: "+91 94432 12345",
    relation: "Mother",
    status: "active",
    lastPing: "5 min ago",
    avatar: "M",
    color: "#8b5cf6",
  },
  {
    id: 3,
    name: "Rahul (Friend)",
    phone: "+91 87654 32109",
    relation: "Friend",
    status: "offline",
    lastPing: "1 hr ago",
    avatar: "R",
    color: "#3b82f6",
  },
];

const policeStations = [
  { id: 1, name: "Koramangala PS", distance: "1.2 km", phone: "080-25534450" },
  { id: 2, name: "Indiranagar PS", distance: "2.8 km", phone: "080-25220022" },
];

const nearbyUsers = [
  { id: 1, name: "ZenSHIELD User", distance: "~400m", verified: true },
  { id: 2, name: "ZenSHIELD User", distance: "~850m", verified: true },
];

export function SafeCircleScreen() {
  const navigate = useNavigate();
  const { username } = useApp();
  const [calledId, setCalledId] = useState<number | null>(null);

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
              width: "36px", height: "36px",
              background: "rgba(255,255,255,0.25)",
              border: "none", cursor: "pointer",
            }}
          >
            <ArrowLeft size={18} color="white" />
          </button>
          <div className="flex-1">
            <h1 style={{ color: "white", fontSize: "18px", fontWeight: 700 }}>Safe Circle</h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>
              Your trusted network
            </p>
          </div>
          <div
            className="flex items-center gap-1 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <div className="w-2 h-2 rounded-full bg-green-300" />
            <span style={{ color: "white", fontSize: "10px", fontWeight: 600 }}>Active</span>
          </div>
        </div>

        {/* Status banner */}
        <div
          className="rounded-2xl p-3 flex items-center gap-3"
          style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}
        >
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.25)" }}
          >
            <Shield size={20} color="white" fill="rgba(255,255,255,0.4)" />
          </div>
          <div>
            <p style={{ color: "white", fontSize: "13px", fontWeight: 700 }}>Safe Circle Active</p>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>
              {guardians.filter((g) => g.status === "active").length} guardians monitoring your journey
            </p>
          </div>
          <Heart size={18} color="rgba(255,255,255,0.8)" className="ml-auto" fill="rgba(255,255,255,0.4)" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Guardian Contacts */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 style={{ color: "#1f2937", fontSize: "14px", fontWeight: 700 }}>Guardian Contacts</h3>
            <button
              className="flex items-center gap-1 px-2.5 py-1 rounded-full"
              style={{
                background: "linear-gradient(135deg, #22c55e, #4ade80)",
                border: "none",
                cursor: "pointer",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              <Plus size={12} color="white" />
              <span style={{ color: "white", fontSize: "10px", fontWeight: 600 }}>Add</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {guardians.map((g) => (
              <motion.div
                key={g.id}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{
                  background: "white",
                  boxShadow: "0 4px 12px rgba(255,79,163,0.08)",
                  border: g.status === "active" ? "1.5px solid #dcfce7" : "1.5px solid #f3f4f6",
                }}
              >
                {/* Avatar */}
                <div
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    width: "44px",
                    height: "44px",
                    background: `${g.color}20`,
                    border: `2px solid ${g.color}40`,
                  }}
                >
                  <span style={{ color: g.color, fontSize: "16px", fontWeight: 800 }}>
                    {g.avatar}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p style={{ color: "#1f2937", fontSize: "13px", fontWeight: 600 }}>
                      {g.name}
                    </p>
                    {g.status === "active" && (
                      <motion.div
                        className="w-2 h-2 rounded-full bg-green-400"
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <p style={{ color: "#9ca3af", fontSize: "11px" }}>
                    {g.phone} • {g.lastPing}
                  </p>
                </div>

                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => setCalledId(g.id)}
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: "34px",
                      height: "34px",
                      background: calledId === g.id ? "#f0fdf4" : "linear-gradient(135deg, #22c55e, #4ade80)",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {calledId === g.id ? (
                      <CheckCircle size={16} color="#22c55e" />
                    ) : (
                      <Phone size={15} color="white" />
                    )}
                  </button>
                  <button
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: "34px",
                      height: "34px",
                      background: "#f0fdf4",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <Bell size={15} color="#22c55e" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Nearby Police Stations */}
        <div>
          <h3 style={{ color: "#1f2937", fontSize: "14px", fontWeight: 700, marginBottom: "10px" }}>
            Nearby Police Stations
          </h3>
          <div className="flex flex-col gap-2">
            {policeStations.map((ps) => (
              <div
                key={ps.id}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{
                  background: "white",
                  boxShadow: "0 2px 10px rgba(255,79,163,0.06)",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: "40px", height: "40px", background: "#eff6ff" }}
                >
                  <Building2 size={20} color="#3b82f6" />
                </div>
                <div className="flex-1">
                  <p style={{ color: "#1f2937", fontSize: "13px", fontWeight: 600 }}>{ps.name}</p>
                  <div className="flex items-center gap-2">
                    <MapPin size={10} color="#9ca3af" />
                    <p style={{ color: "#9ca3af", fontSize: "11px" }}>{ps.distance} away</p>
                  </div>
                </div>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl"
                  style={{
                    background: "#eff6ff",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  <Phone size={13} color="#3b82f6" />
                  <span style={{ color: "#3b82f6", fontSize: "11px", fontWeight: 600 }}>Call</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Nearby Users */}
        <div>
          <h3 style={{ color: "#1f2937", fontSize: "14px", fontWeight: 700, marginBottom: "10px" }}>
            Verified Nearby Users
          </h3>
          <div className="flex flex-col gap-2">
            {nearbyUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{
                  background: "white",
                  boxShadow: "0 2px 10px rgba(255,79,163,0.06)",
                  border: "1.5px solid #dcfce7",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: "40px", height: "40px", background: "#f0fdf4" }}
                >
                  <UserCheck size={20} color="#22c55e" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p style={{ color: "#1f2937", fontSize: "13px", fontWeight: 600 }}>{u.name}</p>
                    {u.verified && (
                      <div
                        className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                        style={{ background: "#f0fdf4" }}
                      >
                        <CheckCircle size={9} color="#22c55e" />
                        <span style={{ color: "#22c55e", fontSize: "8px", fontWeight: 700 }}>Verified</span>
                      </div>
                    )}
                  </div>
                  <p style={{ color: "#9ca3af", fontSize: "11px" }}>{u.distance} from you</p>
                </div>
                <Shield size={16} color="#22c55e" />
              </div>
            ))}
          </div>
        </div>

        {/* Offline note */}
        <div
          className="flex items-center gap-2 p-3 rounded-2xl"
          style={{ background: "#f0fdf4", border: "1px dashed #86efac" }}
        >
          <Users size={13} color="#22c55e" className="flex-shrink-0" />
          <p style={{ color: "#6b7280", fontSize: "11px" }}>
            Safe Circle runs offline. Guardians receive alerts when network is restored.
          </p>
        </div>

        <div className="h-20" />
      </div>

      <BottomNav />
    </div>
  );
}
