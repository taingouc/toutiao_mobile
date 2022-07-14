<template>
  <div class="update-sex">
    <van-picker show-toolbar title="性别" :columns="columns" @confirm="onConfirm" @cancel="$emit('close')" :default-index="value" @change="onPickerChange" />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateSex',
  data() {
    return {
      columns: ['男', '女'],
      sexIndex: this.value
    }
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  methods: {
    async onConfirm(value) {
      const localSex = this.sexIndex
      // loading效果
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 背景禁止点击
        duration: 0 // 持续展示
      })
      try {
        await updateUserProfile({
          gender: localSex
        })
        // 更新视图
        this.$emit('input', localSex)
        // 关闭弹层
        this.$emit('close')
        // 提示消息
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('修改失败，请重试')
      }
    },
    onPickerChange(picker, value, index) {
      this.sexIndex = index
    }
  }
}
</script>

<style lang="less" scoped></style>
