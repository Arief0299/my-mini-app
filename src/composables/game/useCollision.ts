import type { Coin } from "./types";

const BASKET_WIDTH = 80;
const BASKET_HEIGHT = 30;

export function useCollision() {

  function check(
    coin: Coin,
    basketX: number,
    stageHeight: number
  ): boolean {

    const basketTop = stageHeight - BASKET_HEIGHT;

    return (
      coin.y >= basketTop &&
      coin.x >= basketX - 20 &&
      coin.x <= basketX + BASKET_WIDTH
    );

  }

  return {
    check,
  };

}