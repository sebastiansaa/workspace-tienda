<template>
  <div class="auth-container">
    <AuthFormLogin
      v-if="mode === 'login'"
      @submit="handleLogin"
      @switchToRegister="mode = 'register'"
    />
    <AuthFormRegister v-else @submit="handleRegister" @switchToLogin="mode = 'login'" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import AuthFormLogin from './AuthFormLogin.vue'
import AuthFormRegister from './AuthFormRegister.vue'
import { useAuthStore } from '../stores/authStore'
import type { LoginPayload } from '../schemas/loginSchema'
import type { RegisterPayload } from '../schemas/registerSchema'

const mode = ref<'login' | 'register'>('login')
const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const handleLogin = async (data: LoginPayload) => {
  try {
    await authStore.login(data.email, data.password)
    toast.success('¡Bienvenido!')
    router.push('/')
  } catch (error) {
    toast.error('Error al iniciar sesión. Verifica tus credenciales.')
    console.error('Login error:', error)
  }
}

const handleRegister = async (data: RegisterPayload) => {
  try {
    await authStore.register(data.email, data.password)
    toast.success('Registro completado, sesión iniciada')
    router.push('/')
  } catch (error) {
    toast.error('Error al registrarse. Intenta nuevamente.')
    console.error('Register error:', error)
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

@media (max-width: 800px) {
  .auth-container {
    align-items: flex-start;
    padding-top: 2rem;
  }
}
</style>
