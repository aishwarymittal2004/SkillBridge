import { useEffect, useState } from "react";

const TONE = {
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
};

const TONE_BG = {
  success: "#d1fae5",
  warning: "#fef3c7",
  danger: "#fee2e2",
};

export default function ATSScoreCircle({ score = 0, size = 64 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;

    const interval = setInterval(() => {
      start += 1;
      if (start >= score) {
        clearInterval(interval);
        start = score;
      }
      setDisplay(start);
    }, 15);

    return () => clearInterval(interval);
  }, [score]);

  const tone = score > 70 ? "success" : score > 40 ? "warning" : "danger";
  const color = TONE[tone];
  const trackColor = TONE_BG[tone];

  const strokeWidth = Math.max(3, size * 0.08);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(score, 100) / 100) * circumference;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`ATS score: ${score} out of 100`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center font-semibold"
        style={{ color, fontSize: size * 0.28 }}
      >
        {display}
      </div>
    </div>
  );
}