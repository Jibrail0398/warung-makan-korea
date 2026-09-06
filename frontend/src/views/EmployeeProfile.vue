<template>
  <div class="profile-page">
    <header class="site-header">
      <div class="container header-inner">
        <router-link
          class="brand"
          to="/"
          aria-label="Warung Nusantara homepage"
        >
          <span class="brand-mark" aria-hidden="true">WN</span>

          <span class="brand-copy">
            <strong>Warung Nusantara</strong>
            <small>Indonesia in Korea</small>
          </span>
        </router-link>

        <nav class="desktop-nav" aria-label="Main navigation">
          <router-link to="/">Home</router-link>
          <router-link to="/menu">Menu</router-link>
          <router-link to="/about">About</router-link>
          <router-link to="/cart">Cart</router-link>
          <router-link class="active" to="/profile">Profile</router-link>
        </nav>
      </div>
    </header>

    <main class="profile-main">
      <div class="container">
        <div class="page-heading">
          <div>
            <p class="eyebrow">EMPLOYEE ACCOUNT</p>

            <h1 class="page-title">Profile</h1>

            <p class="heading-description">
              Manage your personal information and employee account details.
            </p>
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
                <img
                  v-if="profilePicture"
                  :src="profilePicture"
                  alt="Profile picture"
                />

                <span v-else>
                  {{ userInitial }}
                </span>

                <input
                  ref="profileInput"
                  type="file"
                  accept="image/*"
                  hidden
                  @change="handleProfileUpload"
                />
              </div>

              <h2>{{ profile.fullName }}</h2>
              <p>{{ profile.position }}</p>
            </div>

            <nav class="profile-nav" aria-label="Profile navigation">
              <router-link
                class="profile-nav-item active"
                to="/profile"
              >
                <span>Profile Information</span>
                <span aria-hidden="true">›</span>
              </router-link>

              <router-link
                class="profile-nav-item"
                to="/change-password"
              >
                <span>Change Password</span>
                <span aria-hidden="true">›</span>
              </router-link>
            </nav>
          </aside>

          <section
            class="profile-content"
            aria-label="Employee profile information"
          >
            <ProfileForm
              type="employee"
              :profile="profile"
              @save="handleSave"
            />
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onBeforeUnmount } from 'vue';
import ProfileForm from '../components/Profile/ProfileForm.vue';

const profile = reactive({
  fullName: 'Employee Name',
  gender: 'male',
  email: 'employee@example.com',
  address: 'Seoul, South Korea',

  employeeId: 'EMP-001',
  position: 'Cashier',
  joinDate: '2026-08-01'
});

const profileInput = ref(null);
const profilePicture = ref('');

const userInitial = computed(() => {
  if (!profile.fullName) {
    return 'E';
  }

  return profile.fullName
    .trim()
    .charAt(0)
    .toUpperCase();
});

const triggerProfileUpload = () => {
  profileInput.value?.click();
};

const handleProfileUpload = (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith('image/')) {
    return;
  }

  if (profilePicture.value) {
    URL.revokeObjectURL(profilePicture.value);
  }

  profilePicture.value = URL.createObjectURL(file);
};

const handleSave = (updatedProfile) => {
  Object.assign(profile, updatedProfile);

  // Nanti bisa diganti dengan API:
  // await axios.put('/api/employee/profile', updatedProfile);
};

onBeforeUnmount(() => {
  if (profilePicture.value) {
    URL.revokeObjectURL(profilePicture.value);
  }
});
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
}

.container {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--paper);
  border-bottom: 1px solid var(--line);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 76px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  color: var(--ink);
  text-decoration: none;
}

.brand-mark {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 50%;
  background: var(--red);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.brand-copy {
  display: flex;
  flex-direction: column;
}

.brand-copy strong {
  font-size: 0.92rem;
  line-height: 1.2;
}

.brand-copy small {
  margin-top: 2px;
  color: var(--muted);
  font-size: 0.68rem;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 28px;
}

.desktop-nav a {
  position: relative;
  color: var(--muted);
  text-decoration: none;
  font-size: 0.86rem;
  font-weight: 700;
  transition: color var(--ease);
}

.desktop-nav a:hover,
.desktop-nav a.active {
  color: var(--red);
}

.profile-main {
  padding: 58px 0 80px;
}

.page-heading {
  display: flex;
  justify-content: space-between;
  margin-bottom: 38px;
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--red);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.heading-description {
  max-width: 560px;
  margin: 12px 0 0;
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.7;
}

.profile-layout {
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
  gap: 28px;
  align-items: start;
}

.profile-sidebar {
  position: sticky;
  top: 102px;
}

.profile-card {
  padding: 26px 20px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: #fff;
  text-align: center;
}

.avatar {
  position: relative;
  display: grid;
  width: 76px;
  height: 76px;
  margin: 0 auto 16px;
  place-items: center;
  border-radius: 50%;
  overflow: hidden;
  background: #f3eee9;
  color: var(--red);
  font-size: 1.55rem;
  font-weight: 800;
  cursor: pointer;
  transition: opacity var(--ease);
}

.avatar:hover {
  opacity: 0.85;
}

.avatar img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-card h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
}

.profile-card p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 0.8rem;
  overflow-wrap: anywhere;
}

.profile-nav {
  margin-top: 14px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: #fff;
  overflow: hidden;
}

.profile-nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 52px;
  padding: 0 16px;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 700;
  transition:
    background-color var(--ease),
    color var(--ease);
}

.profile-nav-item:last-child {
  border-bottom: none;
}

.profile-nav-item:hover {
  background: #faf8f6;
}

.profile-nav-item.active {
  color: var(--red);
  background: #fffaf9;
}

.profile-content {
  min-width: 0;
  padding: 32px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: #fff;
}

.page-title {
  margin: 0;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 3rem;
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

@media (max-width: 850px) {
  .desktop-nav {
    gap: 16px;
  }

  .profile-layout {
    grid-template-columns: 1fr;
  }

  .profile-sidebar {
    position: static;
  }

  .profile-card {
    display: grid;
    grid-template-columns: 64px 1fr;
    column-gap: 14px;
    align-items: center;
    text-align: left;
  }

  .avatar {
    width: 64px;
    height: 64px;
    margin: 0;
    grid-row: span 2;
  }

  .profile-card h2 {
    align-self: end;
  }

  .profile-card p {
    align-self: start;
    margin-top: 2px;
  }

  .profile-nav {
    display: flex;
    overflow-x: auto;
  }

  .profile-nav-item {
    flex: 1 0 auto;
    border-right: 1px solid var(--line);
    border-bottom: none;
    padding: 0 18px;
  }

  .profile-nav-item:last-child {
    border-right: none;
  }

  .profile-nav-item span:last-child {
    display: none;
  }
}

@media (max-width: 650px) {
  .container {
    width: min(100% - 28px, 1180px);
  }

  .header-inner {
    min-height: 68px;
  }

  .desktop-nav a:nth-child(-n + 3) {
    display: none;
  }

  .profile-main {
    padding: 38px 0 60px;
  }

  .page-heading {
    margin-bottom: 26px;
  }

  .profile-content {
    padding: 22px 18px;
  }
}
</style>