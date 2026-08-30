import { ref } from "vue";
import type { FloatingText } from "./types";

const floatingTexts = ref<FloatingText[]>([]);

export function useFloatingScore() {

  function add(
    x: number,
    y: number,
    text: string,
    color: string
  ) {

    const id = Date.now() + Math.random();

    floatingTexts.value.push({
      id,
      x,
      y,
      text,
      color,
    });

    window.setTimeout(() => {
      floatingTexts.value = floatingTexts.value.filter(
        (item: FloatingText) => item.id !== id
      );
    }, 800);

  }

  function clear() {
    floatingTexts.value = [];
  }

  return {
    floatingTexts,
    add,
    clear,
  };

}