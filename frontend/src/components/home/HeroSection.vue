<template>
  <section class="hero-wrap" id="home" aria-labelledby="heroTitle">
    <div class="hero">
      <div class="hero-content">
        <div class="hero-copy">
          <span class="eyebrow">Authentic taste</span>
          <h1 id="heroTitle">Indonesian food, <span>made for Korea.</span></h1>
          <p class="hero-description">Traditional meals and selected Indonesian ingredients, prepared for easy online ordering across Korea.</p>
          <a class="btn-primary" href="#menu">
            Order now
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
          <div class="hero-meta" aria-label="Service highlights">
            <span>Freshly prepared</span>
            <span>Online ordering</span>
          </div>
        </div>
      </div>
      <div class="hero-image">
        <img
          src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1200"
          alt="Indonesian rice dish with vegetables and side dishes"
          width="1200"
          height="900"
          fetchpriority="high"
        />
        <div class="hero-image-note">
          <small>Featured today</small>
          <strong>Flavours from home</strong>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-wrap {
  padding: 0;
  width: 100%;
}

.hero {
  display: grid;
  width: 100%;
  min-height: 620px;
  grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
  align-items: stretch;
  overflow: hidden;
  background: var(--soft);
}

.hero-content {
  display: flex;
  align-items: center;
  padding: clamp(46px, 6vw, 78px);
}

.hero-copy {
  width: min(100%, 510px);
  margin-left: auto;
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

.hero h1 {
  max-width: 620px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(3.25rem, 5.4vw, 5rem);
  font-weight: 500;
  letter-spacing: -.055em;
  line-height: .98;
}

.hero h1 span {
  color: var(--red);
}

.hero-description {
  max-width: 430px;
  margin: 24px 0 31px;
  color: var(--muted);
  font-size: 1.08rem;
}

.btn-primary {
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 24px;
  border: 1px solid transparent;
  border-radius: var(--r-sm);
  background: var(--red);
  color: #fff;
  font-size: .88rem;
  font-weight: 780;
  letter-spacing: .05em;
  text-transform: uppercase;
  box-shadow: 0 10px 26px rgba(165, 29, 45, .20);
  transition: transform var(--ease), background var(--ease), box-shadow var(--ease);
}

.btn-primary:hover {
  background: var(--red-dark);
  box-shadow: 0 12px 30px rgba(125, 21, 34, .26);
  transform: translateY(-1px);
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 32px;
  color: var(--muted);
  font-size: .72rem;
  font-weight: 750;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.hero-meta span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.hero-meta span::before {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--red);
  content: "";
}

.hero-image {
  position: relative;
  min-height: 100%;
  overflow: hidden;
}

.hero-image::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(25, 21, 18, .12), transparent 28%);
  content: "";
  pointer-events: none;
}

.hero-image img {
  width: 100%;
  height: 100%;
  min-height: 620px;
  object-fit: cover;
}

.hero-image-note {
  position: absolute;
  right: 24px;
  bottom: 24px;
  z-index: 1;
  max-width: 190px;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, .58);
  border-radius: var(--r-md);
  background: rgba(255, 255, 255, .9);
  box-shadow: 0 8px 24px rgba(36, 25, 18, .08);
  backdrop-filter: blur(10px);
}

.hero-image-note strong {
  display: block;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.08rem;
  line-height: 1.2;
}

.hero-image-note small {
  color: var(--muted);
  font-size: .68rem;
  font-weight: 750;
  letter-spacing: .08em;
  text-transform: uppercase;
}

@media (max-width: 1040px) {
  .hero, .hero-image img {
    min-height: 560px;
  }
  .hero-content {
    padding: 46px;
  }
}

@media (max-width: 860px) {
  .hero {
    min-height: auto;
    grid-template-columns: 1fr;
  }
  .hero-image {
    order: -1;
    min-height: 420px;
  }
  .hero-image img {
    min-height: 420px;
  }
  .hero-content {
    padding: 50px 44px 55px;
  }
}

@media (max-width: 640px) {
  .hero-wrap {
    padding-top: 16px;
  }
  .hero-image, .hero-image img {
    min-height: 330px;
  }
  .hero-image-note {
    right: 14px;
    bottom: 14px;
    padding: 11px 13px;
  }
  .hero-content {
    padding: 38px 24px 43px;
  }
  .hero h1 {
    font-size: clamp(2.3rem, 12vw, 3.2rem);
  }
  .hero-description {
    margin: 19px 0 25px;
    font-size: .98rem;
  }
  .hero-meta {
    flex-wrap: wrap;
    gap: 8px 15px;
    margin-top: 24px;
    font-size: .66rem;
  }
}
</style>
