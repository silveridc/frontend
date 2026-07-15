<template>
  <div class="page-container">
    <a-tabs v-model:activeKey="activeTab" @change="onTabChange">
      <a-tab-pane key="admin" tab="管理员列表" />
      <a-tab-pane key="role" tab="角色管理" />
      <a-tab-pane key="password" tab="修改密码" />
    </a-tabs>

    <!-- 管理员列表 -->
    <div v-if="activeTab === 'admin'" class="tab-content">
      <div class="page-header">
        <a-space>
          <a-input-search
            v-model:value="searchKeywords"
            placeholder="搜索管理员名称"
            style="width: 240px"
            @search="fetchAdminList"
          />
          <a-select
            v-model:value="statusFilter"
            placeholder="状态筛选"
            style="width: 120px"
            allow-clear
            @change="fetchAdminList"
          >
            <a-select-option :value="undefined">全部</a-select-option>
            <a-select-option :value="1">启用</a-select-option>
            <a-select-option :value="0">禁用</a-select-option>
          </a-select>
          <a-button type="primary" @click="showAdminModal()">
            <template #icon><PlusOutlined /></template>
            新增管理员
          </a-button>
        </a-space>
      </div>

      <a-table
        :columns="adminColumns"
        :data-source="adminList"
        :loading="loading"
        :pagination="adminPagination"
        @change="handleAdminTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'green' : 'red'">
              {{ record.status === 1 ? '启用' : '禁用' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showAdminModal(record)">编辑</a>
              <a-popconfirm title="确认删除该管理员？" @confirm="handleDeleteAdmin(record.id)">
                <a style="color: red">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>

      <!-- 管理员弹窗 -->
      <a-modal
        v-model:open="adminModalVisible"
        :title="adminModalTitle"
        @ok="handleAdminSubmit"
        @cancel="adminModalVisible = false"
        :confirm-loading="submitting"
      >
        <a-form :model="adminForm" :rules="adminFormRules" ref="adminFormRef" layout="vertical">
          <a-form-item label="用户名" name="name">
            <a-input v-model:value="adminForm.name" placeholder="请输入用户名" />
          </a-form-item>
          <a-form-item label="邮箱" name="email">
            <a-input v-model:value="adminForm.email" placeholder="请输入邮箱" />
          </a-form-item>
          <a-form-item label="手机号" name="phone">
            <a-input v-model:value="adminForm.phone" placeholder="请输入手机号" />
          </a-form-item>
          <a-form-item label="状态" name="status">
            <a-select v-model:value="adminForm.status" placeholder="请选择状态">
              <a-select-option :value="1">启用</a-select-option>
              <a-select-option :value="0">禁用</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="角色" name="role_ids">
            <a-select
              v-model:value="adminForm.role_ids"
              mode="multiple"
              placeholder="请选择角色"
              :options="roleOptions"
            />
          </a-form-item>
          <a-form-item label="密码" name="password">
            <a-input-password
              v-model:value="adminForm.password"
              :placeholder="editingAdmin ? '留空则不修改密码' : '请输入密码'"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>

    <!-- 角色管理 -->
    <div v-if="activeTab === 'role'" class="tab-content">
      <div class="page-header">
        <a-space>
          <a-input-search
            v-model:value="roleKeywords"
            placeholder="搜索角色名称"
            style="width: 240px"
            @search="fetchRoleList"
          />
          <a-button type="primary" @click="showRoleModal()">
            <template #icon><PlusOutlined /></template>
            新增角色
          </a-button>
        </a-space>
      </div>

      <a-table
        :columns="roleColumns"
        :data-source="roleList"
        :loading="roleLoading"
        :pagination="rolePagination"
        @change="handleRoleTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showRoleModal(record)">编辑</a>
              <a-popconfirm title="确认删除该角色？" @confirm="handleDeleteRole(record.id)">
                <a style="color: red">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>

      <!-- 角色弹窗 -->
      <a-modal
        v-model:open="roleModalVisible"
        :title="roleModalTitle"
        @ok="handleRoleSubmit"
        @cancel="roleModalVisible = false"
        :confirm-loading="roleSubmitting"
        width="640px"
      >
        <a-form :model="roleForm" :rules="roleFormRules" ref="roleFormRef" layout="vertical">
          <a-form-item label="角色名称" name="name">
            <a-input v-model:value="roleForm.name" placeholder="请输入角色名称" />
          </a-form-item>
          <a-form-item label="角色描述" name="description">
            <a-textarea v-model:value="roleForm.description" placeholder="请输入角色描述" :rows="2" />
          </a-form-item>
          <a-form-item label="权限规则" name="rules">
            <a-textarea
              v-model:value="roleForm.rules"
              placeholder="请输入权限规则（逗号分隔，如：client,product,order,host,server）"
              :rows="4"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>

    <!-- 修改密码 -->
    <div v-if="activeTab === 'password'" class="tab-content">
      <div class="password-card">
        <a-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" layout="vertical" style="max-width: 400px">
          <a-form-item label="原密码" name="oldpass">
            <a-input-password v-model:value="passwordForm.oldpass" placeholder="请输入原密码" />
          </a-form-item>
          <a-form-item label="新密码" name="newpass">
            <a-input-password v-model:value="passwordForm.newpass" placeholder="请输入新密码" />
          </a-form-item>
          <a-form-item label="确认新密码" name="confirmPass">
            <a-input-password v-model:value="passwordForm.confirmPass" placeholder="请再次输入新密码" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" :loading="passwordLoading" @click="handleChangePassword" block>
              确认修改
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'antdv-next'
import { PlusOutlined } from '@antdv-next/icons'
import {
  getAdminList, createAdmin, updateAdmin, deleteAdmin, changePassword,
  getRoleList, createRole, updateRole, deleteRole, getRoleInfo
} from '@/api/admin'

// ==================== Tab ====================
const activeTab = ref('admin')
const onTabChange = (key: string) => {
  if (key === 'admin') fetchAdminList()
  else if (key === 'role') fetchRoleList()
}

// ==================== 管理员 ====================
const loading = ref(false)
const submitting = ref(false)
const adminList = ref([])
const searchKeywords = ref('')
const statusFilter = ref<number | undefined>(undefined)
const adminModalVisible = ref(false)
const editingAdmin = ref<any>(null)
const adminFormRef = ref()
const roleOptions = ref<{ value: number; label: string }[]>([])

const adminPagination = reactive({
  current: 1,
  pageSize: 15,
  total: 0
})

const adminColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '用户名', dataIndex: 'name', key: 'name' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '手机号', dataIndex: 'phone', key: 'phone' },
  { title: '状态', key: 'status', width: 80 },
  { title: '创建时间', dataIndex: 'create_time', key: 'create_time', width: 170 },
  { title: '操作', key: 'action', width: 140 }
]

const adminForm = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  status: 1,
  role_ids: [] as number[]
})

const adminFormRules = {
  name: [{ required: true, message: '请输入用户名' }]
}

const adminModalTitle = ref('新增管理员')

const fetchRoleOptions = async () => {
  try {
    const res = await getRoleList({ page: 1, limit: 999 })
    const list = (res.data?.list || []) as any[]
    roleOptions.value = list.map((item: any) => ({
      value: item.id,
      label: item.name || item.id
    }))
  } catch { /* ignore */ }
}

const fetchAdminList = async () => {
  loading.value = true
  try {
    const params: any = { page: adminPagination.current, limit: adminPagination.pageSize }
    if (searchKeywords.value) params.keywords = searchKeywords.value
    if (statusFilter.value !== undefined) params.status = statusFilter.value
    const res = await getAdminList(params)
    adminList.value = (res.data?.list || []) as any
    adminPagination.total = (res.data?.count || 0) as number
  } catch {
    // handled in interceptor
  } finally {
    loading.value = false
  }
}

const handleAdminTableChange = (pag: any) => {
  adminPagination.current = pag.current
  adminPagination.pageSize = pag.pageSize
  fetchAdminList()
}

const showAdminModal = (record?: any) => {
  editingAdmin.value = record || null
  adminModalTitle.value = record ? '编辑管理员' : '新增管理员'
  adminForm.name = record?.name || ''
  adminForm.email = record?.email || ''
  adminForm.phone = record?.phone || ''
  adminForm.password = ''
  adminForm.status = record?.status ?? 1
  adminForm.role_ids = record?.role_ids || []
  adminModalVisible.value = true
}

const handleAdminSubmit = async () => {
  try { await adminFormRef.value?.validate() } catch { return }
  submitting.value = true
  try {
    const payload: Record<string, unknown> = {
      name: adminForm.name,
      email: adminForm.email,
      phone: adminForm.phone,
      status: adminForm.status,
      role_ids: adminForm.role_ids
    }
    if (editingAdmin.value) {
      if (adminForm.password) payload.password = adminForm.password
      await updateAdmin(editingAdmin.value.id, payload)
      message.success('修改成功')
    } else {
      payload.password = adminForm.password
      await createAdmin(payload)
      message.success('创建成功')
    }
    adminModalVisible.value = false
    fetchAdminList()
  } catch {
    // handled in interceptor
  } finally {
    submitting.value = false
  }
}

const handleDeleteAdmin = async (id: number) => {
  try {
    await deleteAdmin(id)
    message.success('删除成功')
    fetchAdminList()
  } catch { /* handled */ }
}

// ==================== 角色管理 ====================
const roleLoading = ref(false)
const roleSubmitting = ref(false)
const roleList = ref([])
const roleKeywords = ref('')
const roleModalVisible = ref(false)
const editingRole = ref<any>(null)
const roleFormRef = ref()

const rolePagination = reactive({
  current: 1,
  pageSize: 15,
  total: 0
})

const roleColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '角色名称', dataIndex: 'name', key: 'name' },
  { title: '描述', dataIndex: 'description', key: 'description' },
  { title: '权限规则', dataIndex: 'rules', key: 'rules' },
  { title: '创建时间', dataIndex: 'create_time', key: 'create_time', width: 170 },
  { title: '操作', key: 'action', width: 140 }
]

const roleForm = reactive({
  name: '',
  description: '',
  rules: ''
})

const roleFormRules = {
  name: [{ required: true, message: '请输入角色名称' }]
}

const roleModalTitle = ref('新增角色')

const fetchRoleList = async () => {
  roleLoading.value = true
  try {
    const params: any = { page: rolePagination.current, limit: rolePagination.pageSize }
    if (roleKeywords.value) params.keywords = roleKeywords.value
    const res = await getRoleList(params)
    roleList.value = (res.data?.list || []) as any
    rolePagination.total = (res.data?.count || 0) as number
  } catch {
    // handled in interceptor
  } finally {
    roleLoading.value = false
  }
}

const handleRoleTableChange = (pag: any) => {
  rolePagination.current = pag.current
  rolePagination.pageSize = pag.pageSize
  fetchRoleList()
}

const showRoleModal = async (record?: any) => {
  editingRole.value = record || null
  roleModalTitle.value = record ? '编辑角色' : '新增角色'
  if (record) {
    try {
      const res = await getRoleInfo(record.id)
      const info = res.data || (res as any)
      roleForm.name = info?.name || record.name || ''
      roleForm.description = info?.description || record.description || ''
      roleForm.rules = info?.rules || record.rules || ''
    } catch {
      roleForm.name = record.name || ''
      roleForm.description = record.description || ''
      roleForm.rules = record.rules || ''
    }
  } else {
    roleForm.name = ''
    roleForm.description = ''
    roleForm.rules = ''
  }
  roleModalVisible.value = true
}

const handleRoleSubmit = async () => {
  try { await roleFormRef.value?.validate() } catch { return }
  roleSubmitting.value = true
  try {
    const payload = {
      name: roleForm.name,
      description: roleForm.description,
      rules: roleForm.rules
    }
    if (editingRole.value) {
      await updateRole(editingRole.value.id, payload)
      message.success('修改成功')
    } else {
      await createRole(payload)
      message.success('创建成功')
    }
    roleModalVisible.value = false
    fetchRoleList()
    fetchRoleOptions()
  } catch {
    // handled in interceptor
  } finally {
    roleSubmitting.value = false
  }
}

const handleDeleteRole = async (id: number) => {
  try {
    await deleteRole(id)
    message.success('删除成功')
    fetchRoleList()
    fetchRoleOptions()
  } catch { /* handled */ }
}

// ==================== 修改密码 ====================
const passwordLoading = ref(false)
const passwordFormRef = ref()
const passwordForm = reactive({
  oldpass: '',
  newpass: '',
  confirmPass: ''
})

const validateConfirmPass = (_rule: any, value: string) => {
  if (value && value !== passwordForm.newpass) {
    return Promise.reject('两次输入的密码不一致')
  }
  return Promise.resolve()
}

const passwordRules = {
  oldpass: [{ required: true, message: '请输入原密码' }],
  newpass: [{ required: true, message: '请输入新密码' }],
  confirmPass: [
    { required: true, message: '请确认新密码' },
    { validator: validateConfirmPass }
  ]
}

const handleChangePassword = async () => {
  try { await passwordFormRef.value?.validate() } catch { return }
  passwordLoading.value = true
  try {
    await changePassword({ oldpass: passwordForm.oldpass, newpass: passwordForm.newpass })
    message.success('密码修改成功')
    passwordForm.oldpass = ''
    passwordForm.newpass = ''
    passwordForm.confirmPass = ''
  } catch {
    // handled in interceptor
  } finally {
    passwordLoading.value = false
  }
}

onMounted(() => {
  fetchAdminList()
  fetchRoleOptions()
})
</script>

<style lang="less" scoped>
.page-container {
  .page-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.tab-content {
  margin-top: 16px;
}

.password-card {
  padding: 24px;
  background: #fafafa;
  border-radius: 8px;
}
</style>
