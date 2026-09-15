<template>
  <AuthLayout title="Verifikasi nomor HP" :subtitle="subtitle">
    <form @submit.prevent="handleVerifyOtp" class="auth-form" novalidate>
      <div v-if="errorMessage" class="global-error-box" role="alert"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg><span>{{ errorMessage }}</span></div>
      <div class="otp-container" @paste="handlePaste">
        <input v-for="(digit, index) in otpDigits" :key="index" :ref="el => inputRefs[index] = el" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-box" :class="{ 'has-value': digit !== '', 'has-error': !!errorMessage }" v-model="otpDigits[index]" @input="handleDigitInput(index, $event)" @keydown="handleKeyDown(index, $event)" :aria-label="`OTP Digit ${index + 1}`" autocomplete="one-time-code" />
      </div>
      <div class="resend-row">
        <template v-if="timer > 0"><span class="resend-text">Belum menerima kode? Kirim ulang dalam </span><strong class="timer-count">00:{{ formattedTimer }}</strong></template>
        <template v-else><span class="resend-text">Belum menerima kode? </span><button type="button" class="resend-btn" @click="resendOtp">Kirim ulang OTP</button></template>
      </div>
      <AuthButton text="VERIFIKASI OTP" :loading="isLoading" type="submit" variant="primary" />
      <AuthDivider text="or" />
      <div class="auth-footer-nav"><router-link to="/register" class="back-link">&larr; Kembali ke pendaftaran</router-link></div>
    </form>
  </AuthLayout>
</template>

<script>
import VerifyOtpViewScript from './VerifyOtpView.js';
export default { ...VerifyOtpViewScript };
</script>
