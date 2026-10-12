"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { CONTACT, PROGRAMS, SEDES } from "@/lib/site";
import { CITY_VIEWBOX } from "@/lib/geo/santiago";
import { CLUB_PITCHES, CLUB_VIEWBOX } from "@/lib/geo/club-oriente";
import { projectToCity, toDms } from "@/lib/geo/project";
import { CityMap } from "./city-map";
import { ClubPlan } from "./club-plan";
import { SedePin } from "./sede-pin";
import { SedePanel } from "./sede-panel";

type View = "city" | "sede";

const CAMERA_EASE = [0.76, 0, 0.24, 1] as const;
const FLY_DURATION = 1.6;
const CITY_ZOOM = 9; // la ciudad se acerca hasta disolverse
const PLAN_TILT = 34; // grados de inclinación del plano (vista 3/4)
const CANCHA_ZOOM = 1.55;
// Relación real de escala entre el encuadre de Santiago y el del club (~47×).
const REAL_ZOOM = 47;

const pct = (value: number, total: number) => (value / total) * 100;

export function SedesMap() {
  const [view, setView] = useState<View>("city");
  const [sedeId, setSedeId] = useState(SEDES[0].id);
  const [canchaId, setCanchaId] = useState(SEDES[0].canchas[0].id);
  const [programId, setProgramId] = useState(SEDES[0].canchas[0].programIds[0]);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const isDrawn = useInView(stageRef, { once: true, margin: "-20% 0px" });

  const zoom = useMotionValue(1);
  const zoomLabel = useTransform(zoom, (z) => `${z.toFixed(z < 10 ? 1 : 0)}×`);

  const sede = SEDES.find((s) => s.id === sedeId) ?? SEDES[0];
  const pin = projectToCity(sede.lon, sede.lat);
  const pinLeft = pct(pin.x, CITY_VIEWBOX.width);
  const pinTop = pct(pin.y, CITY_VIEWBOX.height);
  const isSede = view === "sede";

  // Cámara del plano: centra la cancha elegida.
  const cancha = sede.canchas.find((c) => c.id === canchaId) ?? sede.canchas[0];
  const focusPitches = CLUB_PITCHES.filter((p) => cancha.pitchIds.includes(p.id));
  const hasFocus = focusPitches.length > 0;
  const focusX = hasFocus
    ? pct(focusPitches.reduce((s, p) => s + p.cx, 0) / focusPitches.length, CLUB_VIEWBOX.width)
    : 50;
  const focusY = hasFocus
    ? pct(focusPitches.reduce((s, p) => s + p.cy, 0) / focusPitches.length, CLUB_VIEWBOX.height)
    : 50;

  useEffect(() => {
    const controls = animate(zoom, isSede ? REAL_ZOOM : 1, { duration: FLY_DURATION, ease: CAMERA_EASE });
    return () => controls.stop();
  }, [isSede, zoom]);

  // Esc vuelve al mapa; el foco sigue al usuario entre vistas.
  useEffect(() => {
    if (!isSede) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setView("city");
    window.addEventListener("keydown", onKey);
    const id = window.setTimeout(() => backRef.current?.focus({ preventScroll: true }), 50);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
    };
  }, [isSede]);

  function enterSede(id: string) {
    setSedeId(id);
    setView("sede");
  }

  function backToCity() {
    setView("city");
    window.setTimeout(() => pinRef.current?.focus({ preventScroll: true }), 50);
  }

  function selectCancha(id: string) {
    const next = sede.canchas.find((c) => c.id === id);
    if (!next) return;
    setCanchaId(id);
    setProgramId(next.programIds[0]);
  }

  return (
    <section id="sede" className="sedes-section" aria-labelledby="sedes-heading">
      <div className="sedes-heading">
        <p className="section-tag">05 / Dónde jugamos</p>
        <h2 id="sedes-heading">
          Santiago es <span>la cancha.</span>
        </h2>
        <p>
          Hoy entrenamos en Club Oriente, Las Condes. Toca el pin y entra a la sede: verás las canchas
          reales donde juega cada serie.
        </p>
      </div>

      <div className="sedes-grid">
        <div ref={stageRef} className={`sedes-stage ${isSede ? "is-sede" : ""}`}>
          {/* Capa 1 · ciudad: la cámara vuela hacia el pin y la ciudad se disuelve. */}
          <motion.div
            className="sedes-layer"
            style={{ transformOrigin: `${pinLeft}% ${pinTop}%` }}
            initial={false}
            animate={
              isSede
                ? { scale: CITY_ZOOM, x: `${50 - pinLeft}%`, y: `${50 - pinTop}%`, opacity: 0, filter: "blur(6px)" }
                : { scale: 1, x: "0%", y: "0%", opacity: 1, filter: "blur(0px)" }
            }
            transition={{
              duration: FLY_DURATION,
              ease: CAMERA_EASE,
              opacity: { duration: 0.55, delay: isSede ? 0.85 : 0.35 },
              filter: { duration: 0.6, delay: isSede ? 0.7 : 0.4 },
            }}
            aria-hidden={isSede}
            inert={isSede}
          >
            <CityMap isDrawn={isDrawn} />
            {SEDES.map((s) => {
              const p = projectToCity(s.lon, s.lat);
              return (
                <SedePin
                  key={s.id}
                  ref={s.id === sede.id ? pinRef : undefined}
                  sede={s}
                  left={pct(p.x, CITY_VIEWBOX.width)}
                  top={pct(p.y, CITY_VIEWBOX.height)}
                  isVisible={isDrawn}
                  onEnter={() => enterSede(s.id)}
                />
              );
            })}
          </motion.div>

          {/* Capa 2 · plano del club: nace desde el pin y se inclina a vista 3/4. */}
          <motion.div
            className="sedes-layer sedes-plan"
            initial={false}
            animate={
              isSede
                ? { opacity: 1, scale: 1, rotateX: PLAN_TILT, rotateZ: -6 }
                : { opacity: 0, scale: 0.12, rotateX: 0, rotateZ: 0 }
            }
            transition={{
              duration: isSede ? 1.3 : 0.6,
              delay: isSede ? 0.75 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ transformPerspective: 1400 }}
            aria-hidden={!isSede}
            inert={!isSede}
          >
            <motion.div
              className="sedes-plan-camera"
              style={{
                aspectRatio: `${CLUB_VIEWBOX.width} / ${CLUB_VIEWBOX.height}`,
                transformOrigin: `${focusX}% ${focusY}%`,
              }}
              animate={
                isSede
                  ? { scale: CANCHA_ZOOM, x: `${(50 - focusX) * 0.6}%`, y: `${(50 - focusY) * 0.6}%` }
                  : { scale: 1, x: "0%", y: "0%" }
              }
              transition={{ duration: 1.2, ease: CAMERA_EASE, delay: isSede ? 0.4 : 0 }}
            >
              <ClubPlan
                canchas={sede.canchas}
                activeId={hoverId ?? canchaId}
                onHover={setHoverId}
                onSelect={selectCancha}
                isShown={isSede}
              />
            </motion.div>
          </motion.div>

          {/* HUD de cámara */}
          <div className="sedes-hud" aria-hidden="true">
            <span className="sedes-hud-corner is-tl" />
            <span className="sedes-hud-corner is-tr" />
            <span className="sedes-hud-corner is-bl" />
            <span className="sedes-hud-corner is-br" />
            <p className="sedes-hud-view">{isSede ? `Vista · ${sede.name}` : "Vista · Gran Santiago"}</p>
            <p className="sedes-hud-coords">
              {toDms(sede.lat, "lat")} · {toDms(sede.lon, "lon")}
              <motion.span className="sedes-hud-zoom">{zoomLabel}</motion.span>
            </p>
          </div>
          <p className="sedes-credit">Datos: © OpenStreetMap · comunas RM</p>
        </div>

        <div className="sedes-side">
          {isSede ? (
            <SedePanel
              sede={sede}
              canchaId={canchaId}
              programId={programId}
              highlightId={hoverId}
              onHover={setHoverId}
              onSelectCancha={selectCancha}
              onSelectProgram={setProgramId}
              onBack={backToCity}
              backRef={backRef}
            />
          ) : (
            <div className="sedes-intro">
              <ul className="sedes-list">
                {SEDES.map((s) => {
                  const series = new Set(s.canchas.flatMap((c) => c.programIds));
                  return (
                    <li key={s.id}>
                      <button type="button" onClick={() => enterSede(s.id)} className="sedes-card">
                        <span className="sedes-card-kicker">Sede · {s.comuna}</span>
                        <span className="sedes-card-name">{s.name}</span>
                        <span className="sedes-card-meta">{s.address}</span>
                        <span className="sedes-card-stats">
                          <span><strong>{s.canchas.length}</strong> canchas</span>
                          <span><strong>{series.size}</strong> de {PROGRAMS.length} series</span>
                        </span>
                        <span className="sedes-card-cta">
                          Entrar a la sede <ArrowUpRight aria-hidden="true" className="size-4" />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <ul className="sedes-contact">
                <li>
                  <Phone aria-hidden="true" className="size-4" />
                  <a href={`tel:${CONTACT.phoneRaw}`}>{CONTACT.phone}</a>
                </li>
                <li>
                  <Mail aria-hidden="true" className="size-4" />
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
