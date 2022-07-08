// 请求模块
import axios from 'axios'
// 访问Vuex中的store.state数据，引入这个模块
import store from '@/store'
// import JSONBig from 'json-bigint'
const request = axios.create({
  // 接口的基础路径
  baseURL: 'http://toutiao.itheima.net'
  // 自定义后端返回的原始数据
  // transformRequest: [
  //   function (data) {
  //     try {
  //       return JSONBig.parse(data)
  //     } catch (err) {
  //       return data
  //     }
  //   }
  // ]
})
// 请求拦截器，为每一次请求添加token数据,
request.interceptors.request.use(
  function (config) {
    // 发起请求会会执行这里，config本次请求的配置对象
    // 访问Vuex中的store.state.user数据
    const { user } = store.state
    // 判断user和token数据是否存在
    if (user && user.token) {
      // 为config请求配置对象配置token，token的数据格式：Bearer token数据，注意：Bearer后有个空格
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // config配置对象必须return，否则请求会停止在这里，不会放行
    // console.log(config)
    return config
  },
  function (error) {
    // 请求出错，还没有发出去，会执行这里
    return Promise.reject(error)
  }
)
// 响应拦截器
export default request
