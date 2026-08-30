<script setup lang="ts">
defineProps<{
  account: string;
  balance: string;
  consensus: boolean;
  block: number;
  loading: boolean;

  message: string;
  signature: string;
  publicKey: string;

  recipient: string;
  amount: number;
}>();

const emit = defineEmits([
  "connect",
  "sign",
  "send",
  "update:message",
  "update:recipient",
  "update:amount",
]);
</script>

<template>
  <button
    @click="emit('connect')"
    :disabled="loading"
  >
    {{ loading ? "Connecting..." : "Connect Wallet" }}
  </button>

  <div v-if="account">

    <div class="card">
      <h2>💰 Balance</h2>
      <h1>{{ balance }}</h1>
    </div>

    <div class="card">
      <h2>👛 Address</h2>

      <p class="address">
        {{ account }}
      </p>
    </div>

    <div class="card">
      <h2>🌐 Network</h2>

      <p>
        {{ consensus ? "🟢 Connected" : "🔴 Syncing" }}
      </p>
    </div>

    <div class="card">
      <h2>⛓ Block</h2>

      <h2>{{ block }}</h2>
    </div>

    <div class="card">

      <h2>📝 Sign Message</h2>

      <input
        :value="message"
        @input="emit('update:message', ($event.target as HTMLInputElement).value)"
        placeholder="Message"
      />

      <button @click="emit('sign')">
        Sign Message
      </button>

      <div v-if="publicKey">
        <h3>Public Key</h3>

        <p class="address">
          {{ publicKey }}
        </p>
      </div>

      <div v-if="signature">
        <h3>Signature</h3>

        <p class="address">
          {{ signature }}
        </p>
      </div>

    </div>

    <div class="card">

      <h2>💸 Send NIM</h2>

      <input
        :value="recipient"
        @input="emit('update:recipient', ($event.target as HTMLInputElement).value)"
        placeholder="Recipient Address"
      />

      <input
        :value="amount"
        @input="emit('update:amount', Number(($event.target as HTMLInputElement).value))"
        type="number"
        placeholder="Amount"
      />

      <button @click="emit('send')">
        🚀 Send NIM
      </button>

    </div>

  </div>
</template>

<style scoped>
.card {
  background: #1f2937;
  padding: 20px;
  border-radius: 12px;
  margin-top: 20px;
}

.address {
  word-break: break-all;
}

button {
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: #16a34a;
  color: white;
  cursor: pointer;
}

input {
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  box-sizing: border-box;
}
</style>