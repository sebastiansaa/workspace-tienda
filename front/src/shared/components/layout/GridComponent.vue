<template>
  <div class="grid-component">
    <slot />
  </div>
</template>

<style scoped>
.grid-component {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  margin: 0 auto;
  overflow-x: auto;
  padding: 1rem;
}
</style>
