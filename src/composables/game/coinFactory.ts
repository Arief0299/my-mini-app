import type {
  Coin,
  CoinType,
  DifficultySettings,
} from "./types";

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomType(
  settings: DifficultySettings
): CoinType {

  const r = Math.random();

  if (r < settings.goldChance) return "gold";

  if (
    r <
    settings.goldChance +
      settings.bombChance
  ) {
    return "bomb";
  }

  return "coin";

}

export function createCoin(
  id: number,
  settings: DifficultySettings
): Coin {

  return {
    id,
    x: random(0, 280),
    y: -random(50, 700),
    speed: random(
      settings.minSpeed,
      settings.maxSpeed
    ),
    type: randomType(settings),
  };

}