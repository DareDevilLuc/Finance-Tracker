<script setup lang="ts">
import Card from 'primevue/card'
import { Form } from '@primevue/forms'
import { Button, InputText } from 'primevue'
</script>

<template>
  <div class="login-card">
    <Card style="width: 25rem; display: flex; align-items: center; flex-direction: column">
      <template #title>SignUp User</template>
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
          </div>
        </Form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.signup-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
