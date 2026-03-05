import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft, Brain, Clock, MapPin, Bus, FileWarning,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  Zap, Shield, BarChart3
} from "lucide-react";
import { SafetyGauge } from "../components/SafetyGauge";
import { BottomNav } from "../components/BottomNav";

const riskInsights = [
  {
    id: 1,
    icon: Clock,
    title: "Time Risk",
    subtitle: "Current: 9:30 AM",
    value: "Low",
    score: 85,
    color: "#22c55e",
    bg: "#f0fdf4",
    detail: "Daytime travel is significantly safer. Peak safe hours: 8 AM – 6 PM",
    trend: "down",
  },
  {
    id: 2,
    icon: MapPin,
    title: "Area Risk",
    subtitle: "Koramangala Zone",
    value: "Medium",
    score: 58,
    color: "#f59e0b",
    bg: "#fffbeb",
    detail: "3 incidents reported in the last 7 days in this area",
    trend: "up",
  },
  {
    id: 3,
    icon: Bus,
    title: "Vehicle Risk",
    subtitle: "Bus KA 57 F 2341",
    value: "Low",
    score: 78,
    color: "#22c55e",
    bg: "#f0fdf4",
    detail: "Vehicle has 4.0/5 safety rating. No complaints in 30 days",
    trend: "down",
  },
  {
    id: 4,
    icon: FileWarning,
    title: "Complaint History",
    subtitle: "Area based",
    value: "Moderate",
    score: 55,
    color: "#f59e0b",
    bg: "#fffbeb",
    detail: "8 complaints filed this month. Mostly eve-teasing reports.",
    trend: "up",
  },
];

const aiRecommendations = [
  { id: 1, text: "Prefer routes via MG Road (safer zone, 82% score)", positive: true },
  { id: 2, text: "Avoid Shivajinagar area after 8 PM", positive: false },
  { id: 3, text: "Share live location before boarding", positive: true },
  { id: 4, text: "Moderate incident history in current zone", positive: false },
  { id: 5, text: "Voice SafeWord monitoring is active — good practice", positive: true },
];

export function AIAnalysisScreen() {
  const navigate = useNavigate();
  const safetyScore = 62;
  const [expanded, setExpanded] = useState<number | null>(null);

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
            <h1 style={{ color: "white", fontSize: "18px", fontWeight: 700 }}>AI Safety Analysis</h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>
              Real-time intelligence
            </p>
          </div>
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <Zap size={11} color="white" fill="white" />
            <span style={{ color: "white", fontSize: "9px", fontWeight: 700 }}>AI ACTIVE</span>
          </div>
        </div>

        {/* AI Score card */}
        <div
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}
        >
          <div>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>Overall Safety Score</p>
            <div className="flex items-end gap-2 mt-1">
              <span style={{ color: "white", fontSize: "32px", fontWeight: 800 }}>{safetyScore}%</span>
              <div
                className="flex items-center gap-1 mb-1 px-2 py-0.5 rounded-full"
                style={{ background: "rgba(245,158,11,0.3)" }}
              >
                <span style={{ color: "#fde68a", fontSize: "11px", fontWeight: 700 }}>Medium Risk</span>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "11px" }}>
              Based on 4 risk factors analyzed
            </p>
          </div>
          <SafetyGauge score={safetyScore} size={110} label="" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Risk Insights */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={16} color="#22c55e" />
            <h3 style={{ color: "#1f2937", fontSize: "14px", fontWeight: 700 }}>Risk Breakdown</h3>
          </div>

          <div className="flex flex-col gap-2">
            {riskInsights.map((insight, i) => {
              const Icon = insight.icon;
              const isExpanded = expanded === insight.id;

              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "white",
                    boxShadow: "0 4px 12px rgba(255,79,163,0.08)",
                    border: isExpanded ? `1.5px solid ${insight.color}40` : "1.5px solid transparent",
                  }}
                >
                  <button
                    onClick={() => setExpanded(isExpanded ? null : insight.id)}
                    className="w-full flex items-center gap-3 p-4"
                    style={{ background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
                  >
                    <div
                      className="flex items-center justify-center rounded-xl flex-shrink-0"
                      style={{ width: "44px", height: "44px", background: insight.bg }}
                    >
                      <Icon size={20} color={insight.color} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p style={{ color: "#1f2937", fontSize: "13px", fontWeight: 600, fontFamily: "Poppins, sans-serif" }}>
                          {insight.title}
                        </p>
                        {insight.trend === "up" ? (
                          <TrendingUp size={12} color="#ef4444" />
                        ) : (
                          <TrendingDown size={12} color="#22c55e" />
                        )}
                      </div>
                      <p style={{ color: "#9ca3af", fontSize: "11px", fontFamily: "Poppins, sans-serif" }}>
                        {insight.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <div
                        className="px-2.5 py-1 rounded-full"
                        style={{ background: insight.bg }}
                      >
                        <span style={{ color: insight.color, fontSize: "11px", fontWeight: 700 }}>
                          {insight.value}
                        </span>
                      </div>
                      <span style={{ color: insight.color, fontSize: "12px", fontWeight: 800 }}>
                        {insight.score}%
                      </span>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4"
                    >
                      {/* Score bar */}
                      <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: "#f3f4f6" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: insight.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${insight.score}%` }}
                          transition={{ duration: 0.7 }}
                        />
                      </div>
                      <p style={{ color: "#6b7280", fontSize: "11px", lineHeight: "1.5" }}>
                        {insight.detail}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* AI Recommendations */}
        <div
          className="rounded-3xl p-5"
          style={{
            background: "white",
            boxShadow: "0 6px 24px rgba(255,79,163,0.1)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Brain size={18} color="#8b5cf6" />
            <h3 style={{ color: "#1f2937", fontSize: "14px", fontWeight: 700 }}>AI Recommendations</h3>
          </div>

          <div className="flex flex-col gap-2">
            {aiRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="flex items-start gap-2 p-2.5 rounded-xl"
                style={{
                  background: rec.positive ? "#f0fdf4" : "#fff7ed",
                }}
              >
                {rec.positive ? (
                  <CheckCircle size={14} color="#22c55e" className="mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle size={14} color="#f59e0b" className="mt-0.5 flex-shrink-0" />
                )}
                <p style={{ color: rec.positive ? "#166534" : "#92400e", fontSize: "11px", lineHeight: "1.5" }}>
                  {rec.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Last analysis time */}
        <div
          className="flex items-center justify-center gap-2 py-2"
        >
          <Zap size={12} color="#22c55e" />
          <span style={{ color: "#9ca3af", fontSize: "11px" }}>
            Last AI analysis: 2 minutes ago • Offline model active
          </span>
        </div>

        {/* Offline model badge */}
        <div
          className="flex items-center gap-2 p-3 rounded-2xl"
          style={{ background: "#f5f3ff", border: "1px solid #e9d5ff" }}
        >
          <Shield size={14} color="#8b5cf6" className="flex-shrink-0" />
          <p style={{ color: "#5b21b6", fontSize: "11px" }}>
            <span style={{ fontWeight: 600 }}>Offline AI Model Active.</span>{" "}
            Analysis runs locally on your device without internet connection.
          </p>
        </div>

        <div className="h-20" />
      </div>

      <BottomNav />
    </div>
  );
}
