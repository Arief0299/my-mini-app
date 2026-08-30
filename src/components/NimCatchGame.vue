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

      <div class="item">
        <span>Score</span>
        <strong>{{ score }}</strong>
      </div>

      <div class="item">
        <span>High</span>
        <strong>{{ highScore }}</strong>
      </div>

      <div class="item">
        <span>Time</span>
        <strong>{{ timeLeft }}</strong>
      </div>

      <div class="item">
        <span>Level</span>
        <strong>{{ difficultyLevel }}</strong>
      </div>

      <div class="item">
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
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 12px;
}

.item {
  min-width: 70px;
  padding: 8px 12px;
  border-radius: 10px;
  background: #222;
  color: white;
  text-align: center;
}

.item span {
  display: block;
  font-size: 12px;
  opacity: 0.7;
}

.item strong {
  display: block;
  font-size: 18px;
}

.stage {
  position: relative;
  overflow: hidden;
  background: #111;
  border-radius: 12px;
  touch-action: none;
}

.floating {
  position: absolute;
  font-weight: bold;
  pointer-events: none;
  animation: float 0.8s linear forwards;
}

@keyframes float {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(-40px);
  }
}
</style>
