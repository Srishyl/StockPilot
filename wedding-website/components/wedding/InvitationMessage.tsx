"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { weddingData } from "@/lib/wedding-data";
import { MandalaOrnament, CornerOrnament, DividerFlourish } from "./DecorativeElements";

export function InvitationMessage() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.0,
        ease: [0.22, 1, 0.36, 1] as const,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section className="relative w-full py-20 sm:py-28 px-4 sm:px-8 bg-gradient-to-b from-[#EEDCD5] via-[#F4E3DD] to-[#EEDCD5] overflow-hidden">
      {/* Background Decorative Ambient Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20 select-none">
        <MandalaOrnament size={500} color="#c9a96e" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="relative z-10 max-w-3xl mx-auto"
      >
        {/* Luxury Printed Card Container */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#FAF0EC] via-[#FBF3EF] to-[#F4E3DD] border-2 border-[#c9a96e]/35 shadow-[0_15px_50px_-10px_rgba(143,57,20,0.12)] p-8 sm:p-14 md:p-20 text-center overflow-hidden">
          {/* Double Gold Inset Border */}
          <div className="absolute inset-3 sm:inset-4 rounded-2xl border border-[#9a7b3a]/25 pointer-events-none" />
          <div className="absolute inset-5 sm:inset-6 rounded-xl border border-dashed border-[#c9a96e]/20 pointer-events-none" />

          {/* Corner Ornaments */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <CornerOrnament position="top-left" size={42} />
          </div>
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <CornerOrnament position="top-right" size={42} />
          </div>
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
            <CornerOrnament position="bottom-left" size={42} />
          </div>
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
            <CornerOrnament position="bottom-right" size={42} />
          </div>

          {/* Top Auspicious Sanskrit Blessing */}
          <motion.div variants={itemVariants} className="flex flex-col items-center mb-6">
            <span className="font-serif text-xs sm:text-sm tracking-[0.3em] text-[#8F3914] font-semibold uppercase">
              {weddingData.blessingTagline}
            </span>
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#c9a96e] to-transparent mt-2" />
          </motion.div>

          {/* Subtitle Invitation Line */}
          <motion.p
            variants={itemVariants}
            className="font-serif text-[11px] sm:text-xs md:text-sm tracking-[0.32em] text-[#9a7b3a] font-semibold uppercase mb-3"
          >
            {weddingData.invitationHeading}
          </motion.p>

          <motion.h3
            variants={itemVariants}
            className="font-serif text-sm sm:text-base md:text-lg tracking-[0.24em] text-[#2d160c] uppercase mb-4"
          >
            {weddingData.invitationSubheading}
          </motion.h3>

          <DividerFlourish className="max-w-[220px] my-4 sm:my-6" />

          {/* Couple Names (Royal printed typography) */}
          <motion.div variants={itemVariants} className="my-6 sm:my-8">
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#8F3914] tracking-wide font-normal">
              {weddingData.bride.fullName}
            </h2>
            <div className="flex items-center justify-center my-2 sm:my-3 gap-3">
              <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a96e]" />
              <span className="font-serif italic text-2xl sm:text-3xl text-[#9a7b3a]">&amp;</span>
              <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a96e]" />
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#8F3914] tracking-wide font-normal">
              {weddingData.groom.fullName}
            </h2>
          </motion.div>

          <DividerFlourish className="max-w-[220px] my-4 sm:my-6" />

          {/* Families Blessing note */}
          <motion.div variants={itemVariants} className="mt-6 space-y-4 max-w-lg mx-auto">
            <p className="font-serif italic text-sm sm:text-base text-[#7a6558] leading-relaxed">
              {weddingData.invitationText}
            </p>

            <div className="pt-2 text-xs sm:text-sm tracking-[0.2em] font-serif uppercase text-[#2d160c]">
              <p className="font-semibold text-[#8F3914]">{weddingData.weddingDate.formatted}</p>
              <p className="text-[#7a6558] mt-1 italic capitalize text-xs">
                {weddingData.venue.name} &bull; {weddingData.venue.city}, {weddingData.venue.state}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
