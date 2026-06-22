<script setup lang="ts">
import Card from 'primevue/card'
import { Form } from '@primevue/forms'
</script>

<template>
  <div class="login-card">
    <Card style="width: 25rem; display: flex; align-items: center; flex-direction: column">
      <template #title>Login User</template>
      <template #content>
        <p>
          Don't have an account yet?
          <RouterLink to="/signup" class="link">Sign up !</RouterLink>
        </p>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.link {
  text-decoration: none;
  color: green;
}
</style>