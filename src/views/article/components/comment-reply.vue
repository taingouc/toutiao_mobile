<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon slot="left" name="cross" @click="$emit('click-close')" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 当前评论 -->
    <van-cell title="当前评论">
      <van-image slot="icon" round width="30" height="30" style="margin-right: 10px" :src="comment.aut_photo" />
      <span style="color: #466b9d" slot="title">{{ comment.aut_name }}</span>
      <div slot="label">
        <p style="color: #363636">{{ comment.content }}</p>
        <p>
          <span style="margin-right: 10px">{{ comment.pubdate | relativeTime }}</span>
          <van-button size="mini" type="default">回复 {{ comment.reply_count }}</van-button>
        </p>
      </div>
      <van-icon slot="right-icon" />
    </van-cell>
    <!-- /当前评论 -->

    <van-cell title="所有回复" />

    <!-- 评论的回复列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <comment-item v-for="(comment, index) in list" :key="index" :commentItem="comment" />
    </van-list>
    <!-- /评论的回复列表 -->

    <!-- 底部 -->
    <!-- /底部 -->
  </div>
</template>

<script>
import CommentItem from '@/views/article/components/comment-item.vue'
import { getComment } from '@/api/user'
export default {
  name: 'CommentReply',
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 20
    }
  },
  props: {
    comment: {
      type: [Object],
      required: true
    }
  },
  methods: {
    async onLoad() {
      // 1. 请求获取数据
      const { data } = await getComment({
        type: 'c', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.comment.com_id.toString(), // 源id，文章id或评论id
        offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
      })

      // 2. 将数据添加到列表中
      const { results } = data.data
      this.list.push(...results)

      // 3. 关闭 loading
      this.loading = false

      // 4. 判断数据是否加载完毕
      if (results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    }
  },
  components: { 'comment-item': CommentItem }
}
</script>

<style scoped lang="less"></style>
