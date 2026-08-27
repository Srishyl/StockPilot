"use client";

import React from "react";
import { motion } from "framer-motion";
import { weddingData } from "@/lib/wedding-data";
import { EventCard } from "./EventCard";
import { MandalaOrnament, DividerFlourish } from "./DecorativeElements";
import { CalendarHeart } from "lucide-react";

export function Events() {
  const events = weddingData.events;

  return (
    <section
      id="events-section"
      className="relative w-full py-20 sm:py-32 px-4 sm:px-8 md:px-12 bg-gradient-to-b from-[#F4E3DD] via-[#FAF0EC] to-[#EEDCD5] overflow-hidden"
    >
      {/* Background Decorative Floral/Mandala Accents */}
      <div className="absolute -left-28 top-1/4 opacity-15 pointer-events-none select-none">
        <MandalaOrnament size={360} color="#9a7b3a" />
      </div>
      <div className="absolute -right-28 bottom-1/4 opacity-15 pointer-events-none select-none">
        <MandalaOrnament size={360} color="#9a7b3a" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-16 sm:mb-24"
        >
          <div className="flex items-center gap-2 mb-2 text-[#8F3914]">
            <CalendarHeart className="w-4 h-4" />
            <span className="font-serif text-xs tracking-[0.4em] uppercase font-semibold">
              The Auspicious Occasions
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#2d160c] font-normal tracking-wide mt-2">
            Wedding Celebrations
          </h2>

          <p className="font-serif italic text-sm sm:text-base text-[#7a6558] max-w-lg mt-3">
            Join us in the rituals, melodies, and joyous festivities across the three magical days.
          </p>

          <DividerFlourish className="max-w-[260px] my-5" />
        </motion.div>

        {/* ══ EVENTS TIMELINE / EDITORIAL ALTERNATING LAYOUT ══ */}
        <div className="relative">
          {/* Central Vertical Timeline Gold Line (Visible on Desktop lg screen) */}
          <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#c9a96e]/60 to-transparent pointer-events-none" />

          {/* Events List */}
          <div className="space-y-12 sm:space-y-16 lg:space-y-24">
            {events.map((event, index) => {
              const isEven = index % 2 === 1;

              return (
                <div
                  key={event.id}
                  className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Left / Right Card Slot */}
                  <div className="w-full lg:w-[calc(50%-40px)]">
                    <EventCard event={event} index={index} isEven={isEven} />
                  </div>

                  {/* Central Node Badge on Desktop Timeline */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-[#fdf8ee] via-[#fff] to-[#f4e8d8] border-2 border-[#c9a96e] items-center justify-center shadow-lg z-20 group">
                    <span className="font-serif text-sm font-bold text-[#8F3914]">
                      {index + 1}
                    </span>
                  </div>

                  {/* Empty Spacer Column for Desktop alternating balance */}
                  <div className="hidden lg:block w-[calc(50%-40px)]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
