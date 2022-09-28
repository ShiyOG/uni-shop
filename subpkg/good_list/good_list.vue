<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
				<my-goods :goods=" goods"></my-goods>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				// 请求参数对象
				queryObj: {
					// 查询关键词
					query: '',
					// 商品分类Id
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示多少条数据
					pagesize: 10
				},
				// 商品列表的数据
				goodsList: [],
				// 总数量，用来实现分页
				total: 0,
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
				// 是否正在请求数据
				isloading: false
			};
		},
		onLoad(options) {
			// console.log(options)
			// 将页面参数转存到 this.queryObj 对象中
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			this.getGoodsList()
		},
		methods: {
			async getGoodsList(cb) {
				this.isloading = true
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				this.isloading = false
				// 只要数据请求完毕，就立即按需调用 cb 回调函数
				cb && cb()
				if (res.meta.status !== 200) return uni.$showMsg()
				// 为数据赋值
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total

			},
			// 点击跳转到商品详情页面
			gotoDetail(item) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			}
		},
		// 触底的事件
		onReachBottom() {
			// 判断是否还有下一页数据
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMessage('数据加载完毕！')
			if (this.isloading) return
			// 让页码值自增 +1
			this.queryObj.pagenum += 1
			// 重新获取列表数据
			this.getGoodsList()
		},
		// 下拉刷新的事件
		onPullDownRefresh() {
			// 1. 重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isloading = false
			this.goodsList = []

			// 2. 重新发起请求
			this.getGoodsList(() => uni.stopPullDownRefresh())
		}

	}
</script>

<style lang="scss">

</style>
