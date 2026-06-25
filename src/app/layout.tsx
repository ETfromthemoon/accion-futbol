import type { Metadata } from "next";
import { Archivo, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

// Display: grotesca pesada estilo gráfica de transmisión deportiva.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

// Cuerpo: grotesca humanista, legible y cálida (contraste con el display).
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = "https://accionfutbol.cl";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title:
    "Acción Fútbol · Academia de fútbol en Las Condes | Clase de prueba gratis",
  description:
    "Entrena con metodología profesional en Club Oriente, Las Condes. Programas para adultos, niños, jóvenes y mujeres. Agenda tu clase de prueba gratis.",
  keywords: [
    "academia de fútbol Las Condes",
    "fútbol adultos Santiago",
    "fútbol niños Las Condes",
    "Club Oriente",
    "clase de prueba fútbol",
  ],
  openGraph: {
    title: "Acción Fútbol · Despierta con pasión",
    description:
      "Academia de fútbol con metodología profesional en Las Condes. Agenda tu clase de prueba gratis.",
    url: SITE_URL,
    siteName: "Acción Fútbol",
    locale: "es_CL",
    type: "website",
    images: [{ url: "/images/hero-night.webp", width: 1920, height: 1280 }],
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-CL"
      className={`${archivo.variable} ${hanken.variable} h-full antialiased`}
    >
      <body className="grain min-h-full">{children}</body>
    </html>
  );
}
