<template>
  <div class="evaluation-page">
    <div class="evaluation-container">
      <!-- 头部导航 -->
      <div class="header">
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <div class="title">订单评价</div>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <button @click="fetchOrderDetail" class="retry-btn">重试</button>
      </div>
      
      <div v-else-if="order" class="evaluation-content">
        <!-- 商品信息 -->
        <div class="good-info" v-if="order.good">
          <img :src="order.good.img" :alt="order.good.text" class="good-image">
          <div class="good-details">
            <h3>{{ order.good.text }}</h3>
            <p class="price">¥{{ order.totalPrice.toFixed(2) }}</p>
          </div>
        </div>

        <!-- 评分 -->
        <div class="rating-section">
          <h3>商品评分</h3>
          <div class="star-rating">
            <span 
              v-for="n in 5" 
              :key="n"
              class="star"
              :class="{ active: n <= rating }"
              @click="rating = n"
            >★</span>
          </div>
          <div class="rating-text">{{ getRatingText(rating) }}</div>
        </div>

        <!-- 评价内容 -->
        <div class="content-section">
          <h3>评价内容</h3>
          <textarea
            v-model="content"
            placeholder="请输入您的评价内容，分享您的使用体验..."
            rows="4"
            class="evaluation-input"
            maxlength="500"
          ></textarea>
          <div class="content-length">{{ content.length }}/500</div>
        </div>

        <!-- 图片上传 -->
        <div class="image-section">
          <h3>上传图片</h3>
          <div class="image-upload">
            <div 
              v-for="(img, index) in images" 
              :key="index"
              class="image-preview"
            >
              <img :src="img" :alt="`评价图片${index + 1}`">
              <button class="remove-btn" @click="removeImage(index)">×</button>
            </div>
            <div 
              v-if="images.length < 3" 
              class="upload-btn"
              @click="triggerUpload"
            >
              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                style="display: none"
                @change="handleImageUpload"
                multiple
              >
              <span>+</span>
              <p>上传图片</p>
            </div>
          </div>
          <p class="upload-tip">最多上传3张图片，支持 jpg、png 格式</p>
        </div>

        <!-- 提交按钮 -->
        <button 
          class="submit-btn"
          :disabled="!canSubmit"
          @click="submitEvaluation"
        >
          提交评价
        </button>
      </div>
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
const rating = ref(5)
const content = ref('')
const images = ref<string[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

// 计算属性：是否可以提交
const canSubmit = computed(() => {
  return rating.value > 0 && content.value.trim().length > 0
})

// 获取评分文本
const getRatingText = (rating: number): string => {
  const texts = ['很差', '差', '一般', '好', '很好']
  return texts[rating - 1] || ''
}

// 触发文件上传
const triggerUpload = () => {
  fileInput.value?.click()
}

// 处理图片上传
const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        if (images.value.length < 3) {  // 限制最多3张图片
          images.value.push(e.target.result)
        }
      }
    }
    reader.readAsDataURL(input.files[0])
  }
  // 清空 input 值，允许重复选择同一文件
  input.value = ''
}

// 移除图片
const removeImage = (index: number) => {
  images.value.splice(index, 1)
}

// 提交评价
const submitEvaluation = async () => {
  try {
    if (!order.value) return
    
    await orderService.evaluateOrder(order.value._id, {
      rating: rating.value,
      content: content.value,
      images: images.value
    })
    
    // 提交成功后返回订单详情
    router.push(`/order/${order.value._id}/detail`)
  } catch (err: any) {
    console.error('提交评价失败:', err)
    alert(err.response?.data?.error || '提交评价失败')
  }
}

// 返回上一页
const goBack = () => {
  router.back()
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
    error.value = err.response?.data?.error || '获取订单详情失败'
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取订单详情
fetchOrderDetail()
</script>

<style scoped>
.evaluation-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.evaluation-container {
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

.evaluation-content {
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
  margin-bottom: 24px;
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

.price {
  color: #ff4d4f;
  font-size: 20px;
  font-weight: 600;
}

.rating-section {
  margin-bottom: 24px;
}

.star-rating {
  display: flex;
  gap: 8px;
  margin: 16px 0;
}

.star {
  font-size: 32px;
  color: #d9d9d9;
  cursor: pointer;
  transition: color 0.3s;
}

.star.active {
  color: #ffd700;
}

.rating-text {
  margin-top: 8px;
  color: #666;
  font-size: 14px;
}

.content-section {
  margin-bottom: 24px;
}

.evaluation-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  resize: vertical;
  min-height: 120px;
  margin-top: 12px;
  font-size: 14px;
  line-height: 1.6;
}

.evaluation-input:focus {
  outline: none;
  border-color: #ff4d4f;
}

.content-length {
  text-align: right;
  color: #999;
  font-size: 12px;
  margin-top: 4px;
}

.image-section {
  margin-bottom: 24px;
}

.image-upload {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.image-preview {
  position: relative;
  width: 100px;
  height: 100px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.upload-btn {
  width: 100px;
  height: 100px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-btn:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.upload-btn span {
  font-size: 24px;
  margin-bottom: 4px;
}

.upload-btn p {
  margin: 0;
  font-size: 12px;
}

.upload-tip {
  margin-top: 8px;
  color: #999;
  font-size: 12px;
}

.submit-btn {
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

.submit-btn:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.submit-btn:hover:not(:disabled) {
  background: #ff7875;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .evaluation-page {
    padding: 12px;
  }
  
  .good-image {
    width: 60px;
    height: 60px;
  }
  
  .star {
    font-size: 28px;
  }
  
  .image-preview, .upload-btn {
    width: 80px;
    height: 80px;
  }
}
</style> 