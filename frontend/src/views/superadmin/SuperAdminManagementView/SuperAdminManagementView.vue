<template>
  <div class="admin-management-page">
    <header class="page-header"><div><p class="page-eyebrow">MANAJEMEN PENGGUNA & AKSES</p><h1 class="page-title">Management Admin & Kasir</h1><p class="page-description">Kelola akun operasional staf restoran, tetapkan role (Admin / Kasir), reset kata sandi, dan atur status akses.</p></div><button type="button" class="btn-add-admin" @click="openAddModal"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="1.8" /><line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" /><line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg><span>Tambah Akun Baru</span></button></header>
    <div class="table-container">
      <table class="admins-table"><thead><tr><th scope="col">ID Akun</th><th scope="col">Nama Lengkap</th><th scope="col">Username / Email</th><th scope="col">Role Akses</th><th scope="col">No. Telepon</th><th scope="col">Status</th><th scope="col">Login Terakhir</th><th scope="col" class="col-actions">Aksi</th></tr></thead>
      <tbody><tr v-for="admin in admins" :key="admin.id"><td><span class="admin-id">{{ admin.id }}</span></td><td><strong>{{ admin.name }}</strong></td><td><div class="user-cred-cell"><span>{{ admin.username }}</span><small>{{ admin.email }}</small></div></td><td><span class="role-pill" :class="`role-${admin.role.toLowerCase()}`">{{ admin.role }}</span></td><td><span class="phone-text">{{ admin.phone }}</span></td><td><span class="status-badge" :class="admin.status === 'Active' ? 'status-active' : 'status-inactive'">{{ admin.status }}</span></td><td><span class="login-date">{{ admin.lastLogin }}</span></td><td class="col-actions"><div class="action-btns"><button type="button" class="action-btn edit-btn" title="Edit Akun" @click="openEditModal(admin)">Edit</button><button type="button" class="action-btn reset-btn" title="Reset Password" @click="handleResetPassword(admin)">Reset Pwd</button><button type="button" class="action-btn delete-btn" title="Hapus Akun" @click="confirmDelete(admin)">Hapus</button></div></td></tr></tbody></table>
    </div>
    <div v-if="isModalOpen" class="modal-backdrop" @click.self="isModalOpen = false">
      <div class="modal-card"><div class="modal-header"><h3 class="modal-title">{{ isEdit ? 'Edit Akun Staf' : 'Tambah Akun Admin / Kasir Baru' }}</h3><button type="button" class="close-btn" @click="isModalOpen = false">✕</button></div>
      <form @submit.prevent="handleSaveAdmin" class="modal-body" novalidate>
        <div class="form-group"><label class="form-label required">Nama Lengkap</label><input type="text" v-model="formData.name" class="form-input" placeholder="Contoh: Siti Rahmawati" required /></div>
        <div class="form-group"><label class="form-label required">Username</label><input type="text" v-model="formData.username" class="form-input" placeholder="kasir_siti" required /></div>
        <div class="form-group"><label class="form-label required">Email</label><input type="email" v-model="formData.email" class="form-input" placeholder="siti@warungnusantara.kr" required /></div>
        <div class="form-group"><label class="form-label required">Role Akses</label><select v-model="formData.role" class="form-select"><option value="Kasir">Kasir (Monitoring Pesanan & Laporan)</option><option value="Admin">Admin (Kelola Produk, Kategori, Pesanan & Laporan)</option></select></div>
        <div class="form-group"><label class="form-label">Nomor Telepon</label><input type="text" v-model="formData.phone" class="form-input" placeholder="+82 10 1234 5678" /></div>
        <div class="form-group"><label class="form-label">Status Akun</label><select v-model="formData.status" class="form-select"><option value="Active">Active (Aktif)</option><option value="Inactive">Inactive (Nonaktif)</option></select></div>
        <div class="modal-footer"><button type="button" class="btn-cancel" @click="isModalOpen = false">Batal</button><button type="submit" class="btn-submit">Simpan Akun</button></div>
      </form></div>
    </div>
    <div v-if="resetResult" class="modal-backdrop" @click.self="resetResult = null">
      <div class="modal-card"><div class="modal-header"><h3 class="modal-title">Password Baru Dibuat</h3><button type="button" class="close-btn" @click="resetResult = null">✕</button></div><div class="modal-body"><p>Kata sandi sementara untuk akun <strong>{{ resetResult.admin.username }}</strong> telah berhasil digenerate:</p><div class="temp-pwd-box"><strong>{{ resetResult.temporaryPassword }}</strong></div><small class="notice-text">Harap salin dan berikan kata sandi ini kepada kasir/admin terkait.</small><div class="modal-footer"><button type="button" class="btn-submit" @click="resetResult = null">Selesai</button></div></div></div>
    </div>
    <div v-if="adminToDelete" class="modal-backdrop" @click.self="adminToDelete = null">
      <div class="modal-card"><div class="modal-header"><h3 class="modal-title">Hapus Akun Staf</h3><button type="button" class="close-btn" @click="adminToDelete = null">✕</button></div><div class="modal-body"><p>Apakah Anda yakin ingin menghapus akun <strong>{{ adminToDelete.name }} ({{ adminToDelete.username }})</strong>?</p><div class="modal-footer"><button type="button" class="btn-cancel" @click="adminToDelete = null">Batal</button><button type="button" class="btn-danger" @click="executeDelete">Ya, Hapus</button></div></div></div>
    </div>
  </div>
</template>

<script>
import SuperAdminManagementScript from './SuperAdminManagementView.js';
export default { ...SuperAdminManagementScript };
</script>
