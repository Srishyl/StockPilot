"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";
import { weddingData, StoryMilestone } from "@/lib/wedding-data";
import {
  MandalaOrnament,
  CornerOrnament,
  DividerFlourish,
} from "./DecorativeElements";
import { Heart, Sparkles, Compass } from "lucide-react";

interface MilestoneItemProps {
  milestone: StoryMilestone;
  index: number;
}

function MilestoneCard({ milestone, index }: MilestoneItemProps) {
  const isEven = index % 2 === 1;
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative flex flex-col ${
        isEven ? "lg:flex-row-reverse" : "lg:flex-row"
      } items-center justify-between gap-8 lg:gap-16 w-full`}
    >
      {/* ══ 1. IMAGE CONTAINER (Alternates left/right on desktop) ══ */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 50 : -50, scale: 0.95 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="w-full lg:w-1/2 flex justify-center"
      >
        <div className="group relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/3] sm:aspect-[16/11]">
          {/* Ambient Glow */}
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#fae09c]/20 via-[#c9a96e]/15 to-transparent blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none" />

          {/* Luxury Double Gold Border Box */}
          <div className="relative w-full h-full p-2.5 sm:p-3 rounded-2xl bg-gradient-to-b from-[#fdf8ee] via-[#fffdfa] to-[#f6eee4] border border-[#c9a96e]/45 shadow-[0_15px_35px_-10px_rgba(143,57,20,0.12)]">
            
            {/* Inner Dashed Border */}
            <div className="absolute inset-2 rounded-xl border border-dashed border-[#9a7b3a]/30 pointer-events-none" />

            {/* Corner Ornaments */}
            <div className="absolute -top-1 -left-1 opacity-70">
              <CornerOrnament position="top-left" size={24} />
            </div>
            <div className="absolute -bottom-1 -right-1 opacity-70">
              <CornerOrnament position="bottom-right" size={24} />
            </div>

            {/* Image Inner with Parallax Zoom */}
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#24130b]">
              {!imageError ? (
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={milestone.image}
                    alt={milestone.title}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 420px"
                    className="object-cover object-center filter saturate-[1.05] contrast-[1.02] transition-transform duration-700"
                    onError={() => setImageError(true)}
                  />
                  {/* Subtle Cinematic Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
                </motion.div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#2e180d] to-[#1a0f0a] text-[#fdf5ec]">
                  <MandalaOrnament size={120} color="#fae09c" className="opacity-30 mb-2" />
                  <span className="font-serif text-lg tracking-widest text-[#fae09c]">
                    {milestone.title}
                  </span>
                </div>
              )}

              {/* Year Tag Badge Floating On Image */}
              <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-[#1a0f0a]/75 backdrop-blur-md border border-[#c9a96e]/60 text-[#fae09c] text-[10px] sm:text-xs font-serif tracking-widest uppercase">
                {milestone.year}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ══ 2. CENTRAL NODE ON DESKTOP ══ */}
      <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-gradient-to-br from-[#fdf8ee] via-[#fff] to-[#f4e8d8] border-2 border-[#c9a96e] items-center justify-center shadow-lg z-20">
        <span className="font-serif text-xs font-bold text-[#8F3914]">
          0{index + 1}
        </span>
      </div>

      {/* ══ 3. EDITORIAL TEXT CONTENT ══ */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className={`w-full lg:w-1/2 flex flex-col ${
          isEven ? "lg:items-end lg:text-right" : "lg:items-start lg:text-left"
        } text-center px-2 sm:px-4`}
      >
        {/* Chapter Tag */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-serif text-[11px] tracking-[0.35em] uppercase text-[#8F3914] font-semibold">
            {milestone.tag}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e]" />
          <span className="font-serif text-xs tracking-wider text-[#9a7b3a] font-medium">
            {milestone.year}
          </span>
        </div>

        {/* Milestone Title */}
        <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#2d160c] font-medium tracking-wide">
          {milestone.title}
        </h3>

        {/* Subtitle */}
        <p className="font-serif italic text-sm sm:text-base text-[#9a7b3a] mt-1 font-normal">
          {milestone.subtitle}
        </p>

        {/* Description */}
        <p className="font-serif text-sm sm:text-base text-[#5a4437] leading-relaxed max-w-md mt-3 opacity-95">
          {milestone.description}
        </p>

        {/* Romantic Quote */}
        {milestone.quote && (
          <div className="mt-4 pt-3 border-t border-[#c9a96e]/20 max-w-sm">
            <p className="font-serif italic text-xs sm:text-sm text-[#8F3914] leading-normal">
              {milestone.quote}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export function Story() {
  const milestones = weddingData.storyMilestones;
  const sectionRef = useRef<HTMLElement>(null);

  // Progressive scroll-linked line animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 70%", "end 80%"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <section
      ref={sectionRef}
      id="story-section"
      className="relative w-full py-24 sm:py-36 px-4 sm:px-8 md:px-12 bg-gradient-to-b from-[#EEDCD5] via-[#FAF0EC] to-[#F4E3DD] overflow-hidden"
    >
      {/* Decorative Floating Watermark Mandalas */}
      <div className="absolute -left-36 top-1/3 opacity-15 pointer-events-none select-none">
        <MandalaOrnament size={400} color="#9a7b3a" />
      </div>
      <div className="absolute -right-36 bottom-1/3 opacity-15 pointer-events-none select-none">
        <MandalaOrnament size={400} color="#9a7b3a" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ══ SECTION HEADER ══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-16 sm:mb-24"
        >
          <div className="flex items-center gap-2 mb-2 text-[#8F3914]">
            <Compass className="w-4 h-4" />
            <span className="font-serif text-xs tracking-[0.45em] uppercase font-semibold">
              The Journey of Us
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#2d160c] font-normal tracking-wide mt-2">
            Our Love Story
          </h2>

          <p className="font-serif italic text-sm sm:text-base text-[#7a6558] max-w-lg mt-3">
            Every love story is beautiful, but ours is our favourite timeless fairytale.
          </p>

          <DividerFlourish className="max-w-[240px] my-5" />
        </motion.div>

        {/* ══ TIMELINE WRAPPER ══ */}
        <div className="relative">
          {/* Central Animated Timeline Line on Desktop */}
          <div className="hidden lg:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-[1px] bg-[#c9a96e]/25">
            <motion.div
              style={{ scaleY, originY: 0 }}
              className="w-full h-full bg-gradient-to-b from-[#8F3914] via-[#c9a96e] to-[#8F3914]"
            />
          </div>

          {/* Milestones List */}
          <div className="space-y-16 sm:space-y-24 lg:space-y-32">
            {milestones.map((milestone, index) => (
              <MilestoneCard key={milestone.id} milestone={milestone} index={index} />
            ))}
          </div>
        </div>

        {/* ══ TIMELINE FOOTER FLOURISH ══ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center justify-center mt-20 sm:mt-28 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-[#FAF0EC] border border-[#c9a96e] flex items-center justify-center shadow-md text-[#8F3914] mb-3">
            <Heart className="w-5 h-5 fill-[#8F3914]" />
          </div>
          <p className="font-serif italic text-sm sm:text-base text-[#8F3914] tracking-widest uppercase">
            ... And our forever begins now
          </p>
        </motion.div>
      </div>
    </section>
  );
}
