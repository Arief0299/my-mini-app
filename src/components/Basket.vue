<script setup lang="ts">
defineProps<{
  x: number;
}>();
</script>

<template>
  <div
    class="basket"
    :style="{
      left: x + 'px'
    }"
  >
    <div class="basket-glow"></div>

    <span class="basket-icon">
      🧺
    </span>
  </div>
</template>

<style scoped>
.basket {
  position: absolute;

  bottom: 8px;

  width: 82px;
  height: 58px;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  z-index: 10;

  pointer-events: none;
  user-select: none;

  transition: left 0.05s linear;

  will-change: left;
}

.basket-icon {
  position: relative;

  display: block;

  font-size: 48px;
  line-height: 1;

  transform-origin: bottom center;

  filter:
    drop-shadow(0 3px 3px rgba(0, 0, 0, 0.75))
    drop-shadow(0 0 5px rgba(255, 190, 70, 0.25));

  transition: transform 0.08s ease;
}

/* Subtle landing area glow */
.basket-glow {
  position: absolute;

  left: 50%;
  bottom: 2px;

  width: 58px;
  height: 12px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: rgba(255, 190, 60, 0.18);

  filter: blur(7px);

  pointer-events: none;
}

/* =========================
   MOBILE
========================= */

@media (max-width: 480px) {
  .basket {
    width: 82px;
    height: 58px;
    bottom: 7px;
  }

  .basket-icon {
    font-size: 48px;
  }
}
</style>