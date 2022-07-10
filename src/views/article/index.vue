<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="文章详情" @click-left="$router.back()"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo" />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>
          <follow-user class="follow-btn" :articleArtId="article.aut_id" v-model="article.is_followed"></follow-user>
          <!-- <van-button :loading="followLoading" v-if="article.is_followed" class="follow-btn" round size="small" @click="onFollow">已关注</van-button>
          <van-button :loading="followLoading" v-else class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus" @click="onFollow">关注</van-button> -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content markdown-body" v-html="article.content" ref="article-content"></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表 -->
        <comment-list ref="commentList" :articleId="article.art_id" @onload-success="total_count = $event.total_count"></comment-list>
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small" @click="isPostShow = true">写评论</van-button>
          <van-icon name="comment-o" :badge="total_count" color="#777" />
          <collect-article v-model="article.is_collected" :articleId="article.art_id"></collect-article>
          <like-article v-model="article.attitude" :articleId="article.art_id"></like-article>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 发布评论弹出层 -->
        <van-popup v-model="isPostShow" position="bottom" :style="{ height: '20%' }">
          <comment-post :target="article.art_id" @post-success="onPostSuccess"></comment-post>
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errorStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import './markdown-body.css'
import { getArticleById } from '@/api/user'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/followUser/index.vue'
import CollectArticle from '@/components/collect-article/index.vue'
import LikeArticle from '@/components/like-article/index.vue'
import CommentList from '@/views/article/components/comment-list.vue'
import CommentPost from '@/views/article/components/comment-post.vue'
export default {
  name: 'ArticleIndex',
  data() {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中的loading状态
      errorStatus: 0, // 发生错误状态
      total_count: 0, // 把文章评论的总数量
      isPostShow: false // 控制评论弹出层是否显示
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    // 获取文章信息
    async loadArticle() {
      // 展示loading加载中
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        // if (Math.random() > 0.5) {
        //   JSON.parse('timeout')
        // }
        this.article = data.data
        this.article.content = this.article.content.replace(/https:\/\/images.weserv.nl\/\?url=/g, '')
        // 数据更新驱动视图是异步产生的，直接打印this.$refs['article-content']为undefined
        // 使用定时器异步得到this.$refs['article-content']
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        this.loading = false
        // 404文章不存在或者已删除
        if (err.response.request.status === 404) {
          this.errorStatus = 404
        }
      }
      // 请求无论成功还是失败都要关闭loading
      this.loading = false
    },
    // 得到所有的img节点
    previewImage() {
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            images, // 预览的图片数组
            startPosition: index // 指定图片的初始位置（索引值）
          })
        }
      })
    },
    // 子组件自定义事件处理
    onPostSuccess(data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布评论显示到评论顶部
      this.$refs.commentList.list.unshift(data.new_obj)
    }
  },
  components: { 'follow-user': FollowUser, 'collect-article': CollectArticle, 'like-article': LikeArticle, 'comment-list': CommentList, 'comment-post': CommentPost },
  created() {
    this.loadArticle()
  }
}
</script>

<style scoped lang="less">
.main-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 92px;
  bottom: 0;
  overflow-y: scroll;
  background-color: #fff;
}
.article-detail {
  padding-bottom: 88px;
  .article-title {
    font-size: 40px;
    padding: 50px 32px;
    margin: 0;
    color: #3a3a3a;
  }

  .user-info {
    padding: 0 32px;
    .avatar {
      width: 70px;
      height: 70px;
      margin-right: 17px;
    }
    .van-cell__label {
      margin-top: 0;
    }
    .user-name {
      font-size: 24px;
      color: #3a3a3a;
    }
    .publish-date {
      font-size: 23px;
      color: #b7b7b7;
    }
    .follow-btn {
      width: 170px;
      height: 58px;
    }
  }

  .article-content {
    padding: 55px 32px;
    /deep/ p {
      text-align: justify;
    }
  }
}

.loading-wrap {
  padding: 200px 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.error-wrap {
  padding: 200px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  .van-icon {
    font-size: 122px;
    color: #b4b4b4;
  }
  .text {
    font-size: 30px;
    color: #666666;
    margin: 33px 0 46px;
  }
  .retry-btn {
    width: 280px;
    height: 70px;
    line-height: 70px;
    border: 1px solid #c3c3c3;
    font-size: 30px;
    color: #666666;
  }
}

.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 88px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 282px;
    height: 46px;
    border: 2px solid #eeeeee;
    font-size: 30px;
    line-height: 46px;
    color: #a7a7a7;
  }
  /deep/.van-icon {
    font-size: 40px;
    .van-info {
      font-size: 16px;
      background-color: #e22829;
    }
  }
}
</style>
