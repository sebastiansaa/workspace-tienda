<template>
  <button
    @click="$emit('click')"
    aria-label="Facebook login"
    type="button"
    class="social-btn facebook-btn"
  >
    <span class="icon-facebook">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="#1877F3"
          d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"
        />
      </svg>
    </span>
    <slot>Facebook</slot>
  </button>
</template>

<script setup lang="ts">
// No props, solo emite click
</script>

<style scoped>
.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.85rem 1.5rem;
  border: 1.5px solid #e0e0e0;
  background: white;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: #333;
}
.social-btn:hover {
  border-color: #1877f3;
  background: #f8f9ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.social-btn:active {
  transform: translateY(0);
}
.icon-facebook {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
