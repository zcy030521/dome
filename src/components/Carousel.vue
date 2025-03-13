<template>
    <div class="nav-carousel">
      <div class="carousel-images">
        <img
          v-for="(img, index) in images"
          :key="index"
          :src="img.src"
          :alt="img.alt"
          :class="{ active: currentIndex === index }"
        />
      </div>
      <div class="carousel-dots">
        <span
          v-for="(img, index) in images"
          :key="index"
          :class="{ active: currentIndex === index }"
          @click="setCurrentIndex(index)"
        ></span>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, onUnmounted } from "vue";
  
  export default defineComponent({
    name: "NavCarousel",
    setup() {
      const currentIndex = ref(0);
      const images = ref([
        { src: "../public/images/img1.jpg", alt: "Image 1" },
        { src: "../public/images/img2.jpg", alt: "Image 2" },
        { src: "../public/images/img3.jpg", alt: "Image 3" },
        { src: "../public/images/img4.jpg", alt: "Image 4" },
        { src: "../public/images/img5.jpg", alt: "Image 5" },
      ]);
  
      const interval = 3000; // 3秒切换
      let timer: number | null = null;
  
      const setCurrentIndex = (index: number) => {
        currentIndex.value = index;
      };
  
      const startCarousel = () => {
        timer = window.setInterval(() => {
          currentIndex.value = (currentIndex.value + 1) % images.value.length;
        }, interval);
      };
  
      const stopCarousel = () => {
        if (timer) clearInterval(timer);
      };
  
      onMounted(() => {
        startCarousel();
      });
  
      onUnmounted(() => {
        stopCarousel();
      });
  
      return {
        currentIndex,
        images,
        setCurrentIndex,
      };
    },
  });
  </script>
  
  <style scoped>
  .nav-carousel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 800px;
    height: 350px;
    overflow: hidden;
    border:#333 1px solid;
  }
  
  .carousel-images {
    width: 100%;
    height: 120px; /* 限制图片的展示大小 */
    display: flex;
    justify-content: center;
    align-items: center;
    border:#333 1px solid;
  }
  
  .carousel-images img {
    display: none;
    width: 100%;
    height: 300px; /* 图标大小一致 */
    border-radius: 8px; /* 圆角 */
    object-fit: cover; /* 保持图片比例 */
  }
  
  .carousel-images img.active {
    display: block; /* 仅当前图片展示 */
  }
  
  .carousel-dots {
    margin-top: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .carousel-dots span {
    width: 10px;
    height: 10px;
    margin: 0 4px;
    border-radius: 50%;
    background-color: #ccc;
    cursor: pointer;
    /* margin-bottom: 10px; */
  }
  
  .carousel-dots span.active {
    background-color: #333; /* 高亮展示当前圆点 */
  }
  </style>
  