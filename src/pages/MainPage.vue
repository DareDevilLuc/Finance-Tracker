<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../utils/supabase'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import { Form } from '@primevue/forms'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()

const { signOut } = useAuth()

const date = ref()
const visible = ref(false)
const types = ref(['Allowance', 'Expense'])

const transactions = ref([
  { amount: 500, date: '2026-06-19', type: 'Expense', description: 'Commute' },
  { amount: 100, date: '2026-06-20', type: 'Allowance', description: 'Daily Allowance' },
])

const handleSignout = async () => {
  await signOut()
  router.push('/login')
}

</script>

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
          <DataTable tableStyle="min-width: 50rem" :value="transactions">
            <Column field="date" header="Date" />
            <Column field="type" header="Type">
              <template #body="{ data }">
                <Tag
                  :value="data.type"
                  :severity="data.type === 'Expense' ? 'danger' : 'success'"
                />
              </template>
            </Column>
            <Column field="amount" header="Amount" />
            <Column field="description" header="Description" />
          </DataTable>
        </template>
      </Card>
    </div>
      <Button label="Log out" @click="handleSignout"/>
  </div>

  <Dialog
    v-model:visible="visible"
    modal
    header="Add Allowance/Expense"
    :style="{ width: '25rem' }"
  >
    <Form>
      <div class="dialog-section">
        <label for="description">Description</label>
        <InputText id="description" name="description" fluid />

        <label for="amount">Amount (PHP)</label>
        <InputNumber id="amount" name="amount" fluid />

        <label for="type">Select Type</label>
        <Select id="type" name="type" :options="types" />

        <label for="type">Select Date</label>
        <DatePicker id="date" name="date" showIcon />

        <Button type="submit" label="Submit" />
      </div>
    </Form>
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

.dialog-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
