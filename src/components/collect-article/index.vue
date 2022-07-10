<template>
  <van-button class="btn-border" :icon="value ? 'star' : 'star-o'" :class="{ colorIcon: value }" :loading="loading" @click="onCollect"></van-button>
</template>

<script>
// @ts-nocheck

import { addCollect, deleteCollect } from '@/api/user'
export default {
  name: 'CollectArticle',
  data() {
    return {
      loading: false
    }
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    async onCollect() {
      this.loading = true
      try {
        if (this.value) {
          // 取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 收藏
          await addCollect(this.articleId)
        }
        // 更新视图
        this.$emit('input', !this.value)
        // 提示消息
        this.$toast.success(this.value ? '取消收藏' : '收藏成功')
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
    color: #ffa500;
  }
}
.colorIcon {
  color: #ffa500;
}
</style>
