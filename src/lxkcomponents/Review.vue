<template>
  <div class="review-container" v-loading="loading" element-loading-text="提交中">
    <div class="nav">
      <div class="back-icon" @click="$router.push('/')">
        <van-icon name="arrow-left" />
      </div>
      <div class="title">评价</div>
      <div class="more-icon">
        <van-icon name="ellipsis" />
      </div>
    </div>
    <div class="pickup-info">
      <div class="pickup-title">自提点：万达广场店</div>
      <div class="pickup-address">北京市石景山区石景山路乙18号-1栋A102</div>
    </div>
    <div class="rating-section">
      <h3 class="rating-title">您对提货点的服务满意吗？</h3>
      <div class="rating-stars">
        <span class="rating-label">评分</span>
        <div class="stars">
          <el-rate v-model="value" :texts="['差', '一般', '好', '很好', '非常好']" show-text />
        </div>
      </div>
      <div class="rating-tags">
        <div class="tag" v-for="tag in tags" :key="tag" :class="{ active: selectedTags.includes(tag) }"
          @click="toggleTag(tag)">
          {{ tag }}
        </div>
      </div>
      <div class="rating-input">
        <van-field v-model="comment" type="textarea" rows="3" autosize placeholder="说说对自提点的评价吧" />
      </div>
    </div>
    <div class="product-rating">
      <h3 class="rating-title">您对商品满意吗？</h3>
      <div class="product-list">
        <div class="product-item" v-for="product in products" :key="product.id">
          <div class="product-image">
            <van-image :src="product.image" fit="cover" />
          </div>
          <div class="product-info">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-rating-btns">
              <van-icon name="thumb-circle-o" :class="{ active: product.rating === 'dislike' }"
                @click="rateProduct(product.id, 'dislike')" />
              <van-icon name="thumb-circle" :class="{ active: product.rating === 'like' }"
                @click="rateProduct(product.id, 'like')" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="submit-btn">
      <van-button color="linear-gradient(to left, #ff6034, #ee0a24)" block class="continue-btn" @click="submitReview">
        提交评价
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const num = ref<number>(3)
const submitReview = () => {
  const timer = setInterval(() => {
    loading.value = true
    num.value--
    if (num.value === 0) {
      clearInterval(timer)
      loading.value = false
      router.push('/victory')
    }
  }, 1000)
}






const comment = ref('')
const selectedTags = ref<string[]>([])
const value = ref()
const tags = [
  '到货及时通知',
  '自提点环境干净整洁',
  '服务态度好',
  '商品数量完整',
  '地址准确/好找'
]

const products = ref([
  {
    id: 1,
    name: '春见耙耙柑 500g/份',
    image: '',
    rating: ''
  },
  {
    id: 2,
    name: '陕西红富士苹果 500g/份',
    image: '',
    rating: ''
  }
])

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const rateProduct = (productId: number, rating: string) => {
  const product = products.value.find(p => p.id === productId)
  if (product) {
    product.rating = rating
  }
}

</script>

<style scoped>
.review-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.title {
  font-size: 16px;
  font-weight: 500;
}

.pickup-info {
  background: #fff;
  padding: 16px;
  margin-bottom: 8px;
}

.pickup-title {
  font-size: 14px;
  margin-bottom: 8px;
}

.pickup-address {
  font-size: 12px;
  color: #666;
}

.rating-section {
  background: #fff;
  padding: 16px;
  margin-bottom: 8px;
}

.rating-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}

.rating-stars {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.rating-label {
  margin-right: 12px;
  font-size: 14px;
}

.rating-text {
  margin-left: 8px;
  color: #666;
  font-size: 14px;
}

.rating-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  padding: 6px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  color: #333;
  cursor: pointer;
}

.tag.active {
  background: #fff1f0;
  color: #ff4646;
}

.product-rating {
  background: #fff;
  padding: 16px;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-item {
  display: flex;
  align-items: center;
}

.product-image {
  width: 60px;
  height: 60px;
  margin-right: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
}

.product-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-name {
  font-size: 14px;
}

.product-rating-btns {
  display: flex;
  gap: 16px;
}

.product-rating-btns .van-icon {
  font-size: 24px;
  color: #999;
  cursor: pointer;
}

.product-rating-btns .van-icon.active {
  color: #ff4646;
}

.submit-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: #fff;
}

.submit-btn :deep(.van-button) {
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
}
</style>
