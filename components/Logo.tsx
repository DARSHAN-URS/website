"use client";

import React from "react";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "auto";
  variant?: "blue" | "white" | "dark";
}

/**
 * Unified Laborgro Logo component
 * Use this everywhere the Laborgro logo or icon is needed.
 */
const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  iconOnly = false, 
  size = "md",
  variant = "blue"
}) => {
  // Color configuration
  const config = {
    blue: {
      main: "#3d7ab5",
      inner: "white",
      text: "text-[#3d7ab5]"
    },
    white: {
      main: "white",
      inner: "transparent",
      text: "text-white"
    },
    dark: {
      main: "#1a2533",
      inner: "white",
      text: "text-[#1a2533]"
    }
  }[variant];

  // Size configuration
  const sizes = {
    sm: { icon: "w-8 h-5", text: "text-lg" },
    md: { icon: "w-10 h-6", text: "text-xl" },
    lg: { icon: "w-12 h-8", text: "text-2xl" },
    xl: { icon: "w-16 h-10", text: "text-3xl" },
    auto: { icon: "w-full h-full", text: "text-current" }
  };

  const { icon: iconSize, text: textSize } = sizes[size];

  return (
    <div className={`flex items-center gap-2.5 group shrink-0 ${className}`}>
      <div className={`relative ${iconSize} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
        <svg viewBox="0 0 100 60" fill="none" className="w-full h-full drop-shadow-sm">
          {/* Main helmet/hat shape */}
          <path 
            d="M10 45C10 45 25 10 50 10C75 10 90 45 90 45L75 55C75 55 65 30 50 30C35 30 25 55 25 55L10 45Z" 
            fill={config.inner} 
            stroke={config.main} 
            strokeWidth="6" 
            strokeLinejoin="round"
          />
          {/* Inner "V" detail (eyes/visor) */}
          <path 
            d="M45 30L50 42L55 30" 
            stroke={config.main} 
            strokeWidth="4" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bottom dot detail */}
          <circle cx="50" cy="52" r="2" fill={config.main}/>
        </svg>
      </div>
      {!iconOnly && (
        <span className={`font-serif ${textSize} font-extrabold tracking-tight ${config.text}`}>
          Laborgro
        </span>
      )}
    </div>
  );
};

export default Logo;
