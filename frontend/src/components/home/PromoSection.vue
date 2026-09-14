<template>
  <section class="promo-section" id="promoSection" aria-labelledby="promoTitle">
    <div class="container">
      <div class="promo-card">
        <div>
          <span class="promo-label">Special promotion</span>
          <h2 id="promoTitle">Get 10% off your first online order.</h2>
        </div>

        <a class="btn-secondary" href="#menu">
          Order now
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h14m-5-5 5 5-5 5"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.promo-section {
  padding: 40px 0 28px;
}

.promo-card {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 32px;
  padding: 31px 36px;
  border-radius: var(--r-lg);
  background: var(--red);
  color: #fff;
}

.promo-label {
  display: block;
  margin-bottom: 6px;
  color: rgba(255, 255, 255, .75);
  font-size: .72rem;
  font-weight: 800;
  letter-spacing: .16em;
  text-transform: uppercase;
}

.promo-card h2 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.65rem, 3vw, 2.35rem);
  font-weight: 500;
  letter-spacing: -.035em;
  line-height: 1.15;
}

.btn-secondary {
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 24px;
  min-width: 154px;
  border: 1px solid #fff;
  border-radius: var(--r-sm);
  background: #fff;
  color: var(--red);
  font-size: .88rem;
  font-weight: 780;
  letter-spacing: .05em;
  text-transform: uppercase;
  transition: transform var(--ease);
}

.btn-secondary:hover {
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .promo-section {
    padding-top: 25px;
  }
  .promo-card {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 26px 24px;
  }
  .promo-card .btn-secondary {
    width: 100%;
  }
}
</style>
