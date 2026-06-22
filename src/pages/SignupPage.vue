<script setup lang="ts">
import Card from 'primevue/card'
import { ref } from 'vue'
import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { signUp } = useAuth()
const router = useRouter()

const success = ref('')
const fail = ref('')

const onFormSubmit = async ( { values }: any ) => {
  try {
    await signUp(values.email, values.password, values.username)
    success.value = "Sign up successful !"
    router.push('/login')
  } catch (e: any) {
    fail.value = e.message || 'Unable to sign up. Try again.'
  }
}


</script>

<template>
  <div class="signup-content">
    <div class="signup-card">
      <Card style="width: 25rem; display: flex; align-items: center; flex-direction: column">
        <template #title>Sign Up</template>
        <template #content>
          <Form @submit="onFormSubmit">
            <div class="signup-section">
              <label for="username">Username</label>
              <InputText id="username" name="username" fluid />

              <label for="email">Email</label>
              <InputText id="email" name="email" fluid />

              <label for="password">Password</label>
              <InputText id="password" name="password" fluid />

              <Button type="submit" label="Submit" />

              <p v-if="success" style="color: green;">{{ success }}</p>
              <p v-if="fail" style="color: red;"> {{ fail }}</p>
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

.signup-content {
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
