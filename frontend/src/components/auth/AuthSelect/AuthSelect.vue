<template>
  <div class="auth-field" :class="{ 'has-error': error }">
    <label v-if="label" :for="inputId" class="auth-label">{{ label }}<span v-if="required" class="required-asterisk" aria-hidden="true">*</span></label>
    <div class="custom-select">
      <button :id="inputId" type="button" class="custom-select-button" :aria-expanded="isOpen" :aria-invalid="!!error" :aria-describedby="error ? `${inputId}-error` : null" @click="isOpen = !isOpen">
        <span :class="{ placeholder: !modelValue }">{{ selectedLabel }}</span>
        <span class="custom-select-arrow" :class="{ open: isOpen }" aria-hidden="true"></span>
      </button>
      <div v-if="isOpen" class="custom-select-menu">
        <button v-for="option in options" :key="option.value" type="button" class="custom-select-option" :class="{ selected: modelValue === option.value }" @click="selectOption(option.value)">{{ option.label }}</button>
      </div>
    </div>
    <p v-if="error" :id="`${inputId}-error`" class="error-text" role="alert">{{ error }}</p>
  </div>
</template>

<script>
import AuthSelectScript from './AuthSelect.js';
export default { ...AuthSelectScript };
</script>
