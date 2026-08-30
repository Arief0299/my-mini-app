<template>
<div class="card">

<h2>💰 Balance</h2>

<h1>{{ balance }}</h1>

</div>
</template>

<script setup lang="ts">
defineProps<{
balance:string
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