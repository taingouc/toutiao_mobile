import Vue from 'vue'
import Vuex from 'vuex'
// 导入封装的本地存储操作模块
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)
// 定义本地存储TOKEN_KEY存放登录用户信息
const TOKEN_KEY = ''

export default new Vuex.Store({
  state: {
    // user存储当前登录的用户信息，包括token信息
    // 页面刷新后，会丢失登录用户的信息，使用本地存储的方式将登录用户的信息保存下来，再响应给user
    // 本地存储的数据是字符串，再使用JSON.parse()还原对象信息
    user: getItem(TOKEN_KEY)
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
  },
  getters: {},
  mutations: {
    // 修改state中的数据必须在mutations中定义
    // 定义setUser函数，用户登录成功后将用户信息(token)存储到state.user中
    setUser(state, data) {
      state.user = data
      // 防止页面刷新，丢失存储的用户信息（token），我们需要把数据备份到定义的本地存储TOKEN_KEY
      // state.user是一个对象，使用 JSON.stringify()转化为字符串进行存储
      setItem(TOKEN_KEY, state.user)
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
    }
  },
  actions: {},
  modules: {}
})
