"use client";

import { useEffect, useState } from "react";

type Signup = { email: string; consentAt: string; status: string };

export function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState<Signup[]>([]);
  const [message, setMessage] = useState("");
  async function load() {
    try {
      const response = await fetch("/api/newsletter/admin", { cache: "no-store" });
      if (!response.ok) throw new Error("No se pudo cargar la lista.");
      setSubscribers((await response.json()).subscribers);
      setMessage("");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Error de carga."); }
  }
  useEffect(() => {
    let active = true;
    fetch("/api/newsletter/admin", { cache: "no-store" })
      .then((response) => { if (!response.ok) throw new Error("No se pudo cargar la lista."); return response.json(); })
      .then((result) => { if (active) setSubscribers(result.subscribers); })
      .catch((error: Error) => { if (active) setMessage(error.message); });
    return () => { active = false; };
  }, []);
  return <section id="panel-newsletter" className="space-y-4 scroll-mt-24">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-2xl font-bold">Newsletter</h2><p className="text-sm text-muted">Solicitudes guardadas con consentimiento. Aún no se envían campañas ni se consideran suscriptores confirmados.</p></div><button type="button" className="rounded-xl border border-border px-4 py-2" onClick={load}>Actualizar</button></div>
    <p className="text-sm">{subscribers.length} solicitud{subscribers.length === 1 ? "" : "es"} visible{subscribers.length === 1 ? "" : "s"} (máximo 500).</p>
    {subscribers.length === 0 ? <p className="rounded-xl border border-border p-4 text-sm text-muted">Todavía no hay solicitudes. Prueba el formulario en el pie de página.</p> : <div className="overflow-x-auto rounded-xl border border-border"><table className="w-full text-left text-sm"><thead><tr className="border-b border-border"><th className="p-3">Correo</th><th className="p-3">Recibido</th><th className="p-3">Estado</th></tr></thead><tbody>{subscribers.map((item) => <tr key={item.email} className="border-b border-border last:border-0"><td className="break-all p-3">{item.email}</td><td className="p-3">{new Date(item.consentAt).toLocaleString("es-CL")}</td><td className="p-3">{item.status === "pending_confirmation" ? "Pendiente de confirmación" : item.status}</td></tr>)}</tbody></table></div>}
    <p role="status" className="text-sm">{message}</p>
  </section>;
}
