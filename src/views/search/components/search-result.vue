<template>
  <!-- 主页搜索模块--搜索结果 -->
  <div class="search-results">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" :success-text="freshText" success-duration="1000">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error" error-text="数据加载失败，请稍后重试">
        <van-cell v-for="item in searchResultsList" :key="item.art_id" :title="item.title" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/user'
export default {
  name: 'SearchResult',
  data() {
    return {
      searchResultsList: [],
      error: false,
      loading: false,
      finished: false,
      refreshing: false,
      page: 1, // 请求搜索结果的页码
      per_page: 20, // 每页返回的数据条数
      freshText: '刷新成功'
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  methods: {
    // 滚动到底部时，会触发 onLoad 事件并将 loading 自动设置成 true
    async onLoad() {
      // 搜索内容为空 return出去 关闭loading效果
      if (!this.searchText) {
        this.loading = false
        return
      }
      // 1.请求获取数据
      try {
        const { data } = await getSearchResult({
          page: this.page, // 请求页码
          per_page: this.per_page, // 每页返回的数据条数
          q: this.searchText // 查询关键字
        })
        // 制造错误，便于调试
        // if (Math.random() > 0.5) {
        //   JSON.parse('timeout')
        // }
        // 2.将数据添加进数组列表中
        const { results } = data.data
        this.searchResultsList.push(...results)
        // 3.关闭loading效果
        this.loading = false
        // 4.判断请求的数据是否全部加载完成
        if (results.length) {
          // 未加载完毕，页码加一
          this.page++
        } else {
          // 数据已全部加载完毕，则直接将 finished 设置成 true
          this.finished = true
        }
      } catch (err) {
        // 请求失败提示错误消息
        this.error = true
        // 关闭loading效果
        this.loading = false
      }
    },
    // 下拉刷新时会触发 onRefresh 事件
    async onRefresh() {
      // 1.请求获取数据
      try {
        const { data } = await getSearchResult({
          page: this.page++, // 请求页码
          per_page: this.per_page, // 每页返回的数据条数
          q: this.searchText // 查询关键字
        })
        // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('timeout')
        // }
        // 2.请求成功将数据追加到列表的顶部
        const { results } = data.data
        this.searchResultsList.unshift(...results)
        // 3.关闭下拉刷新的展示状态
        this.refreshing = false
        // 4.提示成功信息，在标签内通过 success-text 可以设置刷新成功后的顶部提示文案，success-duration设置刷新成功提示展示时长(ms)
      } catch (err) {
        // 请求失败，结束下拉刷新的展示状态
        this.refreshing = false
        // 顶部提示失败信息
        this.freshText = '刷新失败,请稍后重试'
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
