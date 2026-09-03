<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  x: number;
  y: number;
  type: "coin" | "gold" | "bomb";
}>();

const icon = computed(() => {
  switch (props.type) {
    case "gold":
      return "⭐";

    case "bomb":
      return "💣";

    default:
      return "🪙";
  }
});

const cssClass = computed(() => {
  switch (props.type) {
    case "gold":
      return "gold";

    case "bomb":
      return "bomb";

    default:
      return "coin";
  }
});
</script>

<template>
  <div
    class="falling-item"
    :class="cssClass"
    :style="{
      left: x + 'px',
      top: y + 'px'
    }"
  >
    <span class="icon">
      {{ icon }}
    </span>
  </div>
</template>

<style scoped>
.falling-item {
  position: absolute;

  width: 46px;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  pointer-events: none;
  user-select: none;

  z-index: 5;
}

.icon {
  display: block;

  font-size: 31px;
  line-height: 1;

  transform-origin: center;

  will-change: transform;
}

/* =========================
   NORMAL COIN
========================= */

.coin .icon {
  animation: coinFloat 1.8s ease-in-out infinite;

  filter:
    drop-shadow(0 2px 2px rgba(0, 0, 0, 0.7))
    drop-shadow(0 0 5px rgba(255, 205, 40, 0.55));
}

/* =========================
   GOLD STAR
========================= */

.gold {
  width: 50px;
  height: 50px;
}

.gold .icon {
  font-size: 37px;

  animation: starPulse 0.9s ease-in-out infinite alternate;

  filter:
    drop-shadow(0 2px 2px rgba(0, 0, 0, 0.7))
    drop-shadow(0 0 6px rgba(255, 215, 0, 0.9))
    drop-shadow(0 0 12px rgba(255, 175, 0, 0.55));
}

/* =========================
   BOMB
========================= */

.bomb .icon {
  font-size: 34px;

  animation: bombPulse 0.55s ease-in-out infinite;

  filter:
    drop-shadow(0 2px 2px rgba(0, 0, 0, 0.8));
}

/* =========================
   ANIMATIONS
========================= */

@keyframes coinFloat {
  0% {
    transform: translateY(0) rotate(-4deg);
  }

  50% {
    transform: translateY(-2px) rotate(4deg);
  }

  100% {
    transform: translateY(0) rotate(-4deg);
  }
}

@keyframes starPulse {
  from {
    transform: scale(0.94) rotate(-4deg);
  }

  to {
    transform: scale(1.08) rotate(4deg);
  }
}

@keyframes bombPulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.12);
  }

  100% {
    transform: scale(1);
  }
}
</style>