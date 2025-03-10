<template>
  <div style="width: 100vw;height: 100vh;">
    <div>
      <router-view></router-view>
    </div>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="wap-home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="list-switch" to="/cate">分类</van-tabbar-item>
      <van-tabbar-item icon="cart-o" to="/car">购物车</van-tabbar-item>
      <van-tabbar-item icon="contact-o" to="/my">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script setup>
import { ref } from 'vue';
const active = ref(0);
</script>