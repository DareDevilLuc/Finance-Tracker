<script setup lang="ts">
import { ref } from 'vue'
import { useTransactions } from '@/composables/useTransactions'
import { useToast } from 'primevue/usetoast'
import { Form } from '@primevue/forms'
import InputNumber from 'primevue/inputnumber'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Toast from 'primevue/toast'

const { newTransaction } = useTransactions()
const toast = useToast()

const fail = ref('')

const emits = defineEmits<{
  (e: 'submitted', transaction: any): void
}>()

const types = ref(['Allowance', 'Expense'])

const visible = defineModel<boolean>('visible', { required: true })

const onFormSubmit = async ({ values }: any) => {
  const dateSubmitted = values.date.toLocaleDateString('en-CA')
  try {
    const newSubmittedTransaction = await newTransaction(
      values.amount,
      values.type,
      dateSubmitted,
      values.description,
    )
    emits('submitted', newSubmittedTransaction)
    visible.value = false
  } catch (e: any) {
    fail.value = e.message
    toast.add({ summary: fail.value, severity: 'danger', life: 2000, group: 'bottom-center' })
  }
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Add Allowance/Expense"
    :style="{ width: '25rem' }"
  >
    <Form @submit="onFormSubmit" autocomplete="off">
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

<style scoped></style>
