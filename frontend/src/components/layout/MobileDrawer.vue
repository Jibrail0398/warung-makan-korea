<template>
  <div>
    <div
      class="drawer-backdrop"
      :class="{ open: isOpen }"
      :aria-hidden="!isOpen"
      @click="$emit('close')"
    ></div>
    <aside
      class="mobile-drawer"
      :class="{ open: isOpen }"
      aria-label="Mobile navigation"
      :aria-hidden="!isOpen"
    >
      <nav>
        <router-link to="/" @click="$emit('close')">Home</router-link>
        <router-link to="/menu" @click="$emit('close')">Menu</router-link>
        <router-link to="/order-history" @click="$emit('close')">Order History</router-link>
        <a href="/#about" @click="$emit('close')">About</a>
        <details>
          <summary>
            Language
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </summary>
          <div class="mobile-language-options">
            <button type="button">English</button>
            <button type="button">한국어</button>
            <button type="button">Bahasa Indonesia</button>
          </div>
        </details>
        <router-link to="/login" @click="$emit('close')">Login</router-link>
      </nav>
      <p class="mobile-drawer-footer">Authentic Indonesian food and ingredients in Korea.</p>
    </aside>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close']);
</script>

<style scoped>
.drawer-backdrop {
  display: none;
}
.mobile-drawer {
  display: none;
}

@media (max-width: 860px) {
  .drawer-backdrop {
    display: block;
    position: fixed;
    inset: 76px 0 0;
    z-index: 38;
    background: rgba(25, 21, 18, .35);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--ease);
  }
  .drawer-backdrop.open {
    opacity: 1;
    pointer-events: auto;
  }
  .mobile-drawer {
    position: fixed;
    top: 76px;
    left: 0;
    z-index: 40;
    display: flex;
    width: min(88vw, 360px);
    height: calc(100dvh - 76px);
    flex-direction: column;
    padding: 26px 24px;
    background: #fff;
    box-shadow: var(--shadow);
    transform: translateX(-105%);
    transition: transform 230ms ease;
  }
  .mobile-drawer.open {
    transform: translateX(0);
  }
  .mobile-drawer nav {
    display: grid;
    gap: 3px;
  }
  .mobile-drawer nav > a, .mobile-drawer summary {
    display: flex;
    min-height: 48px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--line);
    font-size: 1rem;
    font-weight: 700;
    list-style: none;
  }
  .mobile-drawer summary::-webkit-details-marker {
    display: none;
  }
  .mobile-language-options {
    display: grid;
    padding: 9px 0 11px 12px;
  }
  .mobile-language-options button {
    min-height: 42px;
    text-align: left;
  }
  .mobile-drawer-footer {
    margin-top: auto;
    color: var(--muted);
    font-size: .78rem;
  }
}

@media (max-width: 640px) {
  .drawer-backdrop {
    inset: 70px 0 0;
  }
  .mobile-drawer {
    top: 70px;
    height: calc(100dvh - 70px);
  }
}
</style>
