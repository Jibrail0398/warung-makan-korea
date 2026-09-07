<template>
  <section class="about-wrap" id="about" aria-labelledby="aboutTitle">
    <div class="container about-section">
      <div class="about-image">
        <img
          src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1000"
          alt="Warm Indonesian restaurant dining atmosphere"
          width="1000"
          height="800"
          loading="lazy"
        />
        <div class="about-stat">
          <strong>100%</strong>
          <span>Indonesian-inspired taste and hospitality</span>
        </div>
      </div>
      <div class="about-content">
        <span class="eyebrow">Our story</span>
        <h2 class="section-title" id="aboutTitle">A taste of Indonesia, closer to home.</h2>
        <p class="section-copy">We bring authentic Indonesian flavours to Korea through carefully prepared meals and selected ingredients. Every dish is rooted in familiar recipes, warm hospitality, and the joy of sharing food.</p>
        <div class="about-values" aria-label="Restaurant values">
          <div class="about-value">
            <strong>Authentic recipes</strong>
            <span>Familiar flavour, thoughtfully prepared.</span>
          </div>
          <div class="about-value">
            <strong>Selected ingredients</strong>
            <span>Pantry essentials sourced with care.</span>
          </div>
        </div>
        <a class="text-link" href="/about">
          Learn more about us
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-wrap {
  padding: 72px 0 88px;
  background: var(--soft);
}

.about-section {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  gap: clamp(42px, 7vw, 88px);
}

.about-image {
  position: relative;
  min-height: 500px;
  overflow: hidden;
  border-radius: var(--r-lg);
  background: var(--warm);
}

.about-image img {
  width: 100%;
  height: 100%;
  min-height: 500px;
  object-fit: cover;
}

.about-stat {
  position: absolute;
  right: 20px;
  bottom: 20px;
  max-width: 190px;
  padding: 18px;
  border-radius: var(--r-md);
  background: #fff;
  box-shadow: var(--shadow);
}

.about-stat strong {
  display: block;
  color: var(--red);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 2rem;
  font-weight: 500;
  line-height: 1;
}

.about-stat span {
  display: block;
  margin-top: 7px;
  color: var(--muted);
  font-size: .76rem;
  font-weight: 700;
  line-height: 1.35;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  color: var(--red);
  font-size: .76rem;
  font-weight: 800;
  letter-spacing: .14em;
  line-height: 1;
  text-transform: uppercase;
}

.eyebrow::before {
  width: 28px;
  height: 2px;
  background: currentColor;
  content: "";
}

.section-title {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 500;
  letter-spacing: -.045em;
  line-height: 1.08;
}

.section-copy {
  color: var(--muted);
}

.about-content .section-copy {
  max-width: 510px;
  margin: 24px 0 28px;
  font-size: 1.05rem;
}

.about-values {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 31px;
}

.about-value {
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: #fff;
}

.about-value strong {
  display: block;
  margin-bottom: 2px;
  font-size: .9rem;
}

.about-value span {
  color: var(--muted);
  font-size: .76rem;
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding-bottom: 3px;
  border-bottom: 1px solid var(--ink);
  font-size: .88rem;
  font-weight: 750;
  transition: color var(--ease), border-color var(--ease), gap var(--ease);
}

.text-link:hover {
  gap: 13px;
  border-color: var(--red);
  color: var(--red);
}

@media (max-width: 860px) {
  .about-section {
    grid-template-columns: 1fr;
  }
  .about-image, .about-image img {
    min-height: 430px;
  }
}

@media (max-width: 640px) {
  .about-wrap {
    padding: 58px 0 64px;
  }
  .about-image, .about-image img {
    min-height: 340px;
  }
  .about-stat {
    right: 13px;
    bottom: 13px;
    padding: 14px;
  }
  .about-values {
    grid-template-columns: 1fr;
  }
}
</style>
