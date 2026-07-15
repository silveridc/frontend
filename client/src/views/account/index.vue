<template>
  <div class="page" style="max-width:600px">
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="profile" tab="账户信息" />
      <a-tab-pane key="password" tab="修改密码" />
    </a-tabs>
    <div v-if="activeTab === 'profile'" style="margin-top:16px">
      <a-form :model="form" ref="formRef" layout="vertical">
        <a-form-item label="用户名">
          <a-input v-model:value="form.username" />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model:value="form.email" />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model:value="form.phone" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" :loading="saving" @click="handleSave">保存</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div v-if="activeTab === 'password'" style="margin-top:16px">
      <a-form :model="pwForm" :rules="pwRules" ref="pwFormRef" layout="vertical">
        <a-form-item label="原密码" name="old_password">
          <a-input-password v-model:value="pwForm.old_password" />
        </a-form-item>
        <a-form-item label="新密码" name="new_password">
          <a-input-password v-model:value="pwForm.new_password" />
        </a-form-item>
        <a-form-item label="确认新密码" name="confirm">
          <a-input-password v-model:value="pwForm.confirm" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" :loading="pwLoading" @click="handleChangePw">修改密码</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'antdv-next'
import { getProfile, updateProfile } from '@/api/account'
import { changePassword } from '@/api/auth'

const activeTab = ref('profile')
const form = reactive({ username: '', email: '', phone: '' });
const formRef = ref();
const saving = ref(false)
const fetchProfile = async () => {
  try {
    const r = await getProfile();
    const d = r.data || (r as any) || {};
    form.username = d.username || '';
    form.email = d.email || '';
    form.phone = d.phone || ''
  } catch { }
}
const handleSave = async () => {
  saving.value = true;
  try {
    await updateProfile(form);
    message.success('保存成功')
  } finally { saving.value = false }
}

const pwLoading = ref(false);
const pwFormRef = ref();
const pwForm = reactive({ old_password: '', new_password: '', confirm: '' })
const pwRules = {
  old_password: [{ required: true, message: '请输入原密码' }],
  new_password: [{ required: true, message: '请输入新密码' }],
  confirm: [{ required: true, message: '请确认新密码' },
  { validator: (_: any, v: string) => v === pwForm.new_password ? Promise.resolve() : Promise.reject('两次密码不一致') }]
}
const handleChangePw = async () => {
  try { await pwFormRef.value?.validate() } catch { return };
  pwLoading.value = true;
  try {
    await changePassword({ old_password: pwForm.old_password, new_password: pwForm.new_password });
    message.success('密码修改成功');
    pwForm.old_password = '';
    pwForm.new_password = '';
    pwForm.confirm = ''
  } finally { pwLoading.value = false }
}
onMounted(() => fetchProfile())
</script>
