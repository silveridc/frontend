<template>
  <div class="page">
    <a-table :columns="columns" :data-source="ds" :loading="loading" :pagination="pag" @change="onChange" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="getColor(record.status)">{{ getText(record.status) }}</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="showDetail(record)">详情</a>
            <a @click="showNotes(record)">备注</a>
          </a-space>
        </template>
      </template>
    </a-table>
    <a-modal v-model:open="dv" title="实例详情" :footer="null" width="560px">
      <a-descriptions bordered :column="1" v-if="detail">
        <a-descriptions-item label="ID">{{ detail.id }}</a-descriptions-item>
        <a-descriptions-item label="产品">{{ detail.product_name }}</a-descriptions-item>
        <a-descriptions-item label="状态">{{ getText(detail.status) }}</a-descriptions-item>
        <a-descriptions-item label="备注">{{ detail.notes || '-' }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ detail.create_time }}</a-descriptions-item>
      </a-descriptions>
      <a-spin v-else :spinning="dl" />
    </a-modal>
    <a-modal v-model:open="nv" title="修改备注" @ok="saveNotes" @cancel="nv = false" :confirm-loading="ns">
      <a-textarea v-model:value="notes" placeholder="备注" :rows="3" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'antdv-next'
import { getHostList, getHostDetail, updateHostNotes } from '@/api/host'
const loading = ref(false);
const ds = ref([]);
const pag = reactive({ current: 1, pageSize: 15, total: 0 })
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '产品', dataIndex: 'product_name', key: 'product_name' },
  { title: '状态', key: 'status', width: 100 },
  { title: '备注', dataIndex: 'notes', key: 'notes' },
  { title: '创建时间', dataIndex: 'create_time', key: 'create_time', width: 170 },
  { title: '操作', key: 'action', width: 120 }
]
const getColor = (s: string) => ({ Active: 'green', Suspended: 'orange', Terminated: 'red', Pending: 'blue' } as any)[s] || 'default'
const getText = (s: string) => ({ Active: '运行中', Suspended: '已暂停', Terminated: '已终止', Pending: '待开通' } as any)[s] || s || '-'
const dv = ref(false);
const dl = ref(false);
const detail = ref<any>(null)
const nv = ref(false);
const ns = ref(false);
const notes = ref('');
const hId = ref(0)
const fetchList = async () => {
  loading.value = true;
  try {
    const r = await getHostList({ page: pag.current, limit: pag.pageSize });
    ds.value = (r.data?.list || []) as any;
    pag.total = (r.data?.count || 0) as number
  } finally { loading.value = false }
}
const onChange = (pagC: any) => {
  pag.current = pagC.current;
  pag.pageSize = pagC.pageSize;
  fetchList()
}
const showDetail = async (r: any) => {
  dv.value = true;
  detail.value = null; dl.value = true;
  try {
    const res = await getHostDetail(r.id);
    detail.value = res.data || r
  } finally { dl.value = false }
}
const showNotes = (r: any) => {
  hId.value = r.id;
  notes.value = r.notes || '';
  nv.value = true
}
const saveNotes = async () => {
  ns.value = true;
  try {
    await updateHostNotes(hId.value, { notes: notes.value });
    message.success('备注已更新');
    nv.value = false;
    fetchList()
  } finally { ns.value = false }
}
onMounted(() => fetchList())
</script>
