import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Mic, MicOff, Shield, CheckCircle,
  Volume2, AlertTriangle, Info, Edit3, X
} from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useApp } from "../context/AppContext";

const safeWordSuggestions = ["Lotus", "Jasmine", "Eagle", "Rainbow", "Phoenix", "Aurora"];

export function VoiceSafeWordScreen() {
  const navigate = useNavigate();
  const { safeWord, setSafeWord, voiceMonitoring, setVoiceMonitoring } = useApp();

  const [editMode, setEditMode] = useState(false);
  const [inputWord, setInputWord] = useState(safeWord);
  const [testMode, setTestMode] = useState(false);
  const [testResult, setTestResult] = useState<null | "success" | "fail">(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [error, setError] = useState<string>("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        setError("");
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        console.log('Recognized:', transcript);
        
        // Check if the transcript contains the safe word
        if (transcript.includes(safeWord.toLowerCase())) {
          setTestResult("success");
          setTestMode(false);
          // Trigger emergency alert here
          console.log('SafeWord detected! Triggering emergency alert...');
        } else {
          setTestResult("fail");
          setTestMode(false);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
        setTestMode(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
      recognitionRef.current = recognitionInstance;
    } else {
      setError("Speech recognition not supported in this browser");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [safeWord]);

  const handleSave = () => {
    if (inputWord.trim()) {
      setSafeWord(inputWord.trim());
      setEditMode(false);
    }
  };

  const handleTest = () => {
    if (!recognition) {
      setError("Speech recognition not available");
      return;
    }

    setTestMode(true);
    setTestResult(null);
    setError("");

    try {
      recognition.start();
    } catch (err) {
      console.error('Error starting recognition:', err);
      setError("Failed to start speech recognition");
      setTestMode(false);
    }
  };

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
          <div>
            <h1 style={{ color: "white", fontSize: "18px", fontWeight: 700 }}>Voice SafeWord</h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>
              Configure your emergency trigger
            </p>
          </div>
        </div>

        {/* Voice monitoring status */}
        <motion.div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{
            background: voiceMonitoring ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
            backdropFilter: "blur(10px)",
          }}
          animate={voiceMonitoring ? { boxShadow: ["0 0 0 0 rgba(255,255,255,0.1)", "0 0 0 6px rgba(255,255,255,0)", "0 0 0 0 rgba(255,255,255,0.1)"] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {voiceMonitoring ? (
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Mic size={22} color="white" />
              </motion.div>
              {/* Waveform */}
              <div className="flex gap-0.5 items-center">
                {[4, 8, 6, 12, 5, 10, 7, 9, 4, 8].map((h, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full bg-white"
                    style={{ width: "2px", height: `${h}px` }}
                    animate={{ height: [`${h}px`, `${h * 1.5}px`, `${h}px`] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.06,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <MicOff size={22} color="rgba(255,255,255,0.5)" />
          )}

          <div className="flex-1">
            <p style={{ color: "white", fontSize: "13px", fontWeight: 700 }}>
              Voice Monitoring {voiceMonitoring ? "ON" : "OFF"}
            </p>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "10px" }}>
              {voiceMonitoring ? "Listening for SafeWord..." : "Tap to activate"}
            </p>
          </div>

          <button
            onClick={() => setVoiceMonitoring(!voiceMonitoring)}
            className="px-3 py-1.5 rounded-full"
            style={{
              background: voiceMonitoring ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)",
              border: "1.5px solid rgba(255,255,255,0.4)",
              color: "white",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {voiceMonitoring ? "Pause" : "Enable"}
          </button>
        </motion.div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mb-4">
          <div
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
            }}
          >
            <AlertTriangle size={20} color="#dc2626" />
            <p style={{ color: "#dc2626", fontSize: "14px", fontWeight: 500 }}>
              {error}
            </p>
            <button
              onClick={() => setError("")}
              className="ml-auto"
              style={{ color: "#dc2626" }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Current SafeWord */}
        <div
          className="rounded-3xl p-5"
          style={{
            background: "white",
            boxShadow: "0 6px 24px rgba(34,197,94,0.1)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ color: "#1f2937", fontSize: "15px", fontWeight: 700 }}>
              Your SafeWord
            </h3>
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-1 px-3 py-1 rounded-full"
              style={{
                background: "#f0fdf4",
                border: "none",
                cursor: "pointer",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              <Edit3 size={12} color="#22c55e" />
              <span style={{ color: "#22c55e", fontSize: "11px", fontWeight: 600 }}>
                {editMode ? "Cancel" : "Change"}
              </span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!editMode ? (
              <motion.div
                key="display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-4 gap-3"
              >
                <div
                  className="flex items-center justify-center rounded-2xl px-8 py-4"
                  style={{
                    background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                    border: "2px dashed #86efac",
                  }}
                >
                  <span style={{ color: "#22c55e", fontSize: "28px", fontWeight: 800, letterSpacing: "3px" }}>
                    {safeWord}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 size={13} color="#6b7280" />
                  <p style={{ color: "#6b7280", fontSize: "12px", textAlign: "center" }}>
                    Say <strong style={{ color: "#22c55e" }}>"{safeWord}"</strong> twice to trigger emergency alert
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-3"
              >
                <div
                  className="flex items-center gap-3 rounded-2xl px-4"
                  style={{
                    border: "1.5px solid #dcfce7",
                    background: "#f0fdf4",
                    height: "50px",
                  }}
                >
                  <Mic size={18} color="#22c55e" />
                  <input
                    type="text"
                    placeholder="Enter your SafeWord"
                    value={inputWord}
                    onChange={(e) => setInputWord(e.target.value)}
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      fontSize: "16px",
                      color: "#1f2937",
                      fontWeight: 600,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  />
                </div>

                {/* Suggestions */}
                <div>
                  <p style={{ color: "#9ca3af", fontSize: "11px", marginBottom: "8px" }}>Suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {safeWordSuggestions.map((w) => (
                      <button
                        key={w}
                        onClick={() => setInputWord(w)}
                        className="px-3 py-1 rounded-full"
                        style={{
                          background: inputWord === w ? "linear-gradient(135deg, #22c55e, #4ade80)" : "#f0fdf4",
                          border: "none",
                          cursor: "pointer",
                          color: inputWord === w ? "white" : "#22c55e",
                          fontSize: "12px",
                          fontWeight: 600,
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={!inputWord.trim()}
                  className="w-full py-3 rounded-2xl"
                  style={{
                    background: inputWord.trim()
                      ? "linear-gradient(135deg, #22c55e, #4ade80)"
                      : "#f3f4f6",
                    color: inputWord.trim() ? "white" : "#9ca3af",
                    fontSize: "14px",
                    fontWeight: 700,
                    border: "none",
                    cursor: inputWord.trim() ? "pointer" : "not-allowed",
                    fontFamily: "Poppins, sans-serif",
                    boxShadow: inputWord.trim() ? "0 4px 16px rgba(34,197,94,0.3)" : "none",
                  }}
                >
                  Save SafeWord
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Test SafeWord */}
        <div
          className="rounded-3xl p-5"
          style={{
            background: "white",
            boxShadow: "0 4px 16px rgba(34,197,94,0.08)",
          }}
        >
          <h3 style={{ color: "#1f2937", fontSize: "14px", fontWeight: 700, marginBottom: "12px" }}>
            Test Your SafeWord
          </h3>

          <AnimatePresence mode="wait">
            {testMode ? (
              <motion.div
                key="testing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-4"
              >
                <motion.div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: "64px", height: "64px", background: "#f0fdf4" }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <Mic size={28} color="#22c55e" />
                </motion.div>
                <p style={{ color: "#22c55e", fontSize: "13px", fontWeight: 600 }}>
                  Listening... Say "{safeWord}"
                </p>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-green-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : testResult === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-2 py-3"
              >
                <CheckCircle size={36} color="#22c55e" />
                <p style={{ color: "#22c55e", fontSize: "14px", fontWeight: 700 }}>
                  SafeWord Detected!
                </p>
                <p style={{ color: "#9ca3af", fontSize: "11px" }}>
                  Emergency alert would be triggered
                </p>
                <button
                  onClick={() => setTestResult(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#22c55e",
                    fontSize: "12px",
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                    marginTop: "4px",
                  }}
                >
                  Test Again
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="idle"
                whileTap={{ scale: 0.97 }}
                onClick={handleTest}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl"
                style={{
                  background: "#f0fdf4",
                  border: "1.5px dashed #86efac",
                  color: "#22c55e",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                <Mic size={16} />
                Tap to Test SafeWord
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* How it works */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "#f5f3ff", border: "1px solid #e9d5ff" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Info size={14} color="#8b5cf6" />
            <h4 style={{ color: "#7c3aed", fontSize: "13px", fontWeight: 700 }}>How SafeWord Works</h4>
          </div>
          <div className="flex flex-col gap-2">
            {[
              "Say your SafeWord clearly, twice in a row",
              "AI detects the word even in noisy environments",
              "Emergency SOS is triggered automatically",
              "Evidence recording starts immediately",
              "Guardians are notified via SMS alert",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <div
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{ width: "18px", height: "18px", background: "#8b5cf6", marginTop: "1px" }}
                >
                  <span style={{ color: "white", fontSize: "9px", fontWeight: 700 }}>{i + 1}</span>
                </div>
                <p style={{ color: "#5b21b6", fontSize: "11px", lineHeight: "1.5" }}>{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-20" />
      </div>

      <BottomNav />
    </div>
  );
}
