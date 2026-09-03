import { ref } from "vue";

import {
  STAGE_WIDTH,
  STAGE_HEIGHT,
} from "./constants";

import type { Coin } from "./types";

import { createCoin } from "./coinFactory";
import { useCollision } from "./useCollision";
import { useCombo } from "./useCombo";
import { useDifficulty } from "./useDifficulty";
import { useFloatingScore } from "./useFloatingScore";
import { useReward } from "./useReward";
import { useTimer } from "./useTimer";

export function useGame() {
  const score = ref(0);

  const highScore = ref(
    Number(localStorage.getItem("highScore") || 0)
  );

  const basketX = ref(
    (STAGE_WIDTH - 80) / 2
  );

  const coins = ref<Coin[]>([]);

  const isRunning = ref(false);
  const isGameStarted = ref(false);
  const isGameOver = ref(false);

  let gameLoop: number | null = null;

  const combo = useCombo();
  const difficulty = useDifficulty();
  const collision = useCollision();
  const floating = useFloatingScore();
  const reward = useReward();
  const timer = useTimer();

  function rebuildCoins(): void {
    const settings = difficulty.settings();
    const target = settings.coinCount;

    while (coins.value.length < target) {
      coins.value.push(
        createCoin(
          coins.value.length,
          settings
        )
      );
    }

    while (coins.value.length > target) {
      coins.value.pop();
    }
  }

  function resetCoin(index: number): void {
    const oldCoin = coins.value[index];

    if (!oldCoin) {
      return;
    }

    const newCoin = createCoin(
      oldCoin.id,
      difficulty.settings()
    );

    newCoin.y = -50;

    coins.value[index] = newCoin;
  }

  function catchCoin(coin: Coin): void {
    combo.increase();

    let value = 0;
    let textColor = "#ffffff";

    switch (coin.type) {
      case "coin":
        value = 1;
        break;

      case "gold":
        value = 5;
        textColor = "#FFD700";
        break;

      case "bomb":
        value = -3;
        textColor = "#ff4444";
        break;
    }

    value *= combo.multiplier.value;

    score.value = Math.max(
      0,
      score.value + value
    );

    floating.add(
      coin.x,
      coin.y,
      value > 0
        ? `+${value}`
        : `${value}`,
      textColor
    );

    reward.push(value);

    if (score.value > highScore.value) {
      highScore.value = score.value;

      localStorage.setItem(
        "highScore",
        String(score.value)
      );
    }
  }

  function update(): void {
    if (!isRunning.value) {
      return;
    }

    difficulty.update(
      timer.timeLeft.value
    );

    rebuildCoins();

    coins.value.forEach(
      (coin, index) => {
        coin.y += coin.speed;

        if (coin.y > STAGE_HEIGHT) {
          resetCoin(index);
          return;
        }

        const hit = collision.check(
          coin,
          basketX.value,
          STAGE_HEIGHT
        );

        if (hit) {
          catchCoin(coin);
          resetCoin(index);
        }
      }
    );
  }

  function moveBasket(x: number): void {
    basketX.value = Math.max(
      0,
      Math.min(
        STAGE_WIDTH - 80,
        x
      )
    );
  }

  function gameOver(): void {
    stop();

    isGameOver.value = true;
    isGameStarted.value = false;
  }

  function start(): void {
    stop();

    score.value = 0;

    combo.combo.value = 0;
    combo.multiplier.value = 1;

    difficulty.level.value = 1;

    coins.value = [];

    basketX.value =
      (STAGE_WIDTH - 80) / 2;

    isGameOver.value = false;
    isGameStarted.value = true;
    isRunning.value = true;

    rebuildCoins();

    timer.start(() => {
      gameOver();
    });

    gameLoop = window.setInterval(
      update,
      16
    );
  }

  function restart(): void {
    start();
  }

  function stop(): void {
    if (gameLoop !== null) {
      window.clearInterval(
        gameLoop
      );

      gameLoop = null;
    }

    timer.stop();

    isRunning.value = false;
  }

  return {
    score,
    highScore,

    basketX,
    coins,

    isRunning,
    isGameStarted,
    isGameOver,

    combo: combo.combo,
    multiplier: combo.multiplier,

    floatingTexts:
      floating.floatingTexts,

    rewards:
      reward.rewards,

    difficultyLevel:
      difficulty.level,

    timeLeft:
      timer.timeLeft,

    moveBasket,

    start,
    restart,
    stop,

    stageWidth:
      STAGE_WIDTH,

    stageHeight:
      STAGE_HEIGHT,
  };
}