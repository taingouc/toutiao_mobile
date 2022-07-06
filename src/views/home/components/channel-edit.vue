<template>
  <div class="channel-edit">
    <!-- cell单元格组件搭建结构 -->
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button type="danger" plain round size="mini" class="edit-btn" @click=";(isEdit = !isEdit), (isDisabled = !isDisabled)">{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item v-for="(value, index) in MyChannelsList" :key="index" class="grid-item" :class="[isDisabled ? 'disabled' : '']" @click="onMyChannelClick(index)">
        <van-icon v-show="isEdit && index !== activeIndex" slot="icon" name="clear" :class="[isDisabled ? 'deletedState' : '']" @click.stop="clearIconClick(value.id, index)"></van-icon>
        <span slot="text" :class="[index === activeIndex ? 'Highlight' : '']">{{ value.name }}</span>
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item icon="plus" v-for="(channel, index) in recommendChannels" :key="index" :text="channel.name" class="grid-item" @click="onAddChannel(channel)" />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/user'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  data() {
    return {
      // 全部频道列表项
      allChannels: [],
      // 我的频道列表
      MyChannelsList: this.MyChannels,
      // 我的频道编辑状态下列表项x号的显示,默认不显示false
      isEdit: false,
      // 编辑按钮点击，禁用我的频道列表项点击功能，默认可以点击
      isDisabled: false
    }
  },
  props: {
    // 我的频道列表项
    MyChannels: {
      type: Array,
      required: true
    },
    // 目前点击频道的索引
    activeIndex: {
      type: Number,
      required: true
    }
  },
  methods: {
    // 获取全部频道列表
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        const { channels } = data.data
        // 获取到全部频道列表项放到data中
        this.allChannels = channels
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    // 点击推荐频道列表项添加进我的频道列表项
    async onAddChannel(channel) {
      this.MyChannelsList.push(channel)
      // 数据持久化处理
      if (this.user) {
        // 已登录，把数据通过接口同步到服务器
        try {
          await addUserChannel({
            id: channel.id, // 频道id
            seq: this.MyChannelsList.length // 长度
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录，添加到本地存储，让未登录时也能展示
        setItem('TOUTIAO_CHANNELS', this.MyChannelsList)
      }
    },
    // 我的频道列表项点击切换到文章
    onMyChannelClick(index) {
      this.$emit('update-active', index, true)
    },
    // 点击x图标功能
    async clearIconClick(id, index) {
      // 如果删除索引小于当前点击项索引，那么点击项索引要减一，并且不关闭频道弹出层
      if (index < this.activeIndex) {
        this.$emit('update-active', this.activeIndex - 1)
      }
      // 从我的频道中删除对应项
      this.MyChannelsList.splice(index, 1)
      // 数据持久化处理
      if (this.user) {
        // 已登录，把数据通过接口同步到服务器
        try {
          await deleteUserChannel(id)
        } catch (err) {
          this.$toast('删除失败，请稍后重试')
        }
      } else {
        // 未登录，添加到本地存储，让未登录时也能展示
        setItem('TOUTIAO_CHANNELS', this.MyChannelsList)
      }
    }
  },
  computed: {
    // 导入vuex中存储用户已登录的user容器
    ...mapState(['user']),
    // 计算 (频道推荐列表项)=(全部频道列表项)-(我的频道列表项)
    recommendChannels() {
      // // 定义推荐列表项数组
      // const channels = []
      // // 遍历全部列表项数组
      // this.allChannels.forEach((channel) => {
      //   // find查找 我的列表项数组 和 全部列表项数组 中是否有相同的列表名，返回结果true或false
      //   const ret = this.MyChannels.find((myChannel) => {
      //     return channel.name === myChannel.name
      //   })
      //   // 遍历每一项，ret结果为false则没有相同项，把该项添加进推荐列表数组中
      //   if (!ret) {
      //     channels.push(channel)
      //   }
      // })
      // // 最后返回该推荐项数组
      // return channels
      return this.allChannels.filter((channel) => {
        return !this.MyChannelsList.find((MyChannel) => {
          return channel.name === MyChannel.name
        })
      })
    }
  },
  created() {
    this.loadAllChannels()
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding-top: 85px;
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .grid-item {
    width: 160px;
    height: 86px;
    /deep/.van-grid-item__content {
      background-color: #f4f5f6;
      white-space: nowrap;
      .van-grid-item__text {
        font-size: 28px;
        color: #222222;
        margin-top: 0;
      }
    }
    span {
      font-size: 28px;
    }
    .van-icon-clear {
      font-size: 30px;
      position: absolute;
      top: -24px;
      right: -84px;
      transform: translate(30%, -30%);
      color: #cacaca;
      z-index: 2;
    }
  }

  .recommend-grid {
    /deep/.van-grid-item__content {
      flex-direction: unset;
      .van-icon-plus {
        font-size: 28px;
        margin-right: 6px;
      }
    }
  }
}
.Highlight {
  color: red;
}
.disabled {
  pointer-events: none;
  opacity: 0.5;
}
.deletedState {
  color: #f85959 !important;
  pointer-events: fill;
}
</style>
