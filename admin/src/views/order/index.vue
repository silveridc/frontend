<template>
  <div class="page-container">
    <div class="page-header">
      <a-space>
        <a-input-search v-model:value="searchKeywords" placeholder="搜索订单" style="width: 240px" @search="fetchList" />
      </a-space>
    </div>

    <a-table :columns="columns" :data-source="dataSource" :loading="loading" :pagination="pagination"
      @change="handleTableChange" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">{{ record.status || '-' }}</a-tag>
        </template>
        <template v-if="column.key === 'amount'">¥{{ record.amount || 0 }}</template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="showDetail(record)">详情</a>
            <a-popconfirm v-if="record.status === 'pending'" title="确认取消该订单？" @confirm="handleCancel(record.id)">
              <a style="color: red">取消</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="detailVisible" title="订单详情" :footer="null" width="640px">
      <a-descriptions bordered :column="1" v-if="detailData">
        <a-descriptions-item label="订单ID">{{ detailData.id }}</a-descriptions-item>
        <a-descriptions-item label="订单号">{{ detailData.order_no || '-' }}</a-descriptions-item>
        <a-descriptions-item label="客户ID">{{ detailData.client_id || '-' }}</a-descriptions-item>
        <a-descriptions-item label="客户名称">{{ detailData.client_name || '-' }}</a-descriptions-item>
        <a-descriptions-item label="产品ID">{{ detailData.product_id || '-' }}</a-descriptions-item>
        <a-descriptions-item label="产品名称">{{ detailData.product_name || '-' }}</a-descriptions-item>
        <a-descriptions-item label="金额">¥{{ detailData.amount || 0 }}</a-descriptions-item>
        <a-descriptions-item label="状态">{{ detailData.status || '-' }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ detailData.create_time || '-' }}</a-descriptions-item>
        <a-descriptions-item label="到期时间">{{ detailData.due_time || '-' }}</a-descriptions-item>
      </a-descriptions>
      <a-spin v-else :spinning="detailLoading" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'antdv-next'
import { getOrderList, getOrderDetail, cancelOrder } from '@/api/order'

const loading = ref(false)
const dataSource = ref([])
const searchKeywords = ref('')
const detailVisible = ref(false)
const detailData = ref<any>(null)
const detailLoading = ref(false)

const pagination = reactive({ current: 1, pageSize: 15, total: 0 })

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '订单号', dataIndex: 'order_no', key: 'order_no' },
  { title: '客户', dataIndex: 'client_name', key: 'client_name' },
  { title: '产品', dataIndex: 'product_name', key: 'product_name' },
  { title: '金额', key: 'amount', width: 100 },
  { title: '状态', key: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'create_time', key: 'create_time', width: 170 },
  { title: '操作', key: 'action', width: 120 }
]

const getStatusColor = (s: string) => {
  const m: Record<string, string> = { pending: 'orange', active: 'green', cancelled: 'default', completed: 'blue' }
  return m[s] || 'default'
}

const fetchList = async () => {
  loading.value = true
  try {
    const params: any = { page: pagination.current, limit: pagination.pageSize }
    if (searchKeywords.value) params.keywords = searchKeywords.value
    const res = await getOrderList(params)
    dataSource.value = (res.data?.list || []) as any
    pagination.total = (res.data?.count || 0) as number
  } finally { loading.value = false }
}

const handleTableChange = (pag: any) => { pagination.current = pag.current; pagination.pageSize = pag.pageSize; fetchList() }

const showDetail = async (record: any) => {
  detailVisible.value = true; detailData.value = null; detailLoading.value = true
  try { const res = await getOrderDetail(record.id); detailData.value = res.data || {} }
  finally { detailLoading.value = false }
}

const handleCancel = async (id: number) => {
  try { await cancelOrder(id); message.success('取消成功'); fetchList() } catch { /* */ }
}

onMounted(() => { fetchList() })
</script>

<style lang="less" scoped>
.page-container {
  .page-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }
}
</style>
