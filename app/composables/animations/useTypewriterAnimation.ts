import { gsap } from "gsap";

interface TypewriterOptions {
  /** Seconds per character */
  charDelay?: number;
  /** Whether to show a blinking cursor while typing (default: true) */
  cursor?: boolean;
}

/**
 * GSAP-driven typewriter animation.
 * Reveals each target element's text character-by-character, sequentially.
 *
 * Usage:
 *   const { play, stop } = useTypewriterAnimation()
 *   play([el1, el2], ['Hello', 'World'])
 */
export function useTypewriterAnimation() {
  let tl: gsap.core.Timeline | null = null;

  function play(
    targets: (HTMLElement | null | undefined)[],
    texts: string[],
    options: TypewriterOptions = {},
  ) {
    tl?.kill();
    tl = gsap.timeline();

    const charDelay = options.charDelay ?? 0.035;
    const showCursor = options.cursor !== false;

    targets.forEach((el, i) => {
      if (!el || texts[i] === undefined) return;
      const text = texts[i];
      el.textContent = "";
      const counter = { value: 0 };
      const duration = Math.max(text.length * charDelay, 0.01);

      tl!.to(
        counter,
        {
          value: text.length,
          duration,
          ease: "none",
          onUpdate() {
            const partial = text.slice(0, Math.round(counter.value));
            if (showCursor) {
              el.innerHTML = `${partial}<span class="tw-cursor">&#x258C;</span>`;
            } else {
              el.textContent = partial;
            }
          },
          onComplete() {
            el.textContent = text;
          },
        },
        // All lines start at the same time (offset = 0)
        0,
      );
    });
  }

  function stop() {
    tl?.kill();
    tl = null;
  }

  return { play, stop };
}
