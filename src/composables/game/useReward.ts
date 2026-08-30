import { ref } from "vue";

export interface RewardEvent {

  id: number;

  score: number;

  timestamp: number;

}

const rewards = ref<RewardEvent[]>([]);

export function useReward() {

  function push(score: number) {

    rewards.value.push({

      id: Date.now(),

      score,

      timestamp: Date.now(),

    });

  }

  function clear() {

    rewards.value = [];

  }

  return {

    rewards,

    push,

    clear,

  };

}