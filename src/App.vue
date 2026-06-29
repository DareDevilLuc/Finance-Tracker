<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuth } from './composables/useAuth'
import { computed, ref } from 'vue'

const { initAuth, user } = useAuth()


initAuth()
const username = computed(() => user.value?.user_metadata.username)
</script>

<template>
  <div class="content">
    <RouterView />
    <p v-if="user">{{ username }}</p>
    <p v-else>Not logged in.</p>
  </div>
</template>

<style>
.content {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
</style>
