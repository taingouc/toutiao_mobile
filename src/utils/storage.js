// 封装本地存储操作模块

// 存储数据
export const setItem = (key, value) => {
  // 将对象、数组类型的数据转换为json格式的字符串进行存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  // 如果是字符串等其他类型，直接存储
  window.localStorage.setItem(key, value)
}

// 获取数据
export const getItem = (key) => {
  const data = window.localStorage.getItem(key)
  try {
    // 如果读取的数据能通过JSON.parse()转换成对象、数组类型的数据，那就将转换完的数据return
    return JSON.parse(data)
  } catch (err) {
    // 发生错误，说明读取的数据不能通过JSON.parse()转换成功，并非字符串类型，那么直接将数据return
    return data
  }
}

// 删除数据
export const removeItem = (key) => {
  window.localStorage.removeItem(key)
}
