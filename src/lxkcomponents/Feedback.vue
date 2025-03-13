<template>
  <div class="feedback">
    <div class="nav">
      <div class="back-icon" @click="$router.push('/')">
        <van-icon name="arrow-left" />
      </div>
      <div class="title">投诉/反馈</div>
      <div class="more-icon">
        <van-icon name="ellipsis" />
      </div>
    </div>
    <div>
        <van-field
            v-model="message"
            rows="5"
            autosize
            type="textarea"
            placeholder="请输入留言"
        />
        <van-field v-model="digit" type="digit" placeholder="请输入联系方式" />
    </div>
    <div class="main">
        <div class="main-item">
            <span class="main-item-text">为了更快便捷解决问题，我们可能会联系您</span>
            <van-button color="linear-gradient(to left, #ff6034, #ee0a24)" block class="continue-btn" @click="submit">
                提交
            </van-button>
        </div>
        
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus'
const message = ref('');

const digit = ref('');

const submit = () => {
    message.value = '';
    digit.value = '';
    ElMessage({
    message: '感谢您的反馈',
    type: 'success',
  })
}

</script>

<style scoped>
.feedback{
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
.continue-btn {
  width: 90%;
  margin: 0 auto;
  border-radius: 25px;
  margin-top: 30px;
}
.main-item-text {
    margin-left: 15px;
    font-size: 12px;
    color: #999;
    margin-bottom: 10px;
}
</style>
