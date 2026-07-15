<template>
  <div class="page">
    <a-table :columns="columns" :data-source="ds" :loading="loading" :pagination="pag" @change="onChange" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'amount'">
          {{ record.amount_type === 'credit' ? '-' : '+' }}¥{{ record.amount || 0 }}
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="record.status === 'completed' ? 'green' : 'orange'">
            {{ record.status || '-' }}
          </a-tag>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getTransactionList } from '@/api/transaction'
const loading = ref(false); const ds = ref([])
const pag = reactive({ current: 1, pageSize: 15, total: 0 })
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '交易号', dataIndex: 'transaction_no', key: 'transaction_no' },
  { title: '金额', key: 'amount', width: 120 },
  { title: '类型', dataIndex: 'amount_type', key: 'amount_type', width: 80 },
  { title: '状态', key: 'status', width: 100 },
  { title: '时间', dataIndex: 'create_time', key: 'create_time', width: 170 }
]
const fetchList = async () => {
  loading.value = true;
  try {
    const r = await getTransactionList({ page: pag.current, limit: pag.pageSize });
    ds.value = (r.data?.list || []) as any;
    pag.total = (r.data?.count || 0) as number
  } finally { loading.value = false }
}
const onChange = (pagC: any) => { pag.current = pagC.current; pag.pageSize = pagC.pageSize; fetchList() }
onMounted(() => fetchList())
</script>
