const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const root = path.resolve(__dirname, '..')
module.exports = {
  entry: {'Vue2Swiper': path.join(root, 'src/index.js')},
  output: {
    path: path.join(root, 'example'),
    publicPath: '/',
    library: 'Vue2Swiper',
    libraryTarget: 'umd',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader'
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([path.join(root,'example')]),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: function () {
          return [
            autoprefixer({
              browsers: [
                'ie>=8',
                '> 1%',
                'last 2 versions']
            })
          ]
        }
      }
    }),
  ]
}