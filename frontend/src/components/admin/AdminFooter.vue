<template>
  <footer class="admin-footer">
    <div class="footer-inner">
      <span>
        © 2026 Warung Nusantara
      </span>

      <span class="footer-divider">
        /
      </span>

      <span>
        Admin Panel
      </span>
    </div>
  </footer>
</template>

<style scoped>
.admin-footer {
  flex-shrink: 0;

  min-height: 68px;

  display: flex;
  align-items: center;

  background: var(--paper);
  border-top: 1px solid var(--line);
}

.footer-inner {
  width: 100%;

  padding: 18px 28px;

  display: flex;
  align-items: center;
  gap: 8px;

  color: var(--muted);

  font-size: 11px;
}

.footer-divider {
  color: var(--line);
}

@media (max-width: 1040px) {
  .footer-inner {
    padding: 17px 22px;
  }
}

@media (max-width: 860px) {
  .admin-footer {
    min-height: 64px;
  }

  .footer-inner {
    padding: 16px;

    justify-content: center;

    font-size: 10px;
  }
}
</style>