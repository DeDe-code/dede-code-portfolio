<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const skills = [
  "JavaScript",
  "Vue.js",
  "Nuxt.js",
  "Pinia",
  "HTML",
  "CSS",
  "Tailwind",
  "GitHub",
  "GitHub Copilot",
  "Supabase",
  "Vercel",
  "Cloudflare",
  "Chrome Extensions",
  "Communication",
  "Teamwork",
  "Creative Problem Solving",
  "Time Management",
  "Docker",
];

const containerRef = ref<HTMLElement | null>(null);
const tagRefs = ref<HTMLElement[]>([]);
const hoveredIndex = ref<number | null>(null);

let isPaused = false;
let angleX = 0;
let angleY = 0;
let animationId = 0;

const RADIUS = 240;

function getFibonacciPoints(count: number, radius: number) {
  const golden = (1 + Math.sqrt(5)) / 2;
  return Array.from({ length: count }, (_, i) => {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / count);
    const phi = (2 * Math.PI * i) / golden;
    return {
      x: radius * Math.sin(theta) * Math.cos(phi),
      y: radius * Math.sin(theta) * Math.sin(phi),
      z: radius * Math.cos(theta),
    };
  });
}

const basePoints = getFibonacciPoints(skills.length, RADIUS);

function rotate(
  p: { x: number; y: number; z: number },
  ax: number,
  ay: number,
) {
  const cax = Math.cos(ax),
    sax = Math.sin(ax);
  const y1 = p.y * cax - p.z * sax;
  const z1 = p.y * sax + p.z * cax;

  const cay = Math.cos(ay),
    say = Math.sin(ay);
  const x2 = p.x * cay + z1 * say;
  const z2 = -p.x * say + z1 * cay;

  return { x: x2, y: y1, z: z2 };
}

function updatePositions() {
  const container = containerRef.value;
  if (!container) return;
  const hw = container.offsetWidth / 2;
  const hh = container.offsetHeight / 2;
  const perspective = 650;

  basePoints.forEach((pt, i) => {
    const tag = tagRefs.value[i];
    if (!tag) return;
    const r = rotate(pt, angleX, angleY);
    const scale = perspective / (perspective - r.z);
    const x = hw + r.x * scale;
    const y = hh + r.y * scale;
    const depth = (r.z + RADIUS) / (2 * RADIUS);

    tag.style.left = `${x}px`;
    tag.style.top = `${y}px`;
    tag.style.transform = `translate(-50%, -50%) scale(${Math.max(0.45, scale * 0.72)})`;
    tag.style.opacity = String(0.12 + depth * 0.88);
    tag.style.zIndex = String(2 + Math.round(depth * 100));

    if (hoveredIndex.value === i) {
      tag.style.filter =
        "drop-shadow(0px 0px 10px rgba(252,71,71,0.7)) drop-shadow(2px 4px 6px rgba(0,0,0,0.5))";
      tag.style.backgroundColor = "black";
    } else {
      // Light source: top-left corner of page, shining toward the globe (upper-left-front)
      // Light direction unit vector pointing from globe surface TOWARD the light: (-0.6, -0.6, +0.4)
      const dot = (-r.x * 0.6 - r.y * 0.6 + r.z * 0.4) / RADIUS; // +1 = facing light, -1 = facing away
      // lightFactor: 0 = fully lit (white), 1 = fully shadowed (cool grey)
      const lightFactor = Math.max(0, Math.min(1, 0.5 - dot * 0.82));

      // bg: white-100 (#f8f8f5) when lit → cool blue-grey when in shadow
      const red = Math.round(248 - lightFactor * 32);
      const green = Math.round(248 - lightFactor * 34);
      const blue = Math.round(245 - lightFactor * 18);
      tag.style.backgroundColor = `rgb(${red},${green},${blue})`;

      const blur = ((1 - depth) * 1.6).toFixed(2);
      // Depth shadow falls toward lower-right (away from upper-left light)
      const shadowAlpha = (depth * 0.5).toFixed(2);
      const shadowBlur = (depth * 9).toFixed(1);
      const shadowOffX = (depth * 4).toFixed(1); // rightward
      const shadowOffY = (depth * 5).toFixed(1); // downward

      // Contact shadow: tags near the bottom cast a shadow downward+slightly-right
      const floorY = hh + RADIUS * 0.98;
      const floorDist = floorY - y;
      const maxFloorDist = RADIUS * 1.3;
      const contactFactor = Math.max(0, 1 - floorDist / maxFloorDist);
      const contactOffX = (floorDist * 0.22).toFixed(1); // slight rightward offset
      const contactOffY = (floorDist * 0.72).toFixed(1);
      const contactBlur = (6 + floorDist * 0.1).toFixed(1);
      const contactAlpha = (contactFactor * 0.32).toFixed(2);

      const contactShadow =
        contactFactor > 0.02
          ? ` drop-shadow(${contactOffX}px ${contactOffY}px ${contactBlur}px rgba(17,21,30,${contactAlpha}))`
          : "";

      tag.style.filter = `blur(${blur}px) drop-shadow(${shadowOffX}px ${shadowOffY}px ${shadowBlur}px rgba(0,0,0,${shadowAlpha}))${contactShadow}`;
    }
  });
}

function animate() {
  if (!isPaused) {
    angleY += 0.006;
    angleX += 0.002;
  }
  updatePositions();
  animationId = requestAnimationFrame(animate);
}

function setTagRef(el: Element | null, i: number) {
  if (el) tagRefs.value[i] = el as HTMLElement;
}

function onHover(i: number) {
  hoveredIndex.value = i;
  isPaused = true;
}

function onLeave() {
  hoveredIndex.value = null;
  isPaused = false;
}

onMounted(() => {
  tagRefs.value = new Array(skills.length).fill(null);
  animate();
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
});
</script>

<template>
  <div class="relative w-full h-full flex flex-col">
    <div class="lg:hidden absolute top-0 left-0 z-10 p-2">
      <ULink
        to="/code"
        class="text-preset-2 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
      >
        <i class="hn hn-arrow-left-solid" />
      </ULink>
    </div>

    <div ref="containerRef" class="globe-container">
      <span
        v-for="(skill, i) in skills"
        :key="skill"
        :ref="(el) => setTagRef(el as Element | null, i)"
        class="skill-tag"
        :class="{ 'skill-tag--active': hoveredIndex === i }"
        @mouseenter="onHover(i)"
        @mouseleave="onLeave"
      >
        {{ skill }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.globe-container {
  position: relative;
  flex: 1;
  width: 100%;
  min-height: calc(
    100vh - var(--min-height-app-header) - var(--min-height-app-footer)
  );
  overflow: hidden;
}

.globe-container::before {
  content: "";
  position: absolute;
  inset: 0;
  /* ambient glow — light source streams in from top-left corner */
  background: radial-gradient(
    ellipse 70% 65% at 14% 12%,
    rgba(254, 254, 251, 0.22) 0%,
    rgba(254, 254, 251, 0.07) 44%,
    transparent 68%
  );
  pointer-events: none;
  z-index: 1;
}

/* vignette — heavier at lower-right, matching the shadow side */
.globe-container::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 85% 80% at 38% 36%,
    transparent 50%,
    rgba(17, 21, 30, 0.07) 72%,
    rgba(17, 21, 30, 0.22) 100%
  );
  pointer-events: none;
  z-index: 3;
}

.skill-tag {
  position: absolute;
  cursor: pointer;
  white-space: nowrap;
  padding: 3px 10px;
  border: 2px solid black;
  background-color: var(--color-white-100, #f8f8f5);
  font-family: var(--font-sans);
  font-weight: 900;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  user-select: none;
  will-change: transform, left, top, opacity, filter;
  transition:
    color 0.15s ease,
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.skill-tag--active {
  color: #fc4747;
  border-color: #fc4747;
  background-color: black;
}
</style>
