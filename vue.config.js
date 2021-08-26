const CompressionWebpackPlugin = require('compression-webpack-plugin');
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ?
    '/web/' : './',
  outputDir: process.env.outputDir,
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV !== 'production',
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      // 开启gzip压缩
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: /\.js$|\.html$|\.json$|\.css/,
        threshold: 10240,
        minRatio: 0.8
      }))
      // 开启分离js
      config.optimization = {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 20000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                // npm package names are URL-safe, but some servers don't like @ symbols
                return `npm.${packageName.replace('@', '')}`
              }
            }
          }
        }
      };
    }
  },
  devServer: {
    // host: 'localhost',
    // port: 8080,
    // overlay: { //显示编译错误和警告
    //   warnings: true,
    //   errors: true
    // },
    open: false, //不自动打开浏览器
    compress: true, //启用Gzip
    proxy: {
      '/api': {
        target: 'http://10.0.0.79:9006/index.php/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  },
  productionSourceMap: false
};