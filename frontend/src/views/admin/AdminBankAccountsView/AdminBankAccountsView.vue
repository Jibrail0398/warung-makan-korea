<template>
  <div class="bank-accounts-view">
    <header class="page-header">
      <div>
        <p class="page-eyebrow">MANAJEMEN PEMBAYARAN</p>
        <h1 class="page-title">Rekening Bank</h1>
        <p class="page-description">
          Rekening tujuan transfer yang ditampilkan pada halaman checkout customer. Hanya satu akun bank yang diizinkan.
        </p>
      </div>
    </header>

    <div v-if="isPageLoading" class="empty-state-card">
      <LoadingSpinner size="md" color="primary" text="Memuat data rekening bank..." center />
    </div>

    <div v-else-if="account" class="account-card">
      <div class="account-card-header">
        <div class="bank-identity">
          <span class="bank-logo-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 10h18M4 6h16a1 1 0 0 1 1 1v1H3V7a1 1 0 0 1 1-1Zm1 5v6m5-6v6m4-6v6m5-6v6M2 21h20" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </span>
          <div>
            <strong class="bank-name">{{ account.bankName }}</strong>
            <small class="bank-sub">Rekening tujuan transfer manual</small>
          </div>
        </div>
        <span class="status-badge" :class="account.isActive ? 'status-active' : 'status-inactive'">
          {{ account.isActive ? 'Aktif' : 'Nonaktif' }}
        </span>
      </div>
      <div class="account-card-body">
        <div class="account-detail">
          <span class="detail-label">Nomor Rekening</span>
          <strong class="detail-value">{{ account.accountNumber }}</strong>
        </div>
        <div class="account-detail">
          <span class="detail-label">Atas Nama</span>
          <strong class="detail-value">{{ account.accountName }}</strong>
        </div>
        <div class="account-detail">
          <span class="detail-label">Diperbarui</span>
          <strong class="detail-value">{{ formatDate(account.updatedAt) }}</strong>
        </div>
      </div>
      <div class="account-card-footer">
        <button type="button" class="btn-edit" @click="confirmEdit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
          <span>Edit</span>
        </button>
        <button type="button" class="btn-delete" @click="confirmDelete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
          <span>Hapus</span>
        </button>
      </div>
    </div>

    <div v-else class="empty-state-card">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 10h18M4 6h16a1 1 0 0 1 1 1v1H3V7a1 1 0 0 1 1-1Zm1 5v6m5-6v6m4-6v6m5-6v6M2 21h20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
      <p>Belum ada data rekening bank</p>
      <button type="button" class="btn-add-account" @click="openAddModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
        <span>Tambah Rekening Bank</span>
      </button>
    </div>

    <!-- Konfirmasi edit -->
    <Transition name="modal-fade">
      <div v-if="accountToEdit" class="modal-backdrop confirm-backdrop" @click.self="cancelEdit">
        <div class="modal-card confirm-card">
          <div class="modal-header">
            <h3 class="modal-title">Konfirmasi Perubahan</h3>
            <button type="button" class="close-btn" aria-label="Tutup" @click="cancelEdit">✕</button>
          </div>
          <div class="modal-body">
            <p class="confirm-text">Apakah anda yakin ingin mengubah data rekening <strong>{{ accountToEdit.bankName }} ({{ accountToEdit.accountNumber }})</strong>?</p>
            <div class="modal-footer">
              <button type="button" class="btn-cancel" @click="cancelEdit">Batal</button>
              <button type="button" class="btn-submit" @click="executeEdit">Ya, Edit Rekening</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Form tambah / edit rekening -->
    <Transition name="modal-fade">
      <div v-if="isModalOpen" class="modal-backdrop" @click.self="closeFormModal">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title">{{ isEditMode ? 'Edit Rekening Bank' : 'Tambah Rekening Bank' }}</h3>
            <button type="button" class="close-btn" aria-label="Tutup" :disabled="isSaving" @click="closeFormModal">✕</button>
          </div>
          <form class="modal-body" novalidate @submit.prevent="handleSubmit">
            <div class="form-group">
              <label class="form-label required" for="bank-name">Nama Bank</label>
              <input id="bank-name" v-model="formData.bank_name" type="text" class="form-input" :class="{ 'input-error': formErrors.bank_name }" placeholder="Contoh: Hana Bank" :disabled="isSaving" @input="formErrors.bank_name = ''" />
              <small v-if="formErrors.bank_name" class="field-error">{{ formErrors.bank_name }}</small>
            </div>
            <div class="form-group">
              <label class="form-label required" for="account-number">Nomor Rekening</label>
              <input id="account-number" v-model="formData.account_number" type="text" class="form-input" :class="{ 'input-error': formErrors.account_number }" placeholder="Contoh: 123-456-789" :disabled="isSaving" @input="formErrors.account_number = ''" />
              <small v-if="formErrors.account_number" class="field-error">{{ formErrors.account_number }}</small>
            </div>
            <div class="form-group">
              <label class="form-label required" for="account-name">Atas Nama</label>
              <input id="account-name" v-model="formData.account_name" type="text" class="form-input" :class="{ 'input-error': formErrors.account_name }" placeholder="Contoh: Warung Nusantara" :disabled="isSaving" @input="formErrors.account_name = ''" />
              <small v-if="formErrors.account_name" class="field-error">{{ formErrors.account_name }}</small>
            </div>
            <div class="form-group form-group-check">
              <label class="checkbox-label" for="bank-active">
                <input id="bank-active" v-model="formData.is_active" type="checkbox" :disabled="isSaving" />
                <span>Tampilkan rekening ini di halaman checkout (aktif)</span>
              </label>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn-cancel" :disabled="isSaving" @click="closeFormModal">Batal</button>
              <button type="submit" class="btn-submit" :disabled="isSaving">
                <LoadingSpinner v-if="isSaving" size="sm" color="white" text="Menyimpan..." inline />
                <span v-else>{{ isEditMode ? 'Simpan Perubahan' : 'Simpan Rekening' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Konfirmasi hapus -->
    <Transition name="modal-fade">
      <div v-if="accountToDelete" class="modal-backdrop confirm-backdrop" @click.self="!isDeleting && cancelDelete">
        <div class="modal-card confirm-card">
          <div class="modal-header">
            <h3 class="modal-title">Hapus Rekening Bank</h3>
            <button type="button" class="close-btn" aria-label="Tutup" :disabled="isDeleting" @click="cancelDelete">✕</button>
          </div>
          <div class="modal-body">
            <p class="confirm-text">Apakah anda yakin akan menghapus rekening <strong>{{ accountToDelete.bankName }} ({{ accountToDelete.accountNumber }})</strong>? Customer tidak akan melihat rekening tujuan transfer pada checkout.</p>
            <div class="modal-footer">
              <button type="button" class="btn-cancel" :disabled="isDeleting" @click="cancelDelete">Tidak</button>
              <button type="button" class="btn-danger" :disabled="isDeleting" @click="executeDelete">
                <LoadingSpinner v-if="isDeleting" size="sm" color="white" text="Menghapus..." inline />
                <span v-else>Ya</span>
              </button>
            </div>
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
import AdminBankAccountsScript from './AdminBankAccountsView.js';

export default {
  components: {
    LoadingSpinner
  },
  ...AdminBankAccountsScript
};
</script>
