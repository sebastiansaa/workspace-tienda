<template>
  <section class="wishlist">
    <header>
      <p class="wishlist__kicker">Favoritos</p>
      <h2>Lista de deseos</h2>
      <p class="wishlist__sub">Guarda productos para verlos después.</p>
    </header>
    <div class="wishlist__empty">
      <p>No tienes productos guardados.</p>
      <small>Cuando agregues favoritos, aparecerán aquí.</small>
    </div>
  </section>
</template>

<script setup lang="ts">
// Placeholder: conectar con dominio de productos/favoritos cuando esté disponible.
</script>

<style scoped>
.wishlist {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
}
.wishlist__kicker {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.wishlist__sub {
  margin: 4px 0 0;
  color: #475569;
}
.wishlist__empty {
  padding: 16px;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  color: #475569;
  background: #f8fafc;
  margin-top: 12px;
}
</style>
