<template>
  <div class="page-container">
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="email" tab="邮件通知" />
      <a-tab-pane key="sms" tab="短信通知" />
      <a-tab-pane key="setting" tab="通知设置" />
    </a-tabs>
    <!-- 邮件通知 -->
    <div v-if="activeTab === 'email'" class="tab-content">
      <a-table :columns="emailColumns" :data-source="emailList" :loading="emailLoading" :pagination="emailPagination"
        @change="handleEmailTableChange" row-key="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a @click="showEmailModal(record)">编辑</a>
          </template>
        </template>
      </a-table>
    </div>
    <!-- 短信通知 -->
    <div v-if="activeTab === 'sms'" class="tab-content">
      <a-table :columns="smsColumns" :data-source="smsList" :loading="smsLoading" :pagination="smsPagination"
        @change="handleSmsTableChange" row-key="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a @click="showSmsModal(record)">编辑</a>
          </template>
        </template>
      </a-table>
    </div>
    <!-- 通知设置 -->
    <div v-if="activeTab === 'setting'" class="tab-content">
      <a-table :columns="settingColumns" :data-source="settingList" :loading="settingLoading"
        :pagination="settingPagination" @change="handleSettingTableChange" row-key="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a @click="showSettingModal(record)">编辑</a>
          </template>
        </template>
      </a-table>
    </div>
    <a-modal v-model:open="editVisible" title="编辑" @ok="handleEditSubmit" @cancel="editVisible = false"
      :confirm-loading="editSubmitting">
      <a-form :model="editForm" ref="editFormRef" layout="vertical">
        <a-form-item v-for="(v, k) in editForm" :key="k" :label="String(k)">
          <a-input v-if="typeof v === 'string'" v-model:value="editForm[k]" />
          <a-input-number v-else-if="typeof v === 'number'" v-model:value="editForm[k]" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'antdv-next'
import { getNoticeEmailList, updateNoticeEmail, getNoticeSmsList, updateNoticeSms, getNoticeSettingList, updateNoticeSetting } from '@/api/notice'

const activeTab = ref('email')
// email
const emailLoading = ref(false); const emailList = ref([]); const emailPagination = reactive({ current: 1, pageSize: 15, total: 0 })
const emailColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '收件人', dataIndex: 'recipient', key: 'recipient' },
  { title: '主题', dataIndex: 'subject', key: 'subject' },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'create_time', key: 'create_time', width: 170 },
  { title: '操作', key: 'action', width: 80 }
]
const fetchEmailList = async () => { emailLoading.value = true; try { const res = await getNoticeEmailList({ page: emailPagination.current, limit: emailPagination.pageSize }); emailList.value = (res.data?.list || []) as any; emailPagination.total = (res.data?.count || 0) as number } finally { emailLoading.value = false } }
const handleEmailTableChange = (pag: any) => { emailPagination.current = pag.current; emailPagination.pageSize = pag.pageSize; fetchEmailList() }
// sms
const smsLoading = ref(false); const smsList = ref([]); const smsPagination = reactive({ current: 1, pageSize: 15, total: 0 })
const smsColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '手机号', dataIndex: 'phone', key: 'phone' },
  { title: '内容', dataIndex: 'content', key: 'content' },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'create_time', key: 'create_time', width: 170 },
  { title: '操作', key: 'action', width: 80 }
]
const fetchSmsList = async () => { smsLoading.value = true; try { const res = await getNoticeSmsList({ page: smsPagination.current, limit: smsPagination.pageSize }); smsList.value = (res.data?.list || []) as any; smsPagination.total = (res.data?.count || 0) as number } finally { smsLoading.value = false } }
const handleSmsTableChange = (pag: any) => { smsPagination.current = pag.current; smsPagination.pageSize = pag.pageSize; fetchSmsList() }
// setting
const settingLoading = ref(false); const settingList = ref([]); const settingPagination = reactive({ current: 1, pageSize: 15, total: 0 })
const settingColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '配置名称', dataIndex: 'name', key: 'name' },
  { title: '配置值', dataIndex: 'value', key: 'value' },
  { title: '备注', dataIndex: 'notes', key: 'notes' },
  { title: '操作', key: 'action', width: 80 }
]
const fetchSettingList = async () => { settingLoading.value = true; try { const res = await getNoticeSettingList({ page: settingPagination.current, limit: settingPagination.pageSize }); settingList.value = (res.data?.list || []) as any; settingPagination.total = (res.data?.count || 0) as number } finally { settingLoading.value = false } }
const handleSettingTableChange = (pag: any) => { settingPagination.current = pag.current; settingPagination.pageSize = pag.pageSize; fetchSettingList() }
// edit modal
const editVisible = ref(false); const editSubmitting = ref(false); const editFormRef = ref()
const editForm = reactive<Record<string, any>>({}); const editAction = ref<'email' | 'sms' | 'setting' | ''>('')
let editId: number | string = 0
const showEmailModal = (r: any) => { editAction.value = 'email'; editId = r.id; Object.assign(editForm, { ...r }); delete editForm.id; delete editForm.create_time; editVisible.value = true }
const showSmsModal = (r: any) => { editAction.value = 'sms'; editId = r.id; Object.assign(editForm, { ...r }); delete editForm.id; delete editForm.create_time; editVisible.value = true }
const showSettingModal = (r: any) => { editAction.value = 'setting'; editId = r.id; Object.assign(editForm, { ...r }); delete editForm.id; editVisible.value = true }
const handleEditSubmit = async () => { editSubmitting.value = true; try { if (editAction.value === 'email') await updateNoticeEmail(editId, editForm); else if (editAction.value === 'sms') await updateNoticeSms(editId, editForm); else if (editAction.value === 'setting') await updateNoticeSetting(editId, editForm); message.success('修改成功'); editVisible.value = false; if (editAction.value === 'email') fetchEmailList(); else if (editAction.value === 'sms') fetchSmsList(); else fetchSettingList() } finally { editSubmitting.value = false } }
onMounted(() => { fetchEmailList(); fetchSmsList(); fetchSettingList() })
</script>
<style lang="less" scoped>
.page-container .tab-content {
  margin-top: 16px;
}
</style>
