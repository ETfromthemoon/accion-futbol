// Resplandor de fondo: dos halos verdes orbitando lento. CSS puro, sin JS.
export function Aurora() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
    >
      <div className="absolute -left-[12%] top-[8%] size-[55vw] max-w-[680px] rounded-full bg-primary/15 blur-[110px] animate-aurora-1" />
      <div className="absolute -right-[10%] top-[30%] size-[45vw] max-w-[560px] rounded-full bg-emerald-400/10 blur-[120px] animate-aurora-2" />
    </div>
  );
}
