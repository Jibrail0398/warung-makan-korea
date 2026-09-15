<template>
  <div class="superadmin-dashboard">
    <header class="page-header"><div><p class="page-eyebrow">INTERNAL DEVELOPER CONSOLE</p><h1 class="page-title">Super Admin Dashboard</h1><p class="page-description">Monitoring status server, integritas data sistem, aktivitas audit log, dan hak akses staf warung.</p></div><div class="header-actions"><router-link to="/super-admin/admins" class="btn-action"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8" /></svg><span>Management Admin</span></router-link><router-link to="/super-admin/audit-logs" class="btn-action primary"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" /><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.8" /></svg><span>Buka Audit Log</span></router-link></div></header>
    <section class="system-metrics-grid">
      <div class="sys-card"><div class="sys-card-header"><span class="sys-label">Active Admin Accounts</span><span class="status-pill active-pill">Normal</span></div><strong class="sys-val">{{ adminsCount }}</strong><span class="sys-sub">Admin & Kasir terdaftar</span></div>
      <div class="sys-card"><div class="sys-card-header"><span class="sys-label">Audit Logs Recorded</span><span class="status-pill active-pill">Live</span></div><strong class="sys-val">{{ auditLogsCount }}</strong><span class="sys-sub">Aktivitas tercatat</span></div>
      <div class="sys-card"><div class="sys-card-header"><span class="sys-label">API Gateway & Server</span><span class="status-pill active-pill">Operational</span></div><strong class="sys-val sys-success">99.98%</strong><span class="sys-sub">Latency: 28ms avg</span></div>
      <div class="sys-card"><div class="sys-card-header"><span class="sys-label">Database Storage</span><span class="status-pill active-pill">Healthy</span></div><strong class="sys-val">4.8 MB</strong><span class="sys-sub">Snapshot auto-sync OK</span></div>
    </section>
    <div class="dashboard-two-col">
      <section class="card logs-card"><div class="card-header"><h2 class="card-title">Aktivitas Sistem Terkini (Recent Audit Logs)</h2><router-link to="/super-admin/audit-logs" class="view-all-link">Lihat Semua →</router-link></div><table class="mini-logs-table"><thead><tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>Target Resource</th></tr></thead><tbody><tr v-for="log in recentLogs" :key="log.id"><td><span class="time-text">{{ log.timestamp }}</span></td><td><strong>{{ log.actor }}</strong></td><td><span class="action-code">{{ log.action }}</span></td><td><span class="resource-text">{{ log.resource }}</span></td></tr></tbody></table></section>
      <section class="card specs-card"><h2 class="card-title">Konfigurasi Lingkungan</h2><div class="spec-list"><div class="spec-item"><span class="spec-label">Environment:</span><strong>Production / Staging</strong></div><div class="spec-item"><span class="spec-label">Frontend Framework:</span><span>Vue 3 + Vite</span></div><div class="spec-item"><span class="spec-label">State Management:</span><span>Pinia Store</span></div><div class="spec-item"><span class="spec-label">Audio Synth:</span><span>Web Audio API (Chime Alert)</span></div><div class="spec-item"><span class="spec-label">Security Role Guards:</span><span class="sec-ok">Active & Enforced</span></div></div></section>
    </div>
  </div>
</template>

<script>
import SuperAdminDashboardScript from './SuperAdminDashboardView.js';
export default { ...SuperAdminDashboardScript };
</script>
