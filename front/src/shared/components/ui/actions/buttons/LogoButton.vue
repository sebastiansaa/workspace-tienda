<template>
  <button @click="handleSection('home')" class="nav__logo-btn">
    <img src="@/assets/logo.svg" alt="Logo" class="nav__logo" />
  </button>
</template>

<script setup lang="ts">
import { useNavigation } from '../../../../composables'
const { handleSection } = useNavigation()
</script>

<style scoped>
.nav__logo-btn {
  background: none;
  border: none;
  cursor: pointer;
}
.nav__logo {
  height: 32px;
  width: 32px;
}
</style>
