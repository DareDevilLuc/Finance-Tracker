<script setup lang="ts">
import Card from 'primevue/card'
import { Form } from '@primevue/forms'
import { Button, InputText } from 'primevue'
</script>

<template>
  <div class="login-content">
    <div class="login-card">
      <Card style="width: 25rem; display: flex; align-items: center; flex-direction: column">
        <template #title>Sign Up</template>
        <template #content>
          <Form>
            <div class="signup-section">
              <label for="username">Username</label>
              <InputText id="username" name="username" fluid />

              <label for="email">Email</label>
              <InputText id="email" name="email" fluid />

              <label for="password">Password</label>
              <InputText id="password" name="password" fluid />

              <Button type="submit" label="Submit" />

              <p>
                Already have an account?
                <RouterLink to="/login" class="link">Log in !</RouterLink>
              </p>

            </div>
          </Form>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>

.link {
  text-decoration: none;
  color: green;
}

.login-content {
  display: flex;
  align-items: center;
  min-height: 100vh;
}


.signup-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
