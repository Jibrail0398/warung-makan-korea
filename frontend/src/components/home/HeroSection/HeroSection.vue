<template>
  <section class="hero-wrap" id="home" aria-labelledby="heroTitle">
    <div class="hero">
      <div class="hero-content">
        <div class="hero-copy">
          <h1 id="heroTitle">Indonesian food, <span>made for Korea.</span></h1>
          <p class="hero-description">Traditional meals and selected Indonesian ingredients, prepared for easy online ordering across Korea.</p>
          <a class="btn-primary" href="#menu">Order now <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg></a>
        </div>
      </div>
      <div class="hero-image">
        <img src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1200" alt="Indonesian rice dish with vegetables and side dishes" width="1200" height="900" fetchpriority="high" />
      </div>
    </div>
  </section>
</template>

<script>
import './HeroSection.css';
export default { name: 'HeroSection' };
</script>
