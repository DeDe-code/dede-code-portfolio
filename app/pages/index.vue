<template>
  <div
    ref="containerRef"
    class="relative w-full min-h-[calc(100vh_-_var(--min-height-app-header)_-_var(--min-height-app-footer))] overflow-hidden"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <!--
      Inline SVG providing the fog mask + distortion filter.
      The SVG is full-size so that maskUnits="userSpaceOnUse" coordinates
      (i.e. cursor positions relative to the container) map 1:1 to the mask space.
      overflow:visible lets displaced shapes bleed past the SVG bounds without clipping.
    -->
    <svg
      class="absolute inset-0 w-full h-full"
      style="pointer-events: none; overflow: visible"
      aria-hidden="true"
    >
      <defs>
        <!--
          Fog distortion filter pipeline:
          1. feTurbulence  — generates fractal noise used as displacement map
          2. feDisplacementMap — push circle pixels by the noise → jagged, cloud-like edge
          3. feGaussianBlur   — soften the jagged edges into a hazy fog look
          4. feComponentTransfer (gamma on alpha) — punch up mid-alpha so the
             fog looks dense in the centre and wisps out to nothing at the edges
        -->
        <filter
          id="fog-filter"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          color-interpolation-filters="linearRGB"
        >
          <feTurbulence
            ref="turbulenceRef"
            type="fractalNoise"
            baseFrequency="0.016 0.011"
            numOctaves="4"
            seed="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="65"
            xChannelSelector="R"
            yChannelSelector="G"
            result="distorted"
          />
          <feGaussianBlur in="distorted" stdDeviation="14" result="blurred" />
          <feComponentTransfer in="blurred">
            <!-- amplitude/exponent curve: dense core, wispy edges -->
            <feFuncA type="gamma" amplitude="1.8" exponent="0.45" offset="0" />
          </feComponentTransfer>
        </filter>

        <!--
          Fog mask.
          White pixels = reveal original image; black/transparent = show filtered layer.
          A centre circle + 4 orbiting "puff" circles form a cloud-like blob.
          All are grouped so the same filter is applied once to the merged shape.
        -->
        <mask id="fog-mask" maskUnits="userSpaceOnUse">
          <g filter="url(#fog-filter)">
            <circle ref="mainPuffRef" cx="-500" cy="-500" r="0" fill="white" />
            <circle
              ref="puffARef"
              cx="-500"
              cy="-500"
              r="0"
              fill="rgb(235,235,235)"
            />
            <circle
              ref="puffBRef"
              cx="-500"
              cy="-500"
              r="0"
              fill="rgb(215,215,215)"
            />
            <circle
              ref="puffCRef"
              cx="-500"
              cy="-500"
              r="0"
              fill="rgb(195,195,195)"
            />
            <circle
              ref="puffDRef"
              cx="-500"
              cy="-500"
              r="0"
              fill="rgb(175,175,175)"
            />
          </g>
        </mask>
      </defs>
    </svg>

    <!-- Filtered layer — always visible as the base -->
    <div
      class="absolute inset-0 bg-[url('/image/_MG_2826.jpg')] bg-cover bg-center grayscale contrast-[800%]"
    />

    <!-- Original layer — revealed only through the animated fog mask -->
    <div
      class="absolute inset-0 bg-[url('/image/_MG_2826.jpg')] bg-cover bg-center"
      :style="{ mask: 'url(#fog-mask)', WebkitMask: 'url(#fog-mask)' }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const containerRef = ref<HTMLDivElement>();
const turbulenceRef = ref<SVGFETurbulenceElement>();
const mainPuffRef = ref<SVGCircleElement>();
const puffARef = ref<SVGCircleElement>();
const puffBRef = ref<SVGCircleElement>();
const puffCRef = ref<SVGCircleElement>();
const puffDRef = ref<SVGCircleElement>();

const { onMouseMove, onMouseLeave } = useHeroFogAnimation({
  containerRef,
  turbulenceRef,
  mainPuffRef,
  puffRefs: [puffARef, puffBRef, puffCRef, puffDRef],
});
</script>
