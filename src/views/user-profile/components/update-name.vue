<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar title="编辑昵称" z-index left-text="取消" right-text="完成" @click-left="$emit('close')"> </van-nav-bar>
    <div class="field-wrap">
      <van-field v-model="localName" rows="2" autosize type="textarea" maxlength="11" placeholder="请输入昵称" show-word-limit />
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpdateName',
  data() {
    return {
      localName: this.value
    }
  },
  props: {
    value: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.field-wrap {
  padding: 20px;
}
</style>
