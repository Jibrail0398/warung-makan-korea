<template>
  <div class="admin-management-page">
    <header class="page-header">
      <div>
        <p class="page-eyebrow">MANAJEMEN PENGGUNA &amp; AKSES</p>
        <h1 class="page-title">Management Admin &amp; Kasir</h1>
        <p class="page-description">Kelola akun operasional staf restoran dan tetapkan role aksesnya.</p>
      </div>
      <button type="button" class="btn-add-admin" @click="openAddModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="1.8" /><line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" /><line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
        <span>Tambah Akun Admin</span>
      </button>
    </header>

    <div class="table-container">
      <table class="admins-table">
        <thead>
          <tr>
            <th scope="col">ID Akun</th>
            <th scope="col">Nama Lengkap</th>
            <th scope="col">No. Telepon</th>
            <th scope="col">Role Akses</th>
            <th scope="col">Status</th>
            <th scope="col">Dibuat</th>
            <th scope="col" class="col-actions">Aksi</th>
          </tr>
        </thead>
        <tbody v-if="isPageLoading">
          <tr>
            <td colspan="7" class="empty-cell">
              <LoadingSpinner size="md" color="primary" text="Memuat data pengguna..." center />
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="users.length">
          <tr v-for="user in users" :key="user.id">
            <td><span class="admin-id" :title="user.id">{{ user.id }}</span></td>
            <td><strong>{{ user.name }}</strong></td>
            <td><span class="phone-text">{{ user.phone_number || '-' }}</span></td>
            <td><span class="role-pill" :class="`role-${user.role}`">{{ roleLabel(user.role) }}</span></td>
            <td>
              <span class="status-badge" :class="user.is_verified ? 'status-active' : 'status-inactive'">
                {{ user.is_verified ? 'Terverifikasi' : 'Belum Verifikasi' }}
              </span>
            </td>
            <td><span class="login-date">{{ formatDate(user.created_at) }}</span></td>
            <td class="col-actions">
              <div class="action-btns">
                <button type="button" class="action-btn edit-btn" title="Edit Akun" @click="openEditModal(user)">Edit</button>
                <button type="button" class="action-btn password-btn" title="Ubah Password" @click="openPasswordModal(user)">Edit Password</button>
                <button type="button" class="action-btn delete-btn" title="Hapus Akun" @click="confirmDelete(user)">Hapus</button>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr><td colspan="7" class="empty-cell">Belum ada data pengguna.</td></tr>
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

    <!-- Form tambah / edit akun -->
    <Transition name="modal-fade">
      <div v-if="isModalOpen" class="modal-backdrop" @click.self="!isSaving && closeFormModal()">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title">{{ isEditMode ? 'Edit Akun Admin' : 'Tambah Akun Admin Baru' }}</h3>
            <button type="button" class="close-btn" aria-label="Tutup" :disabled="isSaving" @click="closeFormModal">✕</button>
          </div>
          <form class="modal-body" novalidate @submit.prevent="handleSubmit">
            <div class="form-group">
              <label class="form-label required" for="user-name">Nama Lengkap</label>
              <input id="user-name" v-model="formData.name" type="text" class="form-input" :class="{ 'input-error': formErrors.name }" placeholder="Contoh: Siti Rahmawati" :disabled="isSaving" @input="formErrors.name = ''" />
              <small v-if="formErrors.name" class="field-error">{{ formErrors.name }}</small>
            </div>
            <div class="form-group">
              <label class="form-label required" for="user-phone">Nomor Telepon</label>
              <input id="user-phone" v-model="formData.phone_number" type="text" class="form-input" :class="{ 'input-error': formErrors.phone_number }" placeholder="Contoh: 081234567890" :disabled="isSaving" @input="formErrors.phone_number = ''" />
              <small v-if="formErrors.phone_number" class="field-error">{{ formErrors.phone_number }}</small>
            </div>
            <div v-if="!isEditMode" class="form-group">
              <label class="form-label required" for="user-add-password">Password</label>
              <div class="input-wrapper">
                <input
                  id="user-add-password"
                  v-model="formData.password"
                  :type="showAddPassword ? 'text' : 'password'"
                  class="form-input with-action"
                  :class="{ 'input-error': formErrors.password }"
                  placeholder="Minimal 6 karakter"
                  autocomplete="new-password"
                  :disabled="isSaving"
                  @input="formErrors.password = ''"
                />
                <button
                  type="button"
                  class="toggle-pwd-btn"
                  :disabled="isSaving"
                  :aria-label="showAddPassword ? 'Sembunyikan password' : 'Tampilkan password'"
                  @click="showAddPassword = !showAddPassword"
                >
                  <svg v-if="showAddPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.8" /><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8" /></svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
                </button>
              </div>
              <small v-if="formErrors.password" class="field-error">{{ formErrors.password }}</small>
            </div>
            <div v-if="!isEditMode" class="form-group">
              <label class="form-label required" for="user-add-password-confirmation">Konfirmasi Password</label>
              <div class="input-wrapper">
                <input
                  id="user-add-password-confirmation"
                  v-model="formData.password_confirmation"
                  :type="showAddPasswordConfirm ? 'text' : 'password'"
                  class="form-input with-action"
                  :class="{ 'input-error': formErrors.password_confirmation }"
                  placeholder="Ulangi password"
                  autocomplete="new-password"
                  :disabled="isSaving"
                  @input="formErrors.password_confirmation = ''"
                />
                <button
                  type="button"
                  class="toggle-pwd-btn"
                  :disabled="isSaving"
                  :aria-label="showAddPasswordConfirm ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'"
                  @click="showAddPasswordConfirm = !showAddPasswordConfirm"
                >
                  <svg v-if="showAddPasswordConfirm" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.8" /><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8" /></svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
                </button>
              </div>
              <small v-if="formErrors.password_confirmation" class="field-error">{{ formErrors.password_confirmation }}</small>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn-cancel" :disabled="isSaving" @click="closeFormModal">Batal</button>
              <button type="submit" class="btn-submit" :disabled="isSaving">
                <LoadingSpinner v-if="isSaving" size="sm" color="white" text="Menyimpan..." inline />
                <span v-else>{{ isEditMode ? 'Simpan Perubahan' : 'Simpan Akun' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Edit password -->
    <Transition name="modal-fade">
      <div v-if="isPasswordModalOpen" class="modal-backdrop" @click.self="!isChangingPassword && closePasswordModal()">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title">Edit Password: {{ passwordTarget?.name }}</h3>
            <button type="button" class="close-btn" aria-label="Tutup" :disabled="isChangingPassword" @click="closePasswordModal">✕</button>
          </div>
          <form class="modal-body" novalidate @submit.prevent="handlePasswordSubmit">
            <p class="confirm-text">Ubah password untuk akun <strong>{{ passwordTarget?.name }} ({{ passwordTarget?.phone_number }})</strong>. Pastikan password baru tersimpan dengan aman.</p>
            <div class="form-group">
              <label class="form-label required" for="edit-user-password">Password Baru</label>
              <div class="input-wrapper">
                <input
                  id="edit-user-password"
                  v-model="passwordForm.password"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="form-input with-action"
                  :class="{ 'input-error': passwordFormErrors.password }"
                  placeholder="Minimal 6 karakter"
                  autocomplete="new-password"
                  :disabled="isChangingPassword"
                  @input="passwordFormErrors.password = ''"
                />
                <button
                  type="button"
                  class="toggle-pwd-btn"
                  :disabled="isChangingPassword"
                  :aria-label="showNewPassword ? 'Sembunyikan password baru' : 'Tampilkan password baru'"
                  @click="showNewPassword = !showNewPassword"
                >
                  <svg v-if="showNewPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.8" /><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8" /></svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
                </button>
              </div>
              <small v-if="passwordFormErrors.password" class="field-error">{{ passwordFormErrors.password }}</small>
            </div>
            <div class="form-group">
              <label class="form-label required" for="edit-user-password-confirmation">Konfirmasi Password</label>
              <div class="input-wrapper">
                <input
                  id="edit-user-password-confirmation"
                  v-model="passwordForm.password_confirmation"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-input with-action"
                  :class="{ 'input-error': passwordFormErrors.password_confirmation }"
                  placeholder="Ulangi password baru"
                  autocomplete="new-password"
                  :disabled="isChangingPassword"
                  @input="passwordFormErrors.password_confirmation = ''"
                />
                <button
                  type="button"
                  class="toggle-pwd-btn"
                  :disabled="isChangingPassword"
                  :aria-label="showConfirmPassword ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <svg v-if="showConfirmPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.8" /><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8" /></svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
                </button>
              </div>
              <small v-if="passwordFormErrors.password_confirmation" class="field-error">{{ passwordFormErrors.password_confirmation }}</small>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn-cancel" :disabled="isChangingPassword" @click="closePasswordModal">Batal</button>
              <button type="submit" class="btn-submit" :disabled="isChangingPassword">
                <LoadingSpinner v-if="isChangingPassword" size="sm" color="white" text="Menyimpan..." inline />
                <span v-else>Simpan Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Konfirmasi hapus -->
    <Transition name="modal-fade">
      <div v-if="userToDelete" class="modal-backdrop confirm-backdrop" @click.self="!isDeleting && cancelDelete()">
        <div class="modal-card confirm-card">
          <div class="modal-header">
            <h3 class="modal-title">Hapus Akun Staf</h3>
            <button type="button" class="close-btn" aria-label="Tutup" :disabled="isDeleting" @click="cancelDelete">✕</button>
          </div>
          <div class="modal-body">
            <p class="confirm-text">Apakah anda yakin akan menghapus data ini <strong>{{ userToDelete.name }} ({{ userToDelete.phone_number }})</strong>?</p>
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
import NoticeModal from '../../../components/common/NoticeModal/NoticeModal.vue';
import SuperAdminManagementScript from './SuperAdminManagementView.js';

export default {
  ...SuperAdminManagementScript,
  components: {
    LoadingSpinner,
    NoticeModal,
    ...SuperAdminManagementScript.components
  }
};
</script>
