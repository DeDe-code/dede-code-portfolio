import { onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import type { Ref } from "vue";

interface FogRefs {
  containerRef: Ref<HTMLDivElement | undefined>;
  turbulenceRef: Ref<SVGFETurbulenceElement | undefined>;
  mainPuffRef: Ref<SVGCircleElement | undefined>;
  puffRefs: Ref<SVGCircleElement | undefined>[];
}

const ORBITS = [
  { ax: 95, ay: 55, fx: 0.7, fy: 0.55, ph: 0.0, sr: 0.72 },
  { ax: -75, ay: 85, fx: 1.0, fy: 0.85, ph: Math.PI * 0.6, sr: 0.63 },
  { ax: 110, ay: -65, fx: 0.55, fy: 1.1, ph: Math.PI * 1.3, sr: 0.58 },
  { ax: -90, ay: -80, fx: 1.2, fy: 0.65, ph: Math.PI * 2.0, sr: 0.5 },
] as const;

function setCircle(
  el: SVGCircleElement | undefined | null,
  cx: number,
  cy: number,
  r: number,
) {
  if (!el) return;
  el.setAttribute("cx", String(cx));
  el.setAttribute("cy", String(cy));
  el.setAttribute("r", String(r));
}

export function useHeroFogAnimation(refs: FogRefs) {
  const smooth = { x: -500, y: -500 };
  const fogState = { radius: 0 };
  const turbProxy = { freq: 0.016 };

  let isActive = false;
  let quickX: ReturnType<typeof gsap.quickTo>;
  let quickY: ReturnType<typeof gsap.quickTo>;
  let tickerCb: () => void;

  onMounted(() => {
    quickX = gsap.quickTo(smooth, "x", { duration: 0.5, ease: "power3.out" });
    quickY = gsap.quickTo(smooth, "y", { duration: 0.5, ease: "power3.out" });

    gsap.to(turbProxy, {
      freq: 0.026,
      duration: 9,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      onUpdate() {
        refs.turbulenceRef.value?.setAttribute(
          "baseFrequency",
          `${turbProxy.freq} ${turbProxy.freq * 0.68}`,
        );
      },
    });

    tickerCb = () => {
      const t = gsap.ticker.time;
      const r = fogState.radius;

      setCircle(refs.mainPuffRef.value, smooth.x, smooth.y, r);

      refs.puffRefs.forEach((pRef, i) => {
        const o = ORBITS[i];
        if (!o) return;
        const cx = smooth.x + o.ax * Math.sin(o.fx * t + o.ph);
        const cy = smooth.y + o.ay * Math.cos(o.fy * t + o.ph);
        setCircle(pRef.value, cx, cy, r * o.sr);
      });
    };

    gsap.ticker.add(tickerCb);
  });

  onUnmounted(() => {
    if (tickerCb) gsap.ticker.remove(tickerCb);
    gsap.killTweensOf(smooth);
    gsap.killTweensOf(fogState);
    gsap.killTweensOf(turbProxy);
  });

  function onMouseMove(e: MouseEvent) {
    if (!refs.containerRef.value) return;
    const rect = refs.containerRef.value.getBoundingClientRect();
    quickX(e.clientX - rect.left);
    quickY(e.clientY - rect.top);

    if (!isActive) {
      isActive = true;
      gsap.to(fogState, { radius: 185, duration: 0.6, ease: "power2.out" });
    }
  }

  function onMouseLeave() {
    if (!isActive) return;
    isActive = false;
    gsap.to(fogState, { radius: 0, duration: 0.8, ease: "power2.in" });
  }

  return { onMouseMove, onMouseLeave };
}
