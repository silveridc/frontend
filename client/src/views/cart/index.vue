<template>
  <div class="page">
    <div class="header">
      <a-space>
        <a-button type="primary" @click="handleSettle" :loading="settleLoading">去结算</a-button>
        <a-button @click="handleClear">清空购物车</a-button>
      </a-space>
    </div>
    <a-table :columns="columns" :data-source="ds" :loading="loading" :pagination="pag" @change="onChange" row-key="id"
      :row-selection="{ selectedRowKeys: selectedIds, onChange: onSelect }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'price'">¥{{ record.price || 0 }}</template>
        <template v-if="column.key === 'action'">
          <a-popconfirm title="确认删除？" @confirm="handleDelete(record.id)">
            <a style="color:red">删除</a>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message, Modal } from 'antdv-next'
import { useRouter } from 'vue-router'
import { getCartList, deleteCart, clearCart, settleCart, batchDeleteCart } from '@/api/cart'
const router = useRouter()
const loading = ref(false);
const ds = ref([]);
const selectedIds = ref<(string | number)[]>([])
const settleLoading = ref(false)
const pag = reactive({ current: 1, pageSize: 15, total: 0 })
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '产品', dataIndex: 'product_name', key: 'product_name' },
  { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 80 },
  { title: '单价', key: 'price', width: 100 },
  { title: '操作', key: 'action', width: 80 }
]
const fetchList = async () => {
  loading.value = true;
  try {
    const r = await getCartList({ page: pag.current, limit: pag.pageSize });
    ds.value = (r.data?.list || []) as any;
    pag.total = (r.data?.count || 0) as number
  } finally { loading.value = false }
}
const onChange = (pagC: any) => {
  pag.current = pagC.current;
  pag.pageSize = pagC.pageSize; fetchList()
}
const onSelect = (keys: (string | number)[]) => { selectedIds.value = keys }
const handleDelete = async (id: number | string) => {
  try {
    await deleteCart(id);
    message.success('已删除'); fetchList()
  } catch { }
}
const handleClear = () => {
  Modal.confirm({
    title: '确认清空购物车？', onOk: async () => {
      try {
        await clearCart();
        message.success('已清空'); fetchList()
      } catch { }
    }
  })
}
const handleSettle = async () => {
  settleLoading.value = true
  try {
    await settleCart({ ids: selectedIds.value });
    message.success('结算成功');
    router.push('/order'); fetchList()
  } catch { }
  finally { settleLoading.value = false }
}
onMounted(() => fetchList())
</script>
<style lang="less" scoped>
.page .header {
  margin-bottom: 16px;
}
</style>
