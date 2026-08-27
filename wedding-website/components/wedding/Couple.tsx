"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { weddingData } from "@/lib/wedding-data";
import {
  MandalaOrnament,
  CornerOrnament,
  DividerFlourish,
} from "./DecorativeElements";
import { Sparkles, Heart } from "lucide-react";

interface PersonCardProps {
  person: typeof weddingData.bride;
  index: number;
  label: string;
  relationLabel: string;
}

function PersonEditorialCard({ person, index, label, relationLabel }: PersonCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 flex flex-col items-center text-center max-w-md w-full"
    >
      {/* ══ ROLE TAG / EYEBROW ══ */}
      <div className="flex items-center gap-2 mb-4">
        <span className="h-[1px] w-6 bg-[#9a7b3a]/60" />
        <span className="font-serif text-[11px] sm:text-xs tracking-[0.4em] uppercase text-[#8F3914] font-semibold">
          {label}
        </span>
        <span className="h-[1px] w-6 bg-[#9a7b3a]/60" />
      </div>

      {/* ══ EDITORIAL ARCH PORTRAIT CONTAINER ══ */}
      <div className="group relative w-full aspect-[3/4] max-w-[340px] sm:max-w-[380px] my-2">
        {/* Background Ambient Glow */}
        <div className="absolute -inset-2 rounded-t-[180px] rounded-b-3xl bg-gradient-to-b from-[#c9a96e]/20 via-[#fae09c]/10 to-transparent blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Outer Fine Double Border Frame */}
        <div className="absolute inset-0 rounded-t-[170px] rounded-b-2xl border border-[#c9a96e]/40 p-2.5 sm:p-3 bg-gradient-to-b from-[#fdf8ee] via-[#fffdfa] to-[#f6eee4] shadow-[0_15px_35px_-10px_rgba(143,57,20,0.12)]">
          
          {/* Inner Golden Dashed Border */}
          <div className="absolute inset-2 sm:inset-2.5 rounded-t-[160px] rounded-b-xl border border-dashed border-[#9a7b3a]/30 pointer-events-none" />

          {/* Top Royal Crest Accent */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
            <div className="w-6 h-6 rounded-full bg-[#fdf5ec] border border-[#c9a96e] flex items-center justify-center shadow-md">
              <Sparkles className="w-3 h-3 text-[#8F3914]" />
            </div>
          </div>

          {/* Corner Flourishes */}
          <div className="absolute -bottom-1 -left-1 opacity-70">
            <CornerOrnament position="bottom-left" size={28} />
          </div>
          <div className="absolute -bottom-1 -right-1 opacity-70">
            <CornerOrnament position="bottom-right" size={28} />
          </div>

          {/* Image Wrapper with Arch Mask & Parallax/Hover Scale */}
          <div className="relative w-full h-full rounded-t-[152px] rounded-b-lg overflow-hidden bg-[#24130b]">
            {!imageError ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full h-full"
              >
                <Image
                  src={person.photo}
                  alt={person.fullName}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 380px"
                  className="object-cover object-center filter saturate-[1.05] contrast-[1.02] transition-transform duration-700"
                  onError={() => setImageError(true)}
                  priority
                />
                {/* Subtle Luxury Gradient Overlay at Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a]/50 via-transparent to-black/10 pointer-events-none" />
              </motion.div>
            ) : (
              /* Luxury Illustrated Placeholder if image fails to load */
              <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#3a1d10] to-[#1a0f0a] text-[#fdf5ec]">
                <MandalaOrnament size={160} color="#fae09c" className="opacity-30 mb-3" />
                <span className="font-serif text-2xl tracking-widest text-[#fae09c] font-light">
                  {person.firstName}
                </span>
                <span className="text-xs uppercase tracking-widest text-[#c9a96e] mt-1">
                  {label}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ BRIDE / GROOM EDITORIAL TYPOGRAPHY ══ */}
      <div className="mt-6 sm:mt-8 space-y-2">
        {/* Large Luxury Serif Name */}
        <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2d160c] font-medium tracking-wide leading-tight">
          {person.fullName}
        </h3>

        {/* Relation Eyebrow ("Daughter of" / "Son of") */}
        <p className="font-serif italic text-xs sm:text-sm text-[#8F3914] tracking-widest uppercase font-medium">
          {relationLabel}
        </p>

        {/* Parents' Names */}
        <p className="font-serif text-base sm:text-lg text-[#5a4437] font-normal leading-relaxed max-w-xs sm:max-w-sm mx-auto">
          {person.parents}
        </p>

        {/* Residence / Hometown */}
        <p className="text-[11px] sm:text-xs tracking-[0.25em] text-[#9a7b3a] uppercase font-serif mt-1 font-semibold">
          {person.residence}
        </p>

        {/* Short Poetic Bio / Vignette */}
        {person.bio && (
          <p className="font-serif italic text-xs sm:text-sm text-[#7a6558] max-w-xs mx-auto pt-2 leading-relaxed opacity-90">
            {person.bio}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function Couple() {
  const { bride, groom } = weddingData.couple;

  return (
    <section
      id="couple-section"
      className="relative w-full py-24 sm:py-36 px-4 sm:px-8 md:px-12 bg-gradient-to-b from-[#EEDCD5] via-[#FAF0EC] to-[#F4E3DD] overflow-hidden"
    >
      {/* Subtle Background Decorative Mandala Watermarks */}
      <div className="absolute -left-32 top-20 opacity-15 pointer-events-none select-none">
        <MandalaOrnament size={380} color="#9a7b3a" />
      </div>
      <div className="absolute -right-32 bottom-20 opacity-15 pointer-events-none select-none">
        <MandalaOrnament size={380} color="#9a7b3a" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ══ SECTION HEADER ══ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-16 sm:mb-24"
        >
          <div className="flex items-center gap-2 mb-2 text-[#8F3914]">
            <Heart className="w-4 h-4 fill-[#8F3914]/20 text-[#8F3914]" />
            <span className="font-serif text-xs tracking-[0.45em] uppercase font-semibold">
              The Blessed Couple
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#2d160c] font-normal tracking-wide mt-2">
            Bride & Groom
          </h2>

          <p className="font-serif italic text-sm sm:text-base text-[#7a6558] max-w-lg mt-3">
            Two souls united by destiny, blessed with love, embarking on a sacred lifetime journey.
          </p>

          <DividerFlourish className="max-w-[240px] my-5" />
        </motion.div>

        {/* ══ EDITORIAL BRIDE & GROOM SPLIT VIEW ══ */}
        <div className="relative flex flex-col md:flex-row items-center md:items-start justify-center gap-14 sm:gap-16 lg:gap-24">
          
          {/* BRIDE */}
          <PersonEditorialCard
            person={bride}
            index={0}
            label="THE BRIDE"
            relationLabel={bride.relationText || "Daughter of"}
          />

          {/* CENTRAL ORNAMENTAL INTERLOCKING INITIALS ON DESKTOP */}
          <div className="hidden md:flex flex-col items-center justify-center self-center py-6">
            <div className="h-24 w-[1px] bg-gradient-to-b from-transparent via-[#c9a96e] to-[#c9a96e]/20" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="my-4 w-14 h-14 rounded-full border border-[#c9a96e] bg-[#FAF0EC] shadow-md flex items-center justify-center text-[#8F3914]"
            >
              <span className="font-serif text-lg font-bold italic tracking-tighter">
                &
              </span>
            </motion.div>
            <div className="h-24 w-[1px] bg-gradient-to-t from-transparent via-[#c9a96e] to-[#c9a96e]/20" />
          </div>

          {/* GROOM */}
          <PersonEditorialCard
            person={groom}
            index={1}
            label="THE GROOM"
            relationLabel={groom.relationText || "Son of"}
          />
        </div>
      </div>
    </section>
  );
}
