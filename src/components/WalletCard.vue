<template>
  <div class="card">

    <h2>👛 Wallet Address</h2>

    <p class="address">

      {{ account }}

    </p>

    <button @click="copy">

      📋 Copy

    </button>

  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  account: string
}>()

function copy() {
  navigator.clipboard.writeText(props.account)
}
</script>

<style scoped>

.card{

background:#1f2937;
padding:20px;
margin-top:20px;
border-radius:15px;

}

.address{

word-break:break-all;

}

button{

margin-top:10px;

}

</style>