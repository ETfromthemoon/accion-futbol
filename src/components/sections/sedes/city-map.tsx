"use client";

import { motion } from "motion/react";
import { COMUNAS, CITY_VIEWBOX, HIGHWAYS_PATH, RIVERS_PATH } from "@/lib/geo/santiago";
import { CITY_UNITS_PER_KM } from "@/lib/geo/project";

// Comunas con etiqueta visible: referencias que cualquier santiaguino reconoce.
const LABELED = new Set([
  "Santiago",
  "Providencia",
  "Las Condes",
  "Vitacura",
  "Ñuñoa",
  "La Reina",
  "Peñalolén",
  "La Florida",
  "Maipú",
  "Puente Alto",
  "Pudahuel",
  "Quilicura",
  "Huechuraba",
  "San Bernardo",
]);
const HIGHLIGHT = "Las Condes";
const SCALE_KM = 5;
const DRAW_EASE = [0.65, 0, 0.35, 1] as const;

type Props = { isDrawn: boolean };

// Plano vectorial del Gran Santiago con comunas, autopistas y ríos reales.
export function CityMap({ isDrawn }: Props) {
  const { width, height } = CITY_VIEWBOX;
  const scaleWidth = CITY_UNITS_PER_KM * SCALE_KM;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Mapa del Gran Santiago con sus comunas, autopistas y ríos"
    >
      <defs>
        <radialGradient id="city-glow" cx="70%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgb(242 107 33 / .14)" />
          <stop offset="100%" stopColor="rgb(242 107 33 / 0)" />
        </radialGradient>
        <linearGradient id="andes" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="rgb(255 255 255 / 0)" />
          <stop offset="100%" stopColor="rgb(255 255 255 / .06)" />
        </linearGradient>
        <pattern id="graticule" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M50 0H0V50" fill="none" stroke="rgb(255 255 255 / .035)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width={width} height={height} fill="url(#graticule)" />
      <rect width={width} height={height} fill="url(#city-glow)" />
      <rect x={width * 0.8} width={width * 0.2} height={height} fill="url(#andes)" />

      <g>
        {COMUNAS.map((c, i) => (
          <motion.path
            key={c.name}
            d={c.d}
            className={c.name === HIGHLIGHT ? "city-comuna is-highlight" : c.urban ? "city-comuna" : "city-comuna is-rural"}
            initial={{ pathLength: 0, fillOpacity: 0 }}
            animate={isDrawn ? { pathLength: 1, fillOpacity: 1 } : { pathLength: 0, fillOpacity: 0 }}
            transition={{
              pathLength: { duration: 1.6, delay: 0.02 * i, ease: DRAW_EASE },
              fillOpacity: { duration: 0.8, delay: 1 + 0.015 * i },
            }}
          >
            <title>{c.name}</title>
          </motion.path>
        ))}
      </g>

      <motion.path
        d={RIVERS_PATH}
        className="city-river"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: isDrawn ? 1 : 0 }}
        transition={{ duration: 2.2, delay: 0.5, ease: DRAW_EASE }}
      />
      <motion.path
        d={HIGHWAYS_PATH}
        className="city-highway"
        initial={{ opacity: 0 }}
        animate={{ opacity: isDrawn ? 1 : 0 }}
        transition={{ duration: 1.2, delay: 1.2 }}
      />

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: isDrawn ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        {COMUNAS.filter((c) => LABELED.has(c.name)).map((c) => (
          <text
            key={c.name}
            x={c.cx}
            y={c.cy}
            className={c.name === HIGHLIGHT ? "city-label is-highlight" : "city-label"}
            textAnchor="middle"
          >
            {c.name}
          </text>
        ))}
        <text
          x={width - 22}
          y={height * 0.5}
          className="city-label is-andes"
          textAnchor="middle"
          transform={`rotate(90 ${width - 22} ${height * 0.5})`}
        >
          Cordillera de los Andes
        </text>

        {/* Escala y norte: el mapa es medible, no decorativo. */}
        <g transform={`translate(32 ${height - 40})`} className="city-scale">
          <path d={`M0 0H${scaleWidth}M0 -6V6M${scaleWidth} -6V6M${scaleWidth / 2} -4V4`} />
          <text x={scaleWidth / 2} y={-12} textAnchor="middle">{SCALE_KM} km</text>
        </g>
        <g transform={`translate(${width - 70} 52)`} className="city-scale">
          <path d="M0 18L0 -18M-7 -8L0 -18L7 -8" />
          <text x={0} y={36} textAnchor="middle">N</text>
        </g>
      </motion.g>
    </svg>
  );
}
