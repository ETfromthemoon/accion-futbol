import { CITY_BOUNDS, CITY_VIEWBOX } from "./santiago";

const LAT_MID_RAD = ((CITY_BOUNDS.minLat + CITY_BOUNDS.maxLat) / 2) * (Math.PI / 180);
const KM_PER_DEG_LAT = 111.32;

// Misma proyección equirectangular que scripts/build-geo.mjs, en unidades del viewBox.
export function projectToCity(lon: number, lat: number): { x: number; y: number } {
  return {
    x: ((lon - CITY_BOUNDS.minLon) / (CITY_BOUNDS.maxLon - CITY_BOUNDS.minLon)) * CITY_VIEWBOX.width,
    y: ((CITY_BOUNDS.maxLat - lat) / (CITY_BOUNDS.maxLat - CITY_BOUNDS.minLat)) * CITY_VIEWBOX.height,
  };
}

// Unidades del viewBox por kilómetro (para la barra de escala).
export const CITY_UNITS_PER_KM =
  CITY_VIEWBOX.width /
  ((CITY_BOUNDS.maxLon - CITY_BOUNDS.minLon) * KM_PER_DEG_LAT * Math.cos(LAT_MID_RAD));

// -33.4296 → 33°25′47″S
export function toDms(value: number, axis: "lat" | "lon"): string {
  const abs = Math.abs(value);
  const deg = Math.floor(abs);
  const minFloat = (abs - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.round((minFloat - min) * 60);
  const hemi = axis === "lat" ? (value < 0 ? "S" : "N") : value < 0 ? "O" : "E";
  return `${deg}°${String(min).padStart(2, "0")}′${String(sec).padStart(2, "0")}″${hemi}`;
}
