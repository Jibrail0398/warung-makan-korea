<template>
  <aside class="order-summary">
    <h2>Summary</h2>
    <div class="order-options">
      <div v-if="isLoggedIn" class="member-checkout-badge">
        <div class="member-badge-content">
          <span class="member-label">Pemesanan atas nama:</span>
          <strong class="member-name">{{ authStore.user?.name || authStore.user?.username || 'Pelanggan Member' }}</strong>
          <small class="member-phone">{{ authStore.user?.phone || '' }}</small>
        </div>
      </div>
      <div v-else class="guest-information">
        <div class="order-option"><label for="guestName">Name</label><input id="guestName" v-model="guestName" type="text" placeholder="Enter your name" autocomplete="name" :disabled="isSubmitting" /></div>
        <div class="order-option"><label for="phoneNumber">Phone number</label><input id="phoneNumber" v-model="phoneNumber" type="tel" inputmode="numeric" pattern="[0-9]*" placeholder="Enter your phone number" autocomplete="tel" :disabled="isSubmitting" @input="phoneNumber = phoneNumber.replace(/\D/g, '')" /></div>
      </div>
    </div>
    <div class="summary-lines">
      <div><span>Subtotal</span><strong>{{ cartStore.formatPrice(cartStore.subtotal) }}</strong></div>
    </div>
    <div class="summary-total"><span>Total</span><strong>{{ cartStore.formatPrice(cartStore.subtotal) }}</strong></div>
    <button class="checkout-button" type="button" :disabled="isSubmitting" @click="proceedToCheckout">
      <LoadingSpinner v-if="isSubmitting" size="sm" color="white" text="Membuat pesanan..." inline />
      <template v-else>
        <span>Proceed to checkout</span>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </template>
    </button>
    <NoticeModal :visible="isNoticeVisible" :type="noticeType" :title="noticeTitle" :message="noticeMessage" :detail="noticeDetail" :confirm-text="noticeConfirmText" @close="handleNoticeClose" @confirm="handleNoticeConfirm" />
  </aside>
</template>

<script>
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner.vue';
import NoticeModal from '../../common/NoticeModal/NoticeModal.vue';
import CartSummaryScript from './CartSummary.js';

export default {
  ...CartSummaryScript,
  components: {
    LoadingSpinner,
    NoticeModal,
    ...CartSummaryScript.components
  }
};
</script>
