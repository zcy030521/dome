<template>
    <div style="width: 100vw;">
        <header style="background-color: white;">
            <div>
                <img src="https://cdn8.axureshop.com/demo/1992135/images/%E7%99%BB%E5%BD%95/u386.svg" alt="">
                <input type="text" placeholder="搜索">
            </div>
        </header>

        <body>
            <div>
                <nut-swiper :init-page="2" :auto-play="3000" pagination-visible pagination-color="#426543"
                    pagination-unselected-color="#808080">
                    <nut-swiper-item v-for="(item, index) in list" :key="index" style="height: 150px">
                        <img :src="item" alt="" style="height: 100%; width: 100%" draggable="false" />
                    </nut-swiper-item>
                </nut-swiper>
            </div>
            <div style="width: 100vw;margin: 10px 0;">
                <div style="width: 100vw;overflow: auto;overflow-x: auto;white-space:nowrap;">
                    <div style="width: 50px; height: 50px;line-height: 50px; font-size: 10px; background-color: grey;margin: 0 10px; text-align: center; border-radius: 10px; display: inline-block;"
                        v-for="(item, index) in catelist" :key="index">{{
                            item.name }}</div>
                </div>
            </div>
            <div>

            </div>
        </body>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const list = ref([
    'https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg',
    'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg',
    'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg',
    'https://storage.360buyimg.com/jdc-article/fristfabu.jpg'
])

const catelist = [
    { name: '热门分类', icon: '' },
    { name: '热门分类', icon: '' },
    { name: '热门分类', icon: '' },
    { name: '热门分类', icon: '' },
    { name: '热门分类', icon: '' },
    { name: '热门分类', icon: '' },
    { name: '热门分类', icon: '' },
    { name: '热门分类', icon: '' },
    { name: '热门分类', icon: '' },
    { name: '热门分类', icon: '' },
    { name: '热门分类', icon: '' },
    { name: '热门分类', icon: '' },
]
</script>