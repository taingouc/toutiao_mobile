<template>
  <div class="update-birthday">
    <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" @cancel="$emit('close')" @confirm="onBirthday" :min-date="minDate" :max-date="maxDate" />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateBirthday',
  data() {
    return {
      minDate: new Date(1980, 0, 1),
      maxDate: new Date(2022, 7, 1),
      currentDate: new Date(this.value)
    }
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    async onBirthday(value) {
      const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
      // loading效果
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 背景禁止点击
        duration: 0 // 持续展示
      })
      try {
        await updateUserProfile({
          birthday: currentDate
        })
        // 更新视图
        this.$emit('input', currentDate)
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

<style lang="less" scoped></style>
