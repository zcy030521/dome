<template>
    <div class="setting">
        <div class="nav">
            <div class="back-icon" @click="$router.push('/')">
                <van-icon name="arrow-left" />
            </div>
            <div class="title">设置</div>
            <div class="more-icon">
                <van-icon name="ellipsis" />
            </div>
        </div>
        <div class="content">
            <div>
                <div class="img">
                    <img src="https://cdn8.axureshop.com/demo/1992135/images/loading/u356.svg" alt="">
                </div>
                <div class="img_content">
                    <span style="color: rgb(138, 138, 138);">Axlab社区团购介绍</span>
                </div>
            </div>
            <div class="content_item">
                <div class="agreement-list">
                    <div class="agreement-item" v-for="item in items" :key="item">
                        <span>{{ item }}</span>
                        <span class="arrow"><van-icon name="arrow" /></span>
                    </div>
                </div>
            </div>
            <div class="footer">
                <div class="version">
                    <span style="color: rgb(138, 138, 138);">当前版本 V1.0</span>
                </div>
                <van-button color="linear-gradient(to left, #ff6034, #ee0a24)" block class="continue-btn" @click="logout">
                    退出登录
                </van-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const items = ref(['平台资质', '用户协议', '隐私协议']);
const logout = () => {
   ElMessage({
    message: '退出成功',
    type: 'success',
  })
  router.push('/')
}
</script>

<style scoped>
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

.setting {
    min-height: 100vh;
}

.img {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    margin-top: 20px;
    border-radius: 50%;
    text-align: center;
}

.img_content {
    text-align: center;
    font-size: 14px;
}
.content_item{
    margin-top: 60px;
}
.agreement-list {
  padding: 0;
  list-style: none;
  width: 90%;
  margin: 0 auto;
}

.agreement-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
}

.agreement-item span {
  font-size: 16px;
  color: #333;
}

.arrow {
  font-size: 24px;
  color: #999;
}
.footer{
    margin-top: 100px;
    line-height: 50px;
}
.version{
    text-align: center;
}
.continue-btn {
  width: 90%;
  margin: 0 auto;
  border-radius: 25px;
  margin-top: 30px;
}
</style>