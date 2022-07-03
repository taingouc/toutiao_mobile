<template>
  <div class="login_container">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" class="page-nav-bar">
      <!-- slot插槽--左侧x号图标 -->
      <van-icon slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>
    <!-- 登录表单 -->
    <!-- 为van-form添加ref引用,后续可以通过ref获取到Form实例并调用实例方法 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-cell-group inset>
        <!--手机号输入框 type="number" 用户只能输入数字 maxlength="11" 最大长度11位 -->
        <van-field type="number" maxlength="11" name="mobile" placeholder="请输入手机号" v-model="user.mobile" :rules="userFormRules.mobile">
          <!-- 手机号入框插槽-手机图标 -->
          <svg class="icon" aria-hidden="true" slot="left-icon">
            <use xlink:href="#icon-shouji"></use>
          </svg>
        </van-field>
        <!--验证码输入框 type="number" 用户只能输入数字 maxlength="11" 最大长度11位 -->
        <van-field type="number" maxlength="6" name="code" placeholder="请输入短信验证码" v-model="user.code" :rules="userFormRules.code">
          <!-- 验证码输入框插槽-验证码图标 -->
          <svg class="icon" aria-hidden="true" slot="left-icon">
            <use xlink:href="#icon-yanzhengma"></use>
          </svg>
          <!-- 发送验证码插槽 -->
          <template #button>
            <!-- 使用vant组件库中CountDown倒计时组件显示倒计时 finish倒计时结束时触发 -->
            <van-count-down :time="1000 * 10" format="ss s" v-if="isCountDownShow" @finish="isCountDownShow = false" />
            <!-- 在表单中，除了提交按钮外，可能还有一些其他的功能性按钮，如发送验证码按钮。在使用这些按钮时，要注意将native-type设置为button，否则会触发表单提交。 -->
            <van-button v-else native-type="button" round size="small" type="default" class="send-sms-btn" @click="onSendSms">发送验证码</van-button>
          </template>
        </van-field>
      </van-cell-group>
      <div class="login-btn-wrap">
        <van-button block type="info" native-type="submit"> 登录 </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  data() {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      // 表单提交校验规则
      userFormRules: {
        // 手机号校验规则
        mobile: [
          { required: true, message: '手机号不能为空' },
          // pattern校验规则，手机号必须以数字1、3、5、7、8开头，9位数
          { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机格式错误' }
        ],
        // 验证码校验规则
        code: [
          { required: true, message: '验证码不能为空' },
          // pattern校验规则，手机验证码必须为6位数字
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      // 控制发送验证码组件和验证码时间组价切换
      isCountDownShow: false
    }
  },
  methods: {
    // 发送验证码功能
    async onSendSms() {
      // 1.校验手机号是否合法
      try {
        // 通过this.$refs.表单ref引用名.validate('部分表单项的name')验证
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        // 验证失败，捕获错误，return出去，不执行后续操作
        return err
      }
      // 2.验证通过，使用vant组件库中CountDown倒计时组件显示倒计时,通过isCountDownShow切换组件显示
      this.isCountDownShow = true
      // 3.请求发送验证码,同一手机号一分钟内只能发送一次
      try {
        await sendSms(this.user.mobile)
        // 验证码发送成功，使用toast组件提示成功消息
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        // 捕获错误，使用toast组件提示失败消息
        if (err.response.status === 429) {
          this.$toast('发送频繁，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    },
    // 点击登录功能
    async onSubmit(values) {
      // values填写的表单数据
      // console.log(values)
      // 1.获取表单数据
      const user = this.user
      // 2.表单验证，在组件中必须通过this.$toast调用Vant组件库中的toast组件
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认2000ms,为0则持续状态，不会关闭loading效果
      })
      // 3.提交表单发起登录请求
      try {
        // 4.登录成功,存储token,路由跳转
        const { data } = await login(user)
        // 4.1通过this.$store.commit('setUser',data.data)将登录成功时的token信息存储到vuex上
        this.$store.commit('setUser', data.data)
        // 4.2调用this.$toast.success提示登录成功的消息，注意：任何一个新的toast被调用，都会停止上一个toast
        this.$toast.success('登录成功')
        // 4.3路由跳转
        this.$router.push('/my')
      } catch (err) {
        // 登录失败
        if (err.response.status === 400) {
          // 调用this.$toast.fail提示登录失败的消息
          return this.$toast.fail('手机号或验证码错误')
        } else {
          return this.$toast.fail('登录失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.send-sms-btn {
  background-color: #ededed;
  width: 162px;
  height: 46px;
  line-height: 46px;
  color: #666;
}
.login-btn-wrap {
  padding: 53px 33px;
  .van-button--info {
    background-color: #6db4fb;
    border: none;
  }
}
.van-cell-group--inset {
  margin: 0;
}
</style>
