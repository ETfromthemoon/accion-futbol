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
  return <section id="panel-newsletter" className="admin-panel space-y-5 scroll-mt-24">
    <div className="flex flex-wrap items-start justify-between gap-3"><div className="admin-panel-intro"><h2 className="text-2xl">Newsletter</h2><p className="text-sm">Solicitudes guardadas con consentimiento. Aún no se envían campañas ni se consideran suscriptores confirmados.</p><a className="admin-button admin-button-primary w-fit" href="/muestras/newsletter" target="_blank" rel="noopener noreferrer">Ver post de prueba ↗</a></div><button type="button" className="admin-button" onClick={load}>Actualizar lista</button></div>
    <p className="admin-stat text-sm"><strong>{subscribers.length}</strong> solicitud{subscribers.length === 1 ? "" : "es"} visible{subscribers.length === 1 ? "" : "s"} (máximo 500).</p>
    {subscribers.length === 0 ? <p className="admin-subpanel text-sm text-muted">Todavía no hay solicitudes. Prueba el formulario en el pie de página.</p> : <div className="admin-table-wrap"><table className="admin-table text-sm"><thead><tr><th>Correo</th><th>Recibido</th><th>Estado</th></tr></thead><tbody>{subscribers.map((item) => <tr key={item.email}><td className="break-all">{item.email}</td><td>{new Date(item.consentAt).toLocaleString("es-CL")}</td><td>{item.status === "pending_confirmation" ? "Pendiente de confirmación" : item.status}</td></tr>)}</tbody></table></div>}
    <p role="status" className="admin-status text-sm">{message}</p>
  </section>;
}
