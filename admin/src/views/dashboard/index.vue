<template>
  <div class="dashboard">
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card hoverable>
          <a-statistic title="管理员数量" value="-" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card hoverable>
          <a-statistic title="客户数量" value="-" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card hoverable>
          <a-statistic title="产品数量" value="-" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card hoverable>
          <a-statistic title="订单数量" value="-" />
        </a-card>
      </a-col>
    </a-row>
    <a-card title="欢迎使用" class="welcome-card">
      <p>欢迎使用 Cloud Manager 管理端系统，请通过左侧菜单进行管理操作。</p>
    </a-card>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="less" scoped>
.dashboard {
  .welcome-card {
    margin-top: 16px;
  }
}
</style>
