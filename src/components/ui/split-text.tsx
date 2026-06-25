type Props = {
  text: string;
  delay?: number;
  stagger?: number;
  startIndex?: number;
};

// Reveal blur-to-focus vía CSS (no JS): cada palabra ocupa su lugar final desde
// el primer frame y se enfoca secuencialmente. Al ser CSS, funciona sin
// JavaScript y nunca deja el texto oculto de forma permanente (a diferencia de
// un reveal basado en estado que se congela en pestañas en segundo plano).
export function SplitText({
  text,
  delay = 0,
  stagger = 0.04,
  startIndex = 0,
}: Props) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wIdx) => {
        const i = startIndex + wIdx;
        return (
          <span key={wIdx} className="inline-block">
            <span
              className="split-word inline-block"
              style={{ animationDelay: `${delay + i * stagger}s` }}
            >
              {word}
            </span>
            {wIdx < words.length - 1 && <span>&nbsp;</span>}
          </span>
        );
      })}
    </>
  );
}
