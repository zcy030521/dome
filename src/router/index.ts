import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import list from '../lxkcomponents/list.vue';
import Review from '../lxkcomponents/Review.vue';
import Victory from '../lxkcomponents/Victory.vue';
import ShowReview from '../lxkcomponents/ShowReview.vue';
import Money from '../lxkcomponents/Money.vue';
import Recommend from '../lxkcomponents/Recommend.vue';
import Feedback from '../lxkcomponents/Feedback.vue';
import Service from '../lxkcomponents/Service.vue';
import Setting from '../lxkcomponents/Setting.vue';
import AI from '../lxkcomponents/AI.vue';
const routes:Array<RouteRecordRaw> =[
	{
		path:'/',
		name:'List',
		component:list
	},
	{
		path:'/review',
		name:'Review',
		component:Review
	},
	{
		path:'/victory',
		name:'Victory',
		component:Victory
	},
	{
		path:'/showreview',
		name:'ShowReview',
		component:ShowReview
	},
	{
		path:'/money',
		name:'Money',
		component:Money
	},
	{
		path:'/recommend',
		name:'Recommend',
		component:Recommend
	},
	{
		path:'/feedback',
		name:'Feedback',
		component:Feedback
	},
	{
		path:'/service',
		name:'Service',
		component:Service
	},
	{
		path:'/setting',
		name:'Setting',
		component:Setting
	},
	{
        path:'/ai',
        name:'AI',
        component:AI
    }
];

const router = createRouter({
	history:createWebHistory(),
	routes,
});

export default router
