<template>
  <section class="about-wrap" id="about" aria-labelledby="aboutTitle">
    <div class="container about-section">
      <div class="about-image">
        <img src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1000" alt="Warm Indonesian restaurant dining atmosphere" width="1000" height="800" loading="lazy" />
        <div class="about-stat"><strong>100%</strong><span>Indonesian-inspired taste and hospitality</span></div>
      </div>
      <div class="about-content">
        <span class="eyebrow">Our story</span>
        <h2 class="section-title" id="aboutTitle">A taste of Indonesia, closer to home.</h2>
        <p class="section-copy">We bring authentic Indonesian flavours to Korea through carefully prepared meals and selected ingredients. Every dish is rooted in familiar recipes, warm hospitality, and the joy of sharing food.</p>
        <div class="about-values" aria-label="Restaurant values"><div class="about-value"><strong>Authentic recipes</strong><span>Familiar flavour, thoughtfully prepared.</span></div><div class="about-value"><strong>Selected ingredients</strong><span>Pantry essentials sourced with care.</span></div></div>
        <a class="text-link" href="/about">Learn more about us <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg></a>
      </div>
    </div>
  </section>
</template>

<script>
import './AboutSection.css';
export default { name: 'AboutSection' };
</script>
