// Genera src/lib/geo/*.ts (trazados SVG) a partir de datos geográficos reales.
//
// Fuentes (descargar a una carpeta y pasarla como argumento):
//   rm.geojson  → comunas de la Región Metropolitana
//                 https://raw.githubusercontent.com/caracena/chile-geojson/master/13.geojson
//   club.osm    → OpenStreetMap alrededor de Club Oriente (© colaboradores OSM, ODbL)
//                 https://api.openstreetmap.org/api/0.6/map?bbox=-70.5400,-33.4340,-70.5285,-33.4255
//   roads.json  → (opcional) autopistas y ríos vía Overpass:
//                 way["highway"="motorway"] + way["waterway"="river"]["name"~"Mapocho|Maipo"]
//
// Uso: node scripts/build-geo.mjs <carpeta-con-datos>

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const dataDir = process.argv[2];
if (!dataDir) {
  console.error("Uso: node scripts/build-geo.mjs <carpeta-con-datos>");
  process.exit(1);
}

const OUT_DIR = "src/lib/geo";
const CLUB_WAY_ID = "220258824"; // Club Oriente de Fútbol (OSM)

// Encuadre del Gran Santiago (lon/lat). Las comunas que exceden el marco
// quedan recortadas por el viewBox.
const CITY_BOUNDS = { minLon: -70.86, maxLon: -70.43, minLat: -33.64, maxLat: -33.31 };
const CITY_WIDTH = 1000;

// ── utilidades ─────────────────────────────────────────────────────────────
const round = (v) => Math.round(v * 10) / 10;

function makeProjection(b, width) {
  const k = Math.cos(((b.minLat + b.maxLat) / 2) * (Math.PI / 180));
  const height = (width * (b.maxLat - b.minLat)) / ((b.maxLon - b.minLon) * k);
  const project = ([lon, lat]) => [
    ((lon - b.minLon) / (b.maxLon - b.minLon)) * width,
    ((b.maxLat - lat) / (b.maxLat - b.minLat)) * height,
  ];
  return { width, height: Math.round(height), project };
}

// Douglas-Peucker sobre puntos ya proyectados.
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const sqTol = tolerance * tolerance;
  const segDist = (p, a, b) => {
    let [x, y] = a;
    let dx = b[0] - x;
    let dy = b[1] - y;
    if (dx !== 0 || dy !== 0) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) [x, y] = b;
      else if (t > 0) [x, y] = [x + dx * t, y + dy * t];
    }
    dx = p[0] - x;
    dy = p[1] - y;
    return dx * dx + dy * dy;
  };
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    let maxD = 0;
    let index = 0;
    for (let i = first + 1; i < last; i++) {
      const d = segDist(points[i], points[first], points[last]);
      if (d > maxD) [maxD, index] = [d, i];
    }
    if (maxD > sqTol) {
      keep[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

const toPath = (pts, closed) =>
  "M" + pts.map(([x, y]) => `${round(x)} ${round(y)}`).join("L") + (closed ? "Z" : "");

const centroid = (pts) => [
  pts.reduce((a, p) => a + p[0], 0) / pts.length,
  pts.reduce((a, p) => a + p[1], 0) / pts.length,
];

// Centroide de área (mejor posición de etiqueta que el promedio de vértices).
function areaCentroid(pts) {
  let a = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const f = pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
    a += f;
    cx += (pts[j][0] + pts[i][0]) * f;
    cy += (pts[j][1] + pts[i][1]) * f;
  }
  if (Math.abs(a) < 1e-9) return centroid(pts);
  return [cx / (3 * a), cy / (3 * a)];
}

function insidePolygon(p, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

const polyArea = (pts) =>
  Math.abs(pts.reduce((a, p, i) => {
    const q = pts[(i + 1) % pts.length];
    return a + p[0] * q[1] - q[0] * p[1];
  }, 0)) / 2;

const header = (source) =>
  `// ARCHIVO GENERADO por scripts/build-geo.mjs — no editar a mano.\n// ${source}\n\n`;

// ── Mapa de Santiago ───────────────────────────────────────────────────────
function buildCity() {
  const geo = JSON.parse(readFileSync(join(dataDir, "rm.geojson"), "utf8"));
  const { width, height, project } = makeProjection(CITY_BOUNDS, CITY_WIDTH);
  const inFrame = ([x, y]) => x > -40 && x < width + 40 && y > -40 && y < height + 40;

  const comunas = [];
  for (const feature of geo.features) {
    const { Comuna: name, Provincia: provincia } = feature.properties;
    const polys =
      feature.geometry.type === "Polygon"
        ? [feature.geometry.coordinates]
        : feature.geometry.coordinates;
    const rings = polys
      .map((poly) => simplify(poly[0].map(project), 0.7))
      .filter((ring) => ring.length > 3 && ring.some(inFrame));
    if (!rings.length) continue;
    const main = rings.reduce((a, b) => (polyArea(b) > polyArea(a) ? b : a));
    const [cx, cy] = areaCentroid(main);
    comunas.push({
      name,
      urban: provincia === "Santiago" || ["Puente Alto", "San Bernardo"].includes(name),
      d: rings.map((r) => toPath(r, true)).join(""),
      cx: round(cx),
      cy: round(cy),
    });
  }

  const roadsFile = join(dataDir, "roads.json");
  const highways = [];
  const rivers = [];
  const roadsRaw = existsSync(roadsFile) ? readFileSync(roadsFile, "utf8") : "";
  if (roadsRaw && !roadsRaw.trimStart().startsWith("{")) {
    console.warn("roads.json no es JSON válido (¿error de Overpass?); se omiten vías y ríos.");
  } else if (roadsRaw) {
    const roads = JSON.parse(roadsRaw);
    for (const el of roads.elements ?? []) {
      if (!el.geometry) continue;
      const pts = simplify(el.geometry.map((g) => project([g.lon, g.lat])), 1);
      if (pts.length < 2 || !pts.some(inFrame)) continue;
      const target = el.tags?.waterway ? rivers : highways;
      target.push(toPath(pts, false));
    }
  }

  const src =
    header("Comunas: caracena/chile-geojson · Vías y ríos: © colaboradores de OpenStreetMap (ODbL).") +
    `export const CITY_BOUNDS = ${JSON.stringify(CITY_BOUNDS)} as const;\n` +
    `export const CITY_VIEWBOX = { width: ${width}, height: ${height} } as const;\n\n` +
    `export type ComunaShape = { name: string; urban: boolean; d: string; cx: number; cy: number };\n\n` +
    `export const COMUNAS: readonly ComunaShape[] = ${JSON.stringify(comunas)};\n\n` +
    `// Autopistas y ríos en un solo trazado cada uno (menos nodos DOM).\n` +
    `export const HIGHWAYS_PATH = ${JSON.stringify(highways.join(""))};\n\n` +
    `export const RIVERS_PATH = ${JSON.stringify(rivers.join(""))};\n`;
  writeFileSync(join(OUT_DIR, "santiago.ts"), src);
  console.log(`santiago.ts · ${comunas.length} comunas · ${highways.length} autopistas · ${rivers.length} ríos`);
}

// ── Plano de Club Oriente ─────────────────────────────────────────────────
function parseOsm(xml) {
  const nodes = new Map(
    [...xml.matchAll(/<node id="(\d+)"[^>]*lat="([-\d.]+)" lon="([-\d.]+)"/g)].map((m) => [
      m[1],
      [Number(m[3]), Number(m[2])],
    ]),
  );
  const tagsOf = (block) =>
    Object.fromEntries([...block.matchAll(/<tag k="([^"]+)" v="([^"]*)"/g)].map((m) => [m[1], m[2]]));
  return [...xml.matchAll(/<way id="(\d+)"[^>]*>([\s\S]*?)<\/way>/g)].map((m) => ({
    id: m[1],
    tags: tagsOf(m[2]),
    pts: [...m[2].matchAll(/<nd ref="(\d+)"/g)].map((r) => nodes.get(r[1])).filter(Boolean),
  }));
}

function buildClub() {
  const ways = parseOsm(readFileSync(join(dataDir, "club.osm"), "utf8"));
  const club = ways.find((w) => w.id === CLUB_WAY_ID);
  if (!club) throw new Error("No se encontró Club Oriente en club.osm");

  const lons = club.pts.map((p) => p[0]);
  const lats = club.pts.map((p) => p[1]);
  const pad = 0.0011;
  const bounds = {
    minLon: Math.min(...lons) - pad,
    maxLon: Math.max(...lons) + pad,
    minLat: Math.min(...lats) - pad,
    maxLat: Math.max(...lats) + pad,
  };
  const { width, height, project } = makeProjection(bounds, 1200);

  const pitches = ways
    .filter((w) => w.tags.leisure === "pitch" && insidePolygon(centroid(w.pts), club.pts))
    .map((w) => {
      const pts = w.pts.map(project);
      const [cx, cy] = centroid(pts.slice(0, -1));
      return {
        id: w.id,
        name: w.tags.name ?? null,
        sport: w.tags.sport ?? "other",
        d: toPath(pts.slice(0, -1), true),
        cx: round(cx),
        cy: round(cy),
      };
    });

  const MAIN_STREETS = ["Nueva Bilbao", "Avenida Padre Hurtado", "Avenida Francisco Bilbao", "Vital Apoquindo", "Valenzuela Puelma"];
  const streets = ways
    .filter((w) => w.tags.highway && !["footway", "path", "service", "steps", "cycleway"].includes(w.tags.highway))
    .map((w) => ({
      main: MAIN_STREETS.includes(w.tags.name),
      name: w.tags.name ?? null,
      d: toPath(simplify(w.pts.map(project), 0.6), false),
      pts: w.pts.map(project),
    }));

  // Una etiqueta por calle principal: punto medio de su tramo más largo visible.
  const inView = ([x, y]) => x > 60 && x < width - 60 && y > 40 && y < height - 40;
  const labels = MAIN_STREETS.flatMap((name) => {
    const candidates = streets
      .filter((s) => s.name === name)
      .map((s) => ({ s, vis: s.pts.filter(inView) }))
      .filter((c) => c.vis.length >= 2)
      .sort((a, b) => b.vis.length - a.vis.length);
    if (!candidates.length) return [];
    const vis = candidates[0].vis;
    const a = vis[Math.floor(vis.length / 2) - (vis.length > 2 ? 1 : 0)];
    const b = vis[Math.floor(vis.length / 2)];
    let angle = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
    if (angle > 90) angle -= 180;
    if (angle < -90) angle += 180;
    return [{ name: name.replace("Avenida", "Av."), x: round((a[0] + b[0]) / 2), y: round((a[1] + b[1]) / 2), angle: round(angle) }];
  });

  const clubPts = club.pts.map(project);
  const src =
    header("Plano: © colaboradores de OpenStreetMap (ODbL) — Club Oriente de Fútbol, way 220258824.") +
    `export const CLUB_VIEWBOX = { width: ${width}, height: ${height} } as const;\n\n` +
    `export const CLUB_OUTLINE = ${JSON.stringify(toPath(clubPts.slice(0, -1), true))};\n\n` +
    `export type PitchShape = { id: string; name: string | null; sport: string; d: string; cx: number; cy: number };\n\n` +
    `export const CLUB_PITCHES: readonly PitchShape[] = ${JSON.stringify(pitches)};\n\n` +
    `export type StreetShape = { main: boolean; d: string };\n\n` +
    `export const CLUB_STREETS: readonly StreetShape[] = ${JSON.stringify(streets.map(({ main, d }) => ({ main, d })))};\n\n` +
    `export const CLUB_STREET_LABELS = ${JSON.stringify(labels)} as const;\n`;
  writeFileSync(join(OUT_DIR, "club-oriente.ts"), src);
  console.log(`club-oriente.ts · ${pitches.length} canchas · ${streets.length} calles`);
}

mkdirSync(OUT_DIR, { recursive: true });
buildCity();
buildClub();
