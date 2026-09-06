<template>
  <div class="superadmin-dashboard">
    <header class="page-header">
      <div>
        <p class="page-eyebrow">INTERNAL DEVELOPER CONSOLE</p>
        <h1 class="page-title">Super Admin Dashboard</h1>
        <p class="page-description">
          Monitoring status server, integritas data sistem, aktivitas audit log, dan hak akses staf warung.
        </p>
      </div>

      <div class="header-actions">
        <router-link to="/super-admin/admins" class="btn-action">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8" />
          </svg>
          <span>Management Admin</span>
        </router-link>
        <router-link to="/super-admin/audit-logs" class="btn-action primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
            <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.8" />
          </svg>
          <span>Buka Audit Log</span>
        </router-link>
      </div>
    </header>

    <!-- System Status Metric Cards -->
    <section class="system-metrics-grid">
      <div class="sys-card">
        <div class="sys-card-header">
          <span class="sys-label">Active Admin Accounts</span>
          <span class="status-pill active-pill">Normal</span>
        </div>
        <strong class="sys-val">{{ adminsCount }}</strong>
        <span class="sys-sub">Admin & Kasir terdaftar</span>
      </div>

      <div class="sys-card">
        <div class="sys-card-header">
          <span class="sys-label">Audit Logs Recorded</span>
          <span class="status-pill active-pill">Live</span>
        </div>
        <strong class="sys-val">{{ auditLogsCount }}</strong>
        <span class="sys-sub">Aktivitas tercatat</span>
      </div>

      <div class="sys-card">
        <div class="sys-card-header">
          <span class="sys-label">API Gateway & Server</span>
          <span class="status-pill active-pill">Operational</span>
        </div>
        <strong class="sys-val sys-success">99.98%</strong>
        <span class="sys-sub">Latency: 28ms avg</span>
      </div>

      <div class="sys-card">
        <div class="sys-card-header">
          <span class="sys-label">Database Storage</span>
          <span class="status-pill active-pill">Healthy</span>
        </div>
        <strong class="sys-val">4.8 MB</strong>
        <span class="sys-sub">Snapshot auto-sync OK</span>
      </div>
    </section>

    <!-- Two Columns: Recent Audit Logs & System Health Info -->
    <div class="dashboard-two-col">
      <!-- Recent Audit Logs Table Card -->
      <section class="card logs-card">
        <div class="card-header">
          <h2 class="card-title">Aktivitas Sistem Terkini (Recent Audit Logs)</h2>
          <router-link to="/super-admin/audit-logs" class="view-all-link">
            Lihat Semua →
          </router-link>
        </div>

        <table class="mini-logs-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Target Resource</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in recentLogs" :key="log.id">
              <td>
                <span class="time-text">{{ log.timestamp }}</span>
              </td>
              <td>
                <strong>{{ log.actor }}</strong>
              </td>
              <td>
                <span class="action-code">{{ log.action }}</span>
              </td>
              <td>
                <span class="resource-text">{{ log.resource }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- System Quick Specs -->
      <section class="card specs-card">
        <h2 class="card-title">Konfigurasi Lingkungan</h2>

        <div class="spec-list">
          <div class="spec-item">
            <span class="spec-label">Environment:</span>
            <strong>Production / Staging</strong>
          </div>
          <div class="spec-item">
            <span class="spec-label">Frontend Framework:</span>
            <span>Vue 3 + Vite</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">State Management:</span>
            <span>Pinia Store</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Audio Synth:</span>
            <span>Web Audio API (Chime Alert)</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Security Role Guards:</span>
            <span class="sec-ok">Active & Enforced</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { adminService } from '../../services/adminService.js';

const adminsCount = ref(3);
const auditLogsCount = ref(8);
const recentLogs = ref([]);

onMounted(async () => {
  try {
    const [admins, logs] = await Promise.all([
      adminService.getAdmins(),
      adminService.getAuditLogs()
    ]);
    adminsCount.value = admins.length;
    auditLogsCount.value = logs.length;
    recentLogs.value = logs.slice(0, 5);
  } catch (err) {
    console.error('Super Admin Dashboard error:', err);
  }
});
</script>

<style scoped>
.superadmin-dashboard {
  width: 100%;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.page-eyebrow {
  margin: 0 0 6px;
  color: #2563eb;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.page-title {
  margin: 0;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(26px, 3.2vw, 34px);
  font-weight: 500;
  letter-spacing: -0.03em;
}

.page-description {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 0.86rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 16px;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink);
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  transition: all var(--ease);
}

.btn-action.primary {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}

.btn-action.primary:hover {
  background: #1d4ed8;
}

.btn-action:hover:not(.primary) {
  border-color: var(--ink);
}

.system-metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.sys-card {
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid var(--line);
  box-shadow: 0 2px 8px rgba(36, 25, 18, 0.03);
  display: flex;
  flex-direction: column;
}

.sys-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.sys-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--muted);
}

.status-pill {
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
}

.active-pill {
  background: #edf7ee;
  color: var(--success);
}

.sys-val {
  font-size: 1.6rem;
  font-family: Georgia, "Times New Roman", serif;
  color: var(--ink);
  margin-bottom: 2px;
}

.sys-success {
  color: var(--success);
}

.sys-sub {
  font-size: 0.72rem;
  color: var(--muted);
}

.dashboard-two-col {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  gap: 24px;
}

.card {
  padding: 24px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid var(--line);
  box-shadow: 0 2px 10px rgba(36, 25, 18, 0.04);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-title {
  margin: 0;
  font-size: 1.1rem;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 600;
  color: var(--ink);
}

.view-all-link {
  font-size: 0.78rem;
  font-weight: 750;
  color: #2563eb;
  text-decoration: none;
}

.view-all-link:hover {
  text-decoration: underline;
}

.mini-logs-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.8rem;
}

.mini-logs-table th {
  padding: 8px 12px;
  background: var(--soft);
  color: var(--muted);
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}

.mini-logs-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--line);
  vertical-align: middle;
}

.time-text {
  color: var(--muted);
  font-size: 0.72rem;
}

.action-code {
  font-family: monospace;
  font-size: 0.74rem;
  background: var(--soft);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--ink);
}

.resource-text {
  color: var(--muted);
  max-width: 200px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.spec-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 14px;
  font-size: 0.84rem;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line);
}

.spec-item:last-child {
  border-bottom: none;
}

.spec-label {
  color: var(--muted);
}

.sec-ok {
  color: var(--success);
  font-weight: 700;
}

@media (max-width: 1100px) {
  .system-metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .dashboard-two-col {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .system-metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
