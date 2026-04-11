"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "auto";
  variant?: "blue" | "white" | "dark";
  stacked?: boolean;
}

/**
 * Unified Laborgro Logo component — uses the official brand image (icon.png).
 * The source image has a black background; we use CSS to handle display on
 * light/dark surfaces via mix-blend-mode or a rounded container.
 */
const Logo: React.FC<LogoProps> = ({
  className = "",
  iconOnly = false,
  size = "md",
  variant = "blue",
  stacked = false,
}) => {
  const sizeMap = {
    sm: { px: 28, text: "text-base" },
    md: { px: 36, text: "text-xl" },
    lg: { px: 48, text: "text-2xl" },
    xl: { px: 64, text: "text-3xl" },
    auto: { px: 48, text: "text-2xl" },
  };

  const textColorMap = {
    blue: "#3d7ab5",
    white: "#ffffff",
    dark: "#1a2533",
  };

  const { px, text: textSize } = sizeMap[size];
  const textColor = textColorMap[variant];

  // The brand image is square — show just the collar icon portion
  // We show the full image cropped into a circle/rounded container
  const IconImage = () => (
    <div
      className="shrink-0 rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-110"
      style={{
        width: px,
        height: px,
        background: "#000",
        boxShadow: variant === "white" ? "0 0 0 1.5px rgba(255,255,255,0.25)" : "none",
      }}
    >
      <Image
        src="/icon.png"
        alt="Laborgro logo"
        width={px}
        height={px}
        className="w-full h-full object-cover"
        priority
      />
    </div>
  );

  if (iconOnly) {
    return (
      <div className={`group shrink-0 ${className}`}>
        <IconImage />
      </div>
    );
  }

  if (stacked) {
    return (
      <div className={`flex flex-col items-center gap-1 group shrink-0 ${className}`}>
        <IconImage />
        <span
          className={`font-bold tracking-wide ${textSize}`}
          style={{ color: textColor, fontFamily: "'Segoe UI', sans-serif" }}
        >
          Laborgro
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 group shrink-0 ${className}`}>
      <IconImage />
      <span
        className={`font-bold tracking-wide ${textSize}`}
        style={{ color: textColor, fontFamily: "'Segoe UI', sans-serif" }}
      >
        Laborgro
      </span>
    </div>
  );
};

export default Logo;
