import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Shield } from "lucide-react";

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/login"), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="flex flex-col items-center justify-between h-full"
      style={{
        background: "linear-gradient(160deg, #22c55e 0%, #4ade80 50%, #86efac 100%)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Top decorative circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.1)",
            top: "-60px",
            right: "-60px",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "150px",
            height: "150px",
            background: "rgba(255,255,255,0.07)",
            top: "80px",
            left: "-50px",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "120px",
            height: "120px",
            background: "rgba(255,255,255,0.07)",
            bottom: "120px",
            right: "-30px",
          }}
        />
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center justify-center flex-1 gap-6 relative z-10">
        {/* Shield logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center justify-center rounded-3xl"
          style={{
            width: "100px",
            height: "100px",
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(255,79,163,0.4)",
          }}
        >
          <Shield size={54} color="white" strokeWidth={1.8} fill="rgba(255,255,255,0.3)" />
        </motion.div>

        {/* App name */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col items-center gap-2"
        >
          <h1
            style={{
              color: "white",
              fontSize: "32px",
              fontWeight: 800,
              letterSpacing: "1px",
              textShadow: "0 2px 10px rgba(0,0,0,0.15)",
            }}
          >
            Zen<span style={{ color: "#ffe0f0" }}>SHIELD</span>
          </h1>
          <div
            className="px-4 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <p style={{ color: "white", fontSize: "12px", fontWeight: 500, letterSpacing: "0.5px" }}>
              AI Women Travel Safety
            </p>
          </div>
        </motion.div>

        {/* Pulse animation rings */}
        <motion.div
          className="absolute rounded-full border-2 border-white/20"
          style={{ width: "130px", height: "130px", marginTop: "-20px" }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full border-2 border-white/10"
          style={{ width: "160px", height: "160px", marginTop: "-20px" }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
      </div>

      {/* Bottom text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="pb-12 flex flex-col items-center gap-3"
      >
        <div className="flex items-center gap-2">
          <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.4)" }} />
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px", fontWeight: 500 }}>
            Protecting every journey
          </p>
          <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.4)" }} />
        </div>

        {/* Loading dots */}
        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-white/60"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}