<template>
  <div class="audit-log-page">
    <header class="page-header"><div><p class="page-eyebrow">AUDIT TRAIL & LOGS</p><h1 class="page-title">Audit Log & Activity Log</h1><p class="page-description">Rekaman jejak aktivitas seluruh aksi sensitif yang dilakukan oleh Admin, Kasir, dan Sistem.</p></div></header>
    <section class="filter-bar-card">
      <div class="search-box"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.8" /><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg><input type="text" v-model="searchQuery" placeholder="Cari user, action, atau resource..." class="search-input" /></div>
      <select v-model="selectedActionFilter" class="filter-select"><option value="all">Semua Jenis Aksi (Action)</option><option value="UPDATE_ORDER_STATUS">UPDATE_ORDER_STATUS</option><option value="VERIFY_PAYMENT">VERIFY_PAYMENT</option><option value="CREATE_PRODUCT">CREATE_PRODUCT</option><option value="UPDATE_PRODUCT">UPDATE_PRODUCT</option><option value="DELETE_PRODUCT">DELETE_PRODUCT</option><option value="CREATE_CATEGORY">CREATE_CATEGORY</option><option value="RESET_PASSWORD">RESET_PASSWORD</option><option value="LOGIN">LOGIN</option></select>
    </section>
    <div class="table-container">
      <table class="audit-table"><thead><tr><th scope="col">Log ID</th><th scope="col">Waktu (Timestamp)</th><th scope="col">Pelaku (Actor)</th><th scope="col">Aksi (Action)</th><th scope="col">Target / Resource</th><th scope="col">IP Address</th><th scope="col">Status</th><th scope="col" class="col-actions">Detail</th></tr></thead>
      <tbody v-if="filteredLogs.length"><tr v-for="log in filteredLogs" :key="log.id"><td><span class="log-id">{{ log.id }}</span></td><td><span class="timestamp-text">{{ log.timestamp }}</span></td><td><strong class="actor-name">{{ log.actor }}</strong></td><td><span class="action-tag" :class="`action-${log.action?.toLowerCase()}`">{{ log.action }}</span></td><td><span class="resource-text">{{ log.resource }}</span></td><td><span class="ip-text">{{ log.ip }}</span></td><td><span class="status-pill-ok">{{ log.status }}</span></td><td class="col-actions"><button type="button" class="btn-inspect" title="Lihat Detail Payload" @click="inspectLog(log)">Inspect</button></td></tr></tbody>
      <tbody v-else><tr><td colspan="8" class="empty-cell">Tidak ada riwayat log yang sesuai dengan filter pencarian.</td></tr></tbody></table>
    </div>
    <div v-if="selectedLog" class="modal-backdrop" @click.self="selectedLog = null">
      <div class="modal-card"><div class="modal-header"><div><span class="modal-eyebrow">PAYLOAD INSPECTOR</span><h3 class="modal-title">Log Detail: {{ selectedLog.id }}</h3></div><button type="button" class="close-btn" @click="selectedLog = null">✕</button></div><div class="modal-body"><div class="log-meta-grid"><div><strong>Waktu:</strong> {{ selectedLog.timestamp }}</div><div><strong>Pelaku:</strong> {{ selectedLog.actor }}</div><div><strong>Aksi:</strong> {{ selectedLog.action }}</div><div><strong>IP:</strong> {{ selectedLog.ip }}</div></div><div class="json-box"><pre>{{ JSON.stringify(selectedLog.details || { info: selectedLog.resource }, null, 2) }}</pre></div></div></div>
    </div>
  </div>
</template>

<script>
import SuperAdminAuditLogScript from './SuperAdminAuditLogView.js';
export default { ...SuperAdminAuditLogScript };
</script>
