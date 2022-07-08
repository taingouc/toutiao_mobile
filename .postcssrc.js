// postcss.config.js
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // rootValue可以值为数字，也可是一个函数
      // 这里设置rem基准，vant样式按37.5转换，自己的样式则按75转换，可以实现互不干扰
      rootValue({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      propList: ['*'],
      // 配置不要转换的样式资源
      exclude: 'markdown-body'
    }
  }
}
