<template>
  <div>
    <h1>黑马头条</h1>
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-dianzan"></use>
    </svg>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less" scoped></style>
