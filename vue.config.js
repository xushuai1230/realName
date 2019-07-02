const env = process.env
const isProd = process.env.NODE_ENV === 'production'
const TerserPlugin = require('terser-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
module.exports = {
  productionSourceMap: false,
  baseUrl: isProd ? `${env.WEBPACK_PATH}` : '/',

  configureWebpack: {
    plugins: [
      new LodashModuleReplacementPlugin()
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProd
            }
          }
        })
      ]
    },
    externals: isProd ? {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'AMap': 'AMap'
    } : {
      'AMap': 'AMap'
    }
  },
  chainWebpack: config => {
    if (process.env.npm_config_report) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  }
}
