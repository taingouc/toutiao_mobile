<template>
  <van-button :loading="Loading" v-if="isFollowed" round size="small" @click="onFollow">已关注</van-button>
  <van-button :loading="Loading" v-else type="info" color="#3296fa" round size="small" icon="plus" @click="onFollow">关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'FollowUser',
  data() {
    return {
      Loading: false // 关注按钮loading效果
    }
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    articleArtId: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    // 关注按钮点击
    async onFollow() {
      // 开启关注按钮loading状态
      this.Loading = true
      try {
        if (this.isFollowed) {
          // 点击取消关注
          await deleteFollow(this.articleArtId)
        } else {
          // 点击关注
          await addFollow(this.articleArtId)
        }
        // 关闭关注按钮loading状态
        this.Loading = false
        // 修改状态，重新渲染页面
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (err) {
        // 不允许关注自己
        if (err.response && err.response.status === 400) {
          this.$toast('你不能关注自己')
        }
        this.$toast('操作失败，请重试')
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
