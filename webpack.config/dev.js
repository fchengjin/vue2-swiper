const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./base')
const root = path.resolve(__dirname, '..')

module.exports = merge(baseConfig, {
  devServer: {
    historyApiFallback: true, // 404的页面会自动跳转到/页面
    inline: true, // 文件改变自动刷新页面
    progress: true, // 显示编译进度
    port: 3030, // 服务器端口
  },
  devtool: '#eval-source-map', // 用于标记编译后的文件与编译前的文件对应位置，便于调试
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new HtmlWebpackPlugin({
    //   template: path.join(root, 'index.html'), // 模板文件
    //   inject: 'body' // js的script注入到body底部
    // })
  ]
})