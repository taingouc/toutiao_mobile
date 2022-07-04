<template>
  <!-- 使用vant组件库中cell单元格组件构建文章item结构 -->
  <van-cell-group class="article-item">
    <van-cell>
      <!-- 通过插槽自定义组件内容 -->
      <!-- 自定义左侧 title 的内容 vant内置样式van-multi-ellipsis--l2 最多显示两行 -->
      <div slot="title" class="title van-multi-ellipsis--l2">{{ article.title }}</div>
      <!-- 自定义标题下方 label 的内容 -->
      <div slot="label">
        <!-- 底部label中3张封面的容器 -->
        <div class="cover-wrap" v-if="article.cover.type === 3">
          <div v-for="(img, index) in article.cover.images" :key="index" class="cover-item">
            <van-image :src="img" fit="cover" class="cover-item-img"></van-image>
          </div>
        </div>
        <!-- 底部label信息栏 -->
        <div class="label-info-wrap van-ellipsis" :class="[article.cover.type === 1 ? 'label-absolute' : '']">
          <span>{{ article.aut_name }}</span>
          <span>{{ article.comm_count }}评论</span>
          <span>{{ article.pubdate }}</span>
        </div>
      </div>
      <!-- 自定义右侧 value 的内容 vant中image组件-->
      <!-- 单张封面的图片 -->
      <van-image v-if="article.cover.type === 1" slot="default" :src="article.cover.images[0]" class="right-img" fit="cover" />
    </van-cell>
  </van-cell-group>
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    article: {
      // 必须传递文章项数据
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }
  .right-img {
    width: 232px;
    height: 146px;
  }
  .label-info-wrap {
    span {
      font-size: 22px;
      color: #b4b4b4;
      margin-right: 25px;
    }
  }
  .cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
.label-absolute {
  position: absolute;
  bottom: 15px;
  width: 429px;
  overflow: hidden;
}
</style>
