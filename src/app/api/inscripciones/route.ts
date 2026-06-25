import { NextResponse } from "next/server";
import { z } from "zod";
import { saveLead } from "@/lib/db";

const LeadSchema = z.object({
  name: z.string().trim().min(2, "Nombre demasiado corto").max(80),
  email: z.string().trim().email("Correo inválido").max(120),
  phone: z.string().trim().min(8, "Teléfono inválido").max(20),
  program: z.string().trim().min(1).max(40),
  participantAge: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(800).optional().or(z.literal("")),
  // Honeypot anti-bots: debe llegar vacío.
  company: z.string().max(0).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Cuerpo inválido" },
      { status: 400 },
    );
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Revisa los datos del formulario",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  // Si el honeypot trae contenido, es un bot: respondemos OK sin guardar.
  if (parsed.data.company) {
    return NextResponse.json({ success: true });
  }

  try {
    const { company: _company, ...lead } = parsed.data;
    void _company;
    await saveLead({ ...lead, source: "landing" });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[inscripcion] error al guardar lead:", error);
    return NextResponse.json(
      {
        success: false,
        error: "No pudimos registrar tu solicitud. Intenta de nuevo.",
      },
      { status: 500 },
    );
  }
}
