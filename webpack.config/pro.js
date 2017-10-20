const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./base')
const root = path.resolve(__dirname, '..')
const pkg = require('../package.json')
const banner = `${pkg.name} v${pkg.version}\n${pkg.description}\n${pkg.homepage}\n@author ${pkg.author}`

module.exports = merge(baseConfig, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new HtmlWebpackPlugin({
      template: path.join(root, 'index.html'), // 模板文件
      inject: 'body' // js的script注入到body底部
    }),
    new webpack.optimize.UglifyJsPlugin(),
   new webpack.BannerPlugin(banner)
  ]
})
