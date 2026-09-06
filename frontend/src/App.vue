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
  --ease: 180ms ease;
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
</style>
