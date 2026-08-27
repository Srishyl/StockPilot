"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { AnimatePresence } from "framer-motion";
import { weddingData } from "@/lib/wedding-data";
import { Sparkles } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

const emptySubscribe = () => () => {};

function calculateTimeLeft(): TimeLeft {
  try {
    const targetTime = new Date(weddingData.weddingDate.isoDate).getTime();
    if (isNaN(targetTime)) return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: false };
    const now = new Date().getTime();
    const diff = targetTime - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      isComplete: false,
    };
  } catch {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: false };
  }
}

/** Individual countdown box — IntersectionObserver-triggered slide-up */
function CountdownBox({
  label,
  value,
  index,
  isMounted,
}: {
  label: string;
  value: number;
  index: number;
  isMounted: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  const [flipping, setFlipping] = useState(false);

  // IntersectionObserver — fires once
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 80);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  // Number flip animation trigger
  useEffect(() => {
    if (value !== prevValue) {
      setFlipping(true);
      const t = setTimeout(() => {
        setPrevValue(value);
        setFlipping(false);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [value, prevValue]);

  const displayValue = isMounted ? String(value).padStart(2, "0") : "--";

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.4s ease ${index * 80}ms, transform 0.4s ease ${index * 80}ms`,
      }}
    >
      {/* White card with soft shadow */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 20px -4px rgba(90,40,15,0.10), 0 1px 4px rgba(90,40,15,0.06)",
          padding: "20px 12px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          minWidth: 72,
          border: "1px solid rgba(201,162,75,0.2)",
        }}
      >
        {/* Gold top accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "16px 16px 0 0", background: "linear-gradient(90deg, transparent, #C9A24B, transparent)", opacity: 0.8 }} />

        {/* Numeral */}
        <div style={{ overflow: "hidden", height: 52, display: "flex", alignItems: "center", position: "relative" }}>
          <span
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "clamp(2rem, 8vw, 2.8rem)",
              fontWeight: 400,
              color: "#B5502F",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              display: "block",
              transform: flipping ? "translateY(-100%)" : "translateY(0)",
              opacity: flipping ? 0 : 1,
              transition: "transform 0.18s ease-in, opacity 0.18s ease-in",
            }}
          >
            {displayValue}
          </span>
        </div>

        {/* Label */}
        <span
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: 9,
            letterSpacing: "0.3em",
            color: "#9a6b4b",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export function Countdown() {
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: "Days",    value: timeLeft.days },
    { label: "Hours",   value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section
      id="countdown-section"
      style={{
        position: "relative",
        width: "100%",
        background: "linear-gradient(180deg, #EEDCD5 0%, #FAF0EC 40%, #F4E3DD 100%)",
        overflow: "hidden",
        padding: "64px 16px 72px",
        textAlign: "center",
      }}
    >
      {/* Soft peach ambient glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 260, background: "radial-gradient(ellipse, rgba(201,162,75,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 520, margin: "0 auto" }}>

        {/* Section label */}
        <p
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: "clamp(9px, 2vw, 11px)",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "#B5502F",
            fontWeight: 600,
            margin: "0 0 10px",
          }}
        >
          — Counting Down to the Big Day —
        </p>

        {/* Heading */}
        <h2
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(1.6rem, 6vw, 2.4rem)",
            fontWeight: 400,
            color: "#3a1d10",
            letterSpacing: "0.06em",
            margin: "0 0 6px",
          }}
        >
          Save the Auspicious Date
        </h2>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, margin: "12px auto 32px", maxWidth: 200 }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #C9A24B)" }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#B5502F" }} />
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #C9A24B, transparent)" }} />
        </div>

        {/* Countdown display */}
        {isMounted && timeLeft.isComplete ? (
          <div
            style={{
              padding: "32px 24px",
              borderRadius: 20,
              background: "linear-gradient(135deg, #B5502F, #8a3518)",
              color: "#FBF3E9",
              boxShadow: "0 8px 32px rgba(90,24,8,0.25)",
            }}
          >
            <Sparkles style={{ margin: "0 auto 12px", display: "block", color: "#C9A24B", width: 28, height: 28 }} />
            <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "2rem", letterSpacing: "0.1em", color: "#fae09c", margin: 0 }}>
              The Day Has Arrived!
            </h3>
            <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", opacity: 0.9, marginTop: 8 }}>
              Celebrating love, union &amp; togetherness today.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "clamp(10px, 3vw, 20px)",
              maxWidth: 440,
              margin: "0 auto",
            }}
            className="countdown-grid"
          >
            {timeUnits.map((unit, i) => (
              <div key={unit.label} style={{ position: "relative" }}>
                <CountdownBox
                  label={unit.label}
                  value={unit.value}
                  index={i}
                  isMounted={isMounted}
                />
              </div>
            ))}
          </div>
        )}

        {/* Date footnote */}
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "0.8rem",
            color: "#9a6b4b",
            marginTop: 28,
            opacity: 0.85,
          }}
        >
          {weddingData.weddingDate.formatted} · {weddingData.weddingDate.time}
        </p>
      </div>

      {/* Mobile 2×2 grid style override */}
      <style>{`
        @media (max-width: 400px) {
          .countdown-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
