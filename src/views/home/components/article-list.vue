<template>
  <div class="article-list">
    <!--van-pull-refresh下拉刷新组件 在事件的回调函数中可以进行同步或异步操作，操作完成后将 v-model 设置为 false，表示加载完成。 -->
    <van-pull-refresh v-model="freshLoading" @refresh="onRefresh" :success-text="freshText" success-duration="1000">
      <!-- vant组件库中list组件 渲染文章列表-->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error" error-text="请求失败，点击重新加载">
        <article-item v-for="(item, index) in list" :key="index" :article="item"></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/user'
import ArticleItem from '@/components/article-item/index.vue'
export default {
  name: 'ArticleList',
  data() {
    return {
      list: [], // 存储列表数据
      loading: false, // 控制滚动加载中效果展示，初始化或滚动到页面底部时，自动设置为true
      finished: false, // 控制数据加载结束时的状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表加载失败时的提示状态
      freshLoading: false, // 控制下拉刷新的效果展示，下拉式自动设置为true
      freshText: '刷新成功' // 下拉刷新完毕的提示文本
    }
  },
  props: ['channel'],
  methods: {
    // 初始化或滚动到页面底部时会触发onload事件
    async onLoad() {
      // 1.请求获取数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: this.timestamp || Date.now(), // 请求数据的时间戳，初始化时timestamp为空，发送当前时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，值为0不包含或1包含
        })
        // 2.请求成功，将拿到的数据添加进list数组中，而不是覆盖(导航栏切换，历史数据不会清除)
        const { results } = data.data
        // ...数组展开运算符，会把数组中的每一个数据展开
        this.list.push(...results)
        // 3.本次数据加载后，因为组件自动将loading设置为了true，无法再次加载，所以必须修改为false
        this.loading = false
        // 4.判断数据是否全部加载完成
        if (results.length) {
          // 下拉刷新发起请求，有新的数据，更新获取下一页的时间戳,下一次发起请求则得到不同于之前的数据
          this.timestamp = data.data.pre_timestamp
        } else {
          // 不断刷新后，没有请求到新的数据，将finished设置为true,禁止加载更多
          this.finished = true
        }
      } catch (err) {
        // 列表数据加载失败，将 error 设置成 true 即可显示错误提示，用户点击错误提示后会重新触发 load 事件。
        this.error = true
        // 错误后关闭loading效果
        this.loading = false
      }
    },
    // 下拉刷新时会触发 refresh 事件
    async onRefresh() {
      // 1.请求获取数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: Date.now(), // 请求数据的时间戳，发送当前时间戳,请求最新数据
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，值为0不包含或1包含
        })
        // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('timeout')
        // }
        // 2.请求成功将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...results)
        // 3.关闭下拉刷新的展示状态
        this.freshLoading = false
        // 4.提示成功信息，在标签内通过 success-text 可以设置刷新成功后的顶部提示文案，success-duration设置刷新成功提示展示时长(ms)
      } catch (err) {
        // 请求失败，结束下拉刷新的展示状态
        this.freshLoading = false
        // 顶部提示失败信息
        this.freshText = '刷新失败,请稍后重试'
      }
    }
  },
  components: { 'article-item': ArticleItem }
}
</script>

<style lang="less" scoped>
.article-list {
  padding-bottom: 100px;
  // 设置固定高度，让每一个标签内容文章列表产生自己的滚动容器，这样标签切换滚动位置不会相互影响
  height: 79vh; // vh视口单位：1vh=可视窗口高度的1%
  // 设置溢出滚动
  overflow-y: auto;
}
</style>
