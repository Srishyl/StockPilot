"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Share2, Volume2, VolumeX } from "lucide-react";
import { weddingData } from "@/lib/wedding-data";

interface OpeningScreenProps {
  onOpenComplete: () => void;
}

type ScreenStage = 0 | 1 | 2;

export function OpeningScreen({ onOpenComplete }: OpeningScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const [stage, setStage] = useState<ScreenStage>(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isTransitioningRef = useRef(false);

  // Initialize and preload video and background
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const bgImg = new window.Image();
    bgImg.src = "/images/scroll/opening_screen_bg.png";

    const video = videoRef.current;
    if (video) {
      video.currentTime = 0.01;
      video.pause();

      const handleCanPlay = () => setIsVideoReady(true);
      video.addEventListener("canplaythrough", handleCanPlay);

      return () => {
        video.removeEventListener("canplaythrough", handleCanPlay);
        document.body.style.overflow = "";
      };
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Monitor video playback to sync text display after roll opens
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (stage === 1 && !showContent) {
        if (video.duration && (video.currentTime >= video.duration * 0.75 || video.ended)) {
          setShowContent(true);
        }
      }
    };

    const handleEnded = () => {
      if (stage === 1) {
        setShowContent(true);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [stage, showContent]);

  // Main tap handler matching onclick="tap()"
  const tap = useCallback(() => {
    const video = videoRef.current;

    if (stage === 0) {
      setStage(1);
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {
          setShowContent(true);
        });
      }

      const fallbackDelay = (video && video.duration && !isNaN(video.duration))
        ? Math.min(video.duration * 800, 3000)
        : 1800;

      setTimeout(() => {
        setShowContent(true);
      }, fallbackDelay);
    } else if (stage === 1) {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      setStage(2);

      const exitDuration = prefersReducedMotion ? 400 : 850;
      setTimeout(() => {
        document.body.style.overflow = "";
        onOpenComplete();
      }, exitDuration);
    }
  }, [stage, prefersReducedMotion, onOpenComplete]);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `${weddingData.groom.firstName} & ${weddingData.bride.firstName} Wedding Invitation`,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  const isExiting = stage === 2;

  return (
    <div
      id="opening"
      onClick={tap}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          tap();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={
        stage === 0
          ? "Tap to open wedding invitation scroll"
          : "Tap again to open your full invitation"
      }
      className={`vready fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none transition-all duration-700 ${
        isExiting ? "opacity-0 scale-105 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundColor: "#F4E3DD",
        backgroundImage: `url('/images/scroll/opening_screen_bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* ── Top-right Share Button ── */}
      <button
        type="button"
        onClick={handleShare}
        title="Share Invitation"
        className="absolute top-5 right-5 z-30 p-2.5 rounded-full text-[#8a5d3b]/70 hover:text-[#8a5d3b] hover:bg-[#FAF0EC]/60 transition-colors"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {/* ═══════════════════════════════════════════════
          VIDEO CONTAINER & PARCHMENT TEXT OVERLAY
      ═══════════════════════════════════════════════ */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-[360px] sm:max-w-[420px] md:max-w-[460px] aspect-[576/1024] max-h-[86vh]">
        
        {/* ── <video id="prv"> Paper Roll Video Element with Multiply Blend Mode ── */}
        <video
          id="prv"
          ref={videoRef}
          playsInline
          preload="auto"
          muted
          className={`rdy absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${
            isVideoReady ? "opacity-100" : "opacity-95"
          }`}
          style={{
            mixBlendMode: "multiply", // Seamlessly blends video onto the watercolor paper texture
          }}
        >
          <source src="/video/bg.mp4" type="video/mp4" />
        </video>

        {/* ── Paper content (#pcnt) - Fitted cleanly inside the unrolled paper bounds & synced with roll ── */}
        <div
          id="pcnt"
          className={`absolute top-[22%] bottom-[22%] left-[18%] right-[18%] flex flex-col items-center justify-center text-center z-20 transition-all duration-700 ${
            showContent ? "vis opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
          style={{
            clipPath: showContent ? "inset(0% 0px)" : "inset(50% 0px)",
            transition: "clip-path 0.75s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.55s ease, transform 0.6s ease",
          }}
        >
          {/* .pe#pc-eyebrow */}
          <div
            className="pe flex flex-col items-center gap-0.5 mb-1 sm:mb-2 font-serif text-[9px] sm:text-[10.5px] tracking-[0.36em] uppercase font-semibold"
            id="pc-eyebrow"
            style={{ color: "#9E4826" }}
          >
            <span>WEDDING</span>
            <span>INVITATION</span>
          </div>

          {/* .pdiv#pc-div1 */}
          <div
            className="pdiv flex items-center justify-center gap-2 w-full max-w-[150px] sm:max-w-[190px] my-1 opacity-70"
            id="pc-div1"
          >
            <span
              className="flex-1 h-[1px]"
              style={{ background: "linear-gradient(90deg, transparent, #B57E44)" }}
            />
            <i
              className="w-1.5 h-1.5 rounded-full not-italic inline-block"
              style={{
                background: "#B57E44",
                boxShadow: "0 0 3px rgba(181, 126, 68, 0.5)",
              }}
            />
            <span
              className="flex-1 h-[1px]"
              style={{ background: "linear-gradient(90deg, #B57E44, transparent)" }}
            />
          </div>

          {/* .pn#pc-bride-groom */}
          <div
            className="pn flex flex-col items-center my-1 sm:my-2"
            id="pc-bride-groom"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "2px 0 4px",
            }}
          >
            <span
              className="p-groom font-serif text-[26px] sm:text-[34px] md:text-[38px] font-normal leading-tight tracking-wide"
              style={{
                color: "#9E4826",
                fontFamily: "var(--font-cormorant), var(--font-italiana), var(--font-playfair), Georgia, serif",
              }}
            >
              {weddingData.groom.firstName || "Groom"}
            </span>
            <span
              className="p-amp font-serif text-base sm:text-xl italic -my-0.5"
              style={{
                color: "#B25E35",
                fontFamily: "var(--font-cormorant), Georgia, serif",
              }}
            >
              &
            </span>
            <span
              className="p-bride font-serif text-[26px] sm:text-[34px] md:text-[38px] font-normal leading-tight tracking-wide"
              style={{
                color: "#9E4826",
                fontFamily: "var(--font-cormorant), var(--font-italiana), var(--font-playfair), Georgia, serif",
              }}
            >
              {weddingData.bride.firstName || "Bride"}
            </span>
          </div>

          {/* .pdiv#pc-div2 */}
          <div
            className="pdiv flex items-center justify-center gap-2 w-full max-w-[150px] sm:max-w-[190px] my-1 opacity-70"
            id="pc-div2"
          >
            <span
              className="flex-1 h-[1px]"
              style={{ background: "linear-gradient(90deg, transparent, #B57E44)" }}
            />
            <i
              className="w-1.5 h-1.5 rounded-full not-italic inline-block"
              style={{
                background: "#B57E44",
                boxShadow: "0 0 3px rgba(181, 126, 68, 0.5)",
              }}
            />
            <span
              className="flex-1 h-[1px]"
              style={{ background: "linear-gradient(90deg, #B57E44, transparent)" }}
            />
          </div>

          {/* .pd#pc-date */}
          <div
            className="pd font-serif text-[11px] sm:text-xs tracking-[0.32em] font-medium uppercase mt-1.5 mb-1"
            id="pc-date"
            style={{ color: "#9E4826" }}
          >
            {weddingData.weddingDate.day || "DD"} &nbsp;·&nbsp; {weddingData.weddingDate.month.slice(0, 3) || "MM"} &nbsp;·&nbsp; {weddingData.weddingDate.year || "YYYY"}
          </div>

          {/* .pv#pc-venue */}
          <div
            className="pv font-serif text-[11px] sm:text-xs italic tracking-wide"
            id="pc-venue"
            style={{
              color: "#835C40",
              fontFamily: "var(--font-cormorant), Georgia, serif",
            }}
          >
            {weddingData.venue.name}, {weddingData.venue.city}
          </div>
        </div>
      </div>

      {/* ── Bottom-right Audio Toggle Button ── */}
      <button
        type="button"
        onClick={toggleAudio}
        title={isMuted ? "Unmute Music" : "Mute Music"}
        className="absolute bottom-6 right-6 z-30 w-9 h-9 rounded-full bg-[#FAF0EC]/90 backdrop-blur-sm shadow-sm border border-[#E6D3CB] flex items-center justify-center text-[#8a5d3b] hover:bg-[#F4E3DD] transition-colors"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* ═══════════════════════════════════════════════
          STATE 0 & STATE 2 BOTTOM PROMPTS
      ═══════════════════════════════════════════════ */}
      <div
        className="absolute bottom-8 sm:bottom-10 inset-x-0 flex flex-col items-center justify-center px-4 pointer-events-none"
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          {stage === 0 ? (
            /* State 0: Tap to Open (#stt0) */
            <motion.div
              id="stt0"
              key="stt0"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-1.5 pointer-events-auto"
            >
              <motion.p
                animate={{ opacity: [0.75, 1, 0.75], scale: [0.99, 1.01, 0.99] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="tlbl font-serif text-[11px] sm:text-xs tracking-[0.42em] uppercase font-semibold text-center"
                style={{ color: "#9E4826" }}
              >
                TAP TO OPEN
              </motion.p>
            </motion.div>
          ) : (
            /* State 2: Tap Again to Open (#stt2) */
            <motion.div
              id="stt2"
              key="stt2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 8 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="vis flex items-center justify-center gap-2 sm:gap-3 text-center pointer-events-auto"
            >
              {/* Left animated arrow */}
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className="text-xs sm:text-sm font-serif"
                style={{ color: "#9E4826" }}
              >
                ↑
              </motion.span>

              <span
                className="font-serif text-[10px] sm:text-[11px] tracking-[0.22em] sm:tracking-[0.26em] uppercase font-semibold text-center"
                style={{ color: "#9E4826" }}
              >
                TAP AGAIN TO OPEN YOUR INVITATION
              </span>

              {/* Right animated arrow */}
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className="text-xs sm:text-sm font-serif"
                style={{ color: "#9E4826" }}
              >
                ↑
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative progress / bottom element (#vpb) */}
      <div id="vpb" style={{ width: "100%" }} />
    </div>
  );
}
