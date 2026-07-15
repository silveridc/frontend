<template>
  <div class="dashboard">
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card hoverable>
          <a-statistic title="订单数" :value="stats.orders || 0" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card hoverable>
          <a-statistic title="产品实例" :value="stats.hosts || 0" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card hoverable>
          <a-statistic title="购物车" :value="stats.cart || 0" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card hoverable>
          <a-statistic title="交易记录" :value="stats.transactions || 0" />
        </a-card>
      </a-col>
    </a-row>
    <a-card title="欢迎使用 Cloud Manager" class="welcome">
      <p>通过顶部菜单进行产品选购、订单管理、实例管理等操作。</p>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDashboard } from '@/api/account'
import { getOrderList } from '@/api/order'
import { getHostList } from '@/api/host'
import { getCartList } from '@/api/cart'
import { getTransactionList } from '@/api/transaction'

const stats = ref({ orders: 0, hosts: 0, cart: 0, transactions: 0 })
onMounted(async () => {
  try {
    const r = await getOrderList({ page: 1, limit: 1 });
    stats.value.orders = r.data?.count || 0
  } catch { }
  try {
    const r = await getHostList({ page: 1, limit: 1 });
    stats.value.hosts = r.data?.count || 0
  } catch { }
  try {
    const r = await getCartList({ page: 1, limit: 1 });
    stats.value.cart = r.data?.count || 0
  } catch { }
  try {
    const r = await getTransactionList({ page: 1, limit: 1 });
    stats.value.transactions = r.data?.count || 0
  } catch { }
})
</script>
<style lang="less" scoped>
.dashboard {
  .welcome {
    margin-top: 16px;
  }
}
</style>
