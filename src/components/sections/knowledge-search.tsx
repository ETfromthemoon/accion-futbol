"use client";

import { useState } from "react";
import { ArrowUpRight, BookOpen, Plus, Search, X } from "lucide-react";
import { CONTACT } from "@/lib/site";
import { KNOWLEDGE_BASE, KNOWLEDGE_TOPICS, searchKnowledge, type KnowledgeTopic } from "@/lib/knowledge-base";

const popular = ["prueba-gratis", "agendar", "precios", "pro", "sede"];
const suggestions = ["¿Cuánto cuesta?", "Horarios Kids", "¿Dónde entrenan?"];

export function KnowledgeSearch() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<KnowledgeTopic | "Todas">("Todas");
  const [expanded, setExpanded] = useState(false);
  const matching = searchKnowledge(query, topic);
  const featured = !query.trim() && topic === "Todas" && !expanded;
  const results = featured ? popular.map((id) => KNOWLEDGE_BASE.find((entry) => entry.id === id)!) : matching;
  const visible = expanded || featured ? results : results.slice(0, 6);

  return (
    <div className="knowledge-shell mt-16 sm:mt-24" id="preguntas-frecuentes">
      <div className="knowledge-heading grid gap-7 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
        <div>
          <p className="section-tag knowledge-kicker">PREGUNTAS FRECUENTES / BASE DE CONOCIMIENTO</p>
          <h3 id="knowledge-title" className="mt-4 max-w-xl font-display text-3xl font-black uppercase leading-[1.02] tracking-[-.05em] sm:text-5xl">La respuesta antes del primer pitazo.</h3>
          <p className="knowledge-intro mt-4 max-w-md text-sm leading-relaxed sm:text-base">Busca por tema o explora respuestas sobre programas, horarios, pagos y tu primera clase.</p>
        </div>
        <div className="knowledge-search-area">
          <label htmlFor="knowledge-query" className="mb-2 block text-xs font-bold uppercase tracking-[.13em]">¿Qué quieres saber?</label>
          <div className="knowledge-search-box flex items-center gap-3 px-4">
            <Search className="size-5 shrink-0" aria-hidden="true" />
            <input id="knowledge-query" type="search" value={query} maxLength={120} onChange={(event) => { setQuery(event.target.value); setExpanded(false); }}
              placeholder="Ej. horarios, precio, Kids, selección…" autoComplete="off" className="min-h-14 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:opacity-65" />
            {query && <button type="button" onClick={() => { setQuery(""); setExpanded(false); }} aria-label="Borrar búsqueda" className="knowledge-clear flex size-9 shrink-0 items-center justify-center rounded-full"><X className="size-4" aria-hidden="true" /></button>}
          </div>
          <div className="knowledge-suggestions mt-3 flex flex-wrap items-center gap-2 text-xs"><span>Prueba con</span>{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => { setQuery(suggestion); setExpanded(false); }}>{suggestion}</button>)}</div>
        </div>
      </div>

      <div className="knowledge-content mt-9 grid gap-8 border-t pt-8 lg:grid-cols-[210px_1fr] lg:gap-12">
        <div>
          <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.13em]"><BookOpen className="size-4" aria-hidden="true" /> EXPLORA POR TEMA</div>
          <div className="knowledge-topics flex flex-wrap gap-2 lg:flex-col" role="group" aria-label="Filtrar preguntas por tema">
            {(["Todas", ...KNOWLEDGE_TOPICS] as const).map((item) => (
              <button key={item} type="button" onClick={() => { setTopic(item); setExpanded(false); }} aria-pressed={topic === item}
                className={`knowledge-topic inline-flex min-h-10 items-center justify-between gap-3 px-4 text-left text-sm ${topic === item ? "is-active" : ""}`}>
                {item}<span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="knowledge-results-header mb-4 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-[.13em]">{featured ? "LAS MÁS CONSULTADAS" : query.trim() ? "RESPUESTAS RELACIONADAS" : topic.toUpperCase()}</span>
            <span aria-live="polite" className="text-xs">{featured ? "5 preguntas destacadas" : `${matching.length} ${matching.length === 1 ? "respuesta" : "respuestas"}`}</span>
          </div>
          {visible.length ? (
            <div className="knowledge-results">
              {visible.map((entry) => (
                <details key={entry.id} className="knowledge-item group">
                  <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-5 py-4">
                    <span><span className="knowledge-item-topic mb-1 block text-[.65rem] font-bold uppercase tracking-[.13em]">{entry.topic}</span><span className="font-display text-base font-bold leading-snug sm:text-lg">{entry.question}</span></span>
                    <span className="knowledge-plus flex size-9 shrink-0 items-center justify-center rounded-full"><Plus className="size-4 transition-transform group-open:rotate-45" aria-hidden="true" /></span>
                  </summary>
                  <p className="knowledge-answer max-w-2xl pb-6 pr-10 text-sm leading-relaxed sm:text-base">{entry.answer}</p>
                </details>
              ))}
            </div>
          ) : (
            <div className="knowledge-empty p-6 sm:p-8" role="status">
              <p className="font-display text-xl font-bold">Todavía no tenemos una respuesta publicada para eso.</p>
              <p className="mt-2 text-sm">Pregúntanos directamente y te damos la información vigente.</p>
              <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold">Consultar por WhatsApp <ArrowUpRight className="size-4" aria-hidden="true" /></a>
            </div>
          )}
          {featured && <button type="button" onClick={() => setExpanded(true)} className="knowledge-more mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold">Explorar las {KNOWLEDGE_BASE.length} respuestas <ArrowUpRight className="size-4" aria-hidden="true" /></button>}
          {!featured && !expanded && matching.length > visible.length && <button type="button" onClick={() => setExpanded(true)} className="knowledge-more mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold">Mostrar {matching.length - visible.length} respuestas más <ArrowUpRight className="size-4" aria-hidden="true" /></button>}
          <p className="knowledge-note mt-6 text-xs">La búsqueda muestra información disponible en este sitio. Para detalles no publicados o cambios de última hora, confirma directamente con la academia.</p>
        </div>
      </div>
    </div>
  );
}
