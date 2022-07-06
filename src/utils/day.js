import Vue from 'vue'
import dayjs from 'dayjs'
// dayjs 默认语言是英文，这里配置为中文
import 'dayjs/locale/zh-cn'
// 加载relativeTime插件用于时间相对处理
import relativeTime from 'dayjs/plugin/relativeTime'
// 使用处理相对时间
dayjs.extend(relativeTime)
// 全局使用中文
dayjs.locale('zh-cn')

// dayjs() 获取当前最新时间,通过'YYYY-MM-DD'格式输出
// console.log(dayjs().format('YYYY-MM-DD')) 输出当前时间
// console.log(dayjs().to(dayjs('1990-01-01'))) 33年前

// 定义全局过滤器 输出相对时间
Vue.filter('relativeTime', (value) => {
  return dayjs().to(dayjs(value))
})
