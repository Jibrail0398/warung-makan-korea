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
          <tr><td colspan="7" class="empty-cell">Memuat data pengguna...</td></tr>
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
                <button v-if="isSuperAdmin" type="button" class="action-btn password-btn" title="Ganti Password" @click="openPasswordModal(user)">Password</button>
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
    <div v-if="isModalOpen" class="modal-backdrop" @click.self="closeFormModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">{{ isEditMode ? 'Edit Akun Admin' : 'Tambah Akun Admin Baru' }}</h3>
          <button type="button" class="close-btn" aria-label="Tutup" @click="closeFormModal">✕</button>
        </div>
        <form class="modal-body" novalidate @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="form-label required" for="user-name">Nama Lengkap</label>
            <input id="user-name" v-model="formData.name" type="text" class="form-input" :class="{ 'input-error': formErrors.name }" placeholder="Contoh: Siti Rahmawati" />
            <small v-if="formErrors.name" class="field-error">{{ formErrors.name }}</small>
          </div>
          <div class="form-group">
            <label class="form-label required" for="user-phone">Nomor Telepon</label>
            <input id="user-phone" v-model="formData.phone_number" type="text" class="form-input" :class="{ 'input-error': formErrors.phone_number }" placeholder="Contoh: 081234567890" />
            <small v-if="formErrors.phone_number" class="field-error">{{ formErrors.phone_number }}</small>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-cancel" :disabled="isSaving" @click="closeFormModal">Batal</button>
            <button type="submit" class="btn-submit" :disabled="isSaving">{{ isSaving ? 'Menyimpan...' : 'Simpan Akun' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Ganti password -->
    <div v-if="isPasswordModalOpen" class="modal-backdrop" @click.self="closePasswordModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">Ganti Password: {{ passwordTarget?.name }}</h3>
          <button type="button" class="close-btn" aria-label="Tutup" @click="closePasswordModal">✕</button>
        </div>
        <form class="modal-body" novalidate @submit.prevent="handlePasswordSubmit">
          <p class="confirm-text">Ganti password untuk akun <strong>{{ passwordTarget?.name }} ({{ passwordTarget?.phone_number }})</strong>. Pastikan password baru tersimpan dengan aman.</p>
          <div class="form-group">
            <label class="form-label required" for="user-password">Password Baru</label>
            <input id="user-password" v-model="passwordForm.password" type="password" class="form-input" :class="{ 'input-error': passwordFormErrors.password }" placeholder="Minimal 6 karakter" autocomplete="new-password" />
            <small v-if="passwordFormErrors.password" class="field-error">{{ passwordFormErrors.password }}</small>
          </div>
          <div class="form-group">
            <label class="form-label required" for="user-password-confirmation">Konfirmasi Password Baru</label>
            <input id="user-password-confirmation" v-model="passwordForm.password_confirmation" type="password" class="form-input" :class="{ 'input-error': passwordFormErrors.password_confirmation }" placeholder="Ulangi password baru" autocomplete="new-password" />
            <small v-if="passwordFormErrors.password_confirmation" class="field-error">{{ passwordFormErrors.password_confirmation }}</small>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-cancel" :disabled="isChangingPassword" @click="closePasswordModal">Batal</button>
            <button type="submit" class="btn-submit" :disabled="isChangingPassword">{{ isChangingPassword ? 'Menyimpan...' : 'Simpan Password' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Konfirmasi hapus -->
    <div v-if="userToDelete" class="modal-backdrop confirm-backdrop" @click.self="cancelDelete">
      <div class="modal-card confirm-card">
        <div class="modal-header">
          <h3 class="modal-title">Hapus Akun Staf</h3>
          <button type="button" class="close-btn" aria-label="Tutup" @click="cancelDelete">✕</button>
        </div>
        <div class="modal-body">
          <p class="confirm-text">Apakah anda yakin akan menghapus data ini <strong>{{ userToDelete.name }} ({{ userToDelete.phone_number }})</strong>?</p>
          <div class="modal-footer">
            <button type="button" class="btn-cancel" :disabled="isDeleting" @click="cancelDelete">Tidak</button>
            <button type="button" class="btn-danger" :disabled="isDeleting" @click="executeDelete">{{ isDeleting ? 'Menghapus...' : 'Ya' }}</button>
          </div>
        </div>
      </div>
    </div>

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
import SuperAdminManagementScript from './SuperAdminManagementView.js';
export default { ...SuperAdminManagementScript };
</script>
