<template>
  <div class="page-container">
    <a-card title="系统配置">
      <a-form :model="formData" ref="formRef" layout="vertical" style="max-width: 600px">
        <a-form-item v-for="(v, k) in formData" :key="k" :label="String(k)">
          <a-input v-if="typeof v === 'string'" v-model:value="formData[k]" />
          <a-input-number v-else-if="typeof v === 'number'" v-model:value="formData[k]" style="width: 100%" />
          <a-switch v-else-if="typeof v === 'boolean'" v-model:checked="formData[k]" />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" :loading="submitting" @click="handleSave">保存配置</a-button>
            <a-button :loading="clearing" @click="handleClearCache">清除缓存</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'antdv-next'
import { getConfiguration, updateConfiguration, clearCache } from '@/api/configuration'

const formRef = ref(); const submitting = ref(false); const clearing = ref(false)
const formData = reactive<Record<string, any>>({})

const fetchConfig = async () => {
  try {
    const res = await getConfiguration()
    const data = res.data || (res as any) || {}
    Object.keys(data).forEach(k => { if (k !== 'status' && k !== 'messages' && k !== 'time') formData[k] = data[k] })
  } catch { }
}

const handleSave = async () => {
  submitting.value = true
  try { await updateConfiguration(formData); message.success('配置保存成功') } catch { }
  finally { submitting.value = false }
}

const handleClearCache = async () => {
  clearing.value = true
  try { await clearCache(); message.success('缓存已清除') } catch { }
  finally { clearing.value = false }
}

onMounted(() => fetchConfig())
</script>
