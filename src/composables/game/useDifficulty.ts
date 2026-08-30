import { ref } from "vue";
import type { DifficultySettings } from "./types";

const level = ref(1);

export function useDifficulty() {

  function update(timeLeft: number) {

    const elapsed = 60 - timeLeft;

    if (elapsed >= 40)
      level.value = 4;
    else if (elapsed >= 20)
      level.value = 3;
    else if (elapsed >= 10)
      level.value = 2;
    else
      level.value = 1;

  }

  function settings(): DifficultySettings {

    switch (level.value) {

      case 1:
        return {
          coinCount: 8,
          minSpeed: 2,
          maxSpeed: 4,
          goldChance: 0.10,
          bombChance: 0.08,
        };

      case 2:
        return {
          coinCount: 10,
          minSpeed: 3,
          maxSpeed: 5,
          goldChance: 0.15,
          bombChance: 0.10,
        };

      case 3:
        return {
          coinCount: 12,
          minSpeed: 4,
          maxSpeed: 6,
          goldChance: 0.20,
          bombChance: 0.15,
        };

      default:
        return {
          coinCount: 15,
          minSpeed: 5,
          maxSpeed: 8,
          goldChance: 0.25,
          bombChance: 0.20,
        };

    }

  }

  return {
    level,
    update,
    settings,
  };

}