import React from "react";
import { useNavigate, useLocation } from "react-router";
import { Home, Map, Users, Brain, Mic } from "lucide-react";
import { motion } from "motion/react";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Map, label: "Heatmap", path: "/heatmap" },
  { icon: Users, label: "Circle", path: "/safe-circle" },
  { icon: Brain, label: "AI", path: "/ai-analysis" },
  { icon: Mic, label: "Voice", path: "/voice-safeword" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="flex items-center justify-around px-1 py-1"
      style={{
        background: "white",
        borderTop: "1px solid #dcfce7",
        paddingBottom: "env(safe-area-inset-bottom, 6px)",
        boxShadow: "0 -4px 16px rgba(255,79,163,0.06)",
        flexShrink: 0,
      }}
    >
      {navItems.map(({ icon: Icon, label, path }) => {
        const isActive = location.pathname === path;
        return (
          <motion.button
            key={path}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-0.5 py-1.5 rounded-2xl relative"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: isActive ? "#22c55e" : "#9ca3af",
              minWidth: "0",
            }}
          >
            {/* Active indicator dot */}
            {isActive && (
              <motion.div
                layoutId="activeNavDot"
                className="absolute top-0 left-1/2 rounded-full"
                style={{
                  width: "20px",
                  height: "3px",
                  background: "linear-gradient(90deg, #22c55e, #4ade80)",
                  transform: "translateX(-50%)",
                  borderRadius: "0 0 4px 4px",
                }}
              />
            )}

            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: "36px",
                height: "28px",
                background: isActive ? "#f0fdf4" : "transparent",
                transition: "background 0.2s ease",
              }}
            >
              <Icon
                size={18}
                strokeWidth={isActive ? 2.5 : 1.8}
                color={isActive ? "#22c55e" : "#9ca3af"}
              />
            </div>
            <span
              style={{
                fontSize: "9px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: isActive ? 700 : 400,
                color: isActive ? "#22c55e" : "#9ca3af",
              }}
            >
              {label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
