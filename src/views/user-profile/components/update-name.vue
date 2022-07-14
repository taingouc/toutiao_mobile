<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar title="编辑昵称" z-index left-text="取消" right-text="完成" @click-left="$emit('close')" @click-right="onConfirm"> </van-nav-bar>
    <div class="field-wrap">
      <van-field v-model.trim="localName" rows="2" autosize type="textarea" maxlength="11" placeholder="请输入昵称" show-word-limit />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
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
  },
  methods: {
    async onConfirm() {
      // loading效果
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 背景禁止点击
        duration: 0 // 持续展示
      })
      try {
        const localName = this.localName
        if (!localName.length) {
          this.$toast('昵称不能为空')
          return
        }
        await updateUserProfile({
          name: localName
        })
        // 更新视图
        this.$emit('input', localName)
        // 关闭弹层
        this.$emit('close')
        // 提示消息
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('修改失败，请重试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.field-wrap {
  padding: 20px;
}
</style>
