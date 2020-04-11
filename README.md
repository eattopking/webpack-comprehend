# webpack-comprehend

# webpack 感悟

1. webpack 的作用: webpack 就是一个模块化的构建工具, 它能处理 js, css, 图片, 和字体

2. ## 主要概念

# 2.1 loader

loader 的作用: 转换 webpack 无法处理的文件的工具, webpack 默认只能处理 js(ES5 和之前)和 json 文件, 处理比如 css, 图片, react, 都需要用 loader

主要 loader:

1. url-loader 和 file-loader, 是处理图片和图标字体的 loader, url-loader 可以将图片和字体转换为 base64 字符串, url-loader 内部是依赖 file-loader 的, 所以使用 url-loader 时,也要安装 file-loader, url-loader 特有的参数, limit 表示限制文件的大小, 单位是 b, 如果文件大小,大于或者等于 limit 的值, 那就不将文件转为 base64 字符串(url-loader 默认值 limit 是无限制的, 就是文件多大都可以转成 base64 字符串), 而是使用 fallback 设置的 loader 替代 url-loader 处理文件, fallback 的默认值是 file-loader(file-loader 就是正常的处理图片和图标字体的 loader, 还是转成正常的图片和图标字体),mimetype 设置需要转换文件的 mime 类型, 如果没有设置, 会根据后缀名, 查找 mime 类型所以一般不用设置, url-loader 其他的配置项和 file-loader 相同

2.

# 2.2 plugin

plugin 的作用: 因为 loader 的功能比较单一,就是转换文件的,plugin 就是在 webpack 生命周期注册是监听钩子, 用于处理 loader 无法处理的事情, 比如清楚就是包, 压缩 js 和 压缩 css

主要 plugin:

1. 热更新相关插件

NamedModulesPlugin(在命令行打印更新的文件名,而不是 id), 默认是 id

HotModuleReplacementPlugin 是配合 webpack-dev-server hot 共同处理热更新, hot: true 后, 需要引入 HotModuleReplacementPlugin 才能实现热更新, 或者是在, npm 指令中设置 webpack-dev-server --hot --open, 然后 webpack 就会自动引入 HotModuleReplacementPlugin 插件了, 不需要自己手动引入了, 开启热更新是将 css 和 js 的热更新都开了

2. css 相关插件

mini-css-extract-plugin(只在生产环境中使用) 作用, 将 css 整合到一个文件中, 使用 mini-css-extract-plugin 时, 使用 MiniCssExtractPlugin.loader 替换掉 style-loader, MiniCssExtractPlugin.loader 只在生产环境都可以用, 开发环境用 style-loader

optimize-css-assets-webpack-plugin 将 mini-css-extract-plugin 整合的 css 文件进行压缩

3. CopyWebpackPlugin copy 静态资源插件, 我们可以将本地静态资源 copy 到打的包里, 并且 to 的文件路径参照,就是打包完成的目录
   form 的文件路径参照就是项目根目录
   new CopyWebpackPlugin([
   { from: './src/platform/public/lang', to: '../public/lang' },
   { from: './src/platform/resource/', to: '../' }
   ])

4. CleanWebpackPlugin 删除项目里的目录, 主要用于,删除打包目录, 它的文件路径参照也是根目录
   new CleanWebpackPlugin(['dist/platform'], {
   root: path.join(\_\_dirname, '../../'),
   verbose: true,
   dry: false
   });

5. 

# 2.3 tree shaking

tree shaking 的概念就是做构建时的优化, 清除无用代码, 比如没有引用代码, tree shaking 有两大前提, 第一是必须使用 esmodule 模块化, 第二是 mode=production, 这有这样, tree shaking 才会生效, 需要在 package.json 中设置. sideEffects 来说明那些文件包含副作用不能随便删除代码, 一般就是样式,像 less, css 不能随便删除, 其他的都能随便删除

# 2.4 垫片

### webpack 优化

1. 多线程构建 happyPack
   happypack 就是结合 loader 使用的, 实现 loader 多线程转换, 提高 loader 的转换速度

happypack 主要的字段: id(唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件), loaders(对哪些 loader 进行,多线程转换)

happypack 优化 js 时, happypack 的 loaders 中只能配置 babel-loader, 其他 loader 都配置在 use 中

happypack 优化 css 时, MiniCssExtractPlugin.loader 不能配置在 happypack 的 loaders 中, 只能配置在 use 中

2. tree shaking

3. optimization webpack 自带优化配置项

主要使用, minimizer 自定义 terserplugin 插件(js 压缩插件), splitChunks 提取公共代码, 根据缓存组的配置, 决定组名和分多少组, 组名+共同引用的各个入口名组成, 分割成的代码块名, 根据每组优先级, 决定采用哪个组的配置提取公共代码, 模块根据被import次数,被提取到公共chunk中

splitChunks: {
  // 不管同步还是异步都提取公共模块
  chunks: 'all',
  // 提取公共模块的最小大小
  minSize: 30000,
  maxSize: 0,
  // 模块被import引用几次,才提取成公共模块
  minChunks: 1,
  maxAsyncRequests: 5,
  maxInitialRequests: 3,
  // 公共chunk名的连接符
  automaticNameDelimiter: '-',
  name: true,
  // 缓存组, 组名+共同引用的各个入口名组成, 分割成的代码块名
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
      reuseExistingChunk: true,
    }
  }
}
