<script setup lang="ts">
import { ref } from "vue";
import WalletDashboard from "./components/WalletDashboard.vue";
import NimCatchGame from "./components/NimCatchGame.vue";

import { useWallet } from "./composables/useWallet";

const {
  account,
  balance,
  consensus,
  block,
  loading,

  message,
  signature,
  publicKey,

  recipient,
  amount,

  connectWallet,
  signWalletMessage,
  sendTransaction,
} = useWallet();

const page = ref<"wallet" | "game">("wallet");
</script>

<template>
  <div class="container">

    <h1>🚀 Nimiq Mini App</h1>

    <div class="menu">
      <button @click="page='wallet'">
        👛 Wallet
      </button>

      <button @click="page='game'">
        🎮 Game
      </button>
    </div>

    <WalletDashboard
      v-if="page==='wallet'"

      :account="account"
      :balance="balance"
      :consensus="consensus"
      :block="block"
      :loading="loading"

      :message="message"
      :signature="signature"
      :publicKey="publicKey"

      :recipient="recipient"
      :amount="amount"

      @connect="connectWallet"
      @sign="signWalletMessage"
      @send="sendTransaction"

      @update:message="message = $event"
      @update:recipient="recipient = $event"
      @update:amount="amount = $event"
    />

    <NimCatchGame
      v-else
    />

  </div>
</template>

<style>
body{
  margin:0;
  background:#111827;
  color:white;
  font-family:Arial,Helvetica,sans-serif;
}

.container{
  max-width:760px;
  margin:auto;
  padding:30px;
}

.menu{
  display:flex;
  gap:12px;
  margin-bottom:20px;
}

.menu button{
  flex:1;
}

button{
  border:none;
  border-radius:10px;
  padding:12px;
  cursor:pointer;
  background:#16a34a;
  color:white;
  font-size:16px;
}
</style>