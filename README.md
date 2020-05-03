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

NamedModulesPlugin(在命令行打印更新模块(就是文件)id,使用的是模块的路径名,而不是 数字id), 默认是 数字id, 这样有助于我们在命令行查看
更新的文件, 在开发环境使用, 但是这个插件执行的时间有些长, 看情况使用

HashedModuleIdsPlugin: 正常模块id是数字, 按照模块的顺序分为0,1,2,3,4,5...,会根据顺序的改变而发生变化id值, id发生变化后, 他们组成的chunk的chunkhash也会发生变化,HashedModuleIdsPlugin的作用就是根据模块的相对路径生成一个四位数的hash作为模块id, 而不是按照顺序作为id了,这样当模块顺序变化时就不会, 导致他们组成chunk的chunkhash改变了, HashedModuleIdsPlugin用于生成环境, 优化根据chunkhash判断的强缓存

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

5. html相关

1.HtmlWebpackPlugin 可以用于在生产模式下， 产生最后返回的html文件，打包的css文件和js文件会根据对应的目录关系自动引入html，其他不是本次打包的js代码，需要使用AddAssetHtmlWebpackPlugin加到html文件中，HtmlWebpackPlugin可以直接配置chunk, 引入代码分割产生的代码块
2.也可以用于开发模式下，返回开发模式下最后的html文件， 用开发展示

add-asset-html-webpack-plugin 这个plugin是将文件添加html文件中， 可以添加js文件

6. new webpack.HashedModuleIdsPlugin(), // 将module id转换为根据路径生成的hash,防止hash值变化
# 2.3 tree shaking

tree shaking 的概念就是做构建时的优化, 清除无用代码, 比如没有引用代码, tree shaking 有两大前提, 第一是必须使用 esmodule 模块化, 第二是 mode=production, 这有这样, tree shaking 才会生效, 需要在 package.json 中设置. sideEffects 来说明那些文件包含副作用不能随便删除代码, 一般就是样式,像 less, css 不能随便删除, 其他的都能随便删除

# 2.4 垫片

# 2.5 多种hash的概念和作用
通过各种hash对文件进行命名是为了，做前端性能优化， 在生产环境的时候， 对请求的文件开启强缓存， 当文件内容没有变时， 我们的hash也就不变， 此时我们加载文件， 就会走之前的强缓存， 如果我们hash变了，文件名就变了， 那就会去加载最新的文件， 原来的文件的缓存也就没有意义了， 这样就不会走缓存了, 就是只有这一个作用， 并不会在hash不变时，构建的时候就不创建这个文件

1. hash表示每次构建完成产生的hash值,compilation产生的hash值, 多入口打包时，所有入口对应的hash值都是一个
2. chunkhash表示创建每个代码块时，代码块的hash， 后续代码块内的代码不变， chunkhash也是不变的
3. contenthash 表示MiniCssExtractPlugin最后整合出来的css文件的hash，因为一开始css是在js中的，
所以css和js是一个代码块的，所以共用一个chunkhash， 所以这也就导致一个问题， 那就是但是css没有改变时， js发生改变，css的chunkhash也会变，所以导致css也进行了没有必要的加载，影响了性能，contenthash只会关注css文件的变化，css文件变化后， contenthash才会变, 确保只有css变化是contenthash才会变, contenthash:根据文件内容计算而来
4. id 指的就是模块(文件)id, 默认是数字




### webpack 优化

1. 多线程构建 happyPack
   happypack 就是结合 loader 使用的, 实现 loader 多线程转换, 提高 loader 的转换速度

happypack 主要的字段: id(唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件), loaders(对哪些 loader 进行,多线程转换)

happypack 优化 js 时, happypack 的 loaders 中只能配置 babel-loader, 其他 loader 都配置在 use 中

happypack 优化 css 时, MiniCssExtractPlugin.loader 不能配置在 happypack 的 loaders 中, 只能配置在 use 中

2. tree shaking

3. optimization webpack 自带优化配置项

主要使用, minimizer 自定义 terserplugin 插件(js 压缩插件), splitChunks 提取公共代码, 根据缓存组的配置, 决定组名和分多少组, 组名+共同引用的各个入口名组成, 分割成的代码块名, 根据每组优先级, 决定采用哪个组的配置提取公共代码, 模块根据被import次数,被提取到公共chunk中
优先级   maxAsyncRequests/maxInitialRequests < maxSize < minSize , 所以设置了minSize,其他三个就没啥用了 ,内部使用了SplitChunksPlugin 实现, 代码分割对js和css都是生效的

test、priorty和reuseExistingChunk只能用于配置缓存组, 还有splitChunks的选项也可以在缓存组中使用, 覆盖splitChunks的内的选项

splitChunks: {
  // 不管同步加载的模块还是异步加载的模版都可以提取公共模块  async 异步加载的模块, 比如inport(), initial 不是异步加载的模块
  chunks: 'all',
  // 提取公共模块的最小大小, 当公共模块的大小最小达到多少的时候, 才提取成一个公共模块, 单位是b
  minSize: 30000,
  // 当公共模块大小达到maxsize的时候, 对他进行二次分割, 但是当maxSize的大小小于minsize的时候, maxsize就失效了, 因为minsize优先级最高
  maxSize: 0,
  // 模块被引用几次,才提取成公共模块
  minChunks: 1,
  // 异步请求的文件分割成了几个公共模块, 异步请求的文件就不再进行分割了
  maxAsyncRequests: 5,
  // 非异步请求的文件分割成了几个公共模块, 异步请求的文件就不再进行分割了
  maxInitialRequests: 3,
  // 公共chunk名的连接符
  automaticNameDelimiter: '-',
  // 是否使用output的文件命名方式, 当output的name在这里不是入口文件的name, 而是组名+共同引用的各个入口名组成, 默认true(使用), 还可以使用false, 就会按照index(0,1,2,3,4)来命名, 还可以使用, 这里设置的name可以被缓存组中的filename覆盖掉
  函数和字符串, 这俩之后在研究, true基本就够用了
  name: true,
  // 缓存组, 组名+共同引用的各个入口名组成, 分割成的代码块名
  cacheGroups: {
    // 每个缓存组, vendors公共模块一般就是提取第三方模版的公共模块的
    // 给哪个缓存组设置false就是禁用了, 可以自己自定义缓存组
    vendors: {
      // 设定当前缓存项, 需要代码分割的范围, 没有设置就是包含所有文件
      test: /[\\/]node_modules[\\/]/,
      // 优先级
      priority: -10,
      // 分割代码生成包的名称, 这里name代表组名+共同引用的各个入口名组成模块名
      filename: '[name].js',‘
      // 告知 webpack 应该忽略
      // splitChunks.minSize,splitChunks.minChunks,splitChunks.maxAsyncRequests和
      // splitChunks.maxInitialRequests 的配置项，并且总是为此缓存组创建块, 一般用不上
      enforce: true
    },
     // 每个缓存组,default公共模块一般就是提取自己写的公共模块的
    default: {
      minChunks: 1,
      priority: -20,
      // 一个代码块正常的命名方式, 就是缓存组的名+各个引用了当前代码块的文件的名称拼接而成的, 但是如果reuseExistingChunk设置为true,
      那命名方式就以第一引用的文件名称为准了, 之后引用的文件, 名称不会拼接到代码块的名称上去, 代码块不会重新创建更改名称了, 而是一直复用第一次创建的代码块, 如果reuseExistingChunk设置为false就会重新创建代码块, 更新代码块名称
      reuseExistingChunk: true
    }
  }
}
