<template>
  <div class="order-list">
    <div class="list-container">
      <!-- 顶部状态栏 -->
      <div class="status-bar">
        <div class="time">9:41</div>
        <div class="icons">
          <span class="signal"></span>
          <span class="wifi"></span>
          <span class="battery"></span>
        </div>
      </div>

      <!-- 头部导航 -->
      <div class="header">
        <div class="back" @click="$router.back()">
          <i class="icon-back"></i>
        </div>
        <div class="title">我的订单</div>
      </div>

      <!-- 订单状态标签 -->
      <div class="order-tabs">
        <div 
          v-for="tab in tabs" 
          :key="tab.value"
          class="tab"
          :class="{ active: currentTab === tab.value }"
          @click="currentTab = tab.value"
        >
          {{ tab.label }}
          <span class="tab-count" v-if="getTabCount(tab.value)">
            {{ getTabCount(tab.value) }}
          </span>
        </div>
      </div>

      <!-- 提示信息 -->
      <div class="notice">
        <i class="icon-info"></i>
        购物中心如有问题，可联系团长进行解决~
      </div>

      <div class="order-list-container">
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>
        
        <div v-else-if="error" class="error-container">
          <div class="error-icon">!</div>
          <p>{{ error }}</p>
          <button @click="fetchOrders" class="retry-btn">重试</button>
        </div>
        
        <div v-else>
          <div v-for="order in filteredOrders" :key="order._id" class="order-item" @click="viewOrderDetail(order)">
            <div class="order-header">
              <span class="order-id">订单号：{{ formatOrderId(order._id) }}</span>
              <span class="order-status" :class="order.status">
                {{ getStatusText(order.status) }}
              </span>
            </div>
            
            <div class="order-content">
              <div class="good-info" v-if="order.good">
                <img :src="order.good.img" class="good-image" :alt="order.good.text">
                <div class="good-details">
                  <h3>{{ order.good.text }}</h3>
                  <p class="price">¥{{ order.totalPrice.toFixed(2) }}</p>
                  <p class="quantity">x{{ order.quantity }}</p>
                </div>
              </div>
              
              <div class="order-meta">
                <p>创建时间：{{ formatDate(order.createdAt) }}</p>
                <p>支付方式：{{ getPaymentMethodText(order.paymentMethod) }}</p>
                <p v-if="order.transactionHash" class="hash">
                  交易哈希：{{ formatHash(order.transactionHash) }}
                </p>
              </div>
            </div>
            
            <div class="order-actions" @click.stop>
              <template v-if="order.status === 'pending'">
                <button class="action-btn cancel" @click="cancelOrder(order)">
                  取消订单
                </button>
                <button class="action-btn primary" @click="goToPayment(order)">
                  去支付
                </button>
              </template>
              
              <template v-else-if="order.status === 'preparing' || order.status === 'delivered'">
                <button class="action-btn" @click="confirmPickup(order)">
                  确认提货
                </button>
              </template>
              
              <template v-else-if="order.status === 'completed'">
                <button class="action-btn" @click="applyRefund(order)">
                  申请退款
                </button>
                <button class="action-btn primary" @click="evaluateOrder(order)">
                  评价
                </button>
              </template>
              
              <template v-else-if="order.status === 'refundPending'">
                <button class="action-btn" disabled>
                  退款处理中
                </button>
              </template>
              
              <template v-else-if="order.status === 'evaluated'">
                <button class="action-btn" @click="viewEvaluation(order)">
                  查看评价
                </button>
              </template>
            </div>
          </div>
          
          <div v-if="filteredOrders.length === 0" class="empty-list">
            <div class="empty-icon">📦</div>
            <p>暂无{{ currentTabLabel }}订单</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

interface Good {
  _id: string
  text: string
  img: string
  price: number
}

interface Order {
  _id: string
  goodId: string
  good?: Good
  quantity: number
  totalPrice: number
  status: 'pending' | 'completed' | 'cancelled' | 'refunded' | 'refundPending' | 'refundSubmitted' | 'refunding' | 'evaluating' | 'evaluated'
  paymentMethod: 'traditional' | 'crypto'
  transactionHash?: string
  createdAt: string
}

const router = useRouter()
const orders = ref<Order[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const currentTab = ref('all')

const tabs = [
  { label: '全部', value: 'all' },
  { label: '待支付', value: 'pending' },
  { label: '待提货', value: 'preparing' },
  { label: '已完成', value: 'completed' },
  { label: '退款/售后', value: 'refund' }
]

const filteredOrders = computed(() => {
  if (currentTab.value === 'all') return orders.value
  if (currentTab.value === 'refund') {
    return orders.value.filter(order => 
      ['refundPending', 'refundSubmitted', 'refunding', 'refunded'].includes(order.status)
    )
  }
  return orders.value.filter(order => order.status === currentTab.value)
})

const fetchOrders = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // 获取订单列表
    const response = await axios.get('http://localhost:3000/orders/all');
    
    if (response.data && Array.isArray(response.data)) {
      // 获取订单列表
      const ordersData = response.data;
      
      // 使用 Promise.all 并添加错误处理
      const ordersWithGoods = await Promise.all(
        ordersData.map(async (order) => {
          try {
            // 使用 populate 后的路径
            const goodResponse = await axios.get(`http://localhost:3000/orders/${order._id}`);
            return {
              ...order,
              good: goodResponse.data.goodId // 使用 populate 后的数据
            };
          } catch (err) {
            console.error(`获取商品信息失败: ${order.goodId}`, err);
            return order; // 返回原始订单，不带商品信息
          }
        })
      );
      
      orders.value = ordersWithGoods;
    }
    
    loading.value = false;
  } catch (err: any) {
    console.error('获取订单列表失败:', err);
    error.value = err.response?.status === 404 
      ? '暂无订单数据'
      : '获取订单列表失败，请稍后重试';
    loading.value = false;
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString()
}

const formatHash = (hash: string) => {
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`
}

const formatOrderId = (id: string) => {
  return id.length > 8 ? `${id.substring(0, 8)}...` : id;
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待支付',
    preparing: '待提货-商品准备',
    delivered: '待提货-已送达',
    completed: '提货成功',
    cancelled: '订单关闭',
    refundPending: '退款申请中',
    refundSubmitted: '退款已提交',
    refunding: '退款处理中',
    refunded: '退款完成',
    evaluating: '评价中',
    evaluated: '已评价'
  }
  return statusMap[status] || status
}

const getPaymentMethodText = (method: string): string => {
  return method === 'traditional' ? '传统支付' : '加密货币支付'
}

const viewOrderDetail = (order: Order) => {
  router.push(`/order/${order._id}/detail`)
}

const goToPayment = (order: Order) => {
  router.push(`/order/${order._id}/payment`)
}

const cancelOrder = async (order: Order) => {
  if (confirm('确认取消订单吗？')) {
    order.status = 'cancelled'
  }
}

const confirmPickup = async (order: Order) => {
  if (confirm('确认已提货吗？')) {
    order.status = 'completed'
  }
}

const applyRefund = async (order: Order) => {
  if (confirm('确认申请退款吗？')) {
    order.status = 'refundPending'
  }
}

const evaluateOrder = (order: Order) => {
  router.push(`/order/${order._id}/evaluate`)
}

const viewEvaluation = (order: Order) => {
  router.push(`/order/${order._id}/evaluation`)
}

const getTabCount = (tabValue: string): number => {
  if (!orders.value) return 0
  
  switch(tabValue) {
    case 'all':
      return orders.value.length
    case 'pending':
      return orders.value.filter(order => order.status === 'pending').length
    case 'preparing':
      return orders.value.filter(order => ['preparing', 'delivered'].includes(order.status)).length
    case 'completed':
      return orders.value.filter(order => order.status === 'completed').length
    case 'refund':
      return orders.value.filter(order => 
        ['refundPending', 'refundSubmitted', 'refunding', 'refunded'].includes(order.status)
      ).length
    default:
      return 0
  }
}

const currentTabLabel = computed(() => {
  const tab = tabs.find(t => t.value === currentTab.value)
  return tab ? tab.label : ''
})

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.order-list {
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f8fc 0%, #f0f4f8 100%);
  padding-bottom: 80px;
}

.list-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 12px 20px 60px;
}

/* 顶部状态栏样式 */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  color: #1a202c;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
}

.icons {
  display: flex;
  gap: 6px;
}

.icons span {
  width: 16px;
  height: 16px;
  background: rgba(26, 32, 44, 0.8);
  border-radius: 2px;
}

.icons .battery {
  width: 20px;
  border-radius: 4px;
}

/* 头部导航样式 */
.header {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back:hover {
  background: #f1f5f9;
  transform: translateY(-1px);
}

.title {
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
}

/* 订单状态标签样式 */
.order-tabs {
  display: flex;
  overflow-x: auto;
  gap: 8px;
  padding: 4px 0;
  margin-bottom: 12px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  position: relative;
}

.order-tabs::-webkit-scrollbar {
  display: none;
}

.tab {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  color: #64748b;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.tab:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border-color: rgba(255, 77, 79, 0.3);
}

.tab.active {
  color: #ff4d4f;
  background: rgba(255, 241, 240, 0.9);
  border-color: rgba(255, 77, 79, 0.3);
  font-weight: 500;
}

/* 提示信息样式 */
.notice {
  background: rgba(255, 251, 235, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(253, 230, 138, 0.4);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #92400e;
  box-shadow: 0 2px 4px rgba(251, 191, 36, 0.1);
}

.icon-info {
  font-size: 20px;
  color: #f59e0b;
}

/* 订单列表样式 */
.order-list-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.order-item {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.order-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.04);
  border-color: rgba(255, 77, 79, 0.2);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  margin-bottom: 12px;
}

.order-id {
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 4px;
  font-family: 'SF Mono', Menlo, monospace;
  color: #666;
  background: #f8fafc;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-status {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
}

.order-status.pending {
  background: rgba(255, 247, 237, 0.9);
  color: #d97706;
  border: 1px solid rgba(251, 146, 60, 0.3);
}

.order-status.preparing {
  background: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.order-status.delivered {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.order-status.completed {
  background: rgba(240, 253, 244, 0.9);
  color: #15803d;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.order-status.cancelled {
  background: rgba(249, 250, 251, 0.9);
  color: #6b7280;
  border: 1px solid rgba(156, 163, 175, 0.3);
}

/* 商品信息样式 */
.good-info {
  display: flex;
  gap: 12px;
  padding: 12px 0;
}

.good-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.good-image:hover {
  transform: scale(1.02);
}

.good-details {
  padding: 4px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.good-details h3 {
  margin-bottom: 6px;
  font-size: 15px;
  color: #1a202c;
  font-weight: 500;
  line-height: 1.4;
}

.price {
  margin: 4px 0;
  color: #ff4d4f;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: baseline;
}

.price::before {
  content: '¥';
  font-size: 14px;
  margin-right: 2px;
  font-weight: normal;
}

.quantity {
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 订单操作按钮样式 */
.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
}

.action-btn {
  padding: 6px 16px;
  border-radius: 12px;
  font-size: 13px;
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  color: #ff4d4f;
  border-color: #ff4d4f;
  background: #fff1f0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .list-container {
    padding: 8px 12px 40px;
  }
  
  .order-list-container {
    gap: 6px;
  }
  
  .order-item {
    padding: 10px 12px;
  }
  
  .good-image {
    width: 70px;
    height: 70px;
  }
  
  .action-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .title {
    font-size: 18px;
  }
  
  .good-details h3 {
    font-size: 14px;
  }
  
  .price {
    font-size: 16px;
  }
  
  .order-meta {
    font-size: 12px;
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .order-list {
    background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  }
  
  .header {
    background: rgba(26, 32, 44, 0.8);
  }
  
  .title {
    background: linear-gradient(135deg, #f7fafc 0%, #e2e8f0 100%);
    -webkit-background-clip: text;
  }
  
  .order-item {
    background: rgba(26, 32, 44, 0.95);
    border-color: rgba(74, 85, 104, 0.3);
  }
  
  .good-details h3 {
    color: #e2e8f0;
  }
  
  .order-id {
    background: #2d3748;
    color: #e2e8f0;
    border-color: #4a5568;
  }
  
  .action-btn:not(.primary) {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }
  
  .notice {
    background: rgba(26, 32, 44, 0.8);
    border-color: rgba(251, 191, 36, 0.2);
    color: #fbbf24;
  }
}

/* 修改订单元信息样式 */
.order-meta {
  padding: 8px 0;
  border-top: 1px solid #f0f0f0;
  margin-top: 8px;
  font-size: 13px;
  color: #666;
}

.order-meta p {
  margin: 4px 0;
}

.hash {
  font-family: 'SF Mono', Menlo, monospace;
  font-size: 13px;
  background: #f8fafc;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}
</style> 