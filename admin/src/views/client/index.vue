<template>
  <div class="page-container">
    <div class="page-header">
      <a-space>
        <a-input-search v-model:value="searchKeywords" placeholder="搜索客户" style="width: 240px" @search="fetchList" />
        <a-button type="primary" @click="showCreateModal">
          <template #icon>
            <PlusOutlined />
          </template>
          新增客户
        </a-button>
      </a-space>
    </div>

    <a-table :columns="columns" :data-source="dataSource" :loading="loading" :pagination="pagination"
      @change="handleTableChange" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="showDetail(record)">详情</a>
            <a @click="showEditModal(record)">编辑</a>
            <a-popconfirm title="确认删除该客户？" @confirm="handleDelete(record.id)">
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
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="formData.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formData.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="formData.phone" placeholder="请输入手机号" />
        </a-form-item>
        <a-form-item v-if="!editingRecord" label="密码" name="password">
          <a-input-password v-model:value="formData.password" placeholder="请输入密码" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 详情弹窗 -->
    <a-modal v-model:open="detailVisible" title="客户详情" :footer="null" width="560px">
      <a-descriptions bordered :column="1" v-if="detailData">
        <a-descriptions-item label="ID">{{ detailData.id }}</a-descriptions-item>
        <a-descriptions-item label="用户名">{{ detailData.username }}</a-descriptions-item>
        <a-descriptions-item label="邮箱">{{ detailData.email || '-' }}</a-descriptions-item>
        <a-descriptions-item label="手机号">{{ detailData.phone || '-' }}</a-descriptions-item>
        <a-descriptions-item label="公司">{{ detailData.company_name || '-' }}</a-descriptions-item>
        <a-descriptions-item label="余额">{{ detailData.balance || 0 }}</a-descriptions-item>
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
import { getClientList, getClientDetail, createClient, updateClient, deleteClient } from '@/api/client'

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
  { title: '用户名', dataIndex: 'username', key: 'username' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '手机号', dataIndex: 'phone', key: 'phone' },
  { title: '公司', dataIndex: 'company_name', key: 'company_name' },
  { title: '余额', dataIndex: 'balance', key: 'balance', width: 100 },
  { title: '创建时间', dataIndex: 'create_time', key: 'create_time', width: 170 },
  { title: '操作', key: 'action', width: 180 }
]

const formData = reactive({ username: '', email: '', phone: '', password: '' })
const formRules = { username: [{ required: true, message: '请输入用户名' }] }
const modalTitle = ref('新增客户')

const fetchList = async () => {
  loading.value = true
  try {
    const params: any = { page: pagination.current, limit: pagination.pageSize }
    if (searchKeywords.value) params.keywords = searchKeywords.value
    const res = await getClientList(params)
    dataSource.value = (res.data?.list || []) as any
    pagination.total = (res.data?.count || 0) as number
  } finally { loading.value = false }
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchList()
}

const showCreateModal = () => {
  editingRecord.value = null
  modalTitle.value = '新增客户'
  formData.username = ''; formData.email = ''; formData.phone = ''; formData.password = ''
  modalVisible.value = true
}

const showEditModal = (record: any) => {
  editingRecord.value = record
  modalTitle.value = '编辑客户'
  formData.username = record.username || ''; formData.email = record.email || ''; formData.phone = record.phone || ''; formData.password = ''
  modalVisible.value = true
}

const showDetail = async (record: any) => {
  detailVisible.value = true
  detailData.value = null
  detailLoading.value = true
  try {
    const res = await getClientDetail(record.id)
    detailData.value = res.data || {}
  } catch { /* handled */ } finally { detailLoading.value = false }
}

const handleSubmit = async () => {
  try { await formRef.value?.validate() } catch { return }
  submitting.value = true
  try {
    const payload = { username: formData.username, email: formData.email, phone: formData.phone }
    if (editingRecord.value) {
      await updateClient(editingRecord.value.id, payload)
      message.success('修改成功')
    } else {
      await createClient({ ...payload, password: formData.password })
      message.success('创建成功')
    }
    modalVisible.value = false
    fetchList()
  } finally { submitting.value = false }
}

const handleDelete = async (id: number) => {
  try { await deleteClient(id); message.success('删除成功'); fetchList() } catch { /* */ }
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
