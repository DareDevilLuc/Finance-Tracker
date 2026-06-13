<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from './utils/supabase'
import Card from 'primevue/card'
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';


const date = ref()




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

    <div class="data-section">
      <Card>
        <template #content>
          <DatePicker v-model="date" showIcon fluid iconDisplay="input" />
        </template>
      </Card>

      <Card>
        <template #content>
          <DataTable tableStyle="min-width: 50rem">
          </DataTable>

        </template>
      </Card>

    </div>


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

.data-section {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
</style>