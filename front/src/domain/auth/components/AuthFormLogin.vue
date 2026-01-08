<template>
  <div class="auth-form">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleSubmit">
      <div class="field">
        <label>Email</label>
        <input v-model="email" type="email" @blur="emailBlur" placeholder="tu@email.com" />
        <div class="error">{{ emailError || formErrors.email }}</div>
      </div>

      <div class="field">
        <label>Contraseña</label>
        <input v-model="password" type="password" @blur="passwordBlur" placeholder="••••••••" />
        <div class="error">{{ passwordError || formErrors.password }}</div>
      </div>

      <div class="actions">
        <button type="submit" class="btn primary">Ingresar</button>
      </div>

      <div class="switch-link">
        ¿No tienes cuenta?
        <a @click.prevent="$emit('switchToRegister')">Inscríbete aquí</a>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useLoginForm } from '../composables/useLoginForm'

const emit = defineEmits(['submit', 'switchToRegister'])

const {
  email,
  emailError,
  emailBlur,
  password,
  passwordError,
  passwordBlur,
  formErrors,
  onSubmit,
} = useLoginForm()

const handleSubmit = async () => {
  const result = await onSubmit()
  if (result) {
    emit('submit', result)
  }
}
</script>

<style scoped>
.auth-form {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-width: 400px;
  width: 100%;
}

h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #333;
  text-align: center;
}

.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.4rem;
  font-weight: 500;
}

.field input {
  width: 100%;
  padding: 0.75rem;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.field input:focus {
  outline: none;
  border-color: #007bff;
}

.error {
  min-height: 1.2rem;
  font-size: 0.8rem;
  color: #dc3545;
  margin-top: 0.25rem;
}

.actions {
  margin-top: 1.5rem;
}

.btn {
  width: 100%;
  padding: 0.85rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn.primary {
  background: #007bff;
  color: #fff;
}

.btn.primary:hover {
  background: #0056b3;
}

.switch-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}

.switch-link a {
  color: #007bff;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
}

.switch-link a:hover {
  text-decoration: underline;
}

@media (max-width: 800px) {
  .auth-form {
    padding: 1.5rem;
  }
}
</style>
