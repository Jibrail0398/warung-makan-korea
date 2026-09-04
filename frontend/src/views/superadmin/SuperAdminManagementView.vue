<template>
  <div class="admin-management-page">
    <header class="page-header">
      <div>
        <p class="page-eyebrow">MANAJEMEN PENGGUNA & AKSES</p>
        <h1 class="page-title">Management Admin & Kasir</h1>
        <p class="page-description">
          Kelola akun operasional staf restoran, tetapkan role (Admin / Kasir), reset kata sandi, dan atur status akses.
        </p>
      </div>

      <button type="button" class="btn-add-admin" @click="openAddModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          <circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="1.8" />
          <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>Tambah Akun Baru</span>
      </button>
    </header>

    <!-- Admins Table -->
    <div class="table-container">
      <table class="admins-table">
        <thead>
          <tr>
            <th scope="col">ID Akun</th>
            <th scope="col">Nama Lengkap</th>
            <th scope="col">Username / Email</th>
            <th scope="col">Role Akses</th>
            <th scope="col">No. Telepon</th>
            <th scope="col">Status</th>
            <th scope="col">Login Terakhir</th>
            <th scope="col" class="col-actions">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="admin in admins" :key="admin.id">
            <td>
              <span class="admin-id">{{ admin.id }}</span>
            </td>
            <td>
              <strong>{{ admin.name }}</strong>
            </td>
            <td>
              <div class="user-cred-cell">
                <span>{{ admin.username }}</span>
                <small>{{ admin.email }}</small>
              </div>
            </td>
            <td>
              <span class="role-pill" :class="`role-${admin.role.toLowerCase()}`">
                {{ admin.role }}
              </span>
            </td>
            <td>
              <span class="phone-text">{{ admin.phone }}</span>
            </td>
            <td>
              <span class="status-badge" :class="admin.status === 'Active' ? 'status-active' : 'status-inactive'">
                {{ admin.status }}
              </span>
            </td>
            <td>
              <span class="login-date">{{ admin.lastLogin }}</span>
            </td>
            <td class="col-actions">
              <div class="action-btns">
                <button
                  type="button"
                  class="action-btn edit-btn"
                  title="Edit Akun"
                  @click="openEditModal(admin)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="action-btn reset-btn"
                  title="Reset Password"
                  @click="handleResetPassword(admin)"
                >
                  Reset Pwd
                </button>
                <button
                  type="button"
                  class="action-btn delete-btn"
                  title="Hapus Akun"
                  @click="confirmDelete(admin)"
                >
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Admin Form Modal (Add / Edit) -->
    <div v-if="isModalOpen" class="modal-backdrop" @click.self="isModalOpen = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">{{ isEdit ? 'Edit Akun Staf' : 'Tambah Akun Admin / Kasir Baru' }}</h3>
          <button type="button" class="close-btn" @click="isModalOpen = false">✕</button>
        </div>

        <form @submit.prevent="handleSaveAdmin" class="modal-body" novalidate>
          <div class="form-group">
            <label class="form-label required">Nama Lengkap</label>
            <input type="text" v-model="formData.name" class="form-input" placeholder="Contoh: Siti Rahmawati" required />
          </div>

          <div class="form-group">
            <label class="form-label required">Username</label>
            <input type="text" v-model="formData.username" class="form-input" placeholder="kasir_siti" required />
          </div>

          <div class="form-group">
            <label class="form-label required">Email</label>
            <input type="email" v-model="formData.email" class="form-input" placeholder="siti@warungnusantara.kr" required />
          </div>

          <div class="form-group">
            <label class="form-label required">Role Akses</label>
            <select v-model="formData.role" class="form-select">
              <option value="Kasir">Kasir (Monitoring Pesanan & Laporan)</option>
              <option value="Admin">Admin (Kelola Produk, Kategori, Pesanan & Laporan)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Nomor Telepon</label>
            <input type="text" v-model="formData.phone" class="form-input" placeholder="+82 10 1234 5678" />
          </div>

          <div class="form-group">
            <label class="form-label">Status Akun</label>
            <select v-model="formData.status" class="form-select">
              <option value="Active">Active (Aktif)</option>
              <option value="Inactive">Inactive (Nonaktif)</option>
            </select>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="isModalOpen = false">Batal</button>
            <button type="submit" class="btn-submit">Simpan Akun</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Password Reset Result Alert Modal -->
    <div v-if="resetResult" class="modal-backdrop" @click.self="resetResult = null">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">Password Baru Dibuat</h3>
          <button type="button" class="close-btn" @click="resetResult = null">✕</button>
        </div>
        <div class="modal-body">
          <p>Kata sandi sementara untuk akun <strong>{{ resetResult.admin.username }}</strong> telah berhasil digenerate:</p>
          <div class="temp-pwd-box">
            <strong>{{ resetResult.temporaryPassword }}</strong>
          </div>
          <small class="notice-text">Harap salin dan berikan kata sandi ini kepada kasir/admin terkait.</small>
          <div class="modal-footer">
            <button type="button" class="btn-submit" @click="resetResult = null">Selesai</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="adminToDelete" class="modal-backdrop" @click.self="adminToDelete = null">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">Hapus Akun Staf</h3>
          <button type="button" class="close-btn" @click="adminToDelete = null">✕</button>
        </div>
        <div class="modal-body">
          <p>Apakah Anda yakin ingin menghapus akun <strong>{{ adminToDelete.name }} ({{ adminToDelete.username }})</strong>?</p>
          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="adminToDelete = null">Batal</button>
            <button type="button" class="btn-danger" @click="executeDelete">Ya, Hapus</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { adminService } from '../../services/adminService.js';

const admins = ref([]);
const isModalOpen = ref(false);
const isEdit = ref(false);
const selectedAdmin = ref(null);
const resetResult = ref(null);
const adminToDelete = ref(null);

const formData = reactive({
  name: '',
  username: '',
  email: '',
  role: 'Kasir',
  phone: '+82 10 1234 5678',
  status: 'Active'
});

const loadAdmins = async () => {
  try {
    admins.value = await adminService.getAdmins();
  } catch (err) {
    console.error('Load admins error:', err);
  }
};

onMounted(() => {
  loadAdmins();
});

const openAddModal = () => {
  isEdit.value = false;
  selectedAdmin.value = null;
  formData.name = '';
  formData.username = '';
  formData.email = '';
  formData.role = 'Kasir';
  formData.phone = '+82 10 0000 0000';
  formData.status = 'Active';
  isModalOpen.value = true;
};

const openEditModal = (admin) => {
  isEdit.value = true;
  selectedAdmin.value = admin;
  formData.name = admin.name;
  formData.username = admin.username;
  formData.email = admin.email;
  formData.role = admin.role;
  formData.phone = admin.phone;
  formData.status = admin.status;
  isModalOpen.value = true;
};

const handleSaveAdmin = async () => {
  if (isEdit.value && selectedAdmin.value) {
    await adminService.updateAdmin(selectedAdmin.value.id, formData);
  } else {
    await adminService.createAdmin(formData);
  }
  isModalOpen.value = false;
  await loadAdmins();
};

const handleResetPassword = async (admin) => {
  const res = await adminService.resetAdminPassword(admin.id);
  resetResult.value = {
    admin,
    temporaryPassword: res.temporaryPassword
  };
};

const confirmDelete = (admin) => {
  adminToDelete.value = admin;
};

const executeDelete = async () => {
  if (!adminToDelete.value) return;
  await adminService.deleteAdmin(adminToDelete.value.id);
  adminToDelete.value = null;
  await loadAdmins();
};
</script>

<style scoped>
.admin-management-page {
  width: 100%;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
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

.btn-add-admin {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 18px;
  border-radius: var(--r-sm);
  background: #2563eb;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 750;
  cursor: pointer;
  transition: all var(--ease);
}

.btn-add-admin:hover {
  background: #1d4ed8;
}

.table-container {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow-x: auto;
  box-shadow: 0 2px 10px rgba(36, 25, 18, 0.04);
}

.admins-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 880px;
}

.admins-table th {
  padding: 12px 16px;
  background: var(--soft);
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--line);
}

.admins-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--line);
  font-size: 0.82rem;
  vertical-align: middle;
}

.admins-table tbody tr:last-child td {
  border-bottom: none;
}

.admin-id {
  font-family: monospace;
  font-weight: 750;
  color: var(--ink);
}

.user-cred-cell {
  display: flex;
  flex-direction: column;
}

.user-cred-cell small {
  color: var(--muted);
  font-size: 0.72rem;
}

.role-pill {
  display: inline-flex;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 750;
}

.role-pill.role-admin {
  background: var(--red-soft);
  color: var(--red);
}

.role-pill.role-kasir {
  background: #eff6ff;
  color: #2563eb;
}

.phone-text {
  color: var(--muted);
}

.status-badge {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 750;
}

.status-active {
  background: #edf7ee;
  color: var(--success);
}

.status-inactive {
  background: #fef2f2;
  color: #dc2626;
}

.login-date {
  color: var(--muted);
  font-size: 0.76rem;
}

.col-actions {
  text-align: right;
}

.action-btns {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.action-btn {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--ease);
}

.edit-btn {
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink);
}

.reset-btn {
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #2563eb;
}

.delete-btn {
  border: 1px solid transparent;
  background: transparent;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fef2f2;
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
  max-width: 480px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid var(--line);
}

.modal-title {
  margin: 0;
  font-size: 1.15rem;
  font-family: Georgia, "Times New Roman", serif;
}

.close-btn {
  color: var(--muted);
  cursor: pointer;
}

.modal-body {
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--ink);
}

.form-label.required::after {
  content: " *";
  color: var(--red);
}

.form-input, .form-select {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: #fff;
  font-size: 0.84rem;
  outline: none;
}

.form-input:focus, .form-select:focus {
  border-color: #2563eb;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
  margin-top: 6px;
}

.btn-cancel {
  padding: 8px 14px;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-submit {
  padding: 8px 18px;
  border-radius: var(--r-sm);
  background: #2563eb;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 750;
  cursor: pointer;
}

.btn-danger {
  padding: 8px 18px;
  border-radius: var(--r-sm);
  background: #dc2626;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 750;
  cursor: pointer;
}

.temp-pwd-box {
  padding: 14px;
  border-radius: var(--r-sm);
  background: #eff6ff;
  border: 1px dashed #3b82f6;
  text-align: center;
  font-size: 1.2rem;
  color: #1d4ed8;
  font-family: monospace;
  margin: 12px 0;
}

.notice-text {
  color: var(--muted);
  font-size: 0.76rem;
}
</style>
