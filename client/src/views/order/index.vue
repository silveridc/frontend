<template>
  <div class="page">
    <a-table :columns="columns" :data-source="ds" :loading="loading" :pagination="pag" @change="onChange" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'amount'">¥{{ record.amount || 0 }}</template>
        <template v-if="column.key === 'status'">
          <a-tag :color="getColor(record.status)">
            {{ record.status || '-' }}
          </a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="showDetail(record)">详情</a>
            <a-popconfirm v-if="record.status === 'pending'" title="确认取消？" @confirm="handleCancel(record.id)">
              <a style="color:red">取消</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
    <a-modal v-model:open="dv" title="订单详情" :footer="null" width="640px">
      <a-descriptions bordered :column="1" v-if="detail">
        <a-descriptions-item label="订单ID">{{ detail.id }}</a-descriptions-item>
        <a-descriptions-item label="订单号">{{ detail.order_no || '-' }}</a-descriptions-item>
        <a-descriptions-item label="产品">{{ detail.product_name || '-' }}</a-descriptions-item>
        <a-descriptions-item label="金额">¥{{ detail.amount || 0 }}</a-descriptions-item>
        <a-descriptions-item label="状态">{{ detail.status }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ detail.create_time || '-' }}</a-descriptions-item>
      </a-descriptions>
      <a-spin v-else :spinning="dl" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'antdv-next'
import { getOrderList, getOrderDetail, cancelOrder } from '@/api/order'
const loading = ref(false);
const ds = ref([]);
const pag = reactive({ current: 1, pageSize: 15, total: 0 })
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '订单号', dataIndex: 'order_no', key: 'order_no' },
  { title: '产品', dataIndex: 'product_name', key: 'product_name' },
  { title: '金额', key: 'amount', width: 100 },
  { title: '状态', key: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'create_time', key: 'create_time', width: 170 },
  { title: '操作', key: 'action', width: 120 }
]
const getColor = (s: string) => ({ pending: 'orange', active: 'green', cancelled: 'default', completed: 'blue' } as any)[s] || 'default'
const dv = ref(false);
const dl = ref(false);
const detail = ref<any>(null)
const fetchList = async () => {
  loading.value = true;
  try {
    const r = await getOrderList({ page: pag.current, limit: pag.pageSize });
    ds.value = (r.data?.list || []) as any;
    pag.total = (r.data?.count || 0) as number
  } finally { loading.value = false }
}
const onChange = (pagC: any) => {
  pag.current = pagC.current;
  pag.pageSize = pagC.pageSize; fetchList()
}
const showDetail = async (r: any) => {
  dv.value = true; detail.value = null;
  dl.value = true; try {
    const res = await getOrderDetail(r.id);
    detail.value = res.data || r
  } finally { dl.value = false }
}
const handleCancel = async (id: number) => {
  try {
    await cancelOrder(id);
    message.success('取消成功');
    fetchList()
  } catch { }
}
onMounted(() => fetchList())
</script>
