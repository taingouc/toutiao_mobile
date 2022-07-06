<template>
  <!-- 主页搜索模块--搜索建议 -->
  <div class="search-suggestions">
    <van-cell :title="sug" icon="search" v-for="(sug, index) in suggestions" :key="index"></van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/user'
export default {
  name: 'SearchSuggestions',
  data() {
    return {
      suggestions: []
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  methods: {
    // 获取联想建议
    async loadSearchSuggestions() {
      try {
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('获取数据失败，请稍后重试')
      }
    }
  },
  watch: {
    // 监听searchText变化，一变化触发handler函数发起请求获取当前搜索文字的联想建议
    searchText: {
      handler() {
        // 调用封装的方法发起请求
        this.loadSearchSuggestions()
      },
      // immediate让组件被渲染出来，在侦听开始之前立即调用
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped></style>
