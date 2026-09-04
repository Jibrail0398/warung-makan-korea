<template>
  <article
    class="product-card"
    tabindex="0"
    :aria-label="`View ${product.name} details`"
    @click="$emit('select', product.id)"
    @keydown.enter="$emit('select', product.id)"
  >
    <div class="product-image">
      <img
        :src="product.image"
        :alt="`${product.name} Indonesian product`"
        width="600"
        height="600"
        loading="lazy"
      />

      <span class="product-type">
        {{ product.category === 'restaurant' ? 'Restaurant' : 'Ingredient' }}
      </span>
    </div>

    <div class="product-info">
      <h3>{{ product.name }}</h3>

      <p class="description">
        {{ product.description }}
      </p>

      <div class="product-meta">
        <span class="price">
          {{ product.price }}
        </span>

        <QuantityControl
          :quantity="quantity"
          :productName="product.name"
          @increase="$emit('increase', product)"
          @decrease="$emit('decrease', product)"
        />
      </div>
    </div>
  </article>
</template>

<script setup>
import QuantityControl from './QuantityControl.vue';

defineProps({
  product: {
    type: Object,
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  }
});

defineEmits(['select', 'increase', 'decrease']);
</script>

<style scoped>
/* =========================================
   PRODUCT CARD
========================================= */

.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;

  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: var(--paper);

  cursor: pointer;

  transition:
    border-color var(--ease),
    box-shadow var(--ease),
    transform var(--ease);
}

.product-card:hover {
  border-color: #d7cbc1;
  box-shadow: 0 8px 24px rgba(36, 25, 18, 0.07);
  transform: translateY(-3px);
}

.product-card:focus-visible {
  outline: 2px solid var(--red);
  outline-offset: 3px;
}


/* =========================================
   IMAGE
========================================= */

.product-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;

  overflow: hidden;
  background: var(--warm);
}

.product-image img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  transition: transform 320ms ease;
}

.product-card:hover .product-image img {
  transform: scale(1.035);
}


/* =========================================
   PRODUCT TYPE
========================================= */

.product-type {
  position: absolute;
  top: 12px;
  left: 12px;

  max-width: calc(100% - 24px);

  padding: 6px 9px;

  border: 1px solid rgba(255, 255, 255, 0.68);
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.9);

  font-size: 0.61rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  line-height: 1;
  text-transform: uppercase;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  backdrop-filter: blur(8px);
}


/* =========================================
   PRODUCT INFO
========================================= */

.product-info {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;

  padding: 17px 17px 18px;
}

.product-info h3 {
  min-width: 0;
  min-height: 1.5em;

  margin: 0;

  font-size: 1rem;
  font-weight: 750;
  line-height: 1.35;

  overflow: hidden;
  text-overflow: ellipsis;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}


/* =========================================
   DESCRIPTION
========================================= */

.description {
  min-width: 0;

  margin: 6px 0 0;

  color: var(--muted);

  font-size: 0.84rem;
  line-height: 1.45;

  overflow: hidden;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}


/* =========================================
   META
========================================= */

.product-meta {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 12px;

  margin-top: auto;
  padding-top: 14px;

  min-width: 0;
}

.price {
  display: block;
  min-width: 0;

  color: var(--red);

  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.2;

  white-space: nowrap;
}


/* =========================================
   TABLET
   641px - 1024px
========================================= */

@media (max-width: 1024px) {
  .product-info {
    padding: 15px 14px 16px;
  }

  .product-type {
    top: 10px;
    left: 10px;

    padding: 5px 8px;

    font-size: 0.57rem;
  }

  .product-info h3 {
    font-size: 0.96rem;
  }

  .description {
    margin-top: 5px;
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .product-meta {
    gap: 8px;
    padding-top: 12px;
  }

  .price {
    font-size: 1rem;
  }
}


/* =========================================
   MOBILE
   <= 640px
========================================= */

@media (max-width: 640px) {
  .product-card {
    border-radius: var(--r-md);
    transform: none;
  }

  .product-card:hover {
    transform: none;
    box-shadow: none;
  }

  .product-card:hover .product-image img {
    transform: none;
  }

  .product-image {
    aspect-ratio: 1 / 1;
  }

  .product-type {
    top: 8px;
    left: 8px;

    max-width: calc(100% - 16px);

    padding: 5px 7px;

    font-size: 0.52rem;
  }

  .product-info {
    padding: 12px 11px 12px;
  }

  .product-info h3 {
    min-height: auto;

    font-size: 0.9rem;
    line-height: 1.3;

    -webkit-line-clamp: 2;
  }

  .description {
    margin-top: 5px;

    font-size: 0.75rem;
    line-height: 1.4;

    -webkit-line-clamp: 2;
  }

  /*
   * MOBILE:
   * Harga dan tombol quantity
   * berada di bagian paling bawah card.
   */
  .product-meta {
    align-items: center;
    justify-content: space-between;

    gap: 6px;

    margin-top: auto;
    padding-top: 10px;
  }

  .price {
    flex: 0 1 auto;

    font-size: 0.88rem;
    line-height: 1.2;

    overflow: hidden;
    text-overflow: ellipsis;
  }
}


/* =========================================
   SMALL MOBILE
   <= 400px
========================================= */

@media (max-width: 400px) {
  .product-info {
    padding: 10px 9px 11px;
  }

  .product-info h3 {
    font-size: 0.84rem;
  }

  .description {
    font-size: 0.7rem;
  }

  /* Harga di atas, tombol di bawah */
  .product-meta {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    padding-top: 10px;
  }

  .price {
    font-size: 0.82rem;
  }

  .product-type {
    top: 7px;
    left: 7px;
    padding: 4px 6px;
    font-size: 0.48rem;
  }
}
</style>