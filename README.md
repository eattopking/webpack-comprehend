# webpack-comprehend

# webpack 感悟

1. webpack 的作用: webpack 就是一个模块化的构建工具, 它能处理 js, css, 图片, 和字体

***

2. # 主要概念

## output

output.publicPath 就是给图片的请求路径补全的， 打包处理后的图片src路径就是publicPath补全后的结果,
和publicPath拼接的url如果是../../a这样的， 那直接拼成publicPath/a 这样的结果， 不用管../../。

1. 以/开头的图片请求路径，是绝对路径， 最终以  协议 + host + 以/开头的图片请求路径 的结果去请求图片
2. 不以/开头的图片请求路径，是相对路径， 最终以  地址栏中html文件所在目录的整体url + 不以/开头的图片请求路径 的组合结果去请求图片
3. 提供了完成路径， 没有提供协议的， 以地址栏的协议为准请求图片
4. 提供了协议的完整路径， 就以这个路径请求图片

### 再看看字体是怎么引用的， 可错误的在改

## 2.1 loader

loader 的作用: 转换 webpack 无法处理的文件的工具, webpack 默认只能处理 js(ES5 和之前)和 json 文件, 处理比如 css, 图片, react, 都需要用 loader

主要 loader:

#### url-loader

  url-loader的主要作用：就是处理图片和字体的文件名字和文件打包到的位置的， 将图片的src引用处理成base64编码字符串，可以达到减少http请求的优化作用，因为图片的src引用变成base64字符串后，加载图片的时候就不会，发送额外的http请求了， 会在加载html的时候
  直接就加载图片了，但是现在都是js动态生成html啊，这个时候base64是啥时候加载的呢？？？？这个还需要搞明白

  1. url-loader 和 file-loader, 是处理图片和图标字体的 loader, 但是url-loader可以将图片转成base64格式
  2. url-loader 可以将图片和字体转换为 base64 字符串
  3. url-loader 内部是依赖 file-loader 的, 所以使用 url-loader 时,也要安装 file-loader
  4. url-loader 特有的参数, limit 表示可以转换为base64编码的图片文件的最大值, 单位是 b, 如果文件大小大于limit 的值, 那就不将  文件转为 base64 字符串(url-loader 默认值 limit 是无限制的, 就是文件多大都可以转成 base64 字符串), 而是使用 fallback 设置  的 loader 替代 url-loader 处理文件, fallback 的默认值是 file-loader(file-loader 不能将图片转为base64编码，其余和  url-loader一样)
  5. mimetype 设置需要转换文件的 mime 类型, 如果没有设置, 会根据后缀名, 查找 mime 类型所以一般不用设置, url-loader 其他的配置 项和 file-loader 相同
  6. url-loader 的name属性，就是设置打包后文件的目录和文件名的， 如果只设置文件名， 那就将文件打包到output.path设置的目录下

1.1 babel 的理解

babel 是 js 文件的转换工具, 主要包括babel-core(babel的主要实现), babel-polyfill(对babel不支持的一次方法的补充), babelrc文件, 主要配置babel的present(预设, 常见有present-env处理es6, 7, 8, 9, 10还有将要进入es规范的, present-react处理react语法的), 还有plugins(babel的一些插件, 起到处理文件时一些其他的作用)

babel的原理, 还各个部分的具体功能和实现:  待续

2.

****

## 2.2 plugin

plugin 的作用: 因为 loader 的功能比较单一, 就是转换文件的, plugin 就是在 webpack 生命周期注册是监听钩子, 用于处理 loader 无法处理的事情, 比如清楚就是包, 压缩 js 和 压缩 css

主要 plugin:

### 1. 热更新相关插件

NamedModulesPlugin(在命令行打印更新模块(就是文件)id, 使用的是模块的路径名, 而不是 数字id), 默认是 数字id, 这样有助于我们在命令行查看
更新的文件, 在开发环境使用, 但是这个插件执行的时间有些长, 看情况使用

HashedModuleIdsPlugin: 正常模块id是数字, 按照模块的顺序分为0, 1, 2, 3, 4, 5..., 会根据顺序的改变而发生变化id值, id发生变化后, 他们组成的chunk的chunkhash也会发生变化, HashedModuleIdsPlugin的作用就是根据模块的相对路径生成一个四位数的hash作为模块id, 而不是按照顺序作为id了, 这样当模块顺序变化时就不会, 导致他们组成chunk的chunkhash改变了, HashedModuleIdsPlugin用于生成环境, 优化根据chunkhash判断的强缓存

HotModuleReplacementPlugin 是配合 webpack-dev-server hot 共同处理热更新, hot: true 后, 需要引入 HotModuleReplacementPlugin 才能实现热更新, 或者是在, npm 指令中设置 webpack-dev-server --hot --open, 然后 webpack 就会自动引入 HotModuleReplacementPlugin 插件了, 不需要自己手动引入了, 开启热更新是将 css 和 js 的热更新都开了

### 2. css 相关插件

mini-css-extract-plugin(只在生产环境中使用) 作用, 将 css 整合到一个文件中, 使用 mini-css-extract-plugin 时, 使用 MiniCssExtractPlugin.loader 替换掉 style-loader, MiniCssExtractPlugin.loader 只在生产环境都可以用, 开发环境用 style-loader

optimize-css-assets-webpack-plugin 将 mini-css-extract-plugin 整合的 css 文件进行压缩

### 3. CopyWebpackPlugin copy 静态资源插件, 我们可以将本地静态资源 copy 到打的包里, 并且 to 的文件路径参照, 就是打包完成的目录

```
   form 的文件路径参照就是项目根目录
   new CopyWebpackPlugin([
      { from: './src/platform/public/lang', to: '../public/lang' },
      { from: './src/platform/resource/', to: '../' }
   ])
```

### 4. CleanWebpackPlugin 删除项目里的目录, 主要用于, 删除打包目录, 它的文件路径参照也是根目录

```
   new CleanWebpackPlugin(['dist/platform'], {
      root: path.join(\_\_dirname, '../../'),
      verbose: true,
      dry: false
   });
```

### 5. html 相关

 #### HtmlWebpackPlugin 插件
 1. 可以用于在生产模式下， 产生最后返回的html文件，打包的css文件和js文件会根据对应的目录关系自动引入html，其他不是本次打包的js代码，需要使用AddAssetHtmlWebpackPlugin加到html文件中
 2. 也可以用于开发模式下，返回开发模式下最后的html文件， 用开发展示
 3. HtmlWebpackPlugin可以多次调用， 生成多个html文件， 这个主要是用在打包多页面

```
// 打包多页面的主要代码
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'production',
  entry: {
    page1: './src/page1.js',
    page2: './src/page2.js',
  },
  output: {
    path: path.resolve(__dirname, './dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'page1.html',
      // 指定在最后html文件中引入的公共模块
      chunks: ['vendors', 'page1']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'page2.html',
      // 指定在最后html文件中引入的公共模块
      chunks: ['vendors', 'page2']
    })
  ]
}
```

 #### add-asset-html-webpack-plugin插件
 1. 这个 plugin 是将js文件添加 html 文件中

 #### webpack. HashedModuleIdsPlugin
 1. 将 module id 转换为根据路径生成的 hash, 防止 hash 值变化

****

## 2.3 tree shaking

 作用: tree shaking 的概念就是做构建时的优化, 清除无用代码比如没有引用代码

 要求: 使用tree shaking 有两大前提
 1. 是必须使用 esmodule 模块化
 2. mode=production, 这有这样, tree shaking 才会生效, 需要在 package.json 中设置. sideEffects 来说明那些文件包含副作用不能随便删除代码, 一般就是样式, 像 less, css 不能随便删除, 其他的都能随便删除

****

## 2.4 垫片

****

## 2.5 多种hash的概念和作用

作用: 通过各种hash对文件进行命名是为了，做前端性能优化， 在生产环境的时候， 对请求的文件开启强缓存， 当文件内容没有变时， 我们的hash也就不变， 此时我们加载文件， 就会走之前的强缓存， 如果我们hash变了，文件名就变了， 那就会去加载最新的文件， 原来的文件的缓存也就没有意义了， 这样就不会走缓存了, 就是只有这一个作用， 并不会在hash不变时，构建的时候就不创建这个文件

 1. hash表示每次构建完成产生的hash值, compilation产生的hash值, 多入口打包时，所有入口对应的hash值都是一个

 2. chunkhash表示创建每个代码块时，代码块的hash， 后续代码块内的代码不变， chunkhash也是不变的

 3. contenthash 表示MiniCssExtractPlugin最后整合出来的css文件的hash，因为一开始css是在js中的, 所以css和js是一个代码块的，所以共用一个chunkhash， 所以这也就导致一个问题， 那就是但是css没有改变时， js发生改变，css的chunkhash也会变，所以导致css也进行了没有必要的加载，影响了性能，contenthash只会关注css文件的变化，css文件变化后， contenthash才会变, 确保只有css变化是contenthash才会变, contenthash: 根据文件内容计算而来

 4. id 指的就是模块(文件)id, 默认是数字

****

# webpack devSerVer

  1. 使用https 和跳过https浏览器证书认证
  2. 热更新的实现原理还没有写还不懂

```
  devServer: {
    // 停止对访问者进行host检查， 允许使用ip访问服务， 和 host: '0.0.0.0' 配合，达到允许其他人访问自己服务的效果
    disableHostCheck: true,
    proxy: [{
      //  当遇到非pc开头的api时,请到此处补充,如果太多,请抽离成单独模块, 这就是达到不同开头的接口，都代理到同一个域名的效果
      context: ['/pc', '/m', '/callback'],
      // target可以是域名也可以是ip
      target: 'http://localhost:33333',
      // target: 'https://test-m.weishi100.com/',
      // 自定义
      bypass: function (req, res, proxyOptions) {
        if (req.url.indexOf('/pcLib') !== -1) {
          return req.url;
          // return false;
        }
      },
      // 默认情况下只能代理到ip， 设置changeOrigin: true，就是可以ip和域名都能代理了
      changeOrigin: true,
      // 这里设置 secure: false， 就是关闭对https的证书验证， 让我们可以代理https的请求
      secure: false,
    }],
    // 开启热更新
    // hot: true,
    // 这样设置允许， 其他人访问我们的服务
    host: '0.0.0.0',
    // 端口
    port: PORT,
  },
  ```

```
  // devServer就是使用express 运行的一个node代理服务， 用于本地起服务， 和实现本地代理跨域请求，实现本地调试
  // 使用webpack-dev-middleware express中间件实现webpack-dev-sever
  // devServer的代理proxy是根据http-proxy-middleware这个npm包实现的, http-proxy-middleware就是express的一个中间件

  const express = require('express');
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware'); // 监听文件改变重新执行
  const config = require('./webpack.config.js');
  <!-- node中使用webpack返回编译器 -->
  const complier = webpack(config); // 编译器，相当于执行一直编译器就自动打包一次代码
  const app = express();
  app.use(webpackDevMiddleware(complier, {
    publicPath: config.output.publishPath
  }));
  app.listen(3000, () => {
    console.log('serve is running')
  })
  ```

  # performance

  1. performance是webpack编译时的包大小和入口文件大小的监控， 配置打包结果的最大范围， 超出后警告或者报错， 也可以禁用掉包大小和入口文件大小监控， 默认值进行监控的， 超出范围warning提示
  2.




  # stats

  这个属性是控制编译时， 命令行输出的内容的

  1. 有一种情况就是， 输出太多看不到报错时， 可以只输出报错查看错误


# webpack 优化

## 1. 多线程构建 happyPack

作用: happypack 就是结合 loader 使用的, 实现 loader 多线程转换, 提高 loader 的转换速度

1. happypack 主要的字段: id(唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件), loaders(对哪些 loader 进行, 多线程转换), happypack 优化 js 时, happypack 的 loaders 中只能配置 babel-loader, 其他 loader 都配置在 use 中, happypack 优化 css 时, MiniCssExtractPlugin.loader 不能配置在 happypack 的 loaders 中, 只能配置在 use 中

## 2. tree shaking

## 3. optimization webpack 自带优化配置项

主要使用, minimizer 自定义 terserplugin 插件(js 压缩插件), splitChunks 提取公共代码, 根据缓存组的配置, 决定组名和分多少组, 组名+共同引用的各个入口名组成, 分割成的代码块名, 根据每组优先级, 决定采用哪个组的配置提取公共代码

#### 1. splitChunks 代码分割配置

```
splitChunks: {

  // 不管同步还是异步都提取公共模块

  chunks: 'all',

  // 提取出来的公共模块的最小大小， 不达到这个大小不能提取成公共模块

  minSize: 30000,

  // 文件大于多少时被二次拆分， 但是这个值需要大于minSize，否则配置不生效
  // 所以谨慎使用， 一般用不上
  maxSize: 0,

  // 模块被entry这里面入口通过import或者require引用的次数, 引用的次数大于等于minchunks才把模块提取到公共模块中去
  minChunks: 1,

  // 这俩都没有minChunks优先级高， 所以不用管他俩， 直接用默认值就行
  maxAsyncRequests: 5,
  maxInitialRequests: 3,

  // 公共chunk名的连接符

  automaticNameDelimiter: '-',

  name: true,

  // 缓存组(缓存组是直译解释， 其实应该理解为公共代码组, 可以形成各个公共代码chunk), 组名+共同引用的各个入口名组成, 分割成的代码块名

  cacheGroups: {

    // 每个缓存组
    vendors: {
      // 将哪些包分割成一个模块
      test: /[\\/]node_modules[\\/]/,
      // 优先级
      priority: -10,
      // 分割代码生成包的名称
      filename: '[name].js'
    },
     // 每个缓存组
    default: {
      minChunks: 1,
      priority: -20,

      // 是否使用已有的公共文件， 不重新创建文件，更新文件的名称，
      // 在最新的公共文件名称上添加上最新的引用文件的名称, 公共文件的默认命名规范在上面

      reuseExistingChunk: true,
    }
  }
}
```

## 4. service work 离线加载，

    1. webpack使用offline-plugin 实现 service work

  ### offline-plugin 使用

  1. npm install offline-plugin --save-dev ,安装

  2. 在打包的入口文件中引入，开启serviceworker

```
  import * as OfflinePluginRuntime from 'offline-plugin/runtime';
  OfflinePluginRuntime.install();
  ```

  3. 在webpack配置文件中配置 offline-plugin

```
  var OfflinePlugin = require('offline-plugin');
  module.exports = {
    plugins: [
      new OfflinePlugin()
    ]
  }
  ```

  4. 这样配置之后结果就是，会在最后打的包里生成一个用于处理servicework的sw.js文件， 这个文件名称是自己定义的，

  然后会在我们项目最后打包的js代码中， 自动引入这个sw.js（这里是个人理解， 因为在html中没有引入sw.js）, 然后剩下的
  事就可以交给sw.js了，它会自己处理serviceWorker的生命周期

  5. 在说一下，自己对serviceWorer的作用的理解， 他就是劫持请求， 在没有网的时候，将之前存储的数据，塞给请求，作为它的响应结果，保证在离线的情况下， 网页还可以正常浏览， 这是pwa的主要概念
