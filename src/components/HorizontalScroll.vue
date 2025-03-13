<!-- <template>
  <div class="scroll-container" ref="scrollContainer">
    <div class="scroll-content">
      <div v-for="(item, index) in items" :key="index" class="scroll-item">
        <img :src="item.icon" alt="icon" class="item-icon" />
        <p class="item-text">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent, ref} from "vue";

export default defineComponent({
  name: "HorizontalScroll",
  setup() {
    const scrollContainer = ref<HTMLDivElement | null>(null);

    // 数据示例
    const items = [
      { name: "新鲜蔬菜", icon: "path/to/icon1.png" },
      { name: "肉禽蛋类", icon: "path/to/icon2.png" },
      { name: "海鲜水产", icon: "path/to/icon3.png" },
      { name: "粮油调味", icon: "path/to/icon4.png" },
      { name: "乳品烘焙", icon: "path/to/icon5.png" },
      { name: "酒饮饮料", icon: "path/to/icon6.png" },
      { name: "酒饮饮料", icon: "path/to/icon6.png" },
      { name: "酒饮饮料", icon: "path/to/icon6.png" },
      { name: "酒饮饮料", icon: "path/to/icon6.png" },
      { name: "酒饮饮料", icon: "path/to/icon6.png" },
      { name: "酒饮饮料", icon: "path/to/icon6.png" },
      { name: "酒饮饮料", icon: "path/to/icon6.png" },
      { name: "酒饮饮料", icon: "path/to/icon6.png" },
      { name: "酒饮饮料", icon: "path/to/icon6.png" },
      { name: "酒饮饮料", icon: "path/to/icon6.png" },
      { name: "酒饮饮料", icon: "path/to/icon6.png" },
      { name: "酒饮饮料", icon: "path/to/icon6.png" },
      { name: "酒饮饮料", icon: "path/to/icon6.png" },
      { name: "酒饮饮料", icon: "path/to/icon6.png" },
      { name: "酒饮饮料", icon: "path/to/icon6.png" },
      { name: "酒饮饮料", icon: "path/to/icon6.png" },
    ];
    // onMounted(() => {
    //   const intervalId = setInterval(() => {
    //     if (scrollContainer.value) {
    //       scrollContainer.value.scrollLeft += 1; // 自动向右滑动
    //     }
    //   }, 30);

    //   onUnmounted(() => {
    //     clearInterval(intervalId); // 清理定时器
    //   });
    // });

    return {
      scrollContainer,
      items,
    };
  },
});
</script>
  
  <style scoped>
.scroll-container {
  overflow-x: auto; /* 启用横向滚动 */
  white-space: nowrap; /* 避免内容换行 */
  display: flex;
  align-items: center;
  padding: 10px 0;
  background-color: #f8f8f8;
  scroll-behavior: smooth; /* 滑动平滑效果 */
  border-bottom: 1px solid #ddd;
}

.scroll-container::-webkit-scrollbar {
  display: none; /* 隐藏滚动条 */
}

.scroll-content {
  display: flex;
  gap: 15px; /* 控制卡片之间的间距 */
}

.scroll-item {
  display: inline-block;
  text-align: center;
  min-width: 80px; /* 每个卡片的最小宽度 */
}

.item-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.item-text {
  font-size: 12px;
  color: #333;
  margin-top: 5px;
}
</style> -->
  




   <!-- <template>
    <div class="scroll-container" ref="scrollContainer">
      <div class="item" v-for="(item, index) in items" :key="index">
        <div class="icon"></div>
        <p>{{ item }}</p>
      </div>
    </div>
    <div class="controls">
      <button @click="scrollBy(-100)">上一页</button>
      <button @click="scrollBy(100)">下一页</button>
    </div>
  </template>
  
  <script lang="ts">
  import { ref } from 'vue';
  
  export default {
    name: 'HorizontalScroll',
    setup() {
      const scrollContainer = ref<HTMLDivElement | null>(null);
  
      const scrollBy = (distance: number) => {
        if (scrollContainer.value) {
          // 使用 scrollBy 方法平滑滚动
          scrollContainer.value.scrollBy({
            left: distance,
            behavior: 'smooth',
          });
        }
      };
  
      const items = ref([
        '新鲜蔬菜', '肉禽蛋类', '海鲜水产', 
        '粮油调味', '乳品烘焙', '酒饮类', 
        '其他商品'
      ]);
  
      return {
        scrollContainer,
        scrollBy,
        items,
      };
    },
  };
  </script>
  
  <style scoped>
  .scroll-container {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    height: 120px;
    background-color: #f5f5f5;
    padding: 10px;
    /* 隐藏默认滚动条 */
    -ms-overflow-style: none; /* IE 10+ */
    scrollbar-width: none; /* Firefox */
  }
  .scroll-container::-webkit-scrollbar {
    display: none;
  }
  .item {
    flex: 0 0 auto;
    width: 80px;
    text-align: center;
    margin-right: 10px;
    background: #fff;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .icon {
    height: 50px;
    background-color: #eee;
  }
  p {
    font-size: 14px;
    color: #666;
    margin-top: 5px;
  }
  .controls {
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
  button {
    margin: 0 5px;
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
  </style>
   -->




   <template>
    <div class="scroll-container" ref="scrollContainer">
      <div class="scroll-content">
        <div class="scroll-item" v-for="item in items" :key="item.name">
          <img :src="item.icon" alt="icon" class="item-icon" />
          <p class="item-text">{{ item.name }}</p>
        </div>
      </div>
      <button class="scroll-button left" @click="scrollLeft">←</button>
      <button class="scroll-button right" @click="scrollRight">→</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from "vue";
  
  export default defineComponent({
    name: "HorizontalScroll",
    setup() {
      const scrollContainer = ref<HTMLDivElement | null>(null);
  
      // 数据示例
      const items = [
        { name: "新鲜蔬菜", icon: "path/to/icon1.png" },
        { name: "肉禽蛋类", icon: "path/to/icon2.png" },
        { name: "海鲜水产", icon: "path/to/icon3.png" },
        { name: "粮油调味", icon: "path/to/icon4.png" },
      ];
  
      const scrollLeft = () => {
        if (scrollContainer.value) {
          scrollContainer.value.scrollLeft -= 200; // 每次滚动200像素
        }
      };
  
      const scrollRight = () => {
        if (scrollContainer.value) {
          scrollContainer.value.scrollLeft += 200; // 每次滚动200像素
        }
      };
  
      return {
        scrollContainer,
        items,
        scrollLeft,
        scrollRight,
      };
    },
  });
  </script>
  
  <style scoped>
  .scroll-container {
    position: relative;
    width: 100%;
    overflow: hidden;
  }
  
  .scroll-content {
    display: flex;
    overflow-x: scroll;
    scroll-behavior: smooth;
  }
  
  .scroll-item {
    flex: 0 0 auto;
    margin: 0 10px;
  }
  
  .item-icon {
    width: 50px;
    height: 50px;
  }
  
  .scroll-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
  }
  
  .scroll-button.left {
    left: 0;
  }
  
  .scroll-button.right {
    right: 0;
  }
  </style>
  