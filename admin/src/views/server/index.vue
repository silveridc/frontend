<template>
  <div class="page-container">
    <div class="page-header">
      <a-space>
        <a-input-search v-model:value="searchKeywords" placeholder="搜索服务器" style="width: 240px" @search="fetchList" />
        <a-button type="primary" @click="showCreateModal">
          <template #icon>
            <PlusOutlined />
          </template>
          新增服务器
        </a-button>
      </a-space>
    </div>

    <a-table :columns="columns" :data-source="dataSource" :loading="loading" :pagination="pagination"
      @change="handleTableChange" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="record.status === 1 ? 'green' : 'red'">{{ record.status === 1 ? '在线' : '离线' }}</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="showDetail(record)">详情</a>
            <a @click="showEditModal(record)">编辑</a>
            <a-popconfirm title="确认删除该服务器？" @confirm="handleDelete(record.id)">
              <a style="color: red">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 新增/编辑弹窗 -->
    <a-modal v-model:open="modalVisible" :title="modalTitle" @ok="handleSubmit" @cancel="modalVisible = false"
      :confirm-loading="submitting">
      <a-form :model="formData" :rules="formRules" ref="formRef" layout="vertical">
        <a-form-item label="服务器名称" name="name">
          <a-input v-model:value="formData.name" placeholder="请输入服务器名称" />
        </a-form-item>
        <a-form-item label="IP地址" name="ip">
          <a-input v-model:value="formData.ip" placeholder="请输入IP地址" />
        </a-form-item>
        <a-form-item label="备注" name="notes">
          <a-textarea v-model:value="formData.notes" placeholder="请输入备注" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 详情弹窗 -->
    <a-modal v-model:open="detailVisible" title="服务器详情" :footer="null" width="560px">
      <a-descriptions bordered :column="1" v-if="detailData">
        <a-descriptions-item label="ID">{{ detailData.id }}</a-descriptions-item>
        <a-descriptions-item label="名称">{{ detailData.name || '-' }}</a-descriptions-item>
        <a-descriptions-item label="IP地址">{{ detailData.ip || '-' }}</a-descriptions-item>
        <a-descriptions-item label="状态">{{ detailData.status === 1 ? '在线' : '离线' }}</a-descriptions-item>
        <a-descriptions-item label="备注">{{ detailData.notes || '-' }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ detailData.create_time || '-' }}</a-descriptions-item>
      </a-descriptions>
      <a-spin v-else :spinning="detailLoading" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'antdv-next'
import { PlusOutlined } from '@antdv-next/icons'
import { getServerList, getServerDetail, createServer, updateServer, deleteServer } from '@/api/server'

const loading = ref(false)
const submitting = ref(false)
const dataSource = ref([])
const searchKeywords = ref('')
const modalVisible = ref(false)
const editingRecord = ref<any>(null)
const formRef = ref()
const detailVisible = ref(false)
const detailData = ref<any>(null)
const detailLoading = ref(false)

const pagination = reactive({ current: 1, pageSize: 15, total: 0 })

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '服务器名称', dataIndex: 'name', key: 'name' },
  { title: 'IP地址', dataIndex: 'ip', key: 'ip' },
  { title: '状态', key: 'status', width: 80 },
  { title: '备注', dataIndex: 'notes', key: 'notes' },
  { title: '创建时间', dataIndex: 'create_time', key: 'create_time', width: 170 },
  { title: '操作', key: 'action', width: 180 }
]

const formData = reactive({ name: '', ip: '', notes: '' })
const formRules = { name: [{ required: true, message: '请输入服务器名称' }] }
const modalTitle = ref('新增服务器')

const fetchList = async () => {
  loading.value = true
  try {
    const params: any = { page: pagination.current, limit: pagination.pageSize }
    if (searchKeywords.value) params.keywords = searchKeywords.value
    const res = await getServerList(params)
    dataSource.value = (res.data?.list || []) as any
    pagination.total = (res.data?.count || 0) as number
  } finally { loading.value = false }
}

const handleTableChange = (pag: any) => { pagination.current = pag.current; pagination.pageSize = pag.pageSize; fetchList() }

const showCreateModal = () => {
  editingRecord.value = null; modalTitle.value = '新增服务器'
  formData.name = ''; formData.ip = ''; formData.notes = ''
  modalVisible.value = true
}

const showEditModal = (record: any) => {
  editingRecord.value = record; modalTitle.value = '编辑服务器'
  formData.name = record.name || ''; formData.ip = record.ip || ''; formData.notes = record.notes || ''
  modalVisible.value = true
}

const showDetail = async (record: any) => {
  detailVisible.value = true; detailData.value = null; detailLoading.value = true
  try { const res = await getServerDetail(record.id); detailData.value = res.data || {} }
  finally { detailLoading.value = false }
}

const handleSubmit = async () => {
  try { await formRef.value?.validate() } catch { return }
  submitting.value = true
  try {
    const payload = { name: formData.name, ip: formData.ip, notes: formData.notes }
    if (editingRecord.value) { await updateServer(editingRecord.value.id, payload); message.success('修改成功') }
    else { await createServer(payload); message.success('创建成功') }
    modalVisible.value = false; fetchList()
  } finally { submitting.value = false }
}

const handleDelete = async (id: number) => { try { await deleteServer(id); message.success('删除成功'); fetchList() } catch { /* */ } }

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
