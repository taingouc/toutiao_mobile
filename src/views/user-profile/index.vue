<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar title="个人信息" fixed placeholder z-index class="page-nav-bar">
      <van-icon slot="left" name="arrow-left" @click="$router.push('/my')"></van-icon>
    </van-nav-bar>
    <!-- 个人信息 -->
    <van-cell-group inset>
      <input type="file" hidden ref="file" @change="onFileChange" />
      <van-cell title="头像" is-link @click="$refs.file.click()">
        <van-image round fit="cover" :src="user.photo" />
      </van-cell>
      <van-cell title="昵称" is-link :value="user.name" @click="isUpdateNameShow = true" />
      <van-cell title="性别" is-link :value="user.gender === 1 ? '女' : '男'" @click="isUpdateSexShow = true" />
      <van-cell title="生日" is-link :value="user.birthday" @click="isUpdateBirthdayShow = true" />
    </van-cell-group>
    <!-- 编辑个人头像弹出层 -->
    <van-popup v-model="isUpdatePhotoShow" position="bottom" :style="{ height: '100%' }">
      <update-photo :img="img" @close="isUpdatePhotoShow = false" @update-photo="user.photo = $event"></update-photo>
    </van-popup>
    <!-- 编辑昵称弹出层 -->
    <van-popup v-model="isUpdateNameShow" position="bottom" :style="{ height: '100%' }">
      <update-name @close="isUpdateNameShow = false" v-model="user.name" v-if="isUpdateNameShow"></update-name>
    </van-popup>
    <!-- 编辑性别弹出层 -->
    <van-popup v-model="isUpdateSexShow" position="bottom" :style="{ height: '40%' }">
      <update-sex @close="isUpdateSexShow = false" v-model="user.gender" v-if="isUpdateSexShow"></update-sex>
    </van-popup>
    <!-- 编辑生日弹层 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom" :style="{ height: '40%' }">
      <update-birthday @close="isUpdateBirthdayShow = false" v-model="user.birthday" v-if="isUpdateBirthdayShow"></update-birthday>
    </van-popup>
  </div>
</template>

<script>
import UpdateName from '@/views/user-profile/components/update-name.vue'
import { getUserProfile } from '@/api/user'
import UpdateSex from '@/views/user-profile/components/update-sex.vue'
import UpdateBirthday from '@/views/user-profile/components/update-birthday'
import UpdatePhoto from '@/views/user-profile/components/update-photo.vue'
export default {
  name: 'UserProfile',
  data() {
    return {
      user: {},
      isUpdateNameShow: false,
      isUpdateSexShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null
    }
  },
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (err) {
        this.$toast.fail('数据获取失败')
      }
    },
    // 监听input选择图片
    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文章对象获取blob数据
      this.img = window.URL.createObjectURL(file)
      // 展示预览图片弹出层
      this.isUpdatePhotoShow = true
      // file-input如果选择了同一个文件不会触发change事件，每次使用完毕清空其value
      this.$refs.file.value = ''
    }
  },
  components: { 'update-name': UpdateName, 'update-sex': UpdateSex, 'update-birthday': UpdateBirthday, 'update-photo': UpdatePhoto },
  created() {
    this.loadUserProfile()
  }
}
</script>

<style lang="less" scoped>
/deep/.van-nav-bar {
  background-color: unset;
}
.user-profile {
  .van-image {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
