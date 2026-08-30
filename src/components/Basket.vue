<script setup lang="ts">
defineProps<{
  x: number;
}>();
</script>

<template>
  <div
    class="basket"
    :style="{
      left: x + 'px'
    }"
  >
    🧺
  </div>
</template>

<style scoped>
.basket{
  position:absolute;
  bottom:12px;
  width:80px;
  height:50px;

  display:flex;
  align-items:center;
  justify-content:center;

  font-size:44px;

  transition:left .05s linear;

  user-select:none;
}
</style>