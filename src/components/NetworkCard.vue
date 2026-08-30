<template>

<div class="card">

<h2>🌐 Network</h2>

<p>

{{ connected ? "🟢 Connected":"🔴 Syncing" }}

</p>

</div>

</template>

<script setup lang="ts">

defineProps<{

connected:boolean

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