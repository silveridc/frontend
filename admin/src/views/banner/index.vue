<template>
  <div class="page-container">
    <div class="page-header">
      <a-space>
        <a-button type="primary" @click="showCreateModal">
          <template #icon>
            <PlusOutlined />
          </template>
          新增轮播图
        </a-button>
      </a-space>
    </div>
    <a-table :columns="columns" :data-source="dataSource" :loading="loading" :pagination="pagination"
      @change="handleTableChange" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'show'">
          <a-tag :color="record.show ? 'green' : 'default'">{{ record.show ? '展示' : '隐藏' }}</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="handleToggleShow(record)">{{ record.show ? '隐藏' : '展示' }}</a>
            <a @click="showEditModal(record)">编辑</a>
            <a-popconfirm title="确认删除？" @confirm="handleDelete(record.id)"><a style="color: red">删除</a></a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
    <a-modal v-model:open="modalVisible" :title="modalTitle" @ok="handleSubmit" @cancel="modalVisible = false"
      :confirm-loading="submitting">
      <a-form :model="formData" :rules="formRules" ref="formRef" layout="vertical">
        <a-form-item label="图片地址" name="img"><a-input v-model:value="formData.img"
            placeholder="请输入图片URL" /></a-form-item>
        <a-form-item label="跳转链接" name="url"><a-input v-model:value="formData.url"
            placeholder="请输入跳转链接" /></a-form-item>
        <a-form-item label="备注" name="notes"><a-textarea v-model:value="formData.notes" placeholder="请输入备注"
            :rows="2" /></a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'antdv-next'
import { PlusOutlined } from '@antdv-next/icons'
import { getBannerList, createBanner, updateBanner, deleteBanner, toggleBannerShow } from '@/api/banner'

const loading = ref(false); const submitting = ref(false); const dataSource = ref([])
const modalVisible = ref(false); const editingRecord = ref<any>(null); const formRef = ref()
const pagination = reactive({ current: 1, pageSize: 15, total: 0 })
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '图片', dataIndex: 'img', key: 'img' },
  { title: '跳转链接', dataIndex: 'url', key: 'url' },
  { title: '展示', dataIndex: 'show', key: 'show', width: 80 },
  { title: '备注', dataIndex: 'notes', key: 'notes' },
  { title: '操作', key: 'action', width: 200 }
]
const formData = reactive({ img: '', url: '', notes: '' })
const formRules = { img: [{ required: true, message: '请输入图片地址' }], url: [{ required: true, message: '请输入跳转链接' }] }
const modalTitle = ref('新增轮播图')

const fetchList = async () => { loading.value = true; try { const res = await getBannerList({ page: pagination.current, limit: pagination.pageSize }); dataSource.value = (res.data?.list || []) as any; pagination.total = (res.data?.count || 0) as number } finally { loading.value = false } }
const handleTableChange = (pag: any) => { pagination.current = pag.current; pagination.pageSize = pag.pageSize; fetchList() }
const showCreateModal = () => { editingRecord.value = null; modalTitle.value = '新增轮播图'; formData.img = ''; formData.url = ''; formData.notes = ''; modalVisible.value = true }
const showEditModal = (r: any) => { editingRecord.value = r; modalTitle.value = '编辑轮播图'; formData.img = r.img || ''; formData.url = r.url || ''; formData.notes = r.notes || ''; modalVisible.value = true }
const handleSubmit = async () => { try { await formRef.value?.validate() } catch { return }; submitting.value = true; try { const p = { img: formData.img, url: formData.url, notes: formData.notes }; if (editingRecord.value) { await updateBanner(editingRecord.value.id, p); message.success('修改成功') } else { await createBanner(p); message.success('创建成功') }; modalVisible.value = false; fetchList() } finally { submitting.value = false } }
const handleDelete = async (id: number) => { try { await deleteBanner(id); message.success('删除成功'); fetchList() } catch { } }
const handleToggleShow = async (r: any) => { try { await toggleBannerShow(r.id, r.show ? 0 : 1); message.success('操作成功'); fetchList() } catch { } }
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
