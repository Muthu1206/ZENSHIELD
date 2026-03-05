import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Bus, MapPin, Phone, Star, ShieldCheck,
  AlertTriangle, CheckCircle, Navigation
} from "lucide-react";
import { useApp } from "../context/AppContext";

export function StartRideScreen() {
  const navigate = useNavigate();
  const { setCurrentRide } = useApp();

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [destination, setDestination] = useState("");
  const [guardianContact, setGuardianContact] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const canStart = vehicleNumber.trim() && destination.trim() && guardianContact.trim();

  const mockVehicleData = {
    ownerName: "Karnataka State RTC",
    vehicleType: "City Express Bus",
    safetyRating: 4,
    riskLevel: "Low",
    riskColor: "#22c55e",
    busNumber: vehicleNumber || "KA 57 F 2341",
    verified: true,
  };

  const handleStartMonitoring = () => {
    if (!canStart) return;
    setShowVerification(true);
  };

  const handleBeginRide = () => {
    setCurrentRide({
      vehicleNumber,
      destination,
      guardianContact,
      startTime: new Date(),
      duration: "0:00",
    });
    navigate("/live-ride");
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#f0fdf4", fontFamily: "Poppins, sans-serif" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 pt-12 pb-6"
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
            width: "38px",
            height: "38px",
            background: "rgba(255,255,255,0.25)",
            border: "none",
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={20} color="white" />
        </button>
        <div>
          <h1 style={{ color: "white", fontSize: "19px", fontWeight: 700 }}>
            Start Safe Ride
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px" }}>
            Enter your journey details
          </p>
        </div>
        <div
          className="ml-auto flex items-center justify-center rounded-full"
          style={{ width: "38px", height: "38px", background: "rgba(255,255,255,0.25)" }}
        >
          <Bus size={18} color="white" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <AnimatePresence mode="wait">
          {!showVerification ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-4"
            >
              {/* Form card */}
              <div
                className="rounded-3xl p-5"
                style={{
                  background: "white",
                  boxShadow: "0 6px 24px rgba(255,79,163,0.1)",
                }}
              >
                <h3 style={{ color: "#1f2937", fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>
                  Journey Details
                </h3>

                {/* Vehicle Number */}
                <div className="mb-4">
                  <label style={{ color: "#374151", fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                    Vehicle Number
                  </label>
                  <div
                    className="flex items-center gap-3 rounded-2xl px-4"
                    style={{ border: "1.5px solid #dcfce7", background: "#f0fdf4", height: "50px" }}
                  >
                    <Bus size={18} color="#22c55e" />
                    <input
                      type="text"
                      placeholder="e.g. KA 57 F 2341"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                      style={{
                        flex: 1, border: "none", outline: "none", background: "transparent",
                        fontSize: "14px", color: "#1f2937", fontFamily: "Poppins, sans-serif",
                        letterSpacing: "1px",
                      }}
                    />
                  </div>
                </div>

                {/* Destination */}
                <div className="mb-4">
                  <label style={{ color: "#374151", fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                    Destination
                  </label>
                  <div
                    className="flex items-center gap-3 rounded-2xl px-4"
                    style={{ border: "1.5px solid #dcfce7", background: "#f0fdf4", height: "50px" }}
                  >
                    <MapPin size={18} color="#22c55e" />
                    <input
                      type="text"
                      placeholder="e.g. MG Road, Bengaluru"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      style={{
                        flex: 1, border: "none", outline: "none", background: "transparent",
                        fontSize: "14px", color: "#1f2937", fontFamily: "Poppins, sans-serif",
                      }}
                    />
                  </div>
                </div>

                {/* Guardian Contact */}
                <div className="mb-5">
                  <label style={{ color: "#374151", fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                    Guardian Contact
                  </label>
                  <div
                    className="flex items-center gap-3 rounded-2xl px-4"
                    style={{ border: "1.5px solid #dcfce7", background: "#f0fdf4", height: "50px" }}
                  >
                    <Phone size={18} color="#22c55e" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={guardianContact}
                      onChange={(e) => setGuardianContact(e.target.value)}
                      style={{
                        flex: 1, border: "none", outline: "none", background: "transparent",
                        fontSize: "14px", color: "#1f2937", fontFamily: "Poppins, sans-serif",
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleStartMonitoring}
                  disabled={!canStart}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl"
                  style={{
                    height: "52px",
                    background: canStart
                      ? "linear-gradient(135deg, #22c55e, #4ade80)"
                      : "#f3f4f6",
                    color: canStart ? "white" : "#9ca3af",
                    fontSize: "15px",
                    fontWeight: 700,
                    boxShadow: canStart ? "0 6px 20px rgba(255,79,163,0.35)" : "none",
                    border: "none",
                    cursor: canStart ? "pointer" : "not-allowed",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  <Navigation size={18} />
                  Start Monitoring
                </button>
              </div>

              {/* Info note */}
              <div
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
              >
                <ShieldCheck size={16} color="#22c55e" />
                <p style={{ color: "#166534", fontSize: "11px", lineHeight: "1.4" }}>
                  Journey will be monitored offline. Evidence auto-saved locally.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="verification"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="flex flex-col gap-4"
            >
              {/* Success indicator */}
              <div className="flex flex-col items-center py-4">
                <div
                  className="flex items-center justify-center rounded-full mb-2"
                  style={{ width: "60px", height: "60px", background: "#f0fdf4" }}
                >
                  <CheckCircle size={32} color="#22c55e" />
                </div>
                <p style={{ color: "#22c55e", fontSize: "14px", fontWeight: 700 }}>Vehicle Verified!</p>
                <p style={{ color: "#9ca3af", fontSize: "11px" }}>Safety check complete</p>
              </div>

              {/* Verification Card */}
              <div
                className="rounded-3xl p-5"
                style={{
                  background: "white",
                  boxShadow: "0 6px 24px rgba(255,79,163,0.1)",
                  border: "1.5px solid #f0fdf4",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={18} color="#22c55e" />
                  <h3 style={{ color: "#1f2937", fontSize: "15px", fontWeight: 700 }}>
                    Vehicle Verification
                  </h3>
                  <div
                    className="ml-auto px-2 py-0.5 rounded-full"
                    style={{ background: "#f0fdf4" }}
                  >
                    <span style={{ color: "#22c55e", fontSize: "10px", fontWeight: 600 }}>
                      ✓ VERIFIED
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {/* Vehicle number */}
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "#fff8fc" }}>
                    <span style={{ color: "#6b7280", fontSize: "12px" }}>Vehicle No.</span>
                    <span style={{ color: "#1f2937", fontSize: "13px", fontWeight: 700, letterSpacing: "1px" }}>
                      {mockVehicleData.busNumber}
                    </span>
                  </div>

                  {/* Owner */}
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#6b7280", fontSize: "12px" }}>Owner</span>
                    <span style={{ color: "#1f2937", fontSize: "12px", fontWeight: 600 }}>
                      {mockVehicleData.ownerName}
                    </span>
                  </div>

                  {/* Vehicle Type */}
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#6b7280", fontSize: "12px" }}>Type</span>
                    <div className="flex items-center gap-1">
                      <Bus size={14} color="#22c55e" />
                      <span style={{ color: "#1f2937", fontSize: "12px", fontWeight: 600 }}>
                        {mockVehicleData.vehicleType}
                      </span>
                    </div>
                  </div>

                  {/* Safety Rating */}
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#6b7280", fontSize: "12px" }}>Safety Rating</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          color={s <= mockVehicleData.safetyRating ? "#f59e0b" : "#e5e7eb"}
                          fill={s <= mockVehicleData.safetyRating ? "#f59e0b" : "#e5e7eb"}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#6b7280", fontSize: "12px" }}>Risk Level</span>
                    <div
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                      style={{ background: "#f0fdf4" }}
                    >
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span style={{ color: "#22c55e", fontSize: "12px", fontWeight: 700 }}>
                        {mockVehicleData.riskLevel} Risk
                      </span>
                    </div>
                  </div>

                  {/* Destination confirmed */}
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#6b7280", fontSize: "12px" }}>Destination</span>
                    <div className="flex items-center gap-1">
                      <MapPin size={13} color="#22c55e" />
                      <span style={{ color: "#1f2937", fontSize: "12px", fontWeight: 600 }}>
                        {destination}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Begin Ride Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleBeginRide}
                className="w-full flex items-center justify-center gap-2 rounded-2xl"
                style={{
                  height: "56px",
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: 700,
                  boxShadow: "0 8px 24px rgba(34,197,94,0.4)",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                <Navigation size={20} />
                Begin Ride
              </motion.button>

              {/* Modify button */}
              <button
                onClick={() => setShowVerification(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#9ca3af",
                  fontSize: "13px",
                  fontFamily: "Poppins, sans-serif",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                ← Modify details
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
