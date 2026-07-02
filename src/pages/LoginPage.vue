<script setup lang="ts">
import Card from 'primevue/card'
import { ref } from 'vue'
import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'

import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { signIn } = useAuth()

const router = useRouter()

const success = ref('')
const fail = ref('')

const onFormSubmit = async ({ values }: any) => {
  try {
    await signIn(values.email, values.password)
    success.value = 'Sign in successful !'
    router.push('/main')
  } catch (e: any) {
    fail.value = e.message
  }
}


</script>

<template>
  <div class="login-content">
    <div class="login-card">
      <Card style="width: 25rem; display: flex; align-items: center; flex-direction: column">
        <template #title>Log in</template>
        <template #content>
          <Form @submit="onFormSubmit" autocomplete="off">
            <div class="login-section">
              <label for="email">Email</label>
              <InputText id="email" name="email" fluid />

              <label for="password">Password</label>
              <Password id="password" name="password" fluid :feedback="false"/>

              <Button type="submit" label="Submit" />

              <p v-if="success" style="color: green;">{{ success }}</p>
              <p v-if="fail" style="color: red;"> {{ fail }}</p>
              <p>
                Don't have an account yet?
                <RouterLink to="/auth/signup" class="link">Sign up !</RouterLink>
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

.login-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>