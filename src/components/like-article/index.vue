<template>
  <van-button class="btn-border" :icon="value === 1 ? 'good-job' : 'good-job-o'" :class="{ liked: value }" :loading="loading" @click="onLike"></van-button>
</template>

<script>
import { addLike, deleteLike } from '@/api/user'
export default {
  name: 'LikeIndex',
  data() {
    return {
      loading: false
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    },
    value: {
      type: [Boolean, Number],
      required: true
    }
  },
  methods: {
    //  点赞功能
    async onLike() {
      this.loading = true
      try {
        if (this.value === 1) {
          // 取消点赞
          await deleteLike(this.articleId)
          // 视图渲染
          this.$emit('input', -1)
        } else {
          // 点赞
          await addLike(this.articleId)
          // 视图渲染
          this.$emit('input', 1)
        }
        this.$toast.success(this.value === 1 ? '取消点赞' : '点赞成功')
      } catch (err) {
        this.$toast.fail('操作失败，请重试')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.btn-border {
  border: none;
  padding: 0 10px;
  box-sizing: border-box;
  .van-icon {
    color: #e5645f;
  }
}
.liked {
  color: #e5645f;
}
</style>
