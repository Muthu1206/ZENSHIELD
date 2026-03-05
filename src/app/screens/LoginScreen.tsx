import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Shield, Phone, ChevronRight, Lock, CheckCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

export function LoginScreen() {
  const navigate = useNavigate();
  const { setPhone, setUsername } = useApp();
  const [step, setStep] = useState<"phone" | "otp" | "name">("phone");
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (phoneInput.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setPhone(phoneInput);
      setLoading(false);
      setStep("otp");
    }, 1200);
  };

  const handleVerifyOTP = () => {
    if (otpInput.length < 4) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("name");
    }, 1000);
  };

  const handleSetName = () => {
    if (!nameInput.trim()) return;
    setUsername(nameInput.trim());
    navigate("/permissions");
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "#f0fdf4",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Top header */}
      <div
        className="flex flex-col items-center pt-10 pb-8 px-6"
        style={{
          background: "linear-gradient(160deg, #22c55e 0%, #4ade80 100%)",
          borderBottomLeftRadius: "32px",
          borderBottomRightRadius: "32px",
        }}
      >
        <div
          className="flex items-center justify-center rounded-2xl mb-3"
          style={{
            width: "56px",
            height: "56px",
            background: "rgba(255,255,255,0.25)",
          }}
        >
          <Shield size={28} color="white" fill="rgba(255,255,255,0.4)" />
        </div>
        <h1 style={{ color: "white", fontSize: "20px", fontWeight: 700 }}>ZenSHIELD</h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", marginTop: "2px" }}>
          AI Women Travel Safety-ZenShield
        </p>
      </div>

      {/* Login Card */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full rounded-3xl p-6"
          style={{
            background: "white",
            boxShadow: "0 8px 32px rgba(255,79,163,0.12)",
          }}
        >
          {step === "phone" && (
            <>
              <div className="flex items-center gap-2 mb-1">
                <Lock size={18} color="#22c55e" />
                <h2 style={{ color: "#1f2937", fontSize: "18px", fontWeight: 700 }}>
                  Secure Login
                </h2>
              </div>
              <p style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "24px" }}>
                Enter your phone number to receive OTP
              </p>

              <div className="mb-4">
                <label style={{ color: "#374151", fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                  Phone Number
                </label>
                <div
                  className="flex items-center gap-3 rounded-2xl px-4"
                  style={{
                    border: "1.5px solid #dcfce7",
                    background: "#f0fdf4",
                    height: "52px",
                  }}
                >
                  <Phone size={18} color="#22c55e" />
                  <span style={{ color: "#6b7280", fontSize: "14px", borderRight: "1px solid #dcfce7", paddingRight: "12px" }}>+91</span>
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      fontSize: "15px",
                      color: "#1f2937",
                      fontFamily: "Poppins, sans-serif",
                      letterSpacing: "1px",
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleSendOTP}
                disabled={phoneInput.length < 10 || loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl"
                style={{
                  height: "52px",
                  background: phoneInput.length >= 10 ? "linear-gradient(135deg, #22c55e, #4ade80)" : "#f3f4f6",
                  color: phoneInput.length >= 10 ? "white" : "#9ca3af",
                  fontSize: "15px",
                  fontWeight: 600,
                  boxShadow: phoneInput.length >= 10 ? "0 6px 20px rgba(255,79,163,0.35)" : "none",
                  border: "none",
                  cursor: phoneInput.length >= 10 ? "pointer" : "not-allowed",
                  transition: "all 0.3s ease",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                ) : (
                  <>Send OTP <ChevronRight size={18} /></>
                )}
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={18} color="#22c55e" />
                <h2 style={{ color: "#1f2937", fontSize: "18px", fontWeight: 700 }}>
                  Verify OTP
                </h2>
              </div>
              <p style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "8px" }}>
                OTP sent to +91 {phoneInput}
              </p>
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2 mb-5"
                style={{ background: "#f0fdf4" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span style={{ color: "#22c55e", fontSize: "11px", fontWeight: 500 }}>
                  Demo OTP: 1234
                </span>
              </div>

              <div className="mb-4">
                <label style={{ color: "#374151", fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                  Enter 4-digit OTP
                </label>
                <input
                  type="tel"
                  placeholder="• • • •"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="w-full rounded-2xl px-4 text-center"
                  style={{
                    height: "52px",
                    border: "1.5px solid #dcfce7",
                    background: "#f0fdf4",
                    fontSize: "22px",
                    color: "#1f2937",
                    letterSpacing: "12px",
                    outline: "none",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                  }}
                />
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={otpInput.length < 4 || loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl"
                style={{
                  height: "52px",
                  background: otpInput.length >= 4 ? "linear-gradient(135deg, #22c55e, #4ade80)" : "#f3f4f6",
                  color: otpInput.length >= 4 ? "white" : "#9ca3af",
                  fontSize: "15px",
                  fontWeight: 600,
                  boxShadow: otpInput.length >= 4 ? "0 6px 20px rgba(255,79,163,0.35)" : "none",
                  border: "none",
                  cursor: otpInput.length >= 4 ? "pointer" : "not-allowed",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                ) : (
                  <>Verify & Continue <ChevronRight size={18} /></>
                )}
              </button>
            </>
          )}

          {step === "name" && (
            <>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={18} color="#22c55e" />
                <h2 style={{ color: "#1f2937", fontSize: "18px", fontWeight: 700 }}>
                  Almost there!
                </h2>
              </div>
              <p style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "24px" }}>
                What should we call you?
              </p>

              <div className="mb-4">
                <label style={{ color: "#374151", fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full rounded-2xl px-4"
                  style={{
                    height: "52px",
                    border: "1.5px solid #dcfce7",
                    background: "#f0fdf4",
                    fontSize: "15px",
                    color: "#1f2937",
                    outline: "none",
                    fontFamily: "Poppins, sans-serif",
                  }}
                />
              </div>

              <button
                onClick={handleSetName}
                disabled={!nameInput.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-2xl"
                style={{
                  height: "52px",
                  background: nameInput.trim() ? "linear-gradient(135deg, #22c55e, #4ade80)" : "#f3f4f6",
                  color: nameInput.trim() ? "white" : "#9ca3af",
                  fontSize: "15px",
                  fontWeight: 600,
                  boxShadow: nameInput.trim() ? "0 6px 20px rgba(255,79,163,0.35)" : "none",
                  border: "none",
                  cursor: nameInput.trim() ? "pointer" : "not-allowed",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Continue <ChevronRight size={18} />
              </button>
            </>
          )}
        </motion.div>

        {/* Offline indicator */}
        <div
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: "rgba(255,79,163,0.08)" }}
        >
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span style={{ color: "#6b7280", fontSize: "11px", fontFamily: "Poppins, sans-serif" }}>
            Offline Mode Active
          </span>
        </div>
      </div>
    </div>
  );
}
