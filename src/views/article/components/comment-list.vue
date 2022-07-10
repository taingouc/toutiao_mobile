<template>
  <div>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error" error-text="请求失败，点击重新加载">
      <comment-item v-for="(item, index) in list" :key="index" :commentItem="item" @is_likings="item.is_liking = $event" @click-reply="showReply"></comment-item>
    </van-list>
    <!-- 评论回复弹出层 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 50%">
      <comment-reply v-if="isReplyShow" :comment="currentComment" @click-close="isReplyShow = false"></comment-reply>
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import { getComment } from '@/api/user'
import CommentItem from '@/views/article/components/comment-item'
import CommentReply from '@/views/article/components/comment-reply.vue'
export default {
  name: 'CommentList',
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记
      error: false,
      isReplyShow: false, // 回复弹层的显示状态
      currentComment: {} // 点击回复的那个评论对象
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    async onLoad() {
      // 请求获取文章评论列表数据
      try {
        const { data } = await getComment({
          type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.articleId, // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: 10 // 每页大小
        })
        // if (Math.random() > 0.5) {
        //   JSON.parse('timeout')
        // }
        const { results } = data.data
        this.list.push(...results)
        // 把文章评论的总数量传到父组件中
        this.$emit('onload-success', data.data)
        if (results.length) {
          // 数据还未全部加载
          this.offset = data.data.last_id
        } else {
          // 数据全部加载完成
          this.finished = true
        }
      } catch (err) {
        // 发生错误，点击重试
        this.error = true
      }
      // 加载状态结束
      this.loading = false
    },
    showReply(val) {
      // 将子组件中传给我评论对象存储到当前组件
      this.currentComment = val
      // 展示评论回复弹层
      this.isReplyShow = true
    }
  },
  components: { 'comment-item': CommentItem, 'comment-reply': CommentReply },
  created() {
    this.onLoad()
  }
}
</script>

<style lang="less" scoped></style>
