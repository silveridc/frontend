<template>
  <div class="page-container">
    <div class="page-header">
      <a-space>
        <a-input-search v-model:value="searchKeywords" placeholder="搜索服务器组" style="width: 240px" @search="fetchList" />
        <a-button type="primary" @click="showCreateModal">
          <template #icon>
            <PlusOutlined />
          </template>
          新增服务器组
        </a-button>
      </a-space>
    </div>
    <a-table :columns="columns" :data-source="dataSource" :loading="loading" :pagination="pagination"
      @change="handleTableChange" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="showEditModal(record)">编辑</a>
            <a-popconfirm title="确认删除？" @confirm="handleDelete(record.id)"><a style="color: red">删除</a></a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
    <a-modal v-model:open="modalVisible" :title="modalTitle" @ok="handleSubmit" @cancel="modalVisible = false"
      :confirm-loading="submitting">
      <a-form :model="formData" :rules="formRules" ref="formRef" layout="vertical">
        <a-form-item label="名称" name="name"><a-input v-model:value="formData.name" placeholder="请输入名称" /></a-form-item>
        <a-form-item label="描述" name="description"><a-textarea v-model:value="formData.description" placeholder="请输入描述"
            :rows="3" /></a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'antdv-next'
import { PlusOutlined } from '@antdv-next/icons'
import { getServerGroupList, createServerGroup, updateServerGroup, deleteServerGroup } from '@/api/server_group'
const loading = ref(false); const submitting = ref(false); const dataSource = ref([])
const searchKeywords = ref(''); const modalVisible = ref(false); const editingRecord = ref<any>(null); const formRef = ref()
const pagination = reactive({ current: 1, pageSize: 15, total: 0 })
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '描述', dataIndex: 'description', key: 'description' },
  { title: '创建时间', dataIndex: 'create_time', key: 'create_time', width: 170 },
  { title: '操作', key: 'action', width: 140 }
]
const formData = reactive({ name: '', description: '' })
const formRules = { name: [{ required: true, message: '请输入名称' }] }
const modalTitle = ref('新增服务器组')
const fetchList = async () => { loading.value = true; try { const p: any = { page: pagination.current, limit: pagination.pageSize }; if (searchKeywords.value) p.keywords = searchKeywords.value; const res = await getServerGroupList(p); dataSource.value = (res.data?.list || []) as any; pagination.total = (res.data?.count || 0) as number } finally { loading.value = false } }
const handleTableChange = (pag: any) => { pagination.current = pag.current; pagination.pageSize = pag.pageSize; fetchList() }
const showCreateModal = () => { editingRecord.value = null; modalTitle.value = '新增服务器组'; formData.name = ''; formData.description = ''; modalVisible.value = true }
const showEditModal = (r: any) => { editingRecord.value = r; modalTitle.value = '编辑服务器组'; formData.name = r.name || ''; formData.description = r.description || ''; modalVisible.value = true }
const handleSubmit = async () => { try { await formRef.value?.validate() } catch { return }; submitting.value = true; try { const p = { name: formData.name, description: formData.description }; if (editingRecord.value) { await updateServerGroup(editingRecord.value.id, p); message.success('修改成功') } else { await createServerGroup(p); message.success('创建成功') }; modalVisible.value = false; fetchList() } finally { submitting.value = false } }
const handleDelete = async (id: number) => { try { await deleteServerGroup(id); message.success('删除成功'); fetchList() } catch { } }
onMounted(() => fetchList())
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
