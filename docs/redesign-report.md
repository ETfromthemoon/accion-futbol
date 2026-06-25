# Reporte de rediseño — Acción Fútbol

## Antes / Después

| Métrica | Antes | Después |
|---|---|---|
| Mensaje en los primeros segundos | Listas de precios y horarios | "Despierta con pasión" + bajada clara |
| Prueba social en primera pantalla | No | Sí — franja de cifras tras el hero |
| Llamados a la acción | Muchos compitiendo (WhatsApp, formularios sueltos, "más info") | Uno solo, repetido (agendar clase de prueba) |
| Captura de datos | Dispersa, se pierden leads | Centralizada en un formulario → base de datos |
| Segmentación de leads | Ninguna | Programa de interés preseleccionado por tarjeta |
| Efectos de movimiento | Cero | 10 (blur-to-focus, spotlight, aurora, parallax, magnético, ticker, reveal, shimmer, hover, barra móvil) |
| Tipografía display | Sans genérica | Inter Tight, hasta 102px |
| Mobile | Funcional | Mobile-first + barra de CTA fija |
| Peso de imágenes | JPG pesados | WebP ≤ 500 KB |
| Atmósfera | Plana | Cinematográfica "estadio nocturno" |

## Verificación (quality-gate, 2 rondas)

- ✅ `npx tsc --noEmit` y `npm run build` pasan limpios.
- ✅ Sin errores ni warnings en consola del navegador.
- ✅ Sin scroll horizontal (paridad mobile 375px).
- ✅ Contadores animan a su valor final (no quedan en 0).
- ✅ Reduced-motion respetado vía `MotionConfig reducedMotion="user"`.
- ✅ Flujo de captación probado de punta a punta: lead válido → 200 + estado de éxito;
     datos inválidos → rechazo 422; preselección de programa funciona.
- ✅ Imágenes optimizadas a WebP bajo presupuesto de peso.

## Pendientes antes del lanzamiento real

1. **Reemplazar testimonios de muestra** por reseñas reales (en `src/lib/site.ts`).
2. **Conectar `DATABASE_URL`** a la base de datos definitiva (instrucciones en `README.md`).
3. **Reemplazar fotos de banco** por fotografía propia de la academia cuando esté disponible.
4. Confirmar precios/horarios vigentes de cada programa.
5. (Opcional) dominio propio en Vercel.

## Nota sobre fotografía

Las imágenes actuales son de banco libre (Unsplash), seleccionadas para la demo con
tratamiento cinematográfico. Recomendado: sustituir por fotos reales de entrenamientos
de Acción Fútbol para máxima autenticidad.
