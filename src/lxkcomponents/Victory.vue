<template>
  <div class="victory-container">
    <div class="nav">
      <div class="back-icon" @click="$router.push('/')">
        <van-icon name="arrow-left" />
      </div>
      <div class="title">评价成功</div>
      <div class="more-icon">
        <van-icon name="ellipsis" />
      </div>
    </div>
    <div class="success-area">
      <div class="success-icon">
        <van-icon name="checked" color="#4cd964" size="48" />
      </div>
      <div class="success-text">感谢您的评价</div>
      <van-button type="danger" block class="continue-btn" @click="$router.push('/')">继续逛逛</van-button>
    </div>
    <div class="recommend-area">
      <div class="recommend-title">为您推荐</div>
      <div class="product-grid-container">
        <div class="product-grid">
          <div class="product-item" v-for="item in list" :key="item.id">
            <div class="product-image">
              <img :src="item.img" alt="商品图片" />
            </div>
            <div class="product-info">
              <div class="product-name">{{ item.name }} {{item.stock}}g/包</div>
              <div class="product-desc">{{ item.content }}</div>
              <div class="product-tag">
                <span class="flash-sale">秒杀</span>
                <span class="limit">限购{{item.num}}份</span>
              </div>
              <div class="price-area">
                <div class="price">
                  <span class="symbol">¥</span>
                  <span class="amount">{{ item.price }}</span>
                  <span class="original">¥{{ item.original }}</span>
                </div>
                <div class="cart-btn">
                  <van-icon name="cart-o" color="#f00" size="20" />
                </div>
              </div>
            </div>
          </div>
          <!-- 可以复制上面的 product-item 结构来添加更多商品 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import axios from 'axios';
import '../mock/mock.js'
const list = ref<{img:string}[]>([])
const getProlist = () =>{
  try{
    axios.get('/api/product').then((res)=>{
      list.value = res.data.data
    })
  }catch(error){
    console.log('出现的错误为：',error)
  }
}

onMounted(()=>{
  getProlist()
})


</script>




<style scoped>
.victory-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.title {
  font-size: 16px;
  font-weight: 500;
}

.success-area {
  background: #fff;
  padding: 40px 20px;
  text-align: center;
}

.success-text {
  margin: 20px 0 30px;
  font-size: 16px;
  color: #333;
}

.continue-btn {
  width: 50%;
  margin: 0 auto;
  border-radius: 25px;
}

.recommend-area {
  margin-top: 10px;
  padding: 16px;
  background: #fff;
}

.recommend-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  text-align: center;
}

.product-grid-container {
  height: calc(100vh - 300px);
  overflow-y: auto;
  position: relative;
  max-height: calc(100vh - 300px);
}

.product-grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.product-item {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin: 5px;
  width: calc(50% - 10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.product-image {
  width: 100%;
  height: 150px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 10px;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.product-desc {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.product-tag {
  margin-bottom: 8px;
}

.flash-sale {
  background: #fff1f0;
  color: #ff4d4f;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 8px;
}

.limit {
  background: #f5f5f5;
  color: #666;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.price-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price {
  display: flex;
  align-items: baseline;
}

.symbol {
  font-size: 12px;
  color: #ff4d4f;
}

.amount {
  font-size: 18px;
  font-weight: bold;
  color: #ff4d4f;
}

.original {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
  margin-left: 4px;
}

.cart-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
