<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from './utils/supabase'
import Card from 'primevue/card'
import DatePicker from 'primevue/datepicker';
import Popover from 'primevue/popover';
import Button from 'primevue/button';





</script>

<!-- TODO: each date has its own table to show expenses or allowances -->

<template>
  <div class="app-content">
    <div class="top-section">
      <Card>
        <template #title>Current Amount (PHP)</template>
        <template #content>

        </template>
      </Card>
      <Card>
        <template #title>Amount Spent (PHP)</template>
        <template #content>

        </template>
      </Card>
    </div>

    <DatePicker v-model="date" inline showWeek class="datepicker" />


  </div>
</template>

<style>
.app-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.top-section {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.datepicker {
  width: 50%;
}




</style>