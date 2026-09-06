<template>
  <div class="audit-log-page">
    <header class="page-header">
      <div>
        <p class="page-eyebrow">AUDIT TRAIL & LOGS</p>
        <h1 class="page-title">Audit Log & Activity Log</h1>
        <p class="page-description">
          Rekaman jejak aktivitas seluruh aksi sensitif yang dilakukan oleh Admin, Kasir, dan Sistem.
        </p>
      </div>
    </header>

    <!-- Filters & Search -->
    <section class="filter-bar-card">
      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cari user, action, atau resource..."
          class="search-input"
        />
      </div>

      <select v-model="selectedActionFilter" class="filter-select">
        <option value="all">Semua Jenis Aksi (Action)</option>
        <option value="UPDATE_ORDER_STATUS">UPDATE_ORDER_STATUS</option>
        <option value="VERIFY_PAYMENT">VERIFY_PAYMENT</option>
        <option value="CREATE_PRODUCT">CREATE_PRODUCT</option>
        <option value="UPDATE_PRODUCT">UPDATE_PRODUCT</option>
        <option value="DELETE_PRODUCT">DELETE_PRODUCT</option>
        <option value="CREATE_CATEGORY">CREATE_CATEGORY</option>
        <option value="RESET_PASSWORD">RESET_PASSWORD</option>
        <option value="LOGIN">LOGIN</option>
      </select>
    </section>

    <!-- Logs Table -->
    <div class="table-container">
      <table class="audit-table">
        <thead>
          <tr>
            <th scope="col">Log ID</th>
            <th scope="col">Waktu (Timestamp)</th>
            <th scope="col">Pelaku (Actor)</th>
            <th scope="col">Aksi (Action)</th>
            <th scope="col">Target / Resource</th>
            <th scope="col">IP Address</th>
            <th scope="col">Status</th>
            <th scope="col" class="col-actions">Detail</th>
          </tr>
        </thead>
        <tbody v-if="filteredLogs.length > 0">
          <tr v-for="log in filteredLogs" :key="log.id">
            <td>
              <span class="log-id">{{ log.id }}</span>
            </td>
            <td>
              <span class="timestamp-text">{{ log.timestamp }}</span>
            </td>
            <td>
              <strong class="actor-name">{{ log.actor }}</strong>
            </td>
            <td>
              <span class="action-tag" :class="`action-${log.action?.toLowerCase()}`">
                {{ log.action }}
              </span>
            </td>
            <td>
              <span class="resource-text">{{ log.resource }}</span>
            </td>
            <td>
              <span class="ip-text">{{ log.ip }}</span>
            </td>
            <td>
              <span class="status-pill-ok">{{ log.status }}</span>
            </td>
            <td class="col-actions">
              <button
                type="button"
                class="btn-inspect"
                title="Lihat Detail Payload"
                @click="inspectLog(log)"
              >
                Inspect
              </button>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="8" class="empty-cell">
              Tidak ada riwayat log yang sesuai dengan filter pencarian.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- JSON Payload Inspector Modal -->
    <div v-if="selectedLog" class="modal-backdrop" @click.self="selectedLog = null">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <span class="modal-eyebrow">PAYLOAD INSPECTOR</span>
            <h3 class="modal-title">Log Detail: {{ selectedLog.id }}</h3>
          </div>
          <button type="button" class="close-btn" @click="selectedLog = null">✕</button>
        </div>
        <div class="modal-body">
          <div class="log-meta-grid">
            <div><strong>Waktu:</strong> {{ selectedLog.timestamp }}</div>
            <div><strong>Pelaku:</strong> {{ selectedLog.actor }}</div>
            <div><strong>Aksi:</strong> {{ selectedLog.action }}</div>
            <div><strong>IP:</strong> {{ selectedLog.ip }}</div>
          </div>
          <div class="json-box">
            <pre>{{ JSON.stringify(selectedLog.details || { info: selectedLog.resource }, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { adminService } from '../../services/adminService.js';

const logs = ref([]);
const searchQuery = ref('');
const selectedActionFilter = ref('all');
const selectedLog = ref(null);

const loadLogs = async () => {
  try {
    logs.value = await adminService.getAuditLogs();
  } catch (err) {
    console.error('Load audit logs failed:', err);
  }
};

onMounted(() => {
  loadLogs();
});

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const actionMatch = selectedActionFilter.value === 'all' || log.action?.includes(selectedActionFilter.value);
    const q = searchQuery.value.trim().toLowerCase();
    const searchMatch = !q || (
      (log.id + ' ' + log.actor + ' ' + log.action + ' ' + log.resource + ' ' + log.ip)
        .toLowerCase()
        .includes(q)
    );
    return actionMatch && searchMatch;
  });
});

const inspectLog = (log) => {
  selectedLog.value = log;
};
</script>

<style scoped>
.audit-log-page {
  width: 100%;
}

.page-header {
  margin-bottom: 24px;
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

.filter-bar-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid var(--line);
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box svg {
  position: absolute;
  left: 12px;
  color: var(--muted);
}

.search-input {
  width: 280px;
  height: 38px;
  padding: 0 12px 0 36px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: #fff;
  font-size: 0.82rem;
  outline: none;
}

.search-input:focus {
  border-color: #2563eb;
}

.filter-select {
  height: 38px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: #fff;
  font-size: 0.82rem;
  color: var(--ink);
  outline: none;
}

.table-container {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow-x: auto;
  box-shadow: 0 2px 10px rgba(36, 25, 18, 0.04);
}

.audit-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 900px;
}

.audit-table th {
  padding: 12px 16px;
  background: var(--soft);
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--line);
}

.audit-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--line);
  font-size: 0.82rem;
  vertical-align: middle;
}

.audit-table tbody tr:last-child td {
  border-bottom: none;
}

.audit-table tbody tr:hover {
  background: rgba(248, 250, 252, 0.8);
}

.log-id {
  font-family: monospace;
  font-weight: 700;
  color: var(--ink);
}

.timestamp-text {
  color: var(--muted);
  font-size: 0.76rem;
}

.action-tag {
  display: inline-flex;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.72rem;
  font-weight: 750;
  background: var(--soft);
  color: #334155;
  border: 1px solid var(--line);
}

.resource-text {
  color: var(--ink);
  max-width: 220px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ip-text {
  font-family: monospace;
  color: var(--muted);
  font-size: 0.74rem;
}

.status-pill-ok {
  display: inline-flex;
  padding: 2px 7px;
  border-radius: 4px;
  background: #edf7ee;
  color: var(--success);
  font-size: 0.72rem;
  font-weight: 750;
}

.col-actions {
  text-align: right;
}

.btn-inspect {
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid var(--line);
  background: #fff;
  color: #2563eb;
  font-size: 0.74rem;
  font-weight: 750;
  cursor: pointer;
}

.btn-inspect:hover {
  background: #eff6ff;
  border-color: #93c5fd;
}

.empty-cell {
  padding: 36px;
  text-align: center;
  color: var(--muted);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  z-index: 70;
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: 540px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid var(--line);
}

.modal-eyebrow {
  font-size: 0.68rem;
  font-weight: 800;
  color: #2563eb;
}

.modal-title {
  margin: 3px 0 0;
  font-size: 1.15rem;
  font-family: Georgia, "Times New Roman", serif;
}

.close-btn {
  color: var(--muted);
  cursor: pointer;
}

.modal-body {
  padding: 20px 22px;
}

.log-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
  font-size: 0.8rem;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.json-box {
  background: #0f172a;
  color: #38bdf8;
  padding: 14px;
  border-radius: var(--r-sm);
  font-family: monospace;
  font-size: 0.78rem;
  max-height: 240px;
  overflow-y: auto;
}
</style>
