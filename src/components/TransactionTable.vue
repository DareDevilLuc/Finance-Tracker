<script setup lang="ts">
import DataTable from 'primevue/datatable'
import DatePicker from 'primevue/datepicker'
import Column from 'primevue/column'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useTransactions } from '@/composables/useTransactions'

const confirm = useConfirm()
const toast = useToast()

const { deleteTransaction } = useTransactions()

const date = defineModel<Date>('date', {required : true})

const { filteredTransactions } = defineProps<{
    filteredTransactions: Array<any>
}>()


const emits = defineEmits<{
    (e : 'btn-click') : any
    (e : 'delete-row', row : any) : any
}>()

const handleDeleteTransaction = async (data: any) => {
  try {
    const deletedRow = await deleteTransaction(data.id)
    emits('delete-row', deletedRow[0])
  } catch (e: any) {
    toast.add({ summary: 'Something wrong has occured, try again', severity: 'error', life: 2000 })
  }
}

const deleteConfirm = (event: any, data: any) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Delete this transaction?',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: () => {
      handleDeleteTransaction(data)
    }

  })
}

</script>

<template>
    <Card>
        <template #content>
            <div class="data-section">
                <div class="toolbar">
                    <DatePicker v-model="date" showIcon iconDisplay="input" dateFormat="mm/yy" view="month" />
                    <Button icon="pi pi-plus" label="Add Transactions/Expenses" @click="emits('btn-click')" />
                </div>
                <div>
                    <DataTable tableStyle="min-width: 50%" :value="filteredTransactions" paginator :rows="3">
                        <Column field="date" header="Date" />
                        <Column field="type" header="Type">
                            <template #body="{ data }">
                                <Tag :value="data.type" :severity="data.type === 'Expense' ? 'danger' : 'success'" />
                            </template>
                        </Column>
                        <Column field="amount" header="Amount" />
                        <Column field="description" header="Description" />
                        <Column header="Actions">
                            <template #body="{ data }">
                                <Button icon="pi pi-trash" rounded severity="danger" text
                                    @click="deleteConfirm($event, data)" />
                            </template>
                        </Column>
                        <template #empty>
                            <div class="empty-table">
                                <Button iconOnly severity="secondary" icon="pi pi-plus" rounded
                                    @click="emits('btn-click')" />
                                <p style="font-weight: lighter;">Currently no transactions placed for this month</p>
                            </div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </template>
    </Card>
</template>

<style scoped></style>
