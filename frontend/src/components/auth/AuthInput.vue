<template>
  <div
    class="auth-field"
    :class="{
      'has-error': error,
      'is-disabled': disabled
    }"
  >
    <label
      v-if="label"
      :for="inputId"
      class="auth-label"
    >
      {{ label }}

      <span
        v-if="required"
        class="required-asterisk"
        aria-hidden="true"
      >
        *
      </span>
    </label>

    <div class="input-wrapper">
      <input
        :id="inputId"
        :type="computedType"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${inputId}-error` : null"
        class="auth-input"
        @input="$emit('update:modelValue', $event.target.value)"
      />

      <button
        v-if="type === 'password' && !disabled"
        type="button"
        class="toggle-password-btn"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        @click="showPassword = !showPassword"
      >
        <svg
          v-if="!showPassword"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <circle
            cx="12"
            cy="12"
            r="3"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <svg
          v-else
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <line
            x1="1"
            y1="1"
            x2="23"
            y2="23"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <p
      v-if="error"
      :id="`${inputId}-error`"
      class="error-text"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: ''
  },

  type: {
    type: String,
    default: 'text'
  },

  placeholder: {
    type: String,
    default: ''
  },

  modelValue: {
    type: [String, Number],
    default: ''
  },

  error: {
    type: String,
    default: ''
  },

  required: {
    type: Boolean,
    default: false
  },

  autocomplete: {
    type: String,
    default: 'off'
  },

  id: {
    type: String,
    default: ''
  },

  disabled: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);

const showPassword = ref(false);

const fallbackId = `input-${Math.random()
  .toString(36)
  .substring(2, 9)}`;

const inputId = computed(() => {
  return props.id || fallbackId;
});

const computedType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password';
  }

  return props.type;
});
</script>

<style scoped>
.auth-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.auth-label {
  display: block;
  margin-bottom: 7px;
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--ink);
}

.required-asterisk {
  margin-left: 2px;
  color: var(--red);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.auth-input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  outline: none;
  background: var(--paper);
  color: var(--ink);
  font-size: 0.92rem;
  transition:
    border-color var(--ease),
    box-shadow var(--ease),
    background-color var(--ease),
    color var(--ease);
}

.auth-input::placeholder {
  color: #8b837d;
}

.auth-input:focus {
  border-color: var(--red);
  box-shadow: 0 0 0 4px rgba(165, 29, 45, 0.08);
}

/* =========================
   DISABLED
========================= */

.auth-input:disabled {
  background: #f5f3f1;
  border-color: var(--line);
  color: #77716c;
  cursor: not-allowed;
  opacity: 1;
  box-shadow: none;
}

.auth-input:disabled::placeholder {
  color: #9a948f;
}

/* =========================
   ERROR
========================= */

.has-error .auth-input {
  border-color: #dc2626;
}

.has-error .auth-input:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
}

/* =========================
   PASSWORD TOGGLE
========================= */

.toggle-password-btn {
  position: absolute;
  right: 12px;
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: color var(--ease);
}

.toggle-password-btn:hover {
  color: var(--ink);
}

/* =========================
   ERROR MESSAGE
========================= */

.error-text {
  margin-top: 6px;
  margin-bottom: 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: #dc2626;
}
</style>