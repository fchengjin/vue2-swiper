const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
var pkg = require('./package.json')
const banner = `${pkg.name} v${pkg.version}\n${pkg.description}\n${pkg.homepage}\n@author ${pkg.author}`
module.exports = {
  entry: {'vue2-swiper': path.join(__dirname, 'src/vue2-swiper.vue')},
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    library: 'Vue2-swiper',
    libraryTarget: 'umd',
    filename: '[name].js'
  },
  module: {
    loaders: [
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
        // use: {
        //   loader: 'babel-loader',
        //   options: {
        //     presets: ['env','es2015']
        //   }
        // }
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: function () {
          return [
            require('autoprefixer')({
              browsers: [
                'ie>=8',
                '> 1%',
                'last 2 versions']
            })
          ]
        }
      }
    })
  ]
}
if (process.env.NODE_ENV === 'dev') {
  module.exports.devtool = '#eval-source-map'
} else {
  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin())
  module.exports.plugins.push(new webpack.BannerPlugin(banner))
}