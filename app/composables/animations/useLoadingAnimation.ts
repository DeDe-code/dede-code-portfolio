import { gsap } from "gsap";

const TOTAL_BLOCKS = 24;

export function useLoadingAnimation(onComplete: () => void) {
  const pixelBlocks = ref<boolean[]>(Array(TOTAL_BLOCKS).fill(false));
  const percentText = ref("00");

  function start(screenSelector: string) {
    const tl = gsap.timeline();

    tl.to({}, { duration: 0.4 });

    for (let i = 0; i < TOTAL_BLOCKS; i++) {
      const index = i;
      tl.call(
        () => {
          pixelBlocks.value[index] = true;
          const pct = Math.round(((index + 1) / TOTAL_BLOCKS) * 100);
          percentText.value =
            pct === 100 ? "100" : String(pct).padStart(2, "0");
        },
        [],
        "+=0.085",
      );
    }

    tl.to(
      screenSelector,
      {
        opacity: 0,
        duration: 0.55,
        ease: "power2.inOut",
      },
      "+=0.5",
    );

    tl.call(onComplete);
  }

  return { pixelBlocks, percentText, start };
}
