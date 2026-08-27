"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { WeddingEvent } from "@/lib/wedding-data";
import { CornerOrnament } from "./DecorativeElements";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ExternalLink,
  Shirt,
  Flame,
  Music,
  HeartHandshake,
} from "lucide-react";

interface EventCardProps {
  event: WeddingEvent;
  index: number;
  isEven?: boolean;
}

export function EventCard({ event, index, isEven = false }: EventCardProps) {
  const prefersReducedMotion = useReducedMotion();

  // Pick appropriate thematic icon based on event type
  const renderIcon = () => {
    switch (event.iconType) {
      case "ring":
        return <Sparkles className="w-5 h-5 text-[#8F3914]" />;
      case "henna":
        return <HeartHandshake className="w-5 h-5 text-[#8F3914]" />;
      case "haldi":
        return <Flame className="w-5 h-5 text-[#8F3914]" />;
      case "wedding":
        return <Sparkles className="w-5 h-5 text-[#8F3914]" />;
      case "reception":
        return <Music className="w-5 h-5 text-[#8F3914]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#8F3914]" />;
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : isEven ? 40 : -40,
      y: prefersReducedMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.9,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="relative w-full group"
    >
      {/* Luxury Royal Card Body */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#FAF0EC] via-[#FBF3EF] to-[#F4E3DD] border border-[#c9a96e]/40 shadow-[0_10px_35px_-8px_rgba(143,57,20,0.09)] p-6 sm:p-8 md:p-10 transition-all duration-500 hover:shadow-[0_16px_45px_-8px_rgba(143,57,20,0.16)] hover:border-[#9a7b3a]/70 overflow-hidden">
        
        {/* Subtle Gold Ribbon Header Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#c9a96e]/20 via-[#8F3914] to-[#c9a96e]/20" />

        {/* Double Inset Frame */}
        <div className="absolute inset-2.5 sm:inset-3 rounded-xl sm:rounded-2xl border border-[#9a7b3a]/20 pointer-events-none" />

        {/* Corner Flourishes */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
          <CornerOrnament position="top-left" size={32} />
        </div>
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <CornerOrnament position="top-right" size={32} />
        </div>
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
          <CornerOrnament position="bottom-left" size={32} />
        </div>
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
          <CornerOrnament position="bottom-right" size={32} />
        </div>

        {/* Top Header Row: Event Number & Thematic Icon */}
        <div className="relative z-10 flex items-center justify-between border-b border-[#c9a96e]/25 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#FAF0EC] to-[#EEDCD5] border border-[#c9a96e]/60 flex items-center justify-center shadow-inner">
              {renderIcon()}
            </div>
            <div>
              <span className="font-serif text-[10px] sm:text-xs tracking-[0.25em] text-[#9a7b3a] font-semibold uppercase block">
                Occasion {String(index + 1).padStart(2, "0")}
              </span>
              {event.subtitle && (
                <span className="font-serif italic text-xs text-[#7a6558] block">
                  {event.subtitle}
                </span>
              )}
            </div>
          </div>

          <span className="font-serif text-2xl sm:text-3xl text-[#c9a96e]/50 font-bold select-none">
            0{index + 1}
          </span>
        </div>

        {/* Event Title */}
        <div className="relative z-10 mb-4">
          <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#8F3914] font-normal tracking-wide">
            {event.name}
          </h3>
        </div>

        {/* Event Timing & Venue Details Grid */}
        <div className="relative z-10 space-y-2.5 my-4 text-xs sm:text-sm text-[#2d160c]">
          {/* Date */}
          <div className="flex items-start gap-2.5">
            <div className="p-1 rounded bg-[#F4E3DD] text-[#8F3914] mt-0.5 border border-[#c9a96e]/30">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-serif font-semibold text-[#8F3914] tracking-wide block">
                {event.date}
              </span>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-2.5">
            <div className="p-1 rounded bg-[#F4E3DD] text-[#9a7b3a] mt-0.5 border border-[#c9a96e]/30">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="font-serif text-[#2d160c] font-medium tracking-wide">
              {event.time}
            </span>
          </div>

          {/* Venue & Address */}
          <div className="flex items-start gap-2.5">
            <div className="p-1 rounded bg-[#F4E3DD] text-[#8F3914] mt-0.5 border border-[#c9a96e]/30">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-serif font-semibold text-[#2d160c] block">
                {event.venue}
              </span>
              <span className="font-serif text-[11px] sm:text-xs text-[#7a6558] block mt-0.5">
                {event.address}
              </span>
            </div>
          </div>
        </div>

        {/* Event Description */}
        {event.description && (
          <p className="relative z-10 font-serif italic text-xs sm:text-sm text-[#7a6558] leading-relaxed my-4 pt-2 border-t border-[#c9a96e]/15">
            {event.description}
          </p>
        )}

        {/* Dress Code & Google Maps Actions */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#c9a96e]/25 mt-4">
          {/* Dress code badge */}
          {event.dressCode && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fdf8ee] border border-[#c9a96e]/40 text-[#8F3914] text-[11px] sm:text-xs font-serif">
              <Shirt className="w-3 h-3 text-[#9a7b3a]" />
              <span>
                <strong className="font-semibold text-[#9a7b3a] uppercase tracking-wider text-[9px] mr-1">Attire:</strong>
                {event.dressCode}
              </span>
            </div>
          )}

          {/* Map Link */}
          {event.mapUrl && (
            <a
              href={event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#8F3914] text-[#fdf5ec] text-[11px] sm:text-xs font-serif tracking-wider uppercase shadow-sm hover:bg-[#A8451A] transition-colors ml-auto group/btn cursor-pointer"
            >
              <span>Get Directions</span>
              <ExternalLink className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
