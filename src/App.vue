<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuth } from './composables/useAuth'
import { Analytics } from '@vercel/analytics/vue'

const { initAuth } = useAuth()


initAuth()
</script>

<template>
  <Analytics/>
  <div class="content">
    <RouterView />
  </div>
</template>

<style>
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  flex-direction: column;
}
</style>
