<template>
  <!-- 顶部搜索压面 -->
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/">
      <van-search v-model="searchText" show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel" background="#3296fa" shape="round" @focus="isResultShow = false" />
    </form>
    <!-- 搜索结果组件 -->
    <search-result v-if="isResultShow"></search-result>
    <!-- 联想建议组件 -->
    <search-suggestions v-else-if="searchText" :searchText="searchText"></search-suggestions>
    <!-- 搜索历史组件 -->
    <search-history v-else></search-history>
  </div>
</template>

<script>
import SearchHistory from '@/views/search/components/search-history.vue'
import SearchSuggestions from '@/views/search/components/search-suggestions.vue'
import SearchResult from '@/views/search/components/search-result.vue'
export default {
  name: 'SearchIndex',
  data() {
    return {
      // 搜索框内容
      searchText: '',
      // 控制搜索结果组件是否展示
      isResultShow: false
    }
  },
  methods: {
    onSearch(val) {
      this.isResultShow = true
    },
    // 点击取消返回
    onCancel() {
      this.$router.back()
    }
  },
  components: { 'search-history': SearchHistory, 'search-suggestions': SearchSuggestions, 'search-result': SearchResult }
}
</script>

<style lang="less" scoped>
.search-container {
  .van-search__action {
    color: #fff;
  }
}
</style>
