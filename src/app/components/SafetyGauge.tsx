import React, { useEffect, useState } from "react";

interface SafetyGaugeProps {
  score: number; // 0-100
  size?: number;
  label?: string;
  showLabel?: boolean;
}

export function SafetyGauge({ score, size = 140, label = "Safety Score", showLabel = true }: SafetyGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - 24) / 2;
  const circumference = Math.PI * radius; // half circle arc
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const getColor = () => {
    if (score >= 70) return "#22c55e";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getTrackColor = () => {
    if (score >= 70) return "#dcfce7";
    if (score >= 40) return "#fef9c3";
    return "#fee2e2";
  };

  const getRiskLabel = () => {
    if (score >= 70) return "Safe";
    if (score >= 40) return "Medium";
    return "High Risk";
  };

  const cx = size / 2;
  const cy = size / 2;
  const startX = 12;
  const startY = cy;
  const endX = size - 12;
  const endY = cy;

  return (
    <div className="flex flex-col items-center" style={{ position: "relative" }}>
      <svg
        width={size}
        height={size / 2 + 24}
        viewBox={`0 0 ${size} ${size / 2 + 24}`}
        style={{ overflow: "visible" }}
      >
        {/* Shadow filter */}
        <defs>
          <filter id="gaugeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={getColor()} floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Background arc - track */}
        <path
          d={`M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`}
          fill="none"
          stroke={getTrackColor()}
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = Math.PI - (tick / 100) * Math.PI;
          const tx = cx + (radius + 4) * Math.cos(angle);
          const ty = cy - (radius + 4) * Math.sin(angle);
          return (
            <circle
              key={tick}
              cx={tx}
              cy={ty}
              r="2"
              fill={tick <= score ? getColor() : "#e5e7eb"}
              opacity="0.8"
            />
          );
        })}

        {/* Score arc with animation */}
        <path
          d={`M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`}
          fill="none"
          stroke={getColor()}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          filter="url(#gaugeShadow)"
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.5s ease",
          }}
        />

        {/* Center needle/dot */}
        {(() => {
          const needleAngle = Math.PI - (animatedScore / 100) * Math.PI;
          const nx = cx + (radius) * Math.cos(needleAngle);
          const ny = cy - (radius) * Math.sin(needleAngle);
          return (
            <>
              <circle cx={nx} cy={ny} r="7" fill="white" stroke={getColor()} strokeWidth="2.5" />
              <circle cx={nx} cy={ny} r="3" fill={getColor()} />
            </>
          );
        })()}

        {/* Score text */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fontSize="24"
          fontWeight="800"
          fill="#1f2937"
          fontFamily="Poppins, sans-serif"
        >
          {animatedScore}%
        </text>

        {/* Risk label */}
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fontSize="10"
          fill={getColor()}
          fontFamily="Poppins, sans-serif"
          fontWeight="700"
        >
          {getRiskLabel()}
        </text>

        {/* 0 label */}
        <text x="8" y={cy + 20} fontSize="8" fill="#9ca3af" fontFamily="Poppins, sans-serif">0</text>
        {/* 100 label */}
        <text x={size - 20} y={cy + 20} fontSize="8" fill="#9ca3af" fontFamily="Poppins, sans-serif">100</text>
      </svg>

      {showLabel && label && (
        <p style={{ fontSize: "10px", color: "#6b7280", fontFamily: "Poppins, sans-serif", marginTop: "-6px" }}>
          {label}
        </p>
      )}
    </div>
  );
}
