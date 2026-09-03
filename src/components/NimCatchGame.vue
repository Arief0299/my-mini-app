<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";

import Basket from "./Basket.vue";
import Coin from "./Coin.vue";

import { useGame } from "../composables/game/useGame";

const game = useGame();

const score = game.score;
const highScore = game.highScore;
const timeLeft = game.timeLeft;
const difficultyLevel = game.difficultyLevel;
const multiplier = game.multiplier;

const coins = game.coins;
const basketX = game.basketX;
const floatingTexts = game.floatingTexts;

const stageWidth = game.stageWidth;
const stageHeight = game.stageHeight;

onMounted(() => {
  game.start();
});

onBeforeUnmount(() => {
  game.stop();
});

function handleMove(event: PointerEvent) {
  const stage = event.currentTarget as HTMLElement;
  const rect = stage.getBoundingClientRect();

  const x = event.clientX - rect.left;

  game.moveBasket(x - 40);
}
</script>

<template>
  <div class="game">

    <div class="hud">

      <div class="hud-item">
        <span>Score</span>
        <strong>{{ score }}</strong>
      </div>

      <div class="hud-item">
        <span>High</span>
        <strong>{{ highScore }}</strong>
      </div>

      <div class="hud-item">
        <span>Time</span>
        <strong>{{ timeLeft }}</strong>
      </div>

      <div class="hud-item">
        <span>Level</span>
        <strong>{{ difficultyLevel }}</strong>
      </div>

      <div class="hud-item combo">
        <span>Combo</span>
        <strong>x{{ multiplier }}</strong>
      </div>

    </div>

    <div
      class="stage"
      :style="{
        width: stageWidth + 'px',
        height: stageHeight + 'px'
      }"
      @pointermove="handleMove"
    >

      <Coin
        v-for="coin in coins"
        :key="coin.id"
        :x="coin.x"
        :y="coin.y"
        :type="coin.type"
      />

      <Basket :x="basketX" />

      <div
        v-for="item in floatingTexts"
        :key="item.id"
        class="floating"
        :style="{
          left: item.x + 'px',
          top: item.y + 'px',
          color: item.color
        }"
      >
        {{ item.text }}
      </div>

    </div>

  </div>
</template>

<style scoped>
.game {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.hud {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 8px;
  width: 100%;
  max-width: 430px;
  margin-bottom: 12px;
}

.hud-item {
  flex: 1;
  min-width: 0;
  padding: 8px 6px;
  border-radius: 10px;

  background: rgba(30, 30, 30, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.05);

  color: white;
  text-align: center;

  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.25);
}

.hud-item span {
  display: block;
  margin-bottom: 2px;
  font-size: 10px;
  line-height: 1.2;
  opacity: 0.7;
}

.hud-item strong {
  display: block;
  font-size: 16px;
  line-height: 1.2;
  font-weight: 700;
}

.combo strong {
  color: #ffd84d;
}

.stage {
  position: relative;
  overflow: hidden;

  background:
    radial-gradient(
      circle at 50% 35%,
      rgba(255, 190, 0, 0.06),
      transparent 45%
    ),
    #101010;

  border-radius: 12px;

  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.35),
    inset 0 0 0 1px rgba(255, 255, 255, 0.025);

  touch-action: none;
  user-select: none;
}

.floating {
  position: absolute;
  z-index: 20;

  font-size: 17px;
  font-weight: 800;

  pointer-events: none;
  user-select: none;

  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.8);

  animation: float 0.8s ease-out forwards;
}

@keyframes float {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  100% {
    opacity: 0;
    transform: translateY(-42px) scale(1.15);
  }
}

@media (max-width: 480px) {
  .hud {
    gap: 5px;
    margin-bottom: 10px;
  }

  .hud-item {
    padding: 7px 3px;
    border-radius: 9px;
  }

  .hud-item span {
    font-size: 9px;
  }

  .hud-item strong {
    font-size: 14px;
  }

  .stage {
    border-radius: 11px;
  }
}
</style>