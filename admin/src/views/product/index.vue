<template>
  <div class="page-container">
    <div class="page-header">
      <a-space>
        <a-input-search v-model:value="searchKeywords" placeholder="搜索产品" style="width: 240px" @search="fetchList" />
        <a-button type="primary" @click="showCreateModal">
          <template #icon>
            <PlusOutlined />
          </template>
          新增产品
        </a-button>
      </a-space>
    </div>

    <a-table :columns="columns" :data-source="dataSource" :loading="loading" :pagination="pagination"
      @change="handleTableChange" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'price'">¥{{ record.price || 0 }}</template>
        <template v-if="column.key === 'hidden'">
          <a-tag :color="record.hidden ? 'default' : 'green'">{{ record.hidden ? '隐藏' : '显示' }}</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="showEditModal(record)">编辑</a>
            <a-popconfirm title="确认删除该产品？" @confirm="handleDelete(record.id)">
              <a style="color: red">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="modalVisible" :title="modalTitle" @ok="handleSubmit" @cancel="modalVisible = false"
      :confirm-loading="submitting">
      <a-form :model="formData" :rules="formRules" ref="formRef" layout="vertical">
        <a-form-item label="产品名称" name="name">
          <a-input v-model:value="formData.name" placeholder="请输入产品名称" />
        </a-form-item>
        <a-form-item label="产品类型" name="type">
          <a-input v-model:value="formData.type" placeholder="请输入产品类型" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="产品组ID" name="product_group_id">
              <a-input-number v-model:value="formData.product_group_id" placeholder="产品组ID" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="计费周期" name="billing_cycle">
              <a-input v-model:value="formData.billing_cycle" placeholder="计费周期" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="价格" name="price">
              <a-input-number v-model:value="formData.price" placeholder="价格" :min="0" :precision="2"
                style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="库存" name="stock">
              <a-input-number v-model:value="formData.stock" placeholder="库存" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否隐藏" name="hidden">
              <a-select v-model:value="formData.hidden">
                <a-select-option :value="0">显示</a-select-option>
                <a-select-option :value="1">隐藏</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'antdv-next'
import { PlusOutlined } from '@antdv-next/icons'
import { getProductList, createProduct, updateProduct, deleteProduct } from '@/api/product'

const loading = ref(false)
const submitting = ref(false)
const dataSource = ref([])
const searchKeywords = ref('')
const modalVisible = ref(false)
const editingRecord = ref<any>(null)
const formRef = ref()

const pagination = reactive({ current: 1, pageSize: 15, total: 0 })

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '产品名称', dataIndex: 'name', key: 'name' },
  { title: '类型', dataIndex: 'type', key: 'type', width: 100 },
  { title: '产品组', dataIndex: 'product_group_id', key: 'product_group_id', width: 80 },
  { title: '计费周期', dataIndex: 'billing_cycle', key: 'billing_cycle', width: 100 },
  { title: '价格', key: 'price', width: 90 },
  { title: '库存', dataIndex: 'stock', key: 'stock', width: 70 },
  { title: '隐藏', dataIndex: 'hidden', key: 'hidden', width: 70 },
  { title: '操作', key: 'action', width: 140 }
]

const formData = reactive({
  name: '', type: '', product_group_id: undefined as number | undefined,
  billing_cycle: '', price: undefined as number | undefined,
  stock: undefined as number | undefined, hidden: 0
})

const formRules = { name: [{ required: true, message: '请输入产品名称' }] }
const modalTitle = ref('新增产品')

const fetchList = async () => {
  loading.value = true
  try {
    const params: any = { page: pagination.current, limit: pagination.pageSize }
    if (searchKeywords.value) params.keywords = searchKeywords.value
    const res = await getProductList(params)
    dataSource.value = (res.data?.list || []) as any
    pagination.total = (res.data?.count || 0) as number
  } finally { loading.value = false }
}

const handleTableChange = (pag: any) => { pagination.current = pag.current; pagination.pageSize = pag.pageSize; fetchList() }

const showCreateModal = () => {
  editingRecord.value = null; modalTitle.value = '新增产品'
  formData.name = ''; formData.type = ''; formData.product_group_id = undefined
  formData.billing_cycle = ''; formData.price = undefined; formData.stock = undefined; formData.hidden = 0
  modalVisible.value = true
}

const showEditModal = (record: any) => {
  editingRecord.value = record; modalTitle.value = '编辑产品'
  formData.name = record.name || ''; formData.type = record.type || ''
  formData.product_group_id = record.product_group_id
  formData.billing_cycle = record.billing_cycle || ''
  formData.price = record.price; formData.stock = record.stock; formData.hidden = record.hidden ?? 0
  modalVisible.value = true
}

const handleSubmit = async () => {
  try { await formRef.value?.validate() } catch { return }
  submitting.value = true
  try {
    const payload: Record<string, unknown> = {
      name: formData.name, type: formData.type, product_group_id: formData.product_group_id,
      billing_cycle: formData.billing_cycle, price: formData.price, stock: formData.stock, hidden: formData.hidden
    }
    if (editingRecord.value) { await updateProduct(editingRecord.value.id, payload); message.success('修改成功') }
    else { await createProduct(payload); message.success('创建成功') }
    modalVisible.value = false; fetchList()
  } finally { submitting.value = false }
}

const handleDelete = async (id: number) => { try { await deleteProduct(id); message.success('删除成功'); fetchList() } catch { /* */ } }

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
