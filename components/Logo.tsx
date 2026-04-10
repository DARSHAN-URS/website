"use client";

import React from "react";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "auto";
  variant?: "blue" | "white" | "dark";
  stacked?: boolean; // icon on top of text (like brand logo), default false = side-by-side
}

/**
 * Unified Laborgro Logo component — polo shirt collar icon + wordmark.
 * Use this everywhere the Laborgro logo or icon is needed.
 */
const Logo: React.FC<LogoProps> = ({
  className = "",
  iconOnly = false,
  size = "md",
  variant = "blue",
  stacked = false,
}) => {
  const colorMap = {
    blue: {
      collarOuter: "#3d7ab5",
      collarInner: "#5b9bd5",
      collarWhite: "#ffffff",
      text: "#3d7ab5",
    },
    white: {
      collarOuter: "#ffffff",
      collarInner: "#d0e4f5",
      collarWhite: "#e8f2fc",
      text: "#ffffff",
    },
    dark: {
      collarOuter: "#1a2533",
      collarInner: "#3d7ab5",
      collarWhite: "#ffffff",
      text: "#1a2533",
    },
  }[variant];

  const sizeMap = {
    sm: { icon: 28, text: "text-base" },
    md: { icon: 36, text: "text-xl" },
    lg: { icon: 48, text: "text-2xl" },
    xl: { icon: 64, text: "text-3xl" },
    auto: { icon: 48, text: "text-2xl" },
  };

  const { icon: iconPx, text: textSize } = sizeMap[size];

  // Polo shirt collar SVG — faithful recreation of the brand logo
  const CollarIcon = () => (
    <svg
      width={iconPx}
      height={iconPx * 0.7}
      viewBox="0 0 100 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-sm shrink-0"
    >
      {/* Left collar flap */}
      <path
        d="M50 12 C44 20 30 28 8 32 C14 48 26 62 50 66"
        fill={colorMap.collarWhite}
        stroke={colorMap.collarOuter}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Right collar flap */}
      <path
        d="M50 12 C56 20 70 28 92 32 C86 48 74 62 50 66"
        fill={colorMap.collarWhite}
        stroke={colorMap.collarOuter}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Inner collar shadow – left */}
      <path
        d="M50 18 C46 24 36 30 16 36"
        stroke={colorMap.collarInner}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Inner collar shadow – right */}
      <path
        d="M50 18 C54 24 64 30 84 36"
        stroke={colorMap.collarInner}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Neckline top curve */}
      <path
        d="M34 14 Q50 4 66 14"
        fill={colorMap.collarInner}
        stroke={colorMap.collarOuter}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Center button placket */}
      <line
        x1="50" y1="22"
        x2="50" y2="54"
        stroke={colorMap.collarInner}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
    </svg>
  );

  if (stacked) {
    return (
      <div className={`flex flex-col items-center gap-1 group shrink-0 ${className}`}>
        <div className="transition-transform duration-300 group-hover:scale-110">
          <CollarIcon />
        </div>
        {!iconOnly && (
          <span
            className={`font-bold tracking-wide ${textSize}`}
            style={{ color: colorMap.text, fontFamily: "'Segoe UI', sans-serif" }}
          >
            Laborgro
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 group shrink-0 ${className}`}>
      <div className="transition-transform duration-300 group-hover:scale-110">
        <CollarIcon />
      </div>
      {!iconOnly && (
        <span
          className={`font-bold tracking-wide ${textSize}`}
          style={{ color: colorMap.text, fontFamily: "'Segoe UI', sans-serif" }}
        >
          Laborgro
        </span>
      )}
    </div>
  );
};

export default Logo;
