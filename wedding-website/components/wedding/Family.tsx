"use client";

import React from "react";
import { motion } from "framer-motion";
import { weddingData, FamilySide } from "@/lib/wedding-data";
import {
  MandalaOrnament,
  CornerOrnament,
  DividerFlourish,
} from "./DecorativeElements";
import { Flower2, Users, HeartHandshake } from "lucide-react";

/**
 * Botanical Leaf Swirl SVG Ornament
 */
function BotanicalBranchOrnament({ className = "", isMirrored = false }: { className?: string; isMirrored?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none pointer-events-none ${isMirrored ? "-scale-x-100" : ""} ${className}`}
      aria-hidden="true"
    >
      <path
        d="M5 35 C 35 30, 60 15, 115 5"
        stroke="#9a7b3a"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Leaf 1 */}
      <path
        d="M25 29 C 20 20, 32 18, 35 27 Z"
        fill="#c9a96e"
        fillOpacity="0.35"
        stroke="#9a7b3a"
        strokeWidth="0.8"
      />
      {/* Leaf 2 */}
      <path
        d="M50 21 C 52 10, 64 12, 60 20 Z"
        fill="#8F3914"
        fillOpacity="0.25"
        stroke="#9a7b3a"
        strokeWidth="0.8"
      />
      {/* Leaf 3 */}
      <path
        d="M75 14 C 70 5, 84 4, 85 12 Z"
        fill="#c9a96e"
        fillOpacity="0.35"
        stroke="#9a7b3a"
        strokeWidth="0.8"
      />
      {/* Leaf 4 */}
      <path
        d="M100 8 C 102 -1, 112 1, 108 7 Z"
        fill="#8F3914"
        fillOpacity="0.3"
        stroke="#9a7b3a"
        strokeWidth="0.8"
      />
      {/* Small Berry Accents */}
      <circle cx="38" cy="27" r="1.5" fill="#8F3914" />
      <circle cx="63" cy="20" r="1.5" fill="#8F3914" />
      <circle cx="88" cy="12" r="1.5" fill="#8F3914" />
    </svg>
  );
}

function FamilyColumn({ family, index }: { family: FamilySide; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 w-full max-w-lg"
    >
      <div className="relative p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-[#FAF0EC] via-[#FBF3EF] to-[#F4E3DD] border border-[#c9a96e]/40 shadow-[0_10px_30px_-8px_rgba(143,57,20,0.08)]">
        
        {/* Inner Delicate Thin Border */}
        <div className="absolute inset-2 sm:inset-3 rounded-xl border border-dashed border-[#9a7b3a]/25 pointer-events-none" />

        {/* Botanical Corner Accents */}
        <div className="absolute top-2 left-2 opacity-60">
          <CornerOrnament position="top-left" size={32} />
        </div>
        <div className="absolute top-2 right-2 opacity-60">
          <CornerOrnament position="top-right" size={32} />
        </div>
        <div className="absolute bottom-2 left-2 opacity-60">
          <CornerOrnament position="bottom-left" size={32} />
        </div>
        <div className="absolute bottom-2 right-2 opacity-60">
          <CornerOrnament position="bottom-right" size={32} />
        </div>

        {/* ══ HEADER ══ */}
        <div className="relative z-10 flex flex-col items-center text-center pb-6 border-b border-[#c9a96e]/25">
          <div className="w-10 h-10 rounded-full bg-[#F4E3DD] border border-[#c9a96e]/60 flex items-center justify-center mb-3 shadow-sm text-[#8F3914]">
            <Flower2 className="w-5 h-5" />
          </div>

          <span className="font-serif text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#9a7b3a] font-semibold">
            {family.subtitle}
          </span>

          <h3 className="font-serif text-2xl sm:text-3xl text-[#2d160c] font-medium tracking-wide mt-1">
            {family.title}
          </h3>

          <div className="flex items-center gap-3 w-full max-w-[200px] mt-2">
            <BotanicalBranchOrnament className="w-16 h-5" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#8F3914]" />
            <BotanicalBranchOrnament className="w-16 h-5" isMirrored />
          </div>
        </div>

        {/* ══ FAMILY MEMBERS CONTENT ══ */}
        <div className="relative z-10 pt-6 space-y-6">
          {/* Parents Highlight Block */}
          <div className="text-center p-4 rounded-xl bg-[#F4E3DD]/70 border border-[#c9a96e]/20">
            <span className="font-serif text-xs uppercase tracking-[0.3em] text-[#8F3914] font-semibold block mb-1">
              {family.parentsTitle}
            </span>
            <p className="font-serif text-lg sm:text-xl text-[#2d160c] font-medium">
              {family.parents}
            </p>
          </div>

          {/* Detailed Family Roles & Members */}
          <div className="space-y-4 pt-2">
            {family.familyMembers
              .filter((item) => item.relation !== "Parents")
              .map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 py-2 border-b border-[#c9a96e]/15 last:border-b-0 text-center sm:text-left"
                >
                  <span className="font-serif text-xs sm:text-sm tracking-wider uppercase text-[#9a7b3a] font-semibold sm:min-w-[130px]">
                    {item.relation}
                  </span>
                  <span className="font-serif text-sm sm:text-base text-[#4a3528] font-normal sm:text-right flex-1">
                    {item.names}
                  </span>
                </div>
              ))}
          </div>

          {/* Blessing Message */}
          {family.blessingQuote && (
            <div className="pt-4 text-center">
              <p className="font-serif italic text-xs sm:text-sm text-[#7a6558] leading-relaxed max-w-sm mx-auto">
                {family.blessingQuote}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Family() {
  const { bride: brideFamily, groom: groomFamily } = weddingData.family;

  return (
    <section
      id="family-section"
      className="relative w-full py-20 sm:py-32 px-4 sm:px-8 md:px-12 bg-gradient-to-b from-[#F4E3DD] via-[#FAF0EC] to-[#EEDCD5] overflow-hidden"
    >
      {/* Decorative Botanical & Mandala Ambient Accents */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-10 pointer-events-none select-none">
        <MandalaOrnament size={420} color="#9a7b3a" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ══ SECTION HEADER ══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-14 sm:mb-20"
        >
          <div className="flex items-center gap-2 mb-2 text-[#8F3914]">
            <HeartHandshake className="w-4 h-4" />
            <span className="font-serif text-xs tracking-[0.45em] uppercase font-semibold">
              The Pillar of Our Lives
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#2d160c] font-normal tracking-wide mt-2">
            The Families
          </h2>

          <p className="font-serif italic text-sm sm:text-base text-[#7a6558] max-w-lg mt-3">
            Bound by timeless traditions, unconditional warmth, and the shared joy of two families becoming one.
          </p>

          <DividerFlourish className="max-w-[240px] my-5" />
        </motion.div>

        {/* ══ TWO FAMILY COLUMNS: BRIDE'S FAMILY & GROOM'S FAMILY ══ */}
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-10 sm:gap-12 lg:gap-16">
          {/* BRIDE'S FAMILY */}
          <FamilyColumn family={brideFamily} index={0} />

          {/* GROOM'S FAMILY */}
          <FamilyColumn family={groomFamily} index={1} />
        </div>
      </div>
    </section>
  );
}
