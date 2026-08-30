<script setup lang="ts">
defineProps<{
  account: string;
  balance: string;
  consensus: boolean;
  block: number;
  loading: boolean;

  debugStatus: string;
  lastError: string;
  lastTxHash: string;

  providerConnected: boolean;
  providerNetwork: string;

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
    class="primary-button"
    @click="emit('connect')"
    :disabled="loading"
  >
    {{ loading ? "Processing..." : "Connect Wallet" }}
  </button>

  <div v-if="account">

    <!-- DEBUG PANEL -->
    <div class="debug-card">
      <h2>🔍 Network Debug</h2>

      <div class="debug-row">
        <span>Provider</span>
        <strong>
          {{ providerConnected ? "🟢 Connected" : "🔴 Disconnected" }}
        </strong>
      </div>

      <div class="debug-row">
        <span>Network</span>
        <strong>{{ providerNetwork }}</strong>
      </div>

      <div class="debug-row">
        <span>Consensus</span>
        <strong>
          {{ consensus ? "🟢 Established" : "🔴 Syncing" }}
        </strong>
      </div>

      <div class="debug-row">
        <span>Block</span>
        <strong>{{ block }}</strong>
      </div>

      <div class="debug-row">
        <span>Status</span>
        <strong>{{ debugStatus }}</strong>
      </div>
    </div>

    <div
      v-if="lastError"
      class="error-card"
    >
      <strong>⚠️ Error:</strong>

      <p>
        {{ lastError }}
      </p>
    </div>

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
        @input="
          emit(
            'update:message',
            ($event.target as HTMLInputElement).value
          )
        "
        placeholder="Enter a message"
        :disabled="loading"
      />

      <button
        class="secondary-button"
        @click="emit('sign')"
        :disabled="loading || !message.trim()"
      >
        {{ loading ? "Signing..." : "Sign Message" }}
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
        @input="
          emit(
            'update:recipient',
            ($event.target as HTMLInputElement).value
          )
        "
        placeholder="Recipient Address"
        :disabled="loading"
      />

      <input
        :value="amount"
        @input="
          emit(
            'update:amount',
            Number(($event.target as HTMLInputElement).value)
          )
        "
        type="number"
        min="0"
        step="0.00001"
        placeholder="Amount in NIM"
        :disabled="loading"
      />

      <button
        class="send-button"
        @click="emit('send')"
        :disabled="loading || !recipient.trim() || amount <= 0"
      >
        {{ loading ? "Sending..." : "🚀 Send NIM" }}
      </button>

      <div
        v-if="lastTxHash"
        class="success-card"
      >
        <h3>✅ Transaction Sent</h3>

        <p class="address">
          {{ lastTxHash }}
        </p>
      </div>
    </div>

  </div>
</template>

<style scoped>
.card,
.debug-card,
.error-card,
.success-card {
  padding: 20px;
  border-radius: 12px;
  margin-top: 20px;
}

.card {
  background: #1f2937;
}

.debug-card {
  background: #172554;
  border: 1px solid #2563eb;
}

.debug-card h2 {
  margin-top: 0;
}

.debug-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #374151;
}

.debug-row:last-child {
  border-bottom: none;
}

.error-card {
  background: #7f1d1d;
}

.success-card {
  background: #14532d;
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
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.primary-button {
  background: #16a34a;
}

.secondary-button {
  background: #2563eb;
}

.send-button {
  background: #16a34a;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input {
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid #4b5563;
  background: #111827;
  color: white;
  font-size: 16px;
}

input:disabled {
  opacity: 0.6;
}
</style>
