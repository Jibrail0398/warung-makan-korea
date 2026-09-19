<template>
  <div class="audit-log-page">
    <header class="page-header">
      <div>
        <h1 class="page-title">Audit Log</h1>
      </div>
    </header>

    <section class="filter-bar-card">
      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.8" /><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Cari Aksi atau Aktor..."
          class="search-input"
          @keyup.enter="applyFilters"
        />
      </div>
      <select v-model="filters.event" class="filter-select" @change="applyFilters">
        <option value="">Semua Jenis Aksi (Event)</option>
        <option v-for="option in eventOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
      <select v-model="filters.logName" class="filter-select" @change="applyFilters">
        <option value="">Semua Log (Log Name)</option>
        <option v-for="option in logNameOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
      <div class="date-range">
        <input v-model="filters.startDate" type="date" class="filter-date" @change="applyFilters" />
        <span class="date-separator">s/d</span>
        <input v-model="filters.endDate" type="date" class="filter-date" @change="applyFilters" />
      </div>
      <div class="filter-actions">
        <button type="button" class="btn-filter" @click="applyFilters">Terapkan</button>
        <button type="button" class="btn-filter reset" @click="resetFilters">Reset</button>
      </div>
    </section>

    <div class="table-container">
      <table class="audit-table">
        <thead>
          <tr>
            <th scope="col">Log ID</th>
            <th scope="col">Waktu (Timestamp)</th>
            <th scope="col">Pelaku (Actor)</th>
            <th scope="col">Aksi (Event)</th>
            <th scope="col">Log</th>
            <th scope="col">Target / Resource</th>
            <th scope="col">IP Address</th>
            <th scope="col" class="col-actions">Detail</th>
          </tr>
        </thead>
        <tbody v-if="isPageLoading">
          <tr>
            <td colspan="8" class="empty-cell">
              <LoadingSpinner size="md" color="primary" text="Memuat data log aktivitas..." center />
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="logs.length">
          <tr v-for="log in logs" :key="log.id">
            <td><span class="log-id">{{ log.id }}</span></td>
            <td><span class="timestamp-text">{{ formatTimestamp(log.created_at) }}</span></td>
            <td><strong class="actor-name">{{ getActorName(log) }}</strong></td>
            <td><span class="action-tag" :class="`action-${log.event}`">{{ eventLabel(log.event) }}</span></td>
            <td><span class="log-name-tag">{{ logNameLabel(log.log_name) }}</span></td>
            <td><span class="resource-text">{{ getResource(log) }}</span></td>
            <td><span class="ip-text">{{ getIpAddress(log) }}</span></td>
            <td class="col-actions">
              <button type="button" class="btn-inspect" title="Lihat Detail Payload" @click="inspectLog(log)">Inspect</button>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr><td colspan="8" class="empty-cell">Tidak ada riwayat log yang sesuai dengan filter pencarian.</td></tr>
        </tbody>
      </table>
    </div>

    <div v-if="pagination.lastPage > 1" class="pagination">
      <button type="button" class="page-btn" :disabled="pagination.currentPage === 1 || isPageLoading" @click="changePage(pagination.currentPage - 1)">‹ Prev</button>
      <button
        v-for="page in getPageNumbers"
        :key="page"
        type="button"
        class="page-btn"
        :class="{ active: page === pagination.currentPage }"
        :disabled="isPageLoading"
        @click="changePage(page)"
      >{{ page }}</button>
      <button type="button" class="page-btn" :disabled="pagination.currentPage === pagination.lastPage || isPageLoading" @click="changePage(pagination.currentPage + 1)">Next ›</button>
    </div>

    <!-- Detail log -->
    <Transition name="modal-fade">
      <div v-if="selectedLog" class="modal-backdrop" @click.self="closeDetailModal">
        <div class="modal-card">
          <div class="modal-header">
            <div>
              <h3 class="modal-title">Log Detail: {{ selectedLog.id }}</h3>
            </div>
            <button type="button" class="close-btn" aria-label="Tutup" @click="closeDetailModal">✕</button>
          </div>
          <div class="modal-body">
            <div v-if="isDetailLoading" class="detail-loading">
              <LoadingSpinner size="md" color="primary" text="Memuat detail log..." center />
            </div>
            <template v-else>
              <div class="log-meta-grid">
                <div><strong>Waktu:</strong> {{ formatTimestamp(selectedLog.created_at) }}</div>
                <div><strong>Pelaku:</strong> {{ selectedLog.causer ? `${selectedLog.causer.name} (${selectedLog.causer.role})` : getActorName(selectedLog) }}</div>
                <div><strong>Aksi:</strong> {{ eventLabel(selectedLog.event) }}</div>
                <div><strong>Log:</strong> {{ logNameLabel(selectedLog.log_name) }}</div>
                <div><strong>IP:</strong> {{ getIpAddress(selectedLog) }}</div>
              </div>
              <p class="log-description">{{ selectedLog.description }}</p>
              <div class="json-box">
                <pre>{{ JSON.stringify({ properties: selectedLog.properties, attribute_changes: selectedLog.attribute_changes }, null, 2) }}</pre>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>

    <NoticeModal
      :visible="isNoticeVisible"
      :type="noticeType"
      :title="noticeTitle"
      :message="noticeMessage"
      :detail="noticeDetail"
      :confirm-text="noticeConfirmText"
      @confirm="hideNotice"
      @close="hideNotice"
    />
  </div>
</template>

<script>
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner.vue';
import NoticeModal from '../../../components/common/NoticeModal/NoticeModal.vue';
import SuperAdminAuditLogScript from './SuperAdminAuditLogView.js';

export default {
  ...SuperAdminAuditLogScript,
  components: {
    LoadingSpinner,
    NoticeModal,
    ...SuperAdminAuditLogScript.components
  }
};
</script>
