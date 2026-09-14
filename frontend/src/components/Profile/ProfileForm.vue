<template>
  <form class="profile-form" @submit.prevent="handleSubmit">
    <!-- Personal Information -->
    <div class="form-section">
      <div class="section-heading">
        <h2>Personal Information</h2>
        <p>Update your personal information and contact details.</p>
      </div>

      <div class="form-grid">
        <AuthField
          id="fullName"
          v-model="form.fullName"
          label="Full Name"
          placeholder="Enter your full name"
          autocomplete="name"
          :required="true"
          :error="errors.fullName"
        />

        <AuthSelect
          id="gender"
          v-model="form.gender"
          label="Gender"
          placeholder="Select your gender"
          :options="genderOptions"
          :required="true"
          :error="errors.gender"
        />

        <AuthField
          id="email"
          v-model="form.email"
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          autocomplete="email"
          :required="true"
          :error="errors.email"
        />

        <AuthField
          id="address"
          v-model="form.address"
          label="Address"
          placeholder="Enter your address"
          autocomplete="street-address"
          :required="true"
          :error="errors.address"
        />
      </div>
    </div>

    <!-- Employee Information -->
    <template v-if="type === 'employee'">
      <div class="form-divider"></div>

      <div class="form-section">
        <div class="section-heading">
          <h2>Employee Information</h2>
          <p>Employee information is managed by the administrator.</p>
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
            id="position"
            v-model="form.position"
            label="Position"
            placeholder="Position"
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
        <p>Manage your account information and status.</p>
      </div>

      <div class="account-info">
        <div class="info-item">
          <span class="info-label">Email</span>
          <span class="info-value">
            {{ form.email || '-' }}
          </span>
        </div>

        <div
          v-if="type === 'employee'"
          class="info-item"
        >
          <span class="info-label">Join Date</span>
          <span class="info-value">
            {{ formattedJoinDate }}
          </span>
        </div>

        <div class="info-item">
          <span class="info-label">Account Status</span>
          <span class="status-badge">
            Active
          </span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <button
        type="button"
        class="btn btn-secondary"
        :disabled="isSaving"
        @click="resetForm"
      >
        Cancel
      </button>

      <button
        type="submit"
        class="btn btn-primary"
        :disabled="isSaving"
      >
        <span v-if="isSaving">
          Saving...
        </span>

        <span v-else>
          Save Changes
        </span>
      </button>
    </div>

    <p
      v-if="successMessage"
      class="success-message"
      role="status"
    >
      {{ successMessage }}
    </p>
  </form>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import AuthField from '../auth/AuthInput.vue';
import AuthSelect from '../auth/AuthSelect.vue';

const props = defineProps({
  type: {
    type: String,
    default: 'customer',
    validator: value =>
      ['customer', 'employee'].includes(value)
  },

  profile: {
    type: Object,
    default: () => ({
      fullName: '',
      gender: '',
      email: '',
      address: '',
      employeeId: '',
      position: '',
      joinDate: ''
    })
  }
});

const emit = defineEmits(['save']);

/* =========================
   Gender Options
========================= */

const genderOptions = [
  {
    value: 'male',
    label: 'Laki-laki'
  },
  {
    value: 'female',
    label: 'Perempuan'
  },
  {
    value: 'secret',
    label: 'Rahasia'
  }
];

/* =========================
   Form
========================= */

const form = reactive({
  fullName: '',
  gender: '',
  email: '',
  address: '',
  employeeId: '',
  position: '',
  joinDate: ''
});

/* =========================
   Errors
========================= */

const errors = reactive({
  fullName: '',
  gender: '',
  email: '',
  address: ''
});

/* =========================
   State
========================= */

const isSaving = ref(false);
const successMessage = ref('');

/* =========================
   Load Profile
========================= */

const loadProfile = () => {
  form.fullName = props.profile.fullName || '';
  form.gender = props.profile.gender || '';
  form.email = props.profile.email || '';
  form.address = props.profile.address || '';

  form.employeeId = props.profile.employeeId || '';
  form.position = props.profile.position || '';
  form.joinDate = props.profile.joinDate || '';
};

loadProfile();

watch(
  () => props.profile,
  () => {
    loadProfile();
  },
  {
    deep: true
  }
);

/* =========================
   Join Date
========================= */

const formattedJoinDate = computed(() => {
  if (!form.joinDate) {
    return '-';
  }

  const date = new Date(form.joinDate);

  if (Number.isNaN(date.getTime())) {
    return form.joinDate;
  }

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
});

/* =========================
   Validation
========================= */

const validateForm = () => {
  errors.fullName = '';
  errors.gender = '';
  errors.email = '';
  errors.address = '';

  let isValid = true;

  if (!form.fullName.trim()) {
    errors.fullName = 'Full name is required.';
    isValid = false;
  }

  if (!form.gender) {
    errors.gender = 'Gender is required.';
    isValid = false;
  }

  if (!form.email.trim()) {
    errors.email = 'Email address is required.';
    isValid = false;
  }

  if (!form.address.trim()) {
    errors.address = 'Address is required.';
    isValid = false;
  }

  return isValid;
};

/* =========================
   Submit
========================= */

const handleSubmit = async () => {
  successMessage.value = '';

  if (!validateForm()) {
    return;
  }

  isSaving.value = true;

  try {
    emit('save', {
      fullName: form.fullName,
      gender: form.gender,
      email: form.email,
      address: form.address
    });

    successMessage.value =
      'Your profile has been updated successfully.';
  } finally {
    isSaving.value = false;
  }
};

/* =========================
   Reset
========================= */

const resetForm = () => {
  loadProfile();

  errors.fullName = '';
  errors.gender = '';
  errors.email = '';
  errors.address = '';

  successMessage.value = '';
};
</script>

<style scoped>
.profile-form {
  width: 100%;
}

.form-section {
  padding: 4px 0;
}

.section-heading {
  margin-bottom: 26px;
}

.section-heading h2 {
  margin: 0 0 6px;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--ink);
}

.section-heading p {
  margin: 0;
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.6;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 24px;
}

.form-divider {
  height: 1px;
  background: var(--line);
  margin: 12px 0 32px;
}

.account-info {
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  overflow: hidden;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 58px;
  padding: 0 16px;
  border-bottom: 1px solid var(--line);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--muted);
}

.info-value {
  font-size: 0.88rem;
  color: var(--ink);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: #f0fdf4;
  color: #15803d;
  font-size: 0.78rem;
  font-weight: 700;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 32px;
}

.btn {
  min-width: 120px;
  height: 46px;
  padding: 0 18px;
  border-radius: var(--r-sm);
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;

  transition:
    background-color var(--ease),
    border-color var(--ease),
    color var(--ease),
    opacity var(--ease);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-secondary {
  border: 1px solid var(--line);
  background: var(--paper);
  color: var(--ink);
}

.btn-secondary:hover:not(:disabled) {
  background: #f7f5f2;
}

.btn-primary {
  border: 1px solid var(--red);
  background: var(--red);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #8f1827;
  border-color: #8f1827;
}

.success-message {
  margin: 16px 0 0;
  padding: 12px 14px;
  border: 1px solid #bbf7d0;
  border-radius: var(--r-sm);
  background: #f0fdf4;
  color: #166534;
  font-size: 0.84rem;
  font-weight: 600;
}

@media (max-width: 700px) {
  .form-grid {
    grid-template-columns: 1fr;
    column-gap: 0;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }
}
</style>