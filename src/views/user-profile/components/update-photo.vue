<template>
  <div class="update-photo">
    <img class="img" :src="img" ref="img" />
    <div class="bottom-navbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'
export default {
  name: 'UpdatePhoto',
  data() {
    return {
      cropper: null
    }
  },
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  methods: {
    onConfirm() {
      // loading效果
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 背景禁止点击
        duration: 0 // 持续展示
      })
      try {
        // 获取裁切结果
        // 基于服务器端的裁切使用getData()获取裁切的文件对象
        // 基于客户端的裁切使用getCroppedCanvas()获取裁切的文件对象
        this.cropper.getCroppedCanvas().toBlob(async (blob) => {
          // 如果接口要求Content-Type 是 application/json,则传递普通JavaScript对象
          // 如果接口要求Content-Type 是 multipart/form-data,则必须传递FormData对象
          const formData = new FormData()
          formData.append('photo', blob)
          const { data } = await updateUserPhoto(formData)
          // 关闭弹出层
          this.$emit('close')
          // 更新视图
          this.$emit('update-photo', data.data.photo)
          this.$toast.success('更新成功')
        })
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
  },
  mounted() {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  }
}
</script>

<style lang="less" scoped>
.img {
  display: block;
  max-width: 100%;
}
.update-photo {
  height: 100%;
  background-color: #000;
  .bottom-navbar {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      color: #fff;
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
