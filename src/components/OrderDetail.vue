<template>
  <div class="order-detail">
    <div class="detail-container">
      <!-- 头部导航 -->
      <div class="header">
        <div class="back" @click="goBack">
          <i class="icon-back">←</i>
        </div>
        <div class="title">订单详情</div>
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
      
      <div v-else-if="order" class="order-content">
        <!-- 订单状态卡片 -->
        <div class="status-card">
          <div class="status-header">
            <span class="status-tag" :class="order.status">
              {{ getStatusText(order.status) }}
            </span>
            <span class="order-time">{{ formatDate(order.createdAt) }}</span>
          </div>
          <div class="status-body">
            <div class="order-id">订单号：{{ formatOrderId(order._id) }}</div>
            <div class="payment-info">
              <span>支付方式：{{ getPaymentMethodText(order.paymentMethod) }}</span>
              <span v-if="order.transactionHash" class="hash">
                交易哈希：{{ formatHash(order.transactionHash) }}
              </span>
            </div>
          </div>
        </div>

        <!-- 商品信息卡片 -->
        <div class="good-card" v-if="order.good">
          <img :src="order.good.img" :alt="order.good.text" class="good-image">
          <div class="good-info">
            <h3>{{ order.good.text }}</h3>
            <p class="description">{{ order.good.description }}</p>
            <div class="price-info">
              <span class="price">¥{{ order.totalPrice.toFixed(2) }}</span>
              <span class="quantity">x{{ order.quantity }}</span>
            </div>
          </div>
        </div>

        <!-- 订单进度 -->
        <div class="progress-card">
          <h3>订单进度</h3>
          <div class="progress-timeline">
            <div 
              v-for="(step, index) in getOrderSteps(order.status)" 
              :key="index"
              class="progress-item"
              :class="{ active: isStepActive(step.status) }"
            >
              <div class="step-dot"></div>
              <div class="step-line" v-if="index < getOrderSteps(order.status).length - 1"></div>
              <div class="step-info">
                <div class="step-title">{{ step.title }}</div>
                <div class="step-time" v-if="getStepTime(step.status)">
                  {{ formatDate(getStepTime(step.status)) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 评价信息 -->
        <div v-if="order.evaluation" class="evaluation-card">
          <h3>订单评价</h3>
          <div class="evaluation-content">
            <div class="rating">
              <span v-for="n in 5" :key="n" class="star" :class="{ active: n <= order.evaluation.rating }">
                ★
              </span>
              <span class="rating-text">{{ getRatingText(order.evaluation.rating) }}</span>
            </div>
            <p class="evaluation-text">{{ order.evaluation.content }}</p>
            <div class="evaluation-images" v-if="order.evaluation.images?.length">
              <img 
                v-for="(img, index) in order.evaluation.images" 
                :key="index" 
                :src="img" 
                @click="previewImage(img)"
                class="evaluation-image"
              >
            </div>
            <div class="evaluation-time">
              评价时间：{{ formatDate(order.evaluation.evaluateTime) }}
            </div>
          </div>
        </div>

        <!-- 底部操作栏 -->
        <div class="action-bar" v-if="showActions">
          <template v-if="order.status === 'pending'">
            <button class="action-btn cancel" @click="handleCancel">取消订单</button>
            <button class="action-btn primary" @click="goToPayment">去支付</button>
          </template>
          
          <template v-else-if="order.status === 'preparing' || order.status === 'delivered'">
            <button class="action-btn primary" @click="confirmPickup">确认提货</button>
          </template>
          
          <template v-else-if="order.status === 'completed' && !order.evaluation">
            <button class="action-btn" @click="applyRefund">申请退款</button>
            <button class="action-btn primary" @click="goToEvaluate">评价</button>
          </template>
        </div>
      </div>
      
      <div v-else class="empty-detail">
        <div class="empty-icon">🔍</div>
        <p>订单不存在</p>
        <button @click="$router.push('/orders')" class="back-btn">返回列表</button>
      </div>
    </div>

    <!-- 图片预览弹窗 -->
    <div v-if="previewVisible" class="image-preview-modal" @click="closePreview">
      <img :src="previewImageUrl" class="preview-image" @click.stop>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orderService } from '../services/orderService'
import type { Order } from '../types/order'

const route = useRoute()
const router = useRouter()
const orderId = route.params.id as string

const order = ref<Order | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// 获取订单步骤
const getOrderSteps = (status: string) => {
  const baseSteps = [
    { status: 'pending', title: '待支付' },
    { status: 'preparing', title: '商品准备中' },
    { status: 'delivered', title: '待提货' },
    { status: 'completed', title: '提货完成' }
  ]

  if (['refundPending', 'refundSubmitted', 'refunding', 'refunded'].includes(status)) {
    return [
      { status: 'completed', title: '提货完成' },
      { status: 'refundPending', title: '申请退款' },
      { status: 'refundSubmitted', title: '退款审核' },
      { status: 'refunded', title: '退款完成' }
    ]
  }

  return baseSteps
}

// 获取步骤时间
const getStepTime = (status: string) => {
  if (!order.value) return null
  switch (status) {
    case 'pending': return order.value.createdAt
    case 'preparing': return order.value.updatedAt
    case 'delivered': return order.value.deliveryTime
    case 'completed': return order.value.pickupTime
    default: return null
  }
}

// 判断步骤是否激活
const isStepActive = (status: string) => {
  if (!order.value) return false
  const statusIndex = getOrderSteps(order.value.status).findIndex(step => step.status === status)
  const currentIndex = getOrderSteps(order.value.status).findIndex(step => step.status === order.value?.status)
  return statusIndex <= currentIndex
}

// 计算属性：是否显示操作栏
const showActions = computed(() => {
  return order.value && ['pending', 'preparing'].includes(order.value.status)
})

// 计算属性：是否可以取消
const canCancel = computed(() => {
  return order.value?.status === 'pending'
})

// 计算属性：是否可以支付
const canPay = computed(() => {
  return order.value?.status === 'pending'
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转到支付页面
const goToPayment = () => {
  if (!order.value) return
  router.push(`/order/${order.value._id}/payment`)
}

// 处理取消订单
const handleCancel = async () => {
  try {
    if (!order.value) return
    await orderService.cancelOrder(order.value._id)
    await fetchOrderDetail()
    // 取消成功后返回列表页
    setTimeout(() => {
      router.push('/orders')
    }, 1500)
  } catch (err: any) {
    console.error('取消订单失败:', err)
    alert(err.response?.data?.error || '取消订单失败')
  }
}

// 格式化工具函数
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString()
}

const formatHash = (hash: string) => {
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`
}

const formatOrderId = (id: string | undefined) => {
  if (!id) return '';
  return id.length > 20 ? `${id.substring(0, 20)}...` : id;
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待支付',
    preparing: '待提货-商品准备',
    delivered: '待提货-已送达',
    completed: '提货成功',
    cancelled: '订单关闭'
  }
  return statusMap[status] || status
}

const getPaymentMethodText = (method: string) => {
  return method === 'traditional' ? '传统支付' : '加密货币支付'
}

// 获取订单详情
const fetchOrderDetail = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await orderService.getOrderById(orderId)
    order.value = data
  } catch (err: any) {
    console.error('获取订单详情失败:', err)
    error.value = err.response?.status === 404 
      ? '订单不存在'
      : '获取订单详情失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 评价相关方法
const getRatingText = (rating: number) => {
  const texts = ['很差', '差', '一般', '好', '很好']
  return texts[rating - 1] || ''
}

// 图片预览相关
const previewVisible = ref(false)
const previewImageUrl = ref('')

// 预览图片方法
const previewImage = (img: string) => {
  previewVisible.value = true
  previewImageUrl.value = img
}

// 关闭预览
const closePreview = () => {
  previewVisible.value = false
  previewImageUrl.value = ''
}

// 订单操作方法
const confirmPickup = async () => {
  try {
    if (!order.value) return
    await orderService.updateOrderStatus(order.value._id, 'completed')
    await fetchOrderDetail()
  } catch (err: any) {
    console.error('确认提货失败:', err)
    alert(err.response?.data?.error || '确认提货失败')
  }
}

const applyRefund = async () => {
  try {
    if (!order.value) return
    if (confirm('确认申请退款吗？')) {
      await orderService.updateOrderStatus(order.value._id, 'refundPending')
      await fetchOrderDetail()
    }
  } catch (err: any) {
    console.error('申请退款失败:', err)
    alert(err.response?.data?.error || '申请退款失败')
  }
}

const goToEvaluate = () => {
  if (!order.value) return
  router.push(`/order/${order.value._id}/evaluate`)
}

// 组件挂载时获取订单详情
fetchOrderDetail()
</script>

<style scoped>
.order-detail {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.detail-container {
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

.status-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
}

.status-tag.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.status-tag.preparing {
  background: #fffbe6;
  color: #f59e0b;
}

.status-tag.delivered {
  background: #f6ffed;
  color: #52c41a;
}

.status-tag.completed {
  background: #f6ffed;
  color: #52c41a;
}

.status-tag.cancelled {
  background: #f5f5f5;
  color: #999;
}

.order-time {
  font-size: 14px;
  color: #666;
}

.status-body {
  margin-top: 16px;
}

.order-id {
  margin-bottom: 8px;
}

.payment-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.good-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.good-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.good-info {
  flex: 1;
}

.good-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.description {
  color: #666;
}

.price-info {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #ff4d4f;
  font-size: 20px;
  font-weight: 600;
}

.quantity {
  color: #666;
}

.progress-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.progress-timeline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.progress-item {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #e8e8e8;
  margin-bottom: 8px;
}

.step-dot.active {
  background: #ff4d4f;
}

.step-info {
  text-align: center;
}

.step-title {
  font-size: 16px;
  font-weight: 600;
}

.step-time {
  font-size: 14px;
  color: #666;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: white;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.06);
  display: flex;
  gap: 16px;
}

.cancel-btn, .pay-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.pay-btn {
  background: #ff4d4f;
  color: white;
}

.cancel-btn:hover {
  background: #e8e8e8;
}

.pay-btn:hover {
  background: #ff7875;
}

.evaluation-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.star {
  font-size: 20px;
  color: #d9d9d9;
}

.star.active {
  color: #ffd700;
}

.rating-text {
  margin-left: 8px;
  color: #666;
}

.evaluation-text {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 16px;
}

.evaluation-images {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.evaluation-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.3s;
}

.evaluation-image:hover {
  transform: scale(1.05);
}

.evaluation-time {
  font-size: 12px;
  color: #999;
}

.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.preview-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}
</style> 