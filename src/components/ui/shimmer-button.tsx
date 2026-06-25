import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"span"> & {
  className?: string;
};

// Píldora con borde luminoso y barrido de brillo. Se usa dentro de <Link> o <button>.
export function ShimmerButton({ children, className, ...props }: Props) {
  return (
    <span
      className={cn(
        "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-3.5 font-display text-base font-semibold text-primary-foreground shadow-[0_0_0_1px_oklch(0.7_0.19_47_/_0.45),0_8px_30px_-8px_oklch(0.7_0.19_47_/_0.55)] transition-transform duration-300 hover:scale-[1.03] active:scale-100",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full"
      />
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </span>
  );
}
