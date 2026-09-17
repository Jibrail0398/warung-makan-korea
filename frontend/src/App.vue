<template>
  <router-view />
</template>

<style>
:root {
  --red: #a51d2d;
  --red-dark: #7d1522;
  --red-soft: #f9e9ec;
  --ink: #191512;
  --muted: #625b55;
  --line: #e7e0d9;
  --paper: #fff;
  --soft: #f7f4f0;
  --warm: #efe7df;
  --success: #246b47;
  --color-danger: #dc2626;
  --container: 1200px;
  --r-sm: 8px;
  --r-md: 12px;
  --r-lg: 16px;
  --shadow: 0 18px 50px rgba(36, 25, 18, .10);
  --shadow-sm: 0 4px 14px rgba(36, 25, 18, .06);
  --shadow-md: 0 10px 30px rgba(36, 25, 18, .08);
  --ease: 180ms ease;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; scroll-padding-top: 96px; }
body {
  min-width: 320px;
  background: var(--paper);
  color: var(--ink);
  font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
body.drawer-active { overflow: hidden; }
a { color: inherit; text-decoration: none; }
button, input { color: inherit; font: inherit; }
button { border: 0; background: none; cursor: pointer; }
img, svg { display: block; }
img { max-width: 100%; }
:focus-visible { outline: 3px solid rgba(165, 29, 45, .28); outline-offset: 3px; }
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}
.container { width: min(calc(100% - 48px), var(--container)); margin-inline: auto; }

/* ---------------------------------------------------------
   Global Transitions for Vue <Transition>
   --------------------------------------------------------- */
/* Modal smooth fade & scale */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-active .modal-card,
.modal-fade-enter-active .confirm-card,
.modal-fade-enter-active .confirm-dialog,
.modal-fade-enter-active .proof-modal,
.modal-fade-enter-active .print-modal-card,
.modal-fade-leave-active .modal-card,
.modal-fade-leave-active .confirm-card,
.modal-fade-leave-active .confirm-dialog,
.modal-fade-leave-active .proof-modal,
.modal-fade-leave-active .print-modal-card {
  transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1), opacity 220ms cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-card,
.modal-fade-enter-from .confirm-card,
.modal-fade-enter-from .confirm-dialog,
.modal-fade-enter-from .proof-modal,
.modal-fade-enter-from .print-modal-card,
.modal-fade-leave-to .modal-card,
.modal-fade-leave-to .confirm-card,
.modal-fade-leave-to .confirm-dialog,
.modal-fade-leave-to .proof-modal,
.modal-fade-leave-to .print-modal-card {
  opacity: 0;
  transform: translateY(14px) scale(0.96);
}

/* Simple fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Micro-interaction tap/click feedback */
button:active:not(:disabled) {
  transform: scale(0.97);
  transition: transform 80ms ease;
}

/* Smooth input focus transition */
input, select, textarea {
  transition: border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
}
input:focus, select:focus, textarea:focus {
  box-shadow: 0 0 0 3px rgba(165, 29, 45, 0.12);
}
</style>
