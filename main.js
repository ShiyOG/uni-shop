// #ifndef VUE3
import Vue from 'vue'
import App from './App'

import {
	$http
} from '@escook/request-miniprogram'
Vue.config.productionTip = false
uni.$http = $http
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
// 请求开始之前做一些事情
$http.beforeRequest = options => uni.showLoading({
	title: '数据加载中...',
})

//响应拦截器
// 请求完成之后做一些事情
$http.afterRequest = () => uni.hideLoading()

uni.$showMessage = (title = '数据请求失败！', duration = 1500) => {
	uni.showToast({
		title,
		duration,
		icon: 'none',
	})
}

App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
