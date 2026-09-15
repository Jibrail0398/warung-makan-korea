<template>
  <div>
    <div class="drawer-backdrop" :class="{ open: isOpen }" :aria-hidden="!isOpen" @click="$emit('close')"></div>
    <aside class="mobile-drawer" :class="{ open: isOpen }" aria-label="Mobile navigation" :aria-hidden="!isOpen">
      <router-link class="mobile-drawer-brand" to="/" @click="$emit('close')"><span class="mobile-drawer-brand-mark" aria-hidden="true">WN</span><span class="mobile-drawer-brand-copy"><strong>Warung Nusantara</strong><small>Indonesia in Korea</small></span></router-link>
      <nav>
        <router-link to="/" @click="$emit('close')">Home</router-link>
        <router-link to="/#menu" @click="$emit('close')">Menu</router-link>
        <router-link to="/order-history" @click="$emit('close')">Order History</router-link>
        <router-link to="/#about" @click="$emit('close')">About</router-link>
        <router-link to="/login" @click="$emit('close')">Login</router-link>
      </nav>
      <p class="mobile-drawer-footer">Authentic Indonesian food and ingredients in Korea.</p>
    </aside>
  </div>
</template>

<script>
import './MobileDrawer.css';
export default {
  name: 'MobileDrawer',
  props: { isOpen: { type: Boolean, default: false } },
  emits: ['close']
};
</script>
