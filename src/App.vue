<!-- <template>
  <div id="app">
    <div id="nav">
      <Carousel></Carousel>
    </div>
    <div id="content">
       <scrollContainer>
        <button
        @click="
          scrollContainer.value?.scrollBy({ left: -100, behavior: 'smooth' })
        "
      >
        上一页
      </button>
      <button
        @click="
          scrollContainer.value?.scrollBy({ left: 100, behavior: 'smooth' })
        "
      >
        下一页
      </button>
       </scrollContainer>
      
    </div>
    <h1>倒计时</h1>
    <p>{{ days }} 天 {{ hours }} 小时 {{ minutes }} 分钟 {{ seconds }} 秒</p>
    <button @click="stopCountdown">停止倒计时</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { CountdownTimer } from "./components/Show";
import Carousel from "./components/Carousel.vue";
import scrollContainer from "./components/HorizontalScroll.vue";

export default defineComponent({
  name: "App",
  components: {
    Carousel,
    // HorizontalScroll,
    scrollContainer

  },
  setup() {
    const days = ref(0);
    const hours = ref(0);
    const minutes = ref(0);
    const seconds = ref(0);
    let countdownTimer: CountdownTimer | null = null;

    onMounted(() => {
      const endTime = new Date(new Date().getTime() + 10 * 60 * 1000); // 10分钟后结束
      countdownTimer = new CountdownTimer(endTime);

      countdownTimer.start((d, h, m, s) => {
        days.value = d;
        hours.value = h;
        minutes.value = m;
        seconds.value = s;
      });
      const intervalId = setInterval(() => {
        if (scrollContainer.value) {
          scrollContainer.value.scrollLeft += 1; // 自动向右滑动
        }
      }, 30);
    });

    onUnmounted(() => {
      if (countdownTimer) {
        countdownTimer.stop();
      }
      clearInterval(intervalId); // 清理定时器
    });

    const stopCountdown = () => {
      if (countdownTimer) {
        countdownTimer.stop();
      }
    };

    return {
      days,
      hours,
      minutes,
      seconds,
      stopCountdown,
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
}
#nav img {
  height: 300px;
}
</style> -->








<template>
  <div id="app">
    <div id="nav">
      <Carousel></Carousel>
    </div>
    <div id="content">
      <!-- <HorizontalScroll></HorizontalScroll> -->
      <div ref="scrollContainer">
        <button
          @click="
            scrollContainer.value?.scrollBy({ left: -100, behavior: 'smooth' })
          "
        >
          上一页
        </button>
        <button
          @click="
            scrollContainer.value?.scrollBy({ left: 100, behavior: 'smooth' })
          "
        >
          下一页
        </button>
      </div>
    </div>
    <h1>倒计时</h1>
    <p>{{ days }} 天 {{ hours }} 小时 {{ minutes }} 分钟 {{ seconds }} 秒</p>
    <button @click="stopCountdown">停止倒计时</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { CountdownTimer } from "./components/Show";
import Carousel from "./components/Carousel.vue";

export default defineComponent({
  name: "App",
  components: {
    Carousel,
    // HorizontalScroll,
  },
  setup() {
    const days = ref(0);
    const hours = ref(0);
    const minutes = ref(0);
    const seconds = ref(0);
    const scrollContainer = ref<HTMLElement | null>(null);
    let countdownTimer: CountdownTimer | null = null;
    let intervalId: number | null = null;

    onMounted(() => {
      const endTime = new Date(new Date().getTime() + 10 * 60 * 1000); // 10分钟后结束
      countdownTimer = new CountdownTimer(endTime);

      countdownTimer.start((d, h, m, s) => {
        days.value = d;
        hours.value = h;
        minutes.value = m;
        seconds.value = s;
      });
      intervalId = setInterval(() => {
        if (scrollContainer.value) {
          scrollContainer.value.scrollLeft += 1; // 自动向右滑动
        }
      }, 30);
    });

    onUnmounted(() => {
      if (countdownTimer) {
        countdownTimer.stop();
      }
      if (intervalId !== null) {
        clearInterval(intervalId); // 清理定时器
      }
    });

    const stopCountdown = () => {
      if (countdownTimer) {
        countdownTimer.stop();
      }
    };

    return {
      days,
      hours,
      minutes,
      seconds,
      stopCountdown,
      scrollContainer,
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
}
#nav img {
  /* width: 100%; */
  height: 300px;
}
</style>
