<template>
  <div class="page-container">
    <div class="page-header">
      <a-space>
        <a-input-search v-model:value="searchKeywords" placeholder="搜索供应商" style="width: 240px" @search="fetchList" />
        <a-button type="primary" @click="showCreateModal">
          <template #icon>
            <PlusOutlined />
          </template>
          新增供应商
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
        <a-form-item label="名称" name="name"><a-input v-model:value="formData.name"
            placeholder="请输入供应商名称" /></a-form-item>
        <a-form-item label="联系人" name="contact"><a-input v-model:value="formData.contact"
            placeholder="请输入联系人" /></a-form-item>
        <a-form-item label="电话" name="phone"><a-input v-model:value="formData.phone"
            placeholder="请输入电话" /></a-form-item>
        <a-form-item label="备注" name="notes"><a-textarea v-model:value="formData.notes" placeholder="请输入备注"
            :rows="3" /></a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'antdv-next'; import { PlusOutlined } from '@antdv-next/icons'
import { getSupplierList, createSupplier, updateSupplier, deleteSupplier } from '@/api/supplier'
const loading = ref(false); const submitting = ref(false); const dataSource = ref([])
const searchKeywords = ref(''); const modalVisible = ref(false); const editingRecord = ref<any>(null); const formRef = ref()
const pagination = reactive({ current: 1, pageSize: 15, total: 0 })
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '联系人', dataIndex: 'contact', key: 'contact' },
  { title: '电话', dataIndex: 'phone', key: 'phone' },
  { title: '备注', dataIndex: 'notes', key: 'notes' },
  { title: '创建时间', dataIndex: 'create_time', key: 'create_time', width: 170 },
  { title: '操作', key: 'action', width: 140 }
]
const formData = reactive({ name: '', contact: '', phone: '', notes: '' })
const formRules = { name: [{ required: true, message: '请输入供应商名称' }] }
const modalTitle = ref('新增供应商')
const fetchList = async () => { loading.value = true; try { const p: any = { page: pagination.current, limit: pagination.pageSize }; if (searchKeywords.value) p.keywords = searchKeywords.value; const res = await getSupplierList(p); dataSource.value = (res.data?.list || []) as any; pagination.total = (res.data?.count || 0) as number } finally { loading.value = false } }
const handleTableChange = (pag: any) => { pagination.current = pag.current; pagination.pageSize = pag.pageSize; fetchList() }
const showCreateModal = () => { editingRecord.value = null; modalTitle.value = '新增供应商'; formData.name = ''; formData.contact = ''; formData.phone = ''; formData.notes = ''; modalVisible.value = true }
const showEditModal = (r: any) => { editingRecord.value = r; modalTitle.value = '编辑供应商'; formData.name = r.name || ''; formData.contact = r.contact || ''; formData.phone = r.phone || ''; formData.notes = r.notes || ''; modalVisible.value = true }
const handleSubmit = async () => { try { await formRef.value?.validate() } catch { return }; submitting.value = true; try { const p = { name: formData.name, contact: formData.contact, phone: formData.phone, notes: formData.notes }; if (editingRecord.value) { await updateSupplier(editingRecord.value.id, p); message.success('修改成功') } else { await createSupplier(p); message.success('创建成功') }; modalVisible.value = false; fetchList() } finally { submitting.value = false } }
const handleDelete = async (id: number) => { try { await deleteSupplier(id); message.success('删除成功'); fetchList() } catch { } }
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
