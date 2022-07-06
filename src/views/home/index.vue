<template>
  <div class="home_container">
    <!-- NavBar 导航栏 fixed固定定位-->
    <van-nav-bar class="page-nav-bar" fixed>
      <!-- 搜索按钮 -->
      <van-button type="default" class="search-btn" round slot="title" size="small" to="/search">
        <!-- slot插槽--搜索图标 -->
        <svg class="icon" aria-hidden="true" slot="icon">
          <use xlink:href="#icon-sousuo"></use>
        </svg>
        搜索
      </van-button>
    </van-nav-bar>
    <!-- Tab标签页--频道列表 -->
    <!-- 通过 v-model 绑定当前激活标签对应的索引值，active为0启用第一个标签 -->
    <!-- 通过 animated 属性可以开启切换标签内容时的转场动画。 -->
    <!-- 通过 swipeable 属性可以开启滑动切换标签页。 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable swipe-threshold="3">
      <!-- 频道 -->
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- 文章列表组件 -->
        <article-list :channel="item"></article-list>
      </van-tab>
      <!-- 这个div没有实际性作用，充当占位符 -->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 右侧更多按钮 -->
      <div slot="nav-right" class="hamburger-btn" @click="popupShow = true">
        <!-- 更多字体图标 -->
        <svg class="icon" aria-hidden="true" slot="icon">
          <use xlink:href="#icon-gengduo"></use>
        </svg>
      </div>
    </van-tabs>
    <!-- 频道编辑弹出层 popup组件 -->
    <van-popup v-model="popupShow" closeable close-icon-position="top-left" position="bottom" :style="{ height: '100%' }" @click-close-icon="change">
      <channel-edit ref="changEdit" :MyChannels="channels" :activeIndex="active" @update-active="onUpdateActive"></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from '@/views/home/components/article-list.vue'
import ChannelEdit from '@/views/home/components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  data() {
    return {
      active: 0,
      channels: [], // 频道列表数据
      popupShow: false // 控制频道弹出层是否弹出
    }
  },
  methods: {
    // 封装获取用户频道列表方法
    async loadChannels() {
      // 1.如果用户已登录
      if (this.user) {
        try {
          const { data } = await getUserChannels()
          // 发起请求获取频道列表数据，存储到data数据中
          this.channels = data.data.channels
        } catch (err) {
          //  请求失败，捕获错误，提示信息
          this.$toast('获取频道列表失败')
        }
      } else {
        // 2.用户未登录，判断是否有本地存储
        const localChannels = getItem('TOUTIAO_CHANNELS')
        if (localChannels) {
          // 有本地存储
          this.channels = localChannels
        } else {
          // 无本地存储，请求获取默认频道列表
          const { data } = await getUserChannels()
          this.channels = data.data.channels
        }
      }
    },
    // 获取子组件传过来的index,修改active值
    onUpdateActive(index, flag) {
      this.active = index
      // 通过flag判断是否关闭频道弹出层
      if (flag) {
        // 关闭频道弹出层
        this.popupShow = false
      }
    },
    // 让子组件中编辑状态关闭
    change() {
      this.$refs.changEdit.isEdit = false
      this.$refs.changEdit.isDisabled = false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    // 调用loadChannels()方法，获取频道列表
    this.loadChannels()
  },
  components: { 'article-list': ArticleList, 'channel-edit': ChannelEdit }
}
</script>

<style lang="less" scoped>
.home_container {
  padding-top: 176px;
  .page-nav-bar {
    .search-btn {
      width: 555px;
      height: 64px;
      background-color: #5babfb;
      color: #fff;
      border: none;
      font-size: 28px;
      svg.icon {
        font-size: 32px;
      }
    }
    /deep/.van-nav-bar__title {
      max-width: unset !important;
    }
  }
  .channel-tabs {
    /deep/.van-tabs__wrap {
      height: 82px;
      position: fixed;
      top: 92px;
      z-index: 2;
      left: 0;
      right: 0;
    }

    /deep/.van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      line-height: unset;
    }
    /deep/.van-tab--active {
      color: #333;
    }
    /deep/.van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      margin-bottom: 8px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      width: 66px;
      height: 82px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      opacity: 0.9;
      svg.icon {
        font-size: 33px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0px;
        width: 3px;
        height: 100%;
        background-image: url('@/assets/gradient-gray-line.png');
        background-size: contain;
      }
    }
    .placeholder {
      flex-shrink: 0;
      width: 33px;
      height: 82px;
    }
  }
}
</style>
