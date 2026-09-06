<template>
  <div class="auth-field" :class="{ 'has-error': error }">
    <label v-if="label" :for="inputId" class="auth-label">
      {{ label }}
      <span v-if="required" class="required-asterisk" aria-hidden="true">*</span>
    </label>

    <div class="custom-select">
      <button
        :id="inputId"
        type="button"
        class="custom-select-button"
        :aria-expanded="isOpen"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${inputId}-error` : null"
        @click="isOpen = !isOpen"
      >
        <span :class="{ placeholder: !modelValue }">
          {{ selectedLabel }}
        </span>

        <span
          class="custom-select-arrow"
          :class="{ open: isOpen }"
          aria-hidden="true"
        ></span>
      </button>

      <div v-if="isOpen" class="custom-select-menu">
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          class="custom-select-option"
          :class="{ selected: modelValue === option.value }"
          @click="selectOption(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
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
import { computed, ref, onBeforeUnmount } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: ''
  },

  placeholder: {
    type: String,
    default: 'Select'
  },

  modelValue: {
    type: [String, Number],
    default: ''
  },

  options: {
    type: Array,
    default: () => []
  },

  error: {
    type: String,
    default: ''
  },

  required: {
    type: Boolean,
    default: false
  },

  id: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);

const fallbackId = `select-${Math.random().toString(36).substring(2, 9)}`;

const inputId = computed(() => props.id || fallbackId);

const selectedLabel = computed(() => {
  const option = props.options.find(
    option => option.value === props.modelValue
  );

  return option?.label || props.placeholder;
});

function selectOption(value) {
  emit('update:modelValue', value);
  isOpen.value = false;
}

function handleClickOutside(event) {
  const select = event.target.closest(`#${inputId.value}`);

  if (!select && !event.target.closest('.custom-select')) {
    isOpen.value = false;
  }
}

document.addEventListener('click', handleClickOutside);

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
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
  color: var(--red);
  margin-left: 2px;
}

.custom-select {
  position: relative;
  width: 100%;
}

.custom-select-button {
  display: flex;
  width: 100%;
  min-height: 48px;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--paper);
  color: var(--ink);
  font-family: inherit;
  font-size: 0.92rem;
  text-align: left;
  cursor: pointer;
  transition: border-color var(--ease), box-shadow var(--ease);
}

.custom-select-button:hover,
.custom-select-button:focus {
  border-color: var(--red);
  outline: none;
}

.custom-select-button:focus {
  box-shadow: 0 0 0 4px rgba(165, 29, 45, .08);
}

.placeholder {
  color: #8b837d;
}

.custom-select-arrow {
  width: 0;
  height: 0;
  flex-shrink: 0;
  margin-left: 12px;
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
  padding: 11px 16px;
  border: 0;
  background: #fff;
  color: var(--ink);
  font-family: inherit;
  font-size: 0.92rem;
  text-align: left;
  cursor: pointer;
  transition: background var(--ease), color var(--ease);
}

.custom-select-option:hover,
.custom-select-option.selected {
  background: var(--red);
  color: #fff;
}

.has-error .custom-select-button {
  border-color: #dc2626;
}

.has-error .custom-select-button:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, .1);
}

.error-text {
  margin-top: 6px;
  font-size: 0.8rem;
  color: #dc2626;
  font-weight: 600;
}
</style>