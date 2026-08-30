<template>

<div class="card">

<h2>⛓ Current Block</h2>

<h1>{{ block }}</h1>

</div>

</template>

<script setup lang="ts">

defineProps<{

block:number

}>()

</script>

<style scoped>

.card{

background:#1f2937;
padding:20px;
margin-top:20px;
border-radius:15px;

}

</style>