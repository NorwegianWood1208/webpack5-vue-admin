项目源码地址：

    https://github.com/wuxiaohuaer/webpack5-vue-admin
    

## 一、什么是微前端
微前端是一个比较宏观的概念，他的核心就是独立，开发独立、部署独立，比较适合大的团队来进行重量级项目开发。

从Micro Frontends 官网可以了解到，微前端概念是从微服务概念扩展而来的，摒弃大型单体方式，将前端整体分解为小而简单的块，这些块可以独立开发、测试和部署，同时仍然聚合为一个产品出现在客户面前。可以理解微前端是一种将多个可独立交付的小型前端应用聚合为一个整体的架构风格。


## 二、为什么要用微前端？

一个公司有多个类似的项目，大家可能会共用一个dialog组件，那我们可以封装起来，以便其他的项目一起使用。

这个时候大家会有一个疑问，直接打包放在npm上不就完了，为什么要用微前端这么复杂的东西？
我们把公用的组件打包以后上传到npm包管理器上，确实可以让公司的其他项目一起使用，但是会有两个弊端。



#### 1、程序繁琐

开发三个管理后台应用项目，将相同的业务子模块抽离成npm包方式，这时候，如果要更新该业务子模块的逻辑时，那么需要做以下的流程操作：

    更新npm包版本
    
    更新A管理系统应用的npm包版本
    
    发布部署A管理系统应用
    
    对B和C管理系统应用循环2和3步骤

因为虽然相对是独立的，有了npm这么一个中间商，但是要改一个组件，所有的项目都要摸一遍。

如果我们使用微服务，就可以把公用的组件全部放到一个容器应用当中，专门用来放组件，需要更新的时候只要重新部署这个容器应用，其他项目刷新就能得到最新的模块。

#### 2、构建速度慢

如果项目当中引用了n个组件，除了需要从npm上更新以外，构建部署的时候，也是需要全部打包一遍的，开发体验就会越来越差。

而微服务并不需要本地构建这些子模块的代码，从而减小了构建体积，提高了开发效率。

## 三、微前端实现方案

目前业内最火的微前端解决方案应该是蚂蚁团队维护的qiankun：
https://qiankun.umijs.org/zh/guide

有兴趣可以去官网了解

本身没有开发过非常大量级的系统，所以对微服务没有太大的兴趣。前段时间正好在学webpack5，发现webpack5有一个联邦模块功能（mf），对于微前端的公共依赖加载是比较好的解决方案。

鉴于mf的能力，我们可以完全实现一个去中心化的应用部署群：每个应用是单独部署在各自的服务器，每个应用都可以引用其他应用，也能被其他应用所引用，即每个应用可以充当host的角色，亦可以作为remote出现，无中心应用的概念。

目前基于mf，比较成熟的微前端架构是YY团队的EMP微前端方案

https://github.com/efoxTeam/emp

作为一个vue狗，就基于最新的vue3.0+webpack5实现一个基础的微服务。

## 四、搭建环境

### 1、创建文件夹

    // 创建文件夹

    mkdir hand-vue3-project && cd hand-vue3-project
    
    // 初始化项目
    npm init -y
    
### 2、安装依赖

    yarn add webpack webpack-cli -D
    
### 3、创建文件
    
在根目录下创建src文件夹、index.html和webpack.config.js，src文件夹里面创建main.js

### 4、配置webpack.config.js
    
    // webpack.config.js
    const path = require('path')
    
    module.exports = {
      mode: 'development', // 环境模式
      entry: path.resolve(__dirname, './src/main.js'), // 打包入口
      output: {
        path: path.resolve(__dirname, 'dist'), // 打包出口
        filename: 'js/[name].js' // 打包完的静态资源文件名
      }
    }

在package.json 的 scripts 属性加上：
    
    "dev": "webpack --config ./webpack.config.js"

先做一些基础的打包配置，后面引入vue再加

### 5、运行环境

在main.js打印一下
    
    console.log('hello,world!')
    
运行命令：
    
    yarn dev
    
这个时候就可以看到dist文件夹下有个打包好的js文件

## 五、引入vue3.0

公司项目不敢用vue3.x，也只能在demo上骚一骚了

### 安装依赖

    yarn add vue@next -S
    @next -S才能下载到最新的vue版本
    
    yarn add html-webpack-plugin -D
    将 index.html 作为模板，打出到 dist 文件夹
    
    yarn add vue-loader@next 
    解析和转换 .vue  文件，提取出其中的逻辑代码 script、样式代码 style、以及 HTML 模版 template
    
    
    yarn add @vue/compiler-sfc
    Vue 2.x 时代，需要 vue-template-compiler 插件处理 .vue 内容为 ast ， Vue 3.x 则变成 @vue/compiler-sfc 。
    
    yarn add vue-style-loader css-loader
    
### 配置项目
    
#### 1、webpack.config.js
    
    const path = require('path')
    const HtmlWebpackPlugin = require('html-webpack-plugin')
    // 最新的 vue-loader 中，VueLoaderPlugin 插件的位置有所改变
    const { VueLoaderPlugin } = require('vue-loader/dist/index')
    
    module.exports = {
      mode: 'development',
      entry: path.resolve(__dirname, './src/main.js'),
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js'
      },
      module: {
        rules: [
          {
            test: /\.vue$/,
            use: [
              'vue-loader'
            ]
          },
          {
            test: /\.css$/,
              use: [
                'style-loader',
                'css-loader'
              ]
          }
        ]
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, './index.html'),
          filename: 'index.html',
          title: '微前端框架1'
        }),
        // 添加 VueLoaderPlugin 插件
        new VueLoaderPlugin()
      ]
    }
    
#### 2、src下的文件
    
main.js
    
    import { createApp } from 'vue' // Vue 3.x 引入 vue 的形式
    import App from './app.vue' // 引入 APP 页面组建
    
    const app = createApp(App) // 通过 createApp 初始化 app
    app.mount('#root') // 将页面挂载到 root 节点
    
新建的app.vue
    
    <template>
      <div>距离2021年欧洲杯还有？</div>
    </template>
    
    <script>
    export default {
      
    }
    </script>
    
这个时候运行yarn dev，dist文件夹下就会包出来一个index.html，打开就能看到效果，但是每次都要打包打开太麻烦
    
#### 引入WDS

    yarn add webpack-dev-server -D
    
webpack.config.js
    
    devServer: {
      contentBase: path.resolve(__dirname, './dist'),
      port: 8080,
      publicPath: '/'
    }
    
package.json
    
    "dev": "webpack serve --progress --config ./webpack.config.js"
    
运行yarn dev

## 六、使用联邦模块实现微服务

刚才那个项目我们给他称之为项目A，现在需要创建项目A的某个公用组件，并导出

#### 1、新建一个组件
    
mountDown.vue
    
    <template>
        <div>{{ sum }}天</div>
    </template>
    <script>
    import { defineComponent, onMounted, ref, computed } from 'vue'
    export default {
        setup() {
            let sum = computed(() => parseInt((new Date('2021-06-13'.replace(/-/g, '/')).getTime() - new Date()) / (1000*3600*24)));
            return {
                sum
            }
        }
    }
    </script>
    
#### 2、导出组件
    
webpack.config.js
    
    const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
    
    new ModuleFederationPlugin({
      name: "A", // 暴露出去的模块名
      filename: "remoteEntry.js", // 构建出来的文件名
      exposes: {
        './countDown': './src/components/countDown.vue' // 暴露出去。key，要写相对路径
      }
    })

#### 3、B项目引入

webpack.config.js

    const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
    
    new ModuleFederationPlugin({
      name: "B", // 暴露出去的模块名
      filename: "remoteEntry.js", // 构建出来的文件名
      remotes: {
        A: 'A@http://localhost:8080/remoteEntry.js' // 引用
      }
    })
    
app.vue
    
    <template>
      <div>距离2021年欧洲杯还有？</div>
      <countDown/>
    </template>

    import { defineAsyncComponent } from 'vue'

    const countDown = defineAsyncComponent(() =>
            import('A/countDown')
    )
    
    export default {
      components: { countDown },
      setup() {
        return {
        }
      }
    }
    
在A项目上改代码，B项目也会及时更新，不同应用中有相同的组件，就不需要复制粘贴相同的代码到每一个应用的代码中，解决了跨应用代码共享的问题。
## 七、基本概念和配置
#### 一些基本概念
    • 使用Module Federation 时， 每个应用块都是一个独立的构建，这些构建都将被编译为 容器。
    • 被应用的容器，被称为 remote
    • 引用者，被称为 host
    • 暴露出去被使用的模块，称为remote模块
一个容器 ， 使用、暴露，是双向的。一个项目可以引用别的项目的组件，也可以将自己的组件暴露给别的项目用。

#### 原理

感觉原理，就是利用了jsonp。根据模块创建一个全局变量，根据全局变量来获取不同组件的源代码。

### 参考链接
    
    https://juejin.cn/post/6921161482663100423#heading-2
    
    https://www.yuque.com/violet-coyxa/ib3u7d/etzwyg