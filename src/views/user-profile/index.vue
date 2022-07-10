<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar title="个人信息" fixed placeholder z-index class="page-nav-bar">
      <van-icon slot="left" name="arrow-left" @click="$router.push('/my')"></van-icon>
    </van-nav-bar>
    <!-- 个人信息 -->
    <van-cell-group inset>
      <van-cell title="头像" is-link>
        <van-image round fit="cover" :src="user.photo" />
      </van-cell>
      <van-cell title="昵称" is-link :value="user.name" @click="isUpdateNameShow = true" />
      <van-cell title="性别" is-link :value="user.gender === 1 ? '女' : '男'" />
      <van-cell title="生日" is-link :value="user.birthday" />
    </van-cell-group>
    <!-- 编辑昵称弹出层 -->
    <van-popup v-model="isUpdateNameShow" position="bottom" :style="{ height: '100%' }">
      <update-name @close="isUpdateNameShow = false" v-model="user.name" v-if="isUpdateNameShow"></update-name>
    </van-popup>
  </div>
</template>

<script>
import UpdateName from '@/views/user-profile/components/update-name.vue'
import { getUserProfile } from '@/api/user'
export default {
  name: 'UserProfile',
  data() {
    return {
      user: {},
      isUpdateNameShow: false
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
    }
  },
  components: { 'update-name': UpdateName },
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
