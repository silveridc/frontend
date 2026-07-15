<template>
  <div class="page">
    <a-input-search v-model:value="kw" placeholder="搜索产品" style="width:240px;margin-bottom:16px" @search="fetchList" />
    <a-table :columns="columns" :data-source="ds" :loading="loading" :pagination="pag" @change="onChange" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'price'">¥{{ record.price || 0 }}</template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="showDetail(record)">详情</a>
            <a-button type="primary" size="small" @click="buyNow(record)">立即购买</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
    <a-modal v-model:open="dv" title="产品详情" :footer="null" width="560px">
      <a-descriptions bordered :column="1" v-if="detail">
        <a-descriptions-item label="名称">{{ detail.name }}</a-descriptions-item>
        <a-descriptions-item label="类型">{{ detail.type }}</a-descriptions-item>
        <a-descriptions-item label="价格">¥{{ detail.price }}</a-descriptions-item>
        <a-descriptions-item label="描述">{{ detail.description || '-' }}</a-descriptions-item>
      </a-descriptions>
      <a-spin v-else :spinning="dl" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'antdv-next'
import { getProductList, getProductDetail } from '@/api/product'
import { addToCart } from '@/api/cart'
import { useRouter } from 'vue-router'
const router = useRouter()
const loading = ref(false);
const ds = ref([]);
const kw = ref('')
const pag = reactive({ current: 1, pageSize: 15, total: 0 })
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '价格', key: 'price', width: 100 },
  { title: '操作', key: 'action', width: 200 }
]
const dv = ref(false);
const dl = ref(false);
const detail = ref<any>(null)
const fetchList = async () => {
  loading.value = true;
  try {
    const p: any = { page: pag.current, limit: pag.pageSize };
    if (kw.value) p.keywords = kw.value;
    const r = await getProductList(p); ds.value = (r.data?.list || []) as any; pag.total = (r.data?.count || 0) as number
  } finally { loading.value = false }
}
const onChange = (pagC: any) => { pag.current = pagC.current; pag.pageSize = pagC.pageSize; fetchList() }
const showDetail = async (r: any) => {
  dv.value = true; detail.value = null;
  dl.value = true; try {
    const res = await getProductDetail(r.id);
    detail.value = res.data || r
  } finally { dl.value = false }
}
const buyNow = async (r: any) => {
  try {
    await addToCart({ product_id: r.id, quantity: 1 });
    message.success('已加入购物车');
    router.push('/cart')
  } catch { /* */ }
}
onMounted(() => fetchList())
</script>
