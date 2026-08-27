"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { weddingData } from "@/lib/wedding-data";
import {
  MandalaOrnament,
  CornerOrnament,
  DividerFlourish,
  RoyalArchFrame,
} from "./DecorativeElements";
import { ChevronDown, Calendar, MapPin } from "lucide-react";

interface HeroProps {
  isRevealed?: boolean;
}

export function Hero({ isRevealed = true }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const [imageError, setImageError] = useState(false);

  // Animation timing variants in the specified order:
  // 1. Background -> 2. Decoration -> 3. Small label -> 4. Bride/Groom names -> 5. Date -> 6. Image -> 7. Scroll indicator
  const transitionConfig = (delay: number) => ({
    duration: prefersReducedMotion ? 0.3 : 0.9,
    delay: isRevealed ? (prefersReducedMotion ? 0 : delay) : 0,
    ease: [0.22, 1, 0.36, 1] as const,
  });

  return (
    <section
      id="hero-section"
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-between text-center px-4 sm:px-8 pt-16 sm:pt-20 pb-12 overflow-hidden bg-gradient-to-b from-[#F4E3DD] via-[#FAF0EC] to-[#EEDCD5]"
    >
      {/* ══ 1. BACKGROUND (Ambient Glows & Royal Filigree) ══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
        transition={transitionConfig(0.1)}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {/* Soft Royal Warm Radiance */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-b from-[#fae09c]/20 via-[#FAF0EC]/40 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-t from-[#8F3914]/10 via-[#c9a96e]/15 to-transparent blur-3xl" />

        {/* Outer Frame Border with Corner Filigree */}
        <div className="absolute inset-3 sm:inset-6 rounded-3xl border border-[#9a7b3a]/20 pointer-events-none" />
        <div className="absolute inset-5 sm:inset-8 rounded-2xl border border-dashed border-[#c9a96e]/20 pointer-events-none" />

        <div className="absolute top-4 left-4 sm:top-7 sm:left-7">
          <CornerOrnament position="top-left" size={48} />
        </div>
        <div className="absolute top-4 right-4 sm:top-7 sm:right-7">
          <CornerOrnament position="top-right" size={48} />
        </div>
        <div className="absolute bottom-4 left-4 sm:bottom-7 sm:left-7">
          <CornerOrnament position="bottom-left" size={48} />
        </div>
        <div className="absolute bottom-4 right-4 sm:bottom-7 sm:right-7">
          <CornerOrnament position="bottom-right" size={48} />
        </div>
      </motion.div>

      {/* ══ 2. DECORATION (Subtle Top Floating Mandala) ══ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotate: -20 }}
        animate={isRevealed ? { opacity: 0.45, scale: 1, rotate: 0 } : { opacity: 0 }}
        transition={transitionConfig(0.3)}
        className="absolute -top-24 left-1/2 -translate-x-1/2 pointer-events-none"
      >
        <MandalaOrnament size={280} color="#c9a96e" />
      </motion.div>

      {/* ══ HERO MAIN CONTENT ══ */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center my-auto pt-4 sm:pt-6">
        
        {/* ══ 3. SMALL LABEL (Auspicious Tagline & Eyebrow) ══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={transitionConfig(0.5)}
          className="flex flex-col items-center mb-4 sm:mb-6"
        >
          <span className="font-serif text-xs sm:text-sm tracking-[0.32em] text-[#8F3914] font-medium uppercase mb-2">
            {weddingData.blessingTagline}
          </span>
          <div className="flex items-center gap-2">
            <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#9a7b3a]" />
            <h2 className="font-serif text-[11px] sm:text-xs tracking-[0.45em] text-[#9a7b3a] font-bold uppercase">
              Wedding Invitation
            </h2>
            <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#9a7b3a]" />
          </div>
        </motion.div>

        {/* ══ 4. BRIDE & GROOM NAMES (Luxury Shimmer & Display Typography) ══ */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={isRevealed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }}
          transition={transitionConfig(0.7)}
          className="w-full flex flex-col items-center justify-center my-2 sm:my-3"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-1 sm:gap-4 md:gap-6">
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-gold-shimmer font-normal drop-shadow-sm">
              {weddingData.groom.firstName}
            </h1>
            <span className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#9a7b3a] my-1 md:my-0">
              &amp;
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-gold-shimmer font-normal drop-shadow-sm">
              {weddingData.bride.firstName}
            </h1>
          </div>

          <DividerFlourish className="max-w-[260px] sm:max-w-[320px] my-3 sm:my-4" />
        </motion.div>

        {/* ══ 5. WEDDING DATE & VENUE ══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={transitionConfig(0.9)}
          className="flex flex-col items-center text-center space-y-1.5 sm:space-y-2 mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fdf8ee] border border-[#c9a96e]/40 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-[#8F3914]" />
            <span className="font-serif text-xs sm:text-sm md:text-base tracking-[0.28em] text-[#8F3914] font-semibold uppercase">
              {weddingData.weddingDate.formatted}
            </span>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[#7a6558] text-xs sm:text-sm font-serif italic pt-1">
            <MapPin className="w-3.5 h-3.5 text-[#9a7b3a]" />
            <span>{weddingData.venue.name} &bull; {weddingData.venue.city}, {weddingData.venue.state}</span>
          </div>
        </motion.div>

        {/* ══ 6. COUPLE IMAGE (Royal Arch Portrait Frame) ══ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={isRevealed ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0 }}
          transition={transitionConfig(1.1)}
          className="w-full max-w-[290px] sm:max-w-[340px] md:max-w-[380px] my-2 sm:my-4"
        >
          <RoyalArchFrame>
            <div className="relative aspect-[3/4] w-full bg-gradient-to-b from-[#f5ede0] to-[#eaddcc] overflow-hidden group">
              {!imageError ? (
                <Image
                  src="/images/couple.jpg"
                  alt={`${weddingData.groom.firstName} and ${weddingData.bride.firstName}`}
                  fill
                  sizes="(max-width: 640px) 290px, (max-width: 768px) 340px, 380px"
                  className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                  priority
                  onError={() => setImageError(true)}
                />
              ) : (
                /* Graceful Luxury Fallback Frame if image fails */
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#F4E3DD] via-[#FAF0EC] to-[#EEDCD5]">
                  <MandalaOrnament size={120} color="#9a7b3a" className="opacity-60 mb-4" />
                  <span className="font-serif text-2xl text-[#8F3914] font-medium tracking-wide">
                    {weddingData.coupleInitials}
                  </span>
                  <span className="font-serif italic text-xs text-[#7a6558] mt-2">
                    {weddingData.groom.fullName} &amp; {weddingData.bride.fullName}
                  </span>
                </div>
              )}

              {/* Subtle Warm Gradient Vignette on Bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a]/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </RoyalArchFrame>
        </motion.div>

        {/* Invitation Welcome Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isRevealed ? { opacity: 0.85 } : { opacity: 0 }}
          transition={transitionConfig(1.3)}
          className="font-serif italic text-xs sm:text-sm text-[#7a6558] max-w-md mx-auto mt-4 px-4 leading-relaxed"
        >
          {weddingData.invitationText}
        </motion.p>
      </div>

      {/* ══ 7. SCROLL INDICATOR (Subtle Animated Hint) ══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={transitionConfig(1.5)}
        className="relative z-10 flex flex-col items-center gap-1 mt-6 text-[#9a7b3a] select-none"
      >
        <span className="font-serif text-[9px] sm:text-[10px] tracking-[0.4em] uppercase opacity-75">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <ChevronDown className="w-4 h-4 text-[#8F3914] opacity-80" />
          <ChevronDown className="w-4 h-4 text-[#9a7b3a] -mt-2.5 opacity-40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
