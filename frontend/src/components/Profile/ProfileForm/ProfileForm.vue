<template>
  <form class="profile-form" @submit.prevent="handleSubmit">
    <!-- Personal Information -->
    <div class="form-section">
      <div class="section-heading">
        <h2>{{ type === 'employee' ? 'Informasi Pribadi' : 'Personal Information' }}</h2>
        <p>{{ type === 'employee' ? 'Kelola data pribadi dan nomor kontak Anda.' : 'Update your personal information and contact details.' }}</p>
      </div>

      <!-- Employee mode: Only Nama & No. Handphone -->
      <div v-if="type === 'employee'" class="form-grid">
        <AuthField
          id="fullName"
          v-model="form.fullName"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          autocomplete="name"
          :required="true"
          :error="errors.fullName"
          :disabled="isSaving"
        />
        <AuthField
          id="phone"
          v-model="form.phone"
          label="No. Handphone"
          type="tel"
          placeholder="Masukkan nomor handphone"
          autocomplete="tel"
          :required="true"
          :error="errors.phone"
          :disabled="isSaving"
        />
      </div>

      <!-- Customer mode -->
      <div v-else class="form-grid">
        <AuthField
          id="fullName"
          v-model="form.fullName"
          label="Full Name"
          placeholder="Enter your full name"
          autocomplete="name"
          :required="true"
          :error="errors.fullName"
          :disabled="isSaving"
        />
        <AuthField
          id="phone"
          v-model="form.phone"
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
          autocomplete="tel"
          :error="errors.phone"
          :disabled="isSaving"
        />
        <AuthField
          id="email"
          v-model="form.email"
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          autocomplete="email"
          :error="errors.email"
          :disabled="isSaving"
        />
        <AuthField
          id="address"
          v-model="form.address"
          label="Address"
          placeholder="Enter your address"
          autocomplete="street-address"
          :error="errors.address"
          :disabled="isSaving"
        />
      </div>
    </div>

    <!-- Employee Specific Information -->
    <template v-if="type === 'employee'">
      <div class="form-divider"></div>
      <div class="form-section">
        <div class="section-heading">
          <h2>Employee Information</h2>
          <p>Informasi ID dan role akun pegawai yang terdaftar di sistem.</p>
        </div>
        <div class="form-grid">
          <AuthField
            id="employeeId"
            v-model="form.employeeId"
            label="Employee ID"
            placeholder="Employee ID"
            :disabled="true"
          />
          <AuthField
            id="role"
            :model-value="displayRole"
            label="Role"
            placeholder="Role"
            :disabled="true"
          />
        </div>
      </div>
    </template>

    <!-- Account Information -->
    <div class="form-divider"></div>
    <div class="form-section">
      <div class="section-heading">
        <h2>Account Information</h2>
        <p>Informasi nomor handphone dan tanggal bergabung akun Anda.</p>
      </div>
      <div v-if="type === 'employee'" class="account-info">
        <div class="info-item">
          <span class="info-label">No. Handphone</span>
          <span class="info-value">{{ form.phone || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Join Date</span>
          <span class="info-value">{{ formattedJoinDate }}</span>
        </div>
      </div>
      <div v-else class="account-info">
        <div class="info-item">
          <span class="info-label">Email</span>
          <span class="info-value">{{ form.email || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Join Date</span>
          <span class="info-value">{{ formattedJoinDate }}</span>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" :disabled="isSaving" @click="resetForm">
        {{ type === 'employee' ? 'Batal' : 'Cancel' }}
      </button>
      <button type="submit" class="btn btn-primary" :disabled="isSaving">
        <LoadingSpinner v-if="isSaving" size="sm" color="white" :text="type === 'employee' ? 'Menyimpan...' : 'Saving...'" inline />
        <span v-else>{{ type === 'employee' ? 'Simpan Perubahan' : 'Save Changes' }}</span>
      </button>
    </div>
    <p v-if="successMessage" class="success-message" role="status">{{ successMessage }}</p>
  </form>
</template>

<script>
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner.vue';
import ProfileFormScript from './ProfileForm.js';

export default {
  components: {
    LoadingSpinner
  },
  ...ProfileFormScript
};
</script>
