<template>
  <form class="profile-form" @submit.prevent="handleSubmit">
    <div class="form-section">
      <div class="section-heading"><h2>Personal Information</h2><p>Update your personal information and contact details.</p></div>
      <div class="form-grid">
        <AuthField id="fullName" v-model="form.fullName" label="Full Name" placeholder="Enter your full name" autocomplete="name" :required="true" :error="errors.fullName" />
        <AuthSelect id="gender" v-model="form.gender" label="Gender" placeholder="Select your gender" :options="genderOptions" :required="true" :error="errors.gender" />
        <AuthField id="email" v-model="form.email" label="Email Address" type="email" placeholder="Enter your email address" autocomplete="email" :required="true" :error="errors.email" />
        <AuthField id="address" v-model="form.address" label="Address" placeholder="Enter your address" autocomplete="street-address" :required="true" :error="errors.address" />
      </div>
    </div>
    <template v-if="type === 'employee'">
      <div class="form-divider"></div>
      <div class="form-section">
        <div class="section-heading"><h2>Employee Information</h2><p>Employee information is managed by the administrator.</p></div>
        <div class="form-grid">
          <AuthField id="employeeId" v-model="form.employeeId" label="Employee ID" placeholder="Employee ID" :disabled="true" />
          <AuthField id="position" v-model="form.position" label="Position" placeholder="Position" :disabled="true" />
        </div>
      </div>
    </template>
    <div class="form-divider"></div>
    <div class="form-section">
      <div class="section-heading"><h2>Account Information</h2><p>Manage your account information and status.</p></div>
      <div class="account-info">
        <div class="info-item"><span class="info-label">Email</span><span class="info-value">{{ form.email || '-' }}</span></div>
        <div v-if="type === 'employee'" class="info-item"><span class="info-label">Join Date</span><span class="info-value">{{ formattedJoinDate }}</span></div>
        <div class="info-item"><span class="info-label">Account Status</span><span class="status-badge">Active</span></div>
      </div>
    </div>
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" :disabled="isSaving" @click="resetForm">Cancel</button>
      <button type="submit" class="btn btn-primary" :disabled="isSaving"><span v-if="isSaving">Saving...</span><span v-else>Save Changes</span></button>
    </div>
    <p v-if="successMessage" class="success-message" role="status">{{ successMessage }}</p>
  </form>
</template>

<script>
import ProfileFormScript from './ProfileForm.js';
export default { ...ProfileFormScript };
</script>
