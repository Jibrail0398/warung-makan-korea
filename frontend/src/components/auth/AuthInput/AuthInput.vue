<template>
  <div class="auth-field" :class="{ 'has-error': error, 'is-disabled': disabled }">
    <label v-if="label" :for="inputId" class="auth-label">{{ label }}<span v-if="required" class="required-asterisk" aria-hidden="true">*</span></label>
    <div class="input-wrapper">
      <input :id="inputId" :type="computedType" :value="formattedValue" :placeholder="placeholder" :required="required" :autocomplete="autocomplete" :disabled="disabled" :inputmode="type === 'tel' ? 'numeric' : undefined" :maxlength="maxlength || undefined" :aria-invalid="!!error" :aria-describedby="error ? `${inputId}-error` : null" class="auth-input" @input="handleInput" @keydown="handleKeydown" />
      <button v-if="type === 'password' && !disabled" type="button" class="toggle-password-btn" :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">
        <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </div>
    <p v-if="error" :id="`${inputId}-error`" class="error-text" role="alert">{{ error }}</p>
  </div>
</template>

<script>
import AuthInputScript from './AuthInput.js';
export default { ...AuthInputScript };
</script>
