// webpack.config.js
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const webpack = require('webpack')

module.exports = {
  configureWebpack: config =>{
    config.plugins.push(AutoImport({
      resolvers: [ElementPlusResolver()],
    }))
    config.plugins.push(Components({
      resolvers: [ElementPlusResolver()],
    }))
  },
  chainWebpack(config) {
    // 设置 svg-sprite-loader
    // config 为 webpack 配置对象
    // config.module 表示创建一个具名规则，以后用来修改规则
    config.module
      // 规则
      .rule('svg')
      // 忽略
      .exclude.add(resolve('src/icons'))
      // 结束
      .end()
    // config.module 表示创建一个具名规则，以后用来修改规则
    config.module
      // 规则
      .rule('icons')
      // 正则，解析 .svg 格式文件
      .test(/\.svg$/)
      // 解析的文件
      .include.add(resolve('src/icons'))
      // 结束
      .end()
      // 新增了一个解析的loader
      .use('svg-sprite-loader')
      // 具体的loader
      .loader('svg-sprite-loader')
      // loader 的配置
      .options({
        symbolId: 'icon-[name]'
      })
      // 结束
      .end()
    config
      .plugin('ignore')
      .use(
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/)
      )
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  // devServer: {
  //   https: false,
  //   hotOnly: false,
  //   proxy: {
  //     '/api': {
  //       target: 'https://lianghj.top:8888/api/private/v1/',
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': ''
  //       }
  //     }
  //   }
  // }
  devServer: {
    host: "localhost",//配置本项目运行主机
    port: 8888,//配置本项目运行端口
    //配置代理服务器来解决跨域问题
    proxy: {
      // ‘/api’ 的作用就是 替换 baseURL 的，假如这里我用的 localhost：8080 ,前端请求时直接用 /api 就行了
      //  ‘/api’ 只在前端请求时添加，而后端不需要添加 /api 这个路径
      "/api": {
        target: "https://lianghj.top:8888/api/private/v1/", //配置要替换的后台接口地址
        changOrigin: true, //配置允许改变Origin
        ws: true, // proxy websockets
        pathRewrite: {
          "^/api": "/",
          //pathRewrite: {'^/api': '/'} 重写之后url为 http://localhost：8080/xxxx
          //pathRewrite: {'^/api': '/api'} 重写之后url为http://localhost：8080/api/xxxx
        },
      },
    },
  },
  css: {
     loaderOptions: {
       sass: {
        prependData:   // 8版本用prependData: 以上的用：additionalData:
         `
           @import "@/styles/variables.module.scss";  // scss文件地址
           @import "@/styles/mixin.scss";     // scss文件地址
         `
       }
     }
   }
 
}