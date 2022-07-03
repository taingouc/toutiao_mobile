<template>
  <div class="layout_container">
    <!-- 子路由出口 -->
    <router-view></router-view>
    <!-- /子路由出口 -->
    <!-- 标签导航栏 -->
    <van-tabbar route>
      <!-- route开启路由模式 van-tabbar-item指定to属性去往路由hash地址，此时v-model绑定的active失效-->
      <van-tabbar-item to="/home">
        <!-- 图标插槽 -->
        <svg class="icon" aria-hidden="true" slot="icon">
          <use xlink:href="#icon-shouye"></use>
        </svg>
        首页
      </van-tabbar-item>
      <van-tabbar-item to="/qa">
        <!-- 图标插槽 -->
        <svg class="icon" aria-hidden="true" slot="icon">
          <use xlink:href="#icon-wenda"></use>
        </svg>
        问答
      </van-tabbar-item>
      <van-tabbar-item to="/video">
        <!-- 图标插槽 -->
        <svg class="icon" aria-hidden="true" slot="icon">
          <use xlink:href="#icon-shipin"></use>
        </svg>
        视频
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <!-- 图标插槽 -->
        <svg class="icon" aria-hidden="true" slot="icon">
          <use xlink:href="#icon-wode"></use>
        </svg>
        {{ $store.state.user ? '我的' : '未登录' }}
      </van-tabbar-item>
    </van-tabbar>
    <!-- /标签导航栏 -->
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped></style>
