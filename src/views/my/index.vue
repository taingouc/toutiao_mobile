<template>
  <div class="my_container">
    <!-- 用户登录后展示 -->
    <div v-if="user" class="header user-info">
      <!-- 上：用户信息区域 -->
      <div class="base-info">
        <!-- 左侧区域 -->
        <div class="left">
          <!-- 用户头像--vant图片组件 -->
          <van-image class="avater" round fit="cover" :src="userInfo.photo" />
          <!-- 用户昵称 -->
          <div class="info">
            <span>小柯 kebig</span>
            <span>前端开发工程师</span>
          </div>
        </div>
        <!-- 右侧区域 -->
        <div class="right">
          <!-- 编辑用户资料 -->
          <van-button size="mini" round>编辑资料</van-button>
        </div>
      </div>
      <!-- 下：用户关注粉丝区域 -->
      <div class="data-stats">
        <div class="data-item"><span class="count">86</span><span class="text">头条</span></div>
        <div class="data-item"><span class="count">45</span><span class="text">关注</span></div>
        <div class="data-item"><span class="count">1.4w</span><span class="text">粉丝</span></div>
        <div class="data-item"><span class="count">13w</span><span class="text">获赞</span></div>
      </div>
    </div>
    <!-- 未登录时展示 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img src="@/assets/mobile.png" alt="" />
        <span>登录 / 注册</span>
      </div>
    </div>
    <!-- 导航 clickable点击反馈-->
    <van-grid :column-num="2" class="grid-nav" clickable>
      <!-- 收藏导航 -->
      <van-grid-item class="grid-item">
        <!-- 图标 -->
        <svg class="icon shoucang" aria-hidden="true" slot="icon">
          <use xlink:href="#icon-shoucang"></use>
        </svg>
        <!-- 文字 -->
        <span slot="text">收藏</span>
      </van-grid-item>
      <!-- 历史导航 -->
      <van-grid-item class="grid-item">
        <!-- 图标 -->
        <svg class="icon lishi" aria-hidden="true" slot="icon">
          <use xlink:href="#icon-lishi"></use>
        </svg>
        <!-- 文字 -->
        <span slot="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- 功能模块单元格 -->
    <van-cell class="info_notice" title="消息通知" is-link clickable />
    <van-cell title="小智同学" is-link clickable />
    <van-cell v-if="user" class="logout-cell" title="退出登录" clickable @click="onlogout" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'MyIndex',
  data() {
    return {
      userInfo: {}
    }
  },
  methods: {
    // 退出登录功能
    onlogout() {
      // 1.点击退出，退出确认提示，用到Dialog 弹出框组件
      this.$dialog
        .confirm({
          title: '确认退出吗？'
        })
        .then(() => {
          // 2.确认退出，清除登录状态（清除本地token以及user中的token）
          // 调用mutations中的setUse方法，传参null覆盖user中的token及本地token
          this.$store.commit('setUser', null)
        })
        .catch((err) => {
          // 取消执行这里
          return err
        })
    },
    // 用户登录，获取用户信息
    async loadUserInfo() {
      try {
        const { data } = await getUserInfo()
        // 获取用户信息成功，放到userInfo中
        this.userInfo = data.data
      } catch (err) {
        // 失败提示错误消息
        this.$toast('获取数据失败,请稍后重试！')
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    // 获取登录用户的信息
    // 通过this.user判断用户是否登录
    if (this.user) {
      // 用户登录，加载用户信息数据，调用methods中封装的loadUserInfo方法
      this.loadUserInfo()
    }
  }
}
</script>

<style lang="less" scoped>
.my_container {
  .header {
    height: 361px;
    background: url('@/assets/banner.png');
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      span {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avater {
          width: 132px;
          height: 132px;
          margin-right: 23px;
          border: 4px solid white;
        }
        .info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          span {
            font-size: 30px;
            color: #fff;
            margin-bottom: 5px;
          }
        }
      }
    }
    .data-stats {
      height: 130px;
      display: flex;
      .data-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      svg.icon {
        font-size: 50px;
      }
      .shoucang {
        fill: #eb5253;
      }
      .lishi {
        fill: #ff9d1d;
      }
      span {
        font-size: 28px;
      }
    }
  }
  .logout-cell {
    color: #eb5253;
    text-align: center;
    margin-top: 14px;
  }
  .info_notice {
    margin-top: 14px;
  }
}
</style>
