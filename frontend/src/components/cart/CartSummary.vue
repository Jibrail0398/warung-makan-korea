<template>
  <aside class="order-summary">
    <span class="eyebrow">Order summary</span>
    <h2>Summary</h2>

<div class="order-options">

  <!-- Guest Name -->
  <div class="order-option">
    <label for="guestName">Name</label>
    <input
      id="guestName"
      v-model="guestName"
      type="text"
      placeholder="Enter your name"
      autocomplete="name"
    />
  </div>

  <!-- Phone Number -->
  <div class="order-option">
    <label for="phoneNumber">Phone number</label>
<input
  id="phoneNumber"
  v-model="phoneNumber"
  type="tel"
  inputmode="numeric"
  pattern="[0-9]*"
  placeholder="Enter your phone number"
  autocomplete="tel"
  @input="phoneNumber = phoneNumber.replace(/\D/g, '')"
/>
  </div>

  <!-- Order Note -->
  <div class="order-option">
    <label for="orderNote">Order note <span>(optional)</span></label>
    <textarea
      id="orderNote"
      v-model="orderNote"
      placeholder="Add a note for your order..."
      rows="3"
    ></textarea>
  </div>

  <!-- Order Type -->
  <div class="order-option">
    <label>Order type</label>
    <div class="custom-select">
      <button
        type="button"
        class="custom-select-button"
        @click="orderTypeOpen = !orderTypeOpen"
      >
        {{ orderTypeLabel }}
        <span class="custom-select-arrow" :class="{ open: orderTypeOpen }"></span>
      </button>

      <div v-if="orderTypeOpen" class="custom-select-menu">
        <button
          v-for="option in orderTypeOptions"
          :key="option.value"
          type="button"
          class="custom-select-option"
          @click="selectOrderType(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>

  <!-- Schedule -->
  <div class="order-option">
    <label>Schedule</label>
    <div class="custom-select">
      <button
        type="button"
        class="custom-select-button"
        @click="scheduleOpen = !scheduleOpen"
      >
        {{ scheduleLabel }}
        <span class="custom-select-arrow" :class="{ open: scheduleOpen }"></span>
      </button>

      <div v-if="scheduleOpen" class="custom-select-menu">
        <button
          v-for="option in scheduleOptions"
          :key="option.value"
          type="button"
          class="custom-select-option"
          @click="selectSchedule(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>

  <!-- Scheduled Date & Time -->
  <div v-if="scheduleType === 'schedule'" class="schedule-fields">
    <div class="order-option">
      <label for="scheduleDate">Date</label>
      <input id="scheduleDate" v-model="scheduleDate" type="date" />
    </div>

    <div class="order-option">
      <label for="scheduleTime">Time</label>
      <input id="scheduleTime" v-model="scheduleTime" type="time" />
    </div>
  </div>

</div>

    <div class="summary-lines">
      <div>
        <span>Subtotal</span>
        <strong>{{ cartStore.formatPrice(cartStore.subtotal) }}</strong>
      </div>
      <div>
        <span>Delivery</span>
        <strong>{{ cartStore.delivery === 0 ? 'Free' : cartStore.formatPrice(cartStore.delivery) }}</strong>
      </div>
    </div>

    <div class="summary-total">
      <span>Total</span>
      <strong>{{ cartStore.formatPrice(cartStore.total) }}</strong>
    </div>

    <router-link class="checkout-button" to="/checkout">
      Proceed to checkout
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </router-link>

    <p class="secure-note">
      Secure checkout · Order confirmation available after payment
    </p>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from '../../stores/cart.js';

const cartStore = useCartStore();

const orderType = ref('dine-in');
const scheduleType = ref('now');
const scheduleDate = ref('');
const scheduleTime = ref('');
const guestName = ref('');
const orderNote = ref('');
const phoneNumber = ref('');

const orderTypeOpen = ref(false);
const scheduleOpen = ref(false);

const orderTypeOptions = [
  { value: 'dine-in', label: 'Dine-in' },
  { value: 'takeaway', label: 'Takeaway' },
  { value: 'delivery', label: 'Delivery' }
];

const scheduleOptions = [
  { value: 'now', label: 'As soon as possible' },
  { value: 'schedule', label: 'Schedule for later' }
];

const orderTypeLabel = computed(() => {
  const opt = orderTypeOptions.find(o => o.value === orderType.value);
  return opt?.label || 'Dine-in';
});

const scheduleLabel = computed(() => {
  const opt = scheduleOptions.find(o => o.value === scheduleType.value);
  return opt?.label || 'As soon as possible';
});

function selectOrderType(val) {
  orderType.value = val;
  orderTypeOpen.value = false;
}

function selectSchedule(val) {
  scheduleType.value = val;
  scheduleOpen.value = false;
  if (val === 'now') {
    scheduleDate.value = '';
    scheduleTime.value = '';
  }
}
</script>

<style scoped>
.order-summary {
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: #fff;
}

.eyebrow {
  display: block;
  color: var(--red);
  font-size: .7rem;
  font-weight: 800;
  letter-spacing: .15em;
  text-transform: uppercase;
}

.order-summary h2 {
  margin-top: 4px;
  margin-bottom: 20px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.45rem;
  font-weight: 500;
}

.order-options {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line);
}

.order-option {
  display: grid;
  gap: 7px;
}

.order-option label {
  color: var(--ink);
  font-size: .72rem;
  font-weight: 800;
}

.custom-select {
  position: relative;
  width: 100%;
}

.custom-select-button {
  display: flex;
  width: 100%;
  min-height: 44px;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: #fff;
  color: var(--ink);
  font-family: inherit;
  font-size: .8rem;
  text-align: left;
  cursor: pointer;
  transition: border-color var(--ease), box-shadow var(--ease);
}

.custom-select-button:hover, .custom-select-button:focus {
  border-color: var(--red);
  outline: none;
}

.custom-select-arrow {
  width: 0;
  height: 0;
  border-top: 6px solid var(--red);
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
  transition: transform var(--ease);
}

.custom-select-arrow.open {
  transform: rotate(180deg);
}

.custom-select-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 100;
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: #fff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, .10);
}

.custom-select-option {
  display: block;
  width: 100%;
  padding: 11px 12px;
  border: 0;
  background: #fff;
  color: var(--ink);
  font-family: inherit;
  font-size: .8rem;
  text-align: left;
  cursor: pointer;
  transition: background var(--ease), color var(--ease);
}

.custom-select-option:hover {
  background: var(--red);
  color: #fff;
}

.order-option input {
  width: 100%;
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  outline: none;
  background: #fff;
  color: var(--ink);
  font-family: inherit;
  font-size: .8rem;
}

.schedule-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.summary-lines {
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line);
}

.summary-lines > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--muted);
}

.summary-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--ink);
}

.checkout-button {
  display: flex;
  min-height: 52px;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: var(--r-sm);
  background: var(--red);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: background var(--ease), transform var(--ease);
}

.checkout-button:hover {
  background: var(--red-dark);
  transform: translateY(-1px);
}

.secure-note {
  margin-top: 16px;
  text-align: center;
  color: var(--muted);
  font-size: 0.76rem;
}

.order-option input,
.order-option textarea {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  outline: none;
  background: #fff;
  color: var(--ink);
  font-family: inherit;
  font-size: .8rem;
  transition: border-color var(--ease), box-shadow var(--ease);
}

.order-option input {
  min-height: 44px;
}

.order-option textarea {
  min-height: 80px;
  resize: vertical;
  line-height: 1.5;
}

.order-option input::placeholder,
.order-option textarea::placeholder {
  color: var(--muted);
}

.order-option input:focus,
.order-option textarea:focus {
  border-color: var(--red);
  box-shadow: 0 0 0 3px rgba(190, 35, 35, .08);
}

.order-option label span {
  color: var(--muted);
  font-weight: 500;
}
</style>
