"use client";

import React from "react";
import { motion } from "framer-motion";

interface DecorativeProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Ornate Golden Indian Mandala Ornament
 */
export function MandalaOrnament({ className = "", size = 200, color = "#c9a96e" }: DecorativeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="mandalaGoldGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fae09c" />
          <stop offset="50%" stopColor="#c9a96e" />
          <stop offset="100%" stopColor="#8F3914" stopOpacity="0.8" />
        </radialGradient>
      </defs>

      {/* Outer subtle ring */}
      <circle cx="100" cy="100" r="92" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <circle cx="100" cy="100" r="86" stroke={color} strokeWidth="0.8" opacity="0.4" />

      {/* 8 Outer Lotus Petals */}
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={`petal-${i}`} transform={`rotate(${i * 45} 100 100)`}>
          <path
            d="M100 16 C92 38 82 54 100 78 C118 54 108 38 100 16 Z"
            stroke={color}
            strokeWidth="1.2"
            fill="url(#mandalaGoldGrad)"
            fillOpacity="0.08"
          />
          <circle cx="100" cy="14" r="2" fill={color} opacity="0.8" />
          <circle cx="100" cy="46" r="1.5" fill={color} opacity="0.6" />
        </g>
      ))}

      {/* 8 Intermediary Petals */}
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={`subpetal-${i}`} transform={`rotate(${i * 45 + 22.5} 100 100)`}>
          <path
            d="M100 32 C95 48 88 60 100 75 C112 60 105 48 100 32 Z"
            stroke={color}
            strokeWidth="0.9"
            strokeDasharray="2 2"
            opacity="0.7"
          />
          <circle cx="100" cy="30" r="1.5" fill={color} />
        </g>
      ))}

      {/* Middle Ornate Band */}
      <circle cx="100" cy="100" r="48" stroke={color} strokeWidth="1.2" opacity="0.7" />
      <circle cx="100" cy="100" r="42" stroke={color} strokeWidth="0.7" strokeDasharray="4 2" opacity="0.5" />

      {/* 12 Inner Petals */}
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={`inner-petal-${i}`} transform={`rotate(${i * 30} 100 100)`}>
          <path
            d="M100 58 C96 68 94 76 100 86 C106 76 104 68 100 58 Z"
            stroke={color}
            strokeWidth="1"
            fill={color}
            fillOpacity="0.12"
          />
        </g>
      ))}

      {/* Core Center Elements */}
      <circle cx="100" cy="100" r="22" stroke={color} strokeWidth="1.5" fill="none" opacity="0.8" />
      <circle cx="100" cy="100" r="16" fill="url(#mandalaGoldGrad)" fillOpacity="0.25" stroke={color} strokeWidth="0.8" />
      <circle cx="100" cy="100" r="6" fill={color} />
      <circle cx="100" cy="100" r="2.5" fill="#fdf5ec" />
    </svg>
  );
}

/**
 * Royal Corner Flourishes for luxury border frames
 */
export function CornerOrnament({
  position = "top-left",
  size = 64,
  color = "#c9a96e",
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: number;
  color?: string;
}) {
  const rotationMap = {
    "top-left": "rotate(0)",
    "top-right": "rotate(90deg) scaleX(-1)",
    "bottom-left": "rotate(270deg) scaleX(-1)",
    "bottom-right": "rotate(180deg)",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: rotationMap[position] }}
      className="pointer-events-none select-none transition-transform"
      aria-hidden="true"
    >
      <path
        d="M2 2 H48 C48 2 24 6 18 18 C14 26 14 40 14 62"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6 6 H38 C38 6 20 10 16 20 C12 28 10 38 10 54"
        stroke={color}
        strokeWidth="0.75"
        opacity="0.6"
        strokeLinecap="round"
      />
      <circle cx="2" cy="2" r="2.5" fill={color} />
      <circle cx="48" cy="2" r="1.5" fill={color} />
      <circle cx="14" cy="62" r="1.5" fill={color} />
      {/* Decorative leaf swirl */}
      <path
        d="M18 18 C26 26 32 20 28 14 C24 10 18 18 18 18 Z"
        fill={color}
        fillOpacity="0.4"
        stroke={color}
        strokeWidth="0.8"
      />
    </svg>
  );
}

/**
 * Divider flourish with central diamond & floral accents
 */
export function DividerFlourish({ className = "", color = "#9a7b3a" }: DecorativeProps) {
  return (
    <div className={`flex items-center justify-center gap-3 w-full my-4 select-none ${className}`}>
      <div className="h-[1px] flex-1 max-w-[100px] bg-gradient-to-r from-transparent via-[#c9a96e]/50 to-[#9a7b3a]" />
      <div className="flex items-center gap-1.5" style={{ color }}>
        <span className="inline-block w-1.5 h-1.5 rotate-45 border border-[#9a7b3a] bg-[#fdf5ec]" />
        <span className="inline-block w-2.5 h-2.5 rotate-45 bg-[#8F3914] shadow-sm shadow-[#8F3914]/30" />
        <span className="inline-block w-1.5 h-1.5 rotate-45 border border-[#9a7b3a] bg-[#fdf5ec]" />
      </div>
      <div className="h-[1px] flex-1 max-w-[100px] bg-gradient-to-l from-transparent via-[#c9a96e]/50 to-[#9a7b3a]" />
    </div>
  );
}

/**
 * Royal Rajasthani / Mughal Arch for Framing Image
 */
export function RoyalArchFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative p-3.5 sm:p-5 rounded-t-[140px] sm:rounded-t-[180px] rounded-b-2xl border border-[#c9a96e]/40 shadow-2xl bg-gradient-to-b from-[#fdf8ee] via-[#fff] to-[#f8f1ea] ${className}`}>
      {/* Outer Accent Double Border */}
      <div className="absolute inset-1.5 sm:inset-2 rounded-t-[132px] sm:rounded-t-[172px] rounded-b-xl border border-[#9a7b3a]/25 pointer-events-none" />
      
      {/* Top Arch Crown Jewel */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
        <div className="w-7 h-7 rounded-full bg-[#fdf5ec] border border-[#c9a96e] flex items-center justify-center shadow-md">
          <span className="w-3 h-3 rotate-45 bg-gradient-to-br from-[#c9a96e] to-[#8F3914]" />
        </div>
      </div>

      {/* Inner Image Container with Arch Cut */}
      <div className="relative overflow-hidden rounded-t-[124px] sm:rounded-t-[164px] rounded-b-lg shadow-inner">
        {children}
      </div>

      {/* Bottom Corner Flourishes */}
      <div className="absolute -bottom-1 -left-1">
        <CornerOrnament position="bottom-left" size={32} />
      </div>
      <div className="absolute -bottom-1 -right-1">
        <CornerOrnament position="bottom-right" size={32} />
      </div>
    </div>
  );
}

/**
 * Royal Monogram Wax Seal Icon
 */
export function WaxSeal({
  initials = "R & A",
  size = 76,
  onClick,
  className = "",
}: {
  initials?: string;
  size?: number;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{ width: size, height: size }}
      className={`relative rounded-full flex items-center justify-center cursor-pointer select-none transition-shadow ${className}`}
      aria-label="Royal Wax Seal"
    >
      {/* 3D Wax Texture Edge */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#A8451A] via-[#8F3914] to-[#5a1808] shadow-[0_10px_25px_rgba(90,24,8,0.4),inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-3px_6px_rgba(0,0,0,0.5)] border-2 border-[#c9a96e]/50" />
      
      {/* Inner Gold Beaded Ring */}
      <div className="absolute inset-2 rounded-full border border-dashed border-[#fae09c]/60 flex items-center justify-center" />
      
      {/* Monogram Initials */}
      <span className="relative z-10 font-serif text-[#fdf5ec] font-bold text-base tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {initials}
      </span>
    </motion.button>
  );
}
