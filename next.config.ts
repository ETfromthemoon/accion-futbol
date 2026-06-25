import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Fija la raíz del proyecto: evita que Next infiera mal el workspace
  // al detectar otros lockfiles fuera de esta carpeta.
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
