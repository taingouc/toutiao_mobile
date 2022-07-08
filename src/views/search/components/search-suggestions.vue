<template>
  <!-- 主页搜索模块--搜索建议 -->
  <div class="search-suggestions">
    <van-cell icon="search" v-for="(text, index) in suggestions" :key="index" @click="$emit('search', text)">
      <!-- 插槽自定义title文本 -->
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/user'
import { debounce } from 'lodash'
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
    },
    // 搜索建议文本高亮显示,字符串replace方法去替换
    highlight(text) {
      if (text) {
        const highlight = `<span style="color:#3296fa">${this.searchText}</span>`
        // 正则表达式//中间的内容都会当做匹配字符来使用，而不是数据变量
        // 如果需要根据数据变量动态创建正则表达式，则手动new RegExp正则表达式构造函数
        // new RegExp(匹配模式字符串，匹配模式)
        const reg = new RegExp(this.searchText, 'gi')
        return text.replace(reg, highlight)
      }
      return text
    }
  },
  watch: {
    // 监听searchText变化，一变化触发handler函数发起请求获取当前搜索文字的联想建议
    searchText: {
      // 使用lodash中debounce函数，防抖，输入停下来一秒才会触发
      handler: debounce(function () {
        //   // 调用封装的方法发起请求
        this.loadSearchSuggestions()
      }, 1000),
      // immediate让组件被渲染出来，在侦听开始之前立即调用
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped></style>
