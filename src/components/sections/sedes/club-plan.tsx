"use client";

import { motion } from "motion/react";
import {
  CLUB_OUTLINE,
  CLUB_PITCHES,
  CLUB_STREETS,
  CLUB_STREET_LABELS,
  CLUB_VIEWBOX,
  type PitchShape,
} from "@/lib/geo/club-oriente";
import type { Cancha } from "@/lib/site";

type Point = [number, number];

// Las canchas en OSM son cuadriláteros "Mx yLx y…Z".
function parsePoints(d: string): Point[] {
  return d
    .replace(/[MZ]/g, "")
    .split("L")
    .map((pair) => pair.trim().split(" ").map(Number) as Point);
}

const dist = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const mid = (a: Point, b: Point): Point => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

// Línea de medio campo (une los puntos medios de los lados largos) y radio del círculo central.
function pitchMarkings(p: PitchShape) {
  const pts = parsePoints(p.d);
  if (pts.length < 4) return null;
  const [a, b, c, d] = pts;
  const longFirst = dist(a, b) >= dist(b, c);
  const [m1, m2] = longFirst ? [mid(a, b), mid(c, d)] : [mid(b, c), mid(d, a)];
  const short = Math.min(dist(a, b), dist(b, c));
  return { m1, m2, radius: short * 0.16 };
}

// Posiciones pseudoaleatorias deterministas (sin hidratación inestable).
function seeded(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const PLAYERS = 10;
const ENTRY_EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  canchas: readonly Cancha[];
  activeId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  isShown: boolean;
};

export function ClubPlan({ canchas, activeId, onHover, onSelect, isShown }: Props) {
  const ownerOf = new Map<string, Cancha>();
  for (const cancha of canchas) {
    for (const pitchId of cancha.pitchIds) {
      if (!ownerOf.has(pitchId)) ownerOf.set(pitchId, cancha);
    }
  }
  const active = canchas.find((c) => c.id === activeId) ?? null;
  const activePitchIds = new Set(active?.pitchIds ?? []);
  const activePitches = CLUB_PITCHES.filter((p) => activePitchIds.has(p.id));
  const focus = activePitches.length
    ? {
        x: activePitches.reduce((s, p) => s + p.cx, 0) / activePitches.length,
        y: activePitches.reduce((s, p) => s + p.cy, 0) / activePitches.length,
      }
    : null;

  // Una etiqueta por grupo de canchas (16 y 17 comparten sector en el plano).
  const groups = new Map<string, { labels: string[]; pitches: PitchShape[]; approximate: boolean }>();
  for (const cancha of canchas) {
    const key = [...cancha.pitchIds].sort().join(",");
    const group = groups.get(key) ?? {
      labels: [],
      pitches: CLUB_PITCHES.filter((p) => cancha.pitchIds.includes(p.id)),
      approximate: Boolean(cancha.approximate),
    };
    group.labels.push(cancha.label.replace("Cancha ", ""));
    groups.set(key, group);
  }

  return (
    <svg
      viewBox={`0 0 ${CLUB_VIEWBOX.width} ${CLUB_VIEWBOX.height}`}
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Plano de Club Oriente con sus canchas; las canchas de Acción Fútbol están destacadas en naranjo"
    >
      <defs>
        <pattern id="grass" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(-3)">
          <rect width="22" height="22" fill="rgb(56 102 64 / .55)" />
          <rect width="11" height="22" fill="rgb(70 122 78 / .55)" />
        </pattern>
        <radialGradient id="flood-light">
          <stop offset="0%" stopColor="rgb(255 190 120 / .55)" />
          <stop offset="55%" stopColor="rgb(242 107 33 / .16)" />
          <stop offset="100%" stopColor="rgb(242 107 33 / 0)" />
        </radialGradient>
        <linearGradient id="scan" x1="0" x2="1">
          <stop offset="0%" stopColor="rgb(242 107 33 / 0)" />
          <stop offset="85%" stopColor="rgb(242 107 33 / .22)" />
          <stop offset="100%" stopColor="rgb(255 210 170 / .7)" />
        </linearGradient>
      </defs>

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: isShown ? 1 : 0 }}
        transition={{ duration: 0.9, delay: isShown ? 0.2 : 0 }}
      >
        {CLUB_STREETS.map((s, i) => (
          <path key={i} d={s.d} className={s.main ? "club-street is-main" : "club-street"} />
        ))}
        {CLUB_STREET_LABELS.map((l) => (
          <text
            key={l.name}
            x={l.x}
            y={l.y - 10}
            className="club-street-label"
            textAnchor="middle"
            transform={`rotate(${l.angle} ${l.x} ${l.y})`}
          >
            {l.name}
          </text>
        ))}
      </motion.g>

      <motion.path
        d={CLUB_OUTLINE}
        className="club-outline"
        initial={{ pathLength: 0, fillOpacity: 0 }}
        animate={isShown ? { pathLength: 1, fillOpacity: 1 } : { pathLength: 0, fillOpacity: 0 }}
        transition={{ pathLength: { duration: 1.4, delay: 0.35, ease: ENTRY_EASE }, fillOpacity: { duration: 0.8, delay: 1 } }}
      />

      {CLUB_PITCHES.map((p, i) => {
        const owner = ownerOf.get(p.id);
        const marks = p.sport === "soccer" ? pitchMarkings(p) : null;
        const isActive = activePitchIds.has(p.id);
        const className = [
          "club-pitch",
          p.sport === "soccer" ? "is-soccer" : "is-other",
          owner ? "is-ours" : "",
          isActive ? "is-active" : "",
        ].join(" ");
        return (
          <motion.g
            key={p.id}
            className={className}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={isShown ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.6, delay: isShown ? 0.9 + i * 0.035 : 0, ease: ENTRY_EASE }}
            onPointerEnter={owner ? () => onHover(owner.id) : undefined}
            onPointerLeave={owner ? () => onHover(null) : undefined}
            onClick={owner ? () => onSelect(owner.id) : undefined}
          >
            <path d={p.d} className="club-pitch-surface" />
            {marks && (
              <g className="club-pitch-lines">
                <path d={`M${marks.m1[0]} ${marks.m1[1]}L${marks.m2[0]} ${marks.m2[1]}`} />
                <circle cx={p.cx} cy={p.cy} r={marks.radius} />
              </g>
            )}
          </motion.g>
        );
      })}

      {/* Barrido de escaneo: la "cámara" termina de enfocar el recinto. */}
      {isShown && (
        <motion.rect
          y={0}
          width={180}
          height={CLUB_VIEWBOX.height}
          fill="url(#scan)"
          initial={{ x: -200, opacity: 1 }}
          animate={{ x: CLUB_VIEWBOX.width + 40, opacity: 0 }}
          transition={{ duration: 1.8, delay: 0.6, ease: "easeInOut" }}
          pointerEvents="none"
        />
      )}

      {focus && (
        <motion.circle
          key={activeId}
          cx={focus.x}
          cy={focus.y}
          r={150}
          fill="url(#flood-light)"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0.7, 1, 0.7], scale: 1 }}
          transition={{ opacity: { duration: 2.4, repeat: Infinity }, scale: { duration: 0.6 } }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          pointerEvents="none"
        />
      )}

      {focus &&
        activePitches.slice(0, 2).flatMap((p) =>
          Array.from({ length: PLAYERS / 2 }, (_, i) => {
            const seed = Number(p.id.slice(-4)) + i * 7;
            const dx = (seeded(seed) - 0.5) * 34;
            const dy = (seeded(seed + 1) - 0.5) * 50;
            return (
              <motion.circle
                key={`${activeId}-${p.id}-${i}`}
                r={4}
                className={i % 2 ? "club-player is-rival" : "club-player"}
                initial={{ cx: p.cx, cy: p.cy, opacity: 0 }}
                animate={{
                  cx: [p.cx + dx, p.cx - dy * 0.6, p.cx + dy * 0.4, p.cx + dx],
                  cy: [p.cy + dy, p.cy + dx * 0.8, p.cy - dx * 0.5, p.cy + dy],
                  opacity: 1,
                }}
                transition={{ duration: 6 + seeded(seed + 2) * 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                pointerEvents="none"
              />
            );
          }),
        )}

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: isShown ? 1 : 0 }}
        transition={{ duration: 0.6, delay: isShown ? 1.8 : 0 }}
        pointerEvents="none"
      >
        {[...groups.values()].map((g) => {
          const cx = g.pitches.reduce((s, p) => s + p.cx, 0) / Math.max(g.pitches.length, 1);
          const top = Math.min(...g.pitches.map((p) => p.cy)) - (g.approximate ? 72 : 112);
          return (
            <g key={g.labels.join("-")} className="club-callout">
              <path d={`M${cx} ${top + 14}V${top + (g.approximate ? 52 : 70)}`} />
              <rect x={cx - 86} y={top - 34} width={172} height={48} rx={24} />
              <text x={cx} y={top - 2} textAnchor="middle">
                {g.labels.length > 1 ? `Canchas ${g.labels.join(" · ")}` : `Cancha ${g.labels[0]}`}
              </text>
            </g>
          );
        })}
      </motion.g>
    </svg>
  );
}
