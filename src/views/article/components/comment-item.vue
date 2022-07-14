<template>
  <van-cell class="comment-item">
    <van-image slot="icon" class="avatar" round fit="cover" :src="commentItem.aut_photo" />
    <div slot="title" class="title-wrap">
      <div class="user-name">{{ commentItem.aut_name }}</div>
      <van-button class="like-btn" :loading="commentLoading" :class="{ liked: commentItem.is_liking }" :icon="commentItem.is_liking ? 'good-job' : 'good-job-o'" @click="onCommentLike(commentItem)">{{ commentItem.like_count || '赞' }}</van-button>
    </div>
    <div slot="label">
      <p class="comment-content">{{ commentItem.content }}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{ commentItem.pubdate | relativeTime }}</span>
        <van-button class="reply-btn" round @click="$emit('click-reply', commentItem)">回复 {{ commentItem.reply_count }}</van-button>
      </div>
    </div>
  </van-cell>
</template>

<script>
import { deleteCommentLike, addCommentLike } from '@/api/user'
export default {
  name: 'CommentItem',
  props: {
    commentItem: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      commentLoading: false
    }
  },
  methods: {
    async onCommentLike(comment) {
      this.commentLoading = true
      try {
        // 如果已经赞了则取消点赞
        if (comment.is_liking) {
          await deleteCommentLike(comment.com_id)
          comment.like_count--
        } else {
          // 如果没有赞，则点赞
          await addCommentLike(comment.com_id)
          comment.like_count++
        }
        // 提示消息
        this.$toast.success(!comment.is_liking ? '点赞成功' : '取消点赞')
        // 更新视图状态
        this.$emit('is_likings', !comment.is_liking)
      } catch (err) {
        this.$toast.fail('操作失败，请重试')
      }
      this.commentLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
  }
}
.liked {
  color: #e5645f;
}
.van-button--normal {
  padding: unset;
}
</style>
