<template>
  <article class="product-card" tabindex="0" :aria-label="`View ${product.name} details`" @keydown.enter="$emit('select', product.id)">
    <div class="product-image">
      <img :src="ResolveImageUrl(product.image)" :alt="`${product.name} Indonesian product`" width="600" height="600" loading="lazy" />
      <span class="product-type">{{ product.category === 'restaurant' ? 'Restaurant' : 'Ingredient' }}</span>
    </div>
    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <p class="description">{{ product.description }}</p>
      <div class="product-meta">
        <span class="price">{{ product.price }}</span>
        <QuantityControl :quantity="quantity" :productName="product.name" @increase="$emit('increase', product)" @decrease="$emit('decrease', product)" />
      </div>
    </div>
  </article>
</template>

<script>
import MenuCardScript from './MenuCard.js';
export default { ...MenuCardScript };
</script>
