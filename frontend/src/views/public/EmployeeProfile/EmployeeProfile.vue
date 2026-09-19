<template>
  <div class="employee-profile-page">
    <div class="page-heading">
      <div>
        <h1 class="page-title">Profil Pegawai</h1>
      </div>
    </div>

    <div class="profile-layout">
      <aside class="profile-sidebar">
        <div class="profile-card">
          <div
            class="avatar"
            role="button"
            tabindex="0"
            title="Change profile picture"
            @click="triggerProfileUpload"
            @keydown.enter="triggerProfileUpload"
            @keydown.space.prevent="triggerProfileUpload"
          >
            <img v-if="profilePicture" :src="profilePicture" alt="Profile picture" />
            <span v-else>{{ userInitial }}</span>
            <input ref="profileInput" type="file" accept="image/*" hidden @change="handleProfileUpload" />
          </div>
          <h2>{{ profile.fullName }}</h2>
          <p>{{ profile.phone || '-' }}</p>
        </div>

        <nav class="profile-nav" aria-label="Profile navigation">
          <button
            type="button"
            class="profile-nav-item"
            :class="{ active: activeTab === 'info' }"
            @click="activeTab = 'info'"
          >
            <span>Informasi Profil</span>
            <span aria-hidden="true">›</span>
          </button>
          <button
            type="button"
            class="profile-nav-item"
            :class="{ active: activeTab === 'password' }"
            @click="activeTab = 'password'"
          >
            <span>Ubah Password</span>
            <span aria-hidden="true">›</span>
          </button>
        </nav>
      </aside>

      <section class="profile-content" aria-label="Informasi profil pegawai">
        <!-- Tab 1: Profile Information -->
        <ProfileForm v-if="activeTab === 'info'" type="employee" :profile="profile" @save="handleSave" />

        <!-- Tab 2: Change Password -->
        <form v-else-if="activeTab === 'password'" class="profile-form" @submit.prevent="handleChangePassword">
          <div class="form-section">
            <div class="section-heading">
              <h2>Ubah Password</h2>
            </div>
            <div class="form-grid">
              <AuthField
                id="newPassword"
                v-model="passwordForm.password"
                label="Password Baru"
                type="password"
                placeholder="Masukkan password baru (min. 6 karakter)"
                autocomplete="new-password"
                :required="true"
                :error="passwordErrors.password"
                :disabled="isChangingPassword"
                @input="passwordErrors.password = ''"
              />
              <AuthField
                id="confirmPassword"
                v-model="passwordForm.password_confirmation"
                label="Konfirmasi Password Baru"
                type="password"
                placeholder="Ulangi password baru"
                autocomplete="new-password"
                :required="true"
                :error="passwordErrors.password_confirmation"
                :disabled="isChangingPassword"
                @input="passwordErrors.password_confirmation = ''"
              />
            </div>
          </div>

          <div class="form-actions">
            <button
              type="button"
              class="btn btn-secondary"
              :disabled="isChangingPassword"
              @click="resetPasswordForm"
            >
              Batal
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isChangingPassword"
            >
              <LoadingSpinner v-if="isChangingPassword" size="sm" color="white" text="Menyimpan..." inline />
              <span v-else>Simpan Password</span>
            </button>
          </div>

          <p v-if="passwordSuccessMessage" class="success-message" role="status">
            {{ passwordSuccessMessage }}
          </p>
          <p v-if="passwordErrorMessage" class="error-message" role="alert">
            {{ passwordErrorMessage }}
          </p>
        </form>
      </section>
    </div>
  </div>
</template>

<script>
import EmployeeProfileScript from './EmployeeProfile.js';
export default { ...EmployeeProfileScript };
</script>
