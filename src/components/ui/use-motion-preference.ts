"use client";

import { useSyncExternalStore } from "react";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia(MOTION_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const getMotionPreference = () => window.matchMedia(MOTION_QUERY).matches;
// El servidor y la hidratación inicial comparten el poster, sin descargar video.
const getServerMotionPreference = () => true;

export function useMotionPreference() {
  return useSyncExternalStore(subscribeMotion, getMotionPreference, getServerMotionPreference);
}
