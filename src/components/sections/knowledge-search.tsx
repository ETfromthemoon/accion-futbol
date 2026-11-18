"use client";

import { useState } from "react";
import { ArrowUpRight, Plus, Search, X } from "lucide-react";
import { CONTACT } from "@/lib/site";
import { KNOWLEDGE_BASE, searchKnowledge } from "@/lib/knowledge-base";

const popular = ["prueba-gratis", "agendar", "precios", "pro", "sede"];

export function KnowledgeSearch() {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const searching = Boolean(query.trim());
  const results = searching ? searchKnowledge(query) : showAll ? KNOWLEDGE_BASE : popular.map((id) => KNOWLEDGE_BASE.find((entry) => entry.id === id)!);

  return (
    <div className="knowledge-shell" id="preguntas-frecuentes">
      <div className="knowledge-inner">
        <h3 id="knowledge-title" className="font-display font-black uppercase">Preguntas frecuentes.</h3>
        <p className="knowledge-intro">Encuentra lo que necesitas saber antes de salir a la cancha.</p>

        <div className="knowledge-search-box">
          <Search aria-hidden="true" />
          <label htmlFor="knowledge-query" className="sr-only">Buscar una pregunta</label>
          <input id="knowledge-query" type="search" value={query} maxLength={120} onChange={(event) => setQuery(event.target.value)}
            placeholder="Busca horarios, programas, pagos…" autoComplete="off" />
          {query && <button type="button" onClick={() => setQuery("")} aria-label="Borrar búsqueda"><X aria-hidden="true" /></button>}
        </div>

        <span className="sr-only" aria-live="polite">{results.length} {results.length === 1 ? "respuesta" : "respuestas"} disponibles</span>
        <div className="knowledge-results" aria-label="Respuestas disponibles">
          {results.length ? results.map((entry) => (
            <details key={entry.id} name="knowledge-answers" className="knowledge-item">
              <summary><span>{entry.question}</span><span className="knowledge-plus"><Plus aria-hidden="true" /></span></summary>
              <p>{entry.answer}</p>
            </details>
          )) : (
            <div className="knowledge-empty" role="status">
              <p>No encontramos esa respuesta.</p>
              <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer">Pregúntanos por WhatsApp <ArrowUpRight aria-hidden="true" /></a>
            </div>
          )}
        </div>
        {!searching && !showAll && <button type="button" onClick={() => setShowAll(true)} className="knowledge-more">Ver todas las preguntas <ArrowUpRight aria-hidden="true" /></button>}
      </div>
    </div>
  );
}
