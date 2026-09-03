<script setup lang="ts">
import { onBeforeUnmount } from "vue";

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

const isRunning = game.isRunning;
const isGameStarted = game.isGameStarted;
const isGameOver = game.isGameOver;

function startGame() {
  game.start();
}

function restartGame() {
  game.restart();
}

function handleMove(event: PointerEvent) {
  if (!isRunning.value) {
    return;
  }

  const stage = event.currentTarget as HTMLElement;
  const rect = stage.getBoundingClientRect();

  const x = event.clientX - rect.left;

  game.moveBasket(x - 40);
}

onBeforeUnmount(() => {
  game.stop();
});
</script>

<template>
  <div class="game">

    <!-- START MENU -->
    <div
      v-if="!isGameStarted && !isGameOver"
      class="menu"
    >
      <div class="logo">
        NIM
      </div>

      <h1>NIMCATCH</h1>

      <p>Catch the coins and stars!</p>

      <button
        class="game-button"
        type="button"
        @click="startGame"
      >
        START GAME
      </button>

      <div class="best-score">
        Best Score: {{ highScore }}
      </div>
    </div>

    <!-- GAME -->
    <template v-if="isRunning">

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

    </template>

    <!-- GAME OVER -->
    <div
      v-if="isGameOver"
      class="menu"
    >
      <div class="game-over-icon">
        END
      </div>

      <h1>GAME OVER</h1>

      <div class="final-score">
        <span>YOUR SCORE</span>
        <strong>{{ score }}</strong>
      </div>

      <div class="best-score">
        Best Score: {{ highScore }}
      </div>

      <button
        class="game-button"
        type="button"
        @click="restartGame"
      >
        RESTART GAME
      </button>
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

/* MENU */

.menu {
  width: 100%;
  max-width: 430px;
  min-height: 300px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;

  padding: 35px 20px;

  border-radius: 20px;

  background:
    radial-gradient(
      circle at 50% 25%,
      rgba(255, 200, 50, 0.15),
      transparent 55%
    ),
    #101010;

  border: 1px solid rgba(255, 255, 255, 0.08);

  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.4);
}

.logo,
.game-over-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 70px;
  height: 70px;

  margin-bottom: 12px;

  border-radius: 50%;

  background: #ffd84d;

  color: #111;

  font-size: 20px;
  font-weight: 900;

  box-shadow:
    0 8px 25px rgba(255, 190, 0, 0.25);
}

.menu h1 {
  margin: 0;

  color: white;

  font-size: 32px;
  font-weight: 900;

  letter-spacing: 2px;
}

.menu p {
  margin: 8px 0 28px;

  color: rgba(255, 255, 255, 0.6);

  font-size: 14px;
}

/* BUTTON */

.game-button {
  border: none;

  padding: 14px 30px;

  border-radius: 12px;

  background: linear-gradient(
    135deg,
    #ffd84d,
    #ffae00
  );

  color: #111;

  font-size: 15px;
  font-weight: 900;

  cursor: pointer;

  box-shadow:
    0 8px 20px rgba(255, 180, 0, 0.25);

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.game-button:hover {
  transform: translateY(-2px);

  box-shadow:
    0 10px 28px rgba(255, 180, 0, 0.4);
}

.game-button:active {
  transform: translateY(1px);
}

.best-score {
  margin-top: 18px;

  color: rgba(255, 255, 255, 0.5);

  font-size: 13px;
}

/* HUD */

.hud {
  display: flex;
  justify-content: center;

  gap: 8px;

  width: 100%;
  max-width: 430px;

  margin-bottom: 12px;
}

.hud-item {
  flex: 1;

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

/* GAME STAGE */

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

/* FLOATING SCORE */

.floating {
  position: absolute;

  z-index: 20;

  font-size: 17px;
  font-weight: 800;

  pointer-events: none;
  user-select: none;

  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.8);

  animation:
    float 0.8s ease-out forwards;
}

@keyframes float {
  0% {
    opacity: 1;

    transform:
      translateY(0)
      scale(1);
  }

  100% {
    opacity: 0;

    transform:
      translateY(-42px)
      scale(1.15);
  }
}

/* FINAL SCORE */

.final-score {
  display: flex;

  flex-direction: column;

  align-items: center;

  margin: 10px 0 5px;
}

.final-score span {
  color: rgba(255, 255, 255, 0.5);

  font-size: 11px;
}

.final-score strong {
  color: white;

  font-size: 42px;

  font-weight: 900;
}

/* MOBILE */

@media (max-width: 480px) {
  .menu {
    min-height: 270px;
  }

  .menu h1 {
    font-size: 28px;
  }

  .hud {
    gap: 5px;
  }

  .hud-item {
    padding: 7px 3px;
  }

  .hud-item span {
    font-size: 9px;
  }

  .hud-item strong {
    font-size: 14px;
  }
}
</style>