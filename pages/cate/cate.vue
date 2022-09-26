<template>
	<view class="scroll-view-container">
		<scroll-view class="left-scroll-view" scroll-y :style="{height : wh + 'px'}">
			<block v-for="(item,i) in cateList" :key="i">
				<view :class="['left-scroll-view-item',i=== active ? 'active':'']" @click="activeChanged(i)">
					{{item.cat_name}}
				</view>
			</block>
		</scroll-view>
		<scroll-view class="right-scroll-view" scroll-y :style="{height : wh + 'px'}" :scroll-top="scrollTop">
			<view class="cate-lv2" v-for="(item,i) in cateLevel2" :key="i">
				<view class="cate-lv2-title">{{item.cat_name}}</view>
				<!-- 动态渲染三级分类的列表数据 -->
				<view class="cate-lv3-list">
					<!-- 三级分类 Item 项 -->
					<view class="cate-lv3-item" v-for="(items, i3) in item.children" :key="i3"
						@click="gotoGoodsList(items)">
						<!-- 图片 -->
						<image :src="items.cat_icon"></image>
						<!-- 文本 -->
						<text>{{items.cat_name}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				wh: null,
				cateList: [],
				active: 0,
				cateLevel2: [],
				// 滚动条距离顶部的距离
				scrollTop: 0
			};
		},
		created() {
			// 获取当前系统的信息
			const sysInfo = uni.getSystemInfoSync()
			// 为 wh 窗口可用高度动态赋值
			this.wh = sysInfo.windowHeight
			this.getcateList()
		},
		methods: {
			async getcateList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/categories')
				if (res.meta.status !== 200) return uni.$showMessage()
				this.cateList = res.message
				this.cateLevel2 = res.message[0].children
			},
			activeChanged(i) {
				this.active = i
				this.cateLevel2 = this.cateList[i].children
				this.scrolltop = scrolltop === 0 ? 1 : 0
			},
			gotoGoodsList(item) {
				uni.navigateTo({
					url: '/subpkg/good_list/good_list?cid=' + item.cat_id
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.left-scroll-view {

			width: 120px;

			.left-scroll-view-item {
				line-height: 60px;
				background-color: #f7f7f7;
				text-align: center;
				font-size: 12px;

				// 激活项的样式
				&.active {
					background-color: #ffffff;
					position: relative;

					// 渲染激活项左侧的红色指示边线
					&::before {
						content: ' ';
						display: block;
						width: 3px;
						height: 30px;
						background-color: #c00000;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}
		}

		.cate-lv2-title {
			font-size: 12px;
			font-weight: bold;
			text-align: center;
			padding: 15px 0;
		}

		.cate-lv3-list {
			display: flex;
			flex-wrap: wrap;

			.cate-lv3-item {
				width: 33.33%;
				margin-bottom: 10px;
				display: flex;
				flex-direction: column;
				align-items: center;

				image {
					width: 60px;
					height: 60px;
				}

				text {
					font-size: 12px;
				}
			}
		}
	}
</style>
