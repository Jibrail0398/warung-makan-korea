<template>
  <div class="profile-page">
    <header class="site-header"><div class="container header-inner"><router-link class="brand" to="/" aria-label="Warung Nusantara homepage"><span class="brand-mark" aria-hidden="true">WN</span><span class="brand-copy"><strong>Warung Nusantara</strong><small>Indonesia in Korea</small></span></router-link><nav class="desktop-nav" aria-label="Main navigation"><router-link to="/">Home</router-link><router-link to="/menu">Menu</router-link><router-link to="/about">About</router-link><router-link to="/cart">Cart</router-link><router-link class="active" to="/profile">Profile</router-link></nav></div></header>
    <main class="profile-main"><div class="container">
      <div class="page-heading"><div><p class="eyebrow">MY ACCOUNT</p><h1 class="page-title">Profile</h1><p class="heading-description">Manage your personal information and account details.</p></div></div>
      <div class="profile-layout">
        <aside class="profile-sidebar">
          <div class="profile-card">
            <div class="avatar" role="button" tabindex="0" title="Change profile picture" @click="triggerProfileUpload" @keydown.enter="triggerProfileUpload" @keydown.space.prevent="triggerProfileUpload">
              <img v-if="profilePicture" :src="profilePicture" alt="Profile picture" />
              <span v-else>{{ userInitial }}</span>
              <input ref="profileInput" type="file" accept="image/*" hidden @change="handleProfileUpload" />
            </div>
            <h2>{{ profile.fullName }}</h2><p>{{ profile.email }}</p>
          </div>
          <nav class="profile-nav" aria-label="Profile navigation">
            <router-link class="profile-nav-item active" to="/profile"><span>Profile Information</span><span aria-hidden="true">›</span></router-link>
            <router-link class="profile-nav-item" to="/orders"><span>Change Phone Number</span><span aria-hidden="true">›</span></router-link>
            <router-link class="profile-nav-item" to="/change-password"><span>Change Password</span><span aria-hidden="true">›</span></router-link>
          </nav>
        </aside>
        <section class="profile-content" aria-label="Profile information"><ProfileForm :profile="profile" @save="handleSave" /></section>
      </div>
    </div></main>
  </div>
</template>

<script>
import CustomerProfileScript from './CustomerProfile.js';
export default { ...CustomerProfileScript };
</script>
