"use client";

import React, { useState } from "react";
import { OpeningScreen } from "@/components/wedding/OpeningScreen";
import { Hero } from "@/components/wedding/Hero";
import { InvitationMessage } from "@/components/wedding/InvitationMessage";
import { Countdown } from "@/components/wedding/Countdown";
import { Couple } from "@/components/wedding/Couple";
import { Family } from "@/components/wedding/Family";
import { Story } from "@/components/wedding/Story";
import { Events } from "@/components/wedding/Events";
import { RotateCcw } from "lucide-react";

export default function WeddingPage() {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenComplete = () => {
    setIsOpened(true);
  };

  const handleReplayOpening = () => {
    setIsOpened(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen w-full bg-[#F4E3DD] text-[#1a0f0a] overflow-x-hidden selection:bg-[#9a7b3a]/20">
      {/* ══ FULLSCREEN CINEMATIC OPENING SCREEN ══ */}
      {!isOpened && (
        <OpeningScreen onOpenComplete={handleOpenComplete} />
      )}

      {/* ══ CINEMATIC HERO SECTION ══ */}
      <Hero isRevealed={isOpened} />

      {/* ══ INVITATION MESSAGE SECTION ══ */}
      <InvitationMessage />

      {/* ══ LIVE COUNTDOWN SECTION ══ */}
      <Countdown />

      {/* ══ BRIDE & GROOM EDITORIAL COUPLE SECTION ══ */}
      <Couple />

      {/* ══ THE FAMILIES SECTION ══ */}
      <Family />

      {/* ══ OUR LOVE STORY CINEMATIC TIMELINE SECTION ══ */}
      <Story />

      {/* ══ WEDDING CELEBRATIONS & EVENTS SECTION ══ */}
      <Events />

      {/* ══ REPLAY INVITATION EXPERIENCE FLOATING ACTION ══ */}
      {isOpened && (
        <button
          onClick={handleReplayOpening}
          title="Replay Opening Invitation"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FAF0EC]/90 backdrop-blur-md border border-[#c9a96e]/50 text-[#8F3914] shadow-lg text-[11px] font-serif uppercase tracking-widest hover:bg-[#8F3914] hover:text-[#FAF0EC] transition-all duration-300 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Replay</span>
        </button>
      )}
    </main>
  );
}

