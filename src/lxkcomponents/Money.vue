<template>
    <div class="money">
        <div class="nav">
     <div class="back-icon" @click="$router.push('/')">
       <van-icon name="arrow-left" />
     </div>
     <div class="title">天天领红包</div>
     <div class="more-icon">
       <van-icon name="ellipsis" />
     </div>
   </div>
   <div class="main">
      <div class="content-box">
        <div class="empty-state">
          <div class="empty-text">下单分享购物体验得红包</div>
        </div>
      </div>
    </div>
    </div>

</template>

<script setup lang="ts">

</script>

<style scoped>
.money{
    min-height: 100vh;
    background-color: #f5f5f5;
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
.main{
    padding: 16px;
}
.content-box {
  background: #fff;
  border-radius: 8px;
  min-height: 600px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}
.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}
.empty-text {
  color: #999;
  font-size: 14px;
  text-align: center;
}
</style>



