<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  x: number;
  y: number;
  type: "coin" | "gold" | "bomb";
}>();

const icon = computed(() => {
  switch (props.type) {
    case "gold":
      return "⭐";

    case "bomb":
      return "💣";

    default:
      return "🪙";
  }
});

const cssClass = computed(() => {
  switch (props.type) {
    case "gold":
      return "gold";

    case "bomb":
      return "bomb";

    default:
      return "coin";
  }
});
</script>

<template>
  <div
    class="item"
    :class="cssClass"
    :style="{
      left: x + 'px',
      top: y + 'px'
    }"
  >
    {{ icon }}
  </div>
</template>

<style scoped>

.item{

position:absolute;

width:40px;
height:40px;

display:flex;
align-items:center;
justify-content:center;

font-size:34px;

pointer-events:none;

user-select:none;

animation:spin 2s linear infinite;

}

.coin{

filter:drop-shadow(0 0 6px gold);

}

.gold{

font-size:38px;

filter:
drop-shadow(0 0 12px yellow)
drop-shadow(0 0 18px orange);

animation:
spin 1s linear infinite,
glow 1s ease-in-out infinite alternate;

}

.bomb{

font-size:38px;

animation:
pulse .5s infinite;

}

@keyframes spin{

from{

transform:rotate(0deg);

}

to{

transform:rotate(360deg);

}

}

@keyframes glow{

from{

transform:scale(1);

}

to{

transform:scale(1.25);

}

}

@keyframes pulse{

0%{

transform:scale(1);

}

50%{

transform:scale(1.18);

}

100%{

transform:scale(1);

}

}

</style>