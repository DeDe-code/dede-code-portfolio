<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";

definePageMeta({
  layout: "welcome",
});

// ============================================
// CUSTOMIZATION SETTINGS - Change these values
// ============================================
const FULL_TEXT = "dede-code"; // The text to type out
const TYPING_SPEED = 0.08; // Duration per character (lower = faster)

// Hero intro animation settings
const INITIAL_SIZE = 120; // Starting size in pixels
const ROLL_DURATION = 4; // Duration of rolling animation from left to center
const ROLL_DISTANCE = 50; // Percentage from left (50% = center)
const SOFT_PULSE_SCALE = 1.08; // Soft pulse scale (subtle like a heartbeat)
const SOFT_PULSE_DURATION = 0.8; // Duration of each heartbeat cycle (60-75 BPM)
const SOFT_PULSE_REPEATS = 5; // How many heartbeats before intensifying

const INTENSE_PULSE_SCALE = 1.15; // Intense pulse scale (stronger heartbeat)
const INTENSE_PULSE_DURATION = 0.7; // Slightly faster heartbeat (80-85 BPM)
const INTENSE_PULSE_REPEATS = 4; // How many intense heartbeats

const EXPANSION_DURATION = 3.5; // Duration of the massive expansion
const EXPANSION_SIZE = 5000; // Final size in pixels (must cover viewport)
const FADE_OUT_DURATION = 1.2; // Duration to fade out the white point
// ============================================

const headingRef = ref<HTMLElement | null>(null);
const displayText = ref("");
const heroPointRef = ref<HTMLElement | null>(null);
const heroShadingRef = ref<HTMLElement | null>(null);
const heroShadowRef = ref<HTMLElement | null>(null);
const heroOverlayRef = ref<HTMLElement | null>(null);
const pageBackgroundRef = ref<HTMLElement | null>(null);
let heroTimeline: gsap.core.Timeline | null = null;

onMounted(() => {
  // Hero intro animation
  if (
    heroPointRef.value &&
    heroShadowRef.value &&
    heroOverlayRef.value &&
    pageBackgroundRef.value
  ) {
    heroTimeline = gsap.timeline({
      onComplete: () => {
        // After animation completes, start typewriter
        startTypewriter();
      },
    });

    // Phase 0: Rolling from left to almost center
    heroTimeline.fromTo(
      heroPointRef.value,
      {
        left: `-${INITIAL_SIZE * 1.5}px`, // Start fully off screen left
        top: "50%",
        yPercent: -50,
        rotation: 0,
      },
      {
        left: `${ROLL_DISTANCE}%`, // Roll to center
        xPercent: -50, // Center the ball at its position
        rotation: 360 * (ROLL_DURATION * 2), // Full rotations based on duration
        duration: ROLL_DURATION,
        ease: "power2.out",
      },
    );

    // Counter-rotate the shading so it stays fixed (light from left)
    if (heroShadingRef.value) {
      heroTimeline.fromTo(
        heroShadingRef.value,
        {
          rotation: 0,
        },
        {
          rotation: -360 * (ROLL_DURATION * 2), // Counter-rotation to keep shading fixed
          duration: ROLL_DURATION,
          ease: "power2.out",
        },
        0, // Start at the same time as ball rotation
      );
    }

    // Animate shadow alongside ball (same timing, different position)
    heroTimeline.fromTo(
      heroShadowRef.value,
      {
        left: `-${INITIAL_SIZE * 1.5 + 20}px`, // Shadow starts slightly ahead
        top: "50%",
      },
      {
        left: `calc(${ROLL_DISTANCE}% + 20px)`, // Shadow stays ahead and to the right
        duration: ROLL_DURATION,
        ease: "power2.out",
      },
      0, // Start at the same time as ball
    );

    // Phase 1: Soft pulsing
    heroTimeline.to(heroPointRef.value, {
      scale: SOFT_PULSE_SCALE,
      duration: SOFT_PULSE_DURATION / 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: SOFT_PULSE_REPEATS * 2 - 1, // multiply by 2 for yoyo effect
    });

    // Phase 2: Intensify pulsing
    heroTimeline.to(heroPointRef.value, {
      scale: INTENSE_PULSE_SCALE,
      duration: INTENSE_PULSE_DURATION / 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: INTENSE_PULSE_REPEATS * 2 - 1,
    });

    // Phase 3: Massive expansion + change background to white
    heroTimeline.to(
      heroPointRef.value,
      {
        width: EXPANSION_SIZE,
        height: EXPANSION_SIZE,
        left: "50%",
        top: "50%",
        xPercent: -50, // Center horizontally
        yPercent: -50, // Center vertically
        scale: 1,
        rotation: "+=0", // Lock rotation during expansion
        duration: EXPANSION_DURATION,
        ease: "power2.inOut",
        transformOrigin: "50% 50%",
      },
      "expand",
    );

    // Scale shading overlay during expansion
    if (heroShadingRef.value) {
      heroTimeline.to(
        heroShadingRef.value,
        {
          width: EXPANSION_SIZE,
          height: EXPANSION_SIZE,
          duration: EXPANSION_DURATION,
          ease: "power2.inOut",
        },
        "expand",
      );
    }

    // Simultaneously change background to white
    heroTimeline.to(
      pageBackgroundRef.value,
      {
        backgroundColor: "#ffffff",
        duration: EXPANSION_DURATION,
        ease: "power2.inOut",
      },
      "expand",
    );

    // Phase 4: Fade out
    heroTimeline.to(heroOverlayRef.value, {
      opacity: 0,
      duration: FADE_OUT_DURATION,
      ease: "power2.inOut",
    });

    // Finally hide the overlay
    heroTimeline.set(heroOverlayRef.value, { display: "none" });
  } else {
    // If hero elements don't exist, start typewriter immediately
    startTypewriter();
  }
});

function startTypewriter() {
  if (!headingRef.value) return;

  // Create typing animation
  gsap.to(
    { progress: 0 },
    {
      progress: FULL_TEXT.length,
      duration: FULL_TEXT.length * TYPING_SPEED,
      ease: "none",
      onUpdate: function () {
        const currentProgress = Math.floor(this.targets()[0].progress);
        displayText.value = FULL_TEXT.substring(0, currentProgress);
      },
    },
  );
}

onUnmounted(() => {
  // Clean up animations
  if (heroTimeline) {
    heroTimeline.kill();
    heroTimeline = null;
  }
  gsap.killTweensOf({ progress: 0 });
});
</script>

<template>
  <!-- Page background wrapper -->
  <div ref="pageBackgroundRef" class="page-background">
    <!-- Hero intro overlay -->
    <div ref="heroOverlayRef" class="hero-overlay">
      <!-- Shadow (separate element) -->
      <div ref="heroShadowRef" class="hero-shadow" />
      <!-- Ball -->
      <div
        ref="heroPointRef"
        class="hero-point"
        :style="{ width: `${INITIAL_SIZE}px`, height: `${INITIAL_SIZE}px` }"
      >
        <!-- Shading overlay (doesn't rotate with ball) -->
        <div
          ref="heroShadingRef"
          class="hero-shading"
          :style="{ width: `${INITIAL_SIZE}px`, height: `${INITIAL_SIZE}px` }"
        />
      </div>
    </div>

    <!-- Main content -->
    <!-- <div class="welcome-container">
      <h1 ref="headingRef" class="typewriter-heading">
        <span class="typewriter-text">{{ displayText }}</span>
        <span class="typewriter-caret"></span>
      </h1>
    </div> -->
  </div>
</template>

<style scoped>
/* Page background */
.page-background {
  min-height: 100vh;
  width: 100%;
  background-color: transparent;
  transition: background-color 0s;
}

/* Hero intro animation styles */
.hero-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  z-index: 9999;
  pointer-events: none;
}

.hero-point {
  background: radial-gradient(
    circle at 35% 35%,
    #ffffff,
    #f0f0f0 40%,
    #d0d0d0 70%,
    #b0b0b0
  );
  border-radius: 50%;
  position: absolute;
  transform-origin: 50% 50%;
  z-index: 2;
  overflow: hidden;
}

.hero-shading {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.6) 25%,
    rgba(255, 255, 255, 0) 45%,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 0.2) 75%,
    rgba(0, 0, 0, 0.4) 100%
  );
  box-shadow:
    inset -20px -20px 40px rgba(0, 0, 0, 0.25),
    inset 20px 20px 40px rgba(255, 255, 255, 1);
  z-index: 3;
}

/* .hero-shadow {
  position: absolute;
  width: 140px;
  height: 50px;
  background: radial-gradient(
    ellipse,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0.5) 30%,
    rgba(255, 255, 255, 0.2) 60%,
    transparent 80%
  );
  border-radius: 50%;
  filter: blur(12px);
  transform: translateY(45px);
  z-index: 1;
} */

/* Main content styles */
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
}

.typewriter-heading {
  font-size: 3rem;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
}

.typewriter-text {
  display: inline-block;
}

.typewriter-caret {
  display: inline-block;
  width: 0.6em;
  height: 2px;
  background-color: currentColor;
  margin-left: 4px;
  margin-bottom: 0.2em;
  animation: blink 1s step-end infinite;
}

/* Blinking caret animation */
@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  50.01%,
  100% {
    opacity: 0;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .typewriter-heading {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .typewriter-heading {
    font-size: 1.5rem;
  }
}
</style>
