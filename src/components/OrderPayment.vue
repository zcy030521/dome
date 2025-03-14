<template>
  <div class="payment-page">
    <div class="payment-container">
      <!-- 头部导航 -->
      <div class="header">
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <div class="title">订单支付</div>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <div class="error-icon">!</div>
        <p>{{ error }}</p>
        <button @click="fetchOrderDetail" class="retry-btn">重试</button>
      </div>
      
      <div v-else-if="order" class="payment-content">
        <!-- 订单信息 -->
        <div class="order-info">
          <div class="good-info" v-if="order.good">
            <img :src="order.good.img" :alt="order.good.text" class="good-image">
            <div class="good-details">
              <h3>{{ order.good.text }}</h3>
              <p class="quantity">数量：{{ order.quantity }}</p>
              <p class="total-price">总计：¥{{ order.totalPrice.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <!-- 支付方式选择 -->
        <div class="payment-methods">
          <h3>选择支付方式</h3>
          <div class="method-options">
            <div 
              class="method-option"
              :class="{ active: selectedMethod === 'traditional' }"
              @click="selectPaymentMethod('traditional')"
            >
              <i class="method-icon">💳</i>
              <div class="method-info">
                <h4>传统支付</h4>
                <p>使用银行卡支付</p>
              </div>
            </div>
            
            <div 
              class="method-option"
              :class="{ active: selectedMethod === 'crypto' }"
              @click="selectPaymentMethod('crypto')"
            >
              <i class="method-icon">🔗</i>
              <div class="method-info">
                <h4>加密货币支付</h4>
                <p>使用数字钱包支付</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 加密货币支付信息 -->
        <div v-if="selectedMethod === 'crypto'" class="crypto-payment">
          <div v-if="!walletConnected" class="connect-wallet">
            <p>请先连接您的数字钱包</p>
            <button @click="connectWallet" class="connect-btn">
              连接钱包
            </button>
          </div>
          
          <div v-else class="wallet-info">
            <p class="wallet-address">
              钱包地址：{{ formatAddress(walletAddress) }}
            </p>
            <p class="eth-amount">
              支付金额：{{ ethAmount }} ETH
            </p>
          </div>
        </div>

        <!-- 支付按钮 -->
        <div class="payment-action">
          <button 
            class="pay-btn"
            :disabled="!canPay"
            @click="handlePayment"
          >
            {{ payButtonText }}
          </button>
          <p class="payment-tip">请在30分钟内完成支付</p>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="action-bar">
        <button class="cancel-btn" @click="goBack">取消支付</button>
        <button class="confirm-btn" @click="handlePayment">确认支付</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orderService } from '../services/orderService'
import type { Order } from '../types/order'

const route = useRoute()
const router = useRouter()
const orderId = route.params.id as string

const order = ref<Order | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedMethod = ref<'traditional' | 'crypto'>('traditional')
const walletConnected = ref(false)
const walletAddress = ref('')
const ethAmount = ref('0.0')

// 计算属性
const canPay = computed(() => {
  if (selectedMethod.value === 'traditional') return true
  return selectedMethod.value === 'crypto' && walletConnected.value
})

const payButtonText = computed(() => {
  if (selectedMethod.value === 'crypto' && !walletConnected.value) {
    return '请先连接钱包'
  }
  return `支付 ¥${order.value?.totalPrice.toFixed(2) || '0.00'}`
})

// 方法
const fetchOrderDetail = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await orderService.getOrderById(orderId)
    order.value = data
    loading.value = false
  } catch (err: any) {
    console.error('获取订单详情失败:', err)
    error.value = err.response?.data?.error || '获取订单详情失败'
    loading.value = false
  }
}

const selectPaymentMethod = (method: 'traditional' | 'crypto') => {
  selectedMethod.value = method
}

const connectWallet = async () => {
  try {
    // 这里添加连接钱包的逻辑
    // 示例：
    walletConnected.value = true
    walletAddress.value = '0x1234...5678' // 实际应该是真实的钱包地址
    calculateEthAmount()
  } catch (err) {
    console.error('连接钱包失败:', err)
    alert('连接钱包失败，请重试')
  }
}

const calculateEthAmount = () => {
  // 这里添加计算 ETH 金额的逻辑
  // 示例：假设 1 ETH = 15000 CNY
  if (order.value) {
    ethAmount.value = (order.value.totalPrice / 15000).toFixed(4)
  }
}

const handlePayment = async () => {
  try {
    if (!order.value) return
    
    const paymentData = {
      paymentMethod: selectedMethod.value,
      transactionHash: selectedMethod.value === 'crypto' ? '0x...' : undefined
    }
    
    await orderService.payOrder(order.value._id, paymentData)
    
    // 支付成功后跳转到订单详情
    router.push(`/order/${order.value._id}/detail`)
  } catch (err: any) {
    console.error('支付失败:', err)
    alert(err.response?.data?.error || '支付失败，请重试')
  }
}

const formatAddress = (address: string) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// 返回上一页
const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchOrderDetail()
})
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.payment-container {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.back {
  cursor: pointer;
  padding: 8px;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
}

.payment-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.good-info {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.good-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.good-details h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.total-price {
  color: #ff4d4f;
  font-size: 20px;
  font-weight: 600;
  margin: 8px 0;
}

.payment-methods {
  margin-top: 24px;
}

.method-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.method-option {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 12px;
}

.method-option.active {
  border-color: #ff4d4f;
  background: #fff1f0;
}

.method-icon {
  font-size: 24px;
}

.method-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
}

.method-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.crypto-payment {
  margin-top: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.connect-wallet {
  text-align: center;
}

.connect-btn {
  margin-top: 12px;
  padding: 8px 24px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.wallet-info {
  font-family: monospace;
}

.payment-action {
  margin-top: 24px;
  text-align: center;
}

.pay-btn {
  width: 100%;
  padding: 12px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.pay-btn:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.payment-tip {
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}

.action-bar {
  margin-top: 24px;
  text-align: center;
}

.cancel-btn, .confirm-btn {
  margin: 0 12px;
  padding: 8px 24px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style> 