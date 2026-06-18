<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from './utils/supabase'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'

const date = ref()
const visible = ref(false)
</script>

<!-- TODO: each date has its own table to show expenses or allowances -->

<template>
  <div class="app-content">
    <div class="top-section">
      <Card>
        <template #title>Current Amount (PHP)</template>
        <template #content> </template>
      </Card>
      <Card>
        <template #title>Amount Spent (PHP)</template>
        <template #content> </template>
      </Card>
    </div>

    <div class="data-section">
      <Card>
        <template #content>
          <div class="month-button">
            <DatePicker
              v-model="date"
              showIcon
              fluid
              iconDisplay="input"
              dateFormat="mm/yy"
              view="month"
            />
            <Button label="Add Allowance/Expense" @click="visible = true" />
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <DataTable tableStyle="min-width: 50rem"> </DataTable>
        </template>
      </Card>
    </div>
  </div>

  <Dialog v-model:visible="visible" modal header="Add Allowance/Expense">
    Testing the bilat
  </Dialog>
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

.month-button {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
