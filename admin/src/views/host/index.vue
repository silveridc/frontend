<template>
  <div class="page-container">
    <div class="page-header">
      <a-input-search v-model:value="searchKeywords" placeholder="搜索实例" style="width: 240px" @search="fetchList" />
    </div>

    <a-table :columns="columns" :data-source="dataSource" :loading="loading" :pagination="pagination"
      @change="handleTableChange" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="showNotesModal(record)">备注</a>
            <a v-if="record.status !== 'Suspended'" @click="showSuspendModal(record)">暂停</a>
            <a v-if="record.status === 'Suspended'" @click="handleUnsuspend(record.id)" style="color: green">解除暂停</a>
            <a-popconfirm title="确认终止该实例？" @confirm="handleTerminate(record.id)">
              <a style="color: red">终止</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 备注弹窗 -->
    <a-modal v-model:open="notesVisible" title="修改备注" @ok="handleNotesSubmit" @cancel="notesVisible = false"
      :confirm-loading="notesSubmitting">
      <a-textarea v-model:value="currentNotes" placeholder="请输入备注" :rows="4" />
    </a-modal>

    <!-- 暂停弹窗 -->
    <a-modal v-model:open="suspendVisible" title="暂停实例" @ok="handleSuspendSubmit" @cancel="suspendVisible = false"
      :confirm-loading="suspendSubmitting">
      <a-form layout="vertical">
        <a-form-item label="暂停原因">
          <a-textarea v-model:value="suspendReason" placeholder="请输入暂停原因（选填）" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message, Modal } from 'antdv-next'
import { getHostList, updateHostNotes, suspendHost, unsuspendHost, terminateHost } from '@/api/host'

const loading = ref(false)
const dataSource = ref([])
const searchKeywords = ref('')
const notesVisible = ref(false)
const notesSubmitting = ref(false)
const currentNotes = ref('')
const currentHostId = ref(0)
const suspendVisible = ref(false)
const suspendSubmitting = ref(false)
const suspendReason = ref('')
const suspendHostId = ref(0)

const pagination = reactive({ current: 1, pageSize: 15, total: 0 })

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '产品名称', dataIndex: 'product_name', key: 'product_name' },
  { title: '客户', dataIndex: 'client_name', key: 'client_name' },
  { title: '状态', key: 'status', width: 100 },
  { title: '备注', dataIndex: 'notes', key: 'notes' },
  { title: '创建时间', dataIndex: 'create_time', key: 'create_time', width: 170 },
  { title: '操作', key: 'action', width: 260 }
]

const getStatusColor = (s: string) => {
  const m: Record<string, string> = { Active: 'green', Suspended: 'orange', Terminated: 'red', Pending: 'blue' }
  return m[s] || 'default'
}
const getStatusText = (s: string) => {
  const m: Record<string, string> = { Active: '运行中', Suspended: '已暂停', Terminated: '已终止', Pending: '待开通' }
  return m[s] || s || '-'
}

const fetchList = async () => {
  loading.value = true
  try {
    const params: any = { page: pagination.current, limit: pagination.pageSize }
    if (searchKeywords.value) params.keywords = searchKeywords.value
    const res = await getHostList(params)
    dataSource.value = (res.data?.list || []) as any
    pagination.total = (res.data?.count || 0) as number
  } finally { loading.value = false }
}

const handleTableChange = (pag: any) => { pagination.current = pag.current; pagination.pageSize = pag.pageSize; fetchList() }

const showNotesModal = (record: any) => { currentHostId.value = record.id; currentNotes.value = record.notes || ''; notesVisible.value = true }
const handleNotesSubmit = async () => {
  notesSubmitting.value = true
  try { await updateHostNotes(currentHostId.value, { notes: currentNotes.value }); message.success('备注修改成功'); notesVisible.value = false; fetchList() }
  finally { notesSubmitting.value = false }
}

const showSuspendModal = (record: any) => { suspendHostId.value = record.id; suspendReason.value = ''; suspendVisible.value = true }
const handleSuspendSubmit = async () => {
  suspendSubmitting.value = true
  try { await suspendHost(suspendHostId.value, { reason: suspendReason.value }); message.success('已暂停'); suspendVisible.value = false; fetchList() }
  finally { suspendSubmitting.value = false }
}

const handleUnsuspend = async (id: number) => { try { await unsuspendHost(id); message.success('已解除暂停'); fetchList() } catch { /* */ } }
const handleTerminate = async (id: number) => { try { await terminateHost(id); message.success('已终止'); fetchList() } catch { /* */ } }

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
