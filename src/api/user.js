// 用户相关的请求模块
import request from '@/utils/request'

// 登录请求
export const login = (data) => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data
  })
}
// 发送验证码请求,注意每个手机号每分钟一次
export const sendSms = (mobile) => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`
  })
}
// 获取用户自己的信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user'
  })
}
// 获取用户频道列表
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/channels'
  })
}
// 获取频道的文章列表
export const getArticles = (params) => {
  return request({
    method: 'GET',
    url: '/v1_0/articles',
    params
  })
}
// 获取所有频道列表
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}
// 批量修改用户频道列表
export const addUserChannel = (channel) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data: {
      channels: [channel]
    }
  })
}
// 删除用户指定频道
export const deleteUserChannel = (channelID) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${channelID}`
  })
}
// 获取联想建议
export const getSearchSuggestions = (q) => {
  return request({
    method: 'GET',
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}
// 获取搜索结果
export const getSearchResult = (params) => {
  return request({
    method: 'GET',
    url: '/v1_0/search',
    params
  })
}
// 获取文章详情
export const getArticleById = (articleId) => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${articleId}`
  })
}
// 文章详情页面关注用户
export const addFollow = (target) => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target
    }
  })
}
// 文章详情页面取消关注用户
export const deleteFollow = (id) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${id}`,
    data: {
      id
    }
  })
}
