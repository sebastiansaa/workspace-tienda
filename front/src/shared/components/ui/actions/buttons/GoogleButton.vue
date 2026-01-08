<template>
  <button
    @click="$emit('click')"
    aria-label="Google login"
    type="button"
    class="social-btn google-btn"
  >
    <span class="icon-google">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M21.35 11.1h-9.18v2.92h5.27c-.23 1.23-1.41 3.6-5.27 3.6-3.17 0-5.76-2.62-5.76-5.82s2.59-5.82 5.76-5.82c1.81 0 3.03.77 3.73 1.43l2.55-2.48C16.13 3.54 14.3 2.7 12.17 2.7 6.99 2.7 2.7 7.01 2.7 12.19s4.29 9.49 9.47 9.49c5.47 0 9.09-3.85 9.09-9.28 0-.62-.07-1.09-.16-1.3z"
        />
      </svg>
    </span>
    <slot>Google</slot>
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
  border-color: #667eea;
  background: #f8f9ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.social-btn:active {
  transform: translateY(0);
}
.icon-google {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
