const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
var pkg = require('./package.json')
const banner = `${pkg.name} v${pkg.version}\n${pkg.description}\n${pkg.homepage}\n@author ${pkg.author}`
module.exports = {
  entry: [{ 'vue2-swiper': path.join(__dirname, 'src/vue2-swiper.vue') }],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    library: 'Vue2Swiper',
    libraryTarget: 'umd',
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.vue&/, loader: 'vue' },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      }
    ]
  },
  postcss: [autoprefixer({browsers: ['last 2 versions', 'Android 2.3']})],
  babel:{
    'presets':['es2015','stage-2']
  }
}
if (process.env.NODE_ENV === 'dev') {
  module.exports.devtool = '#eval-source-map';
} else {
  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin());
  module.exports.plugins.push(new webpack.BannerPlugin(banner));
}