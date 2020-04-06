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

HotModuleReplacementPlugin是配合 webpack-dev-server hot 共同处理热更新, hot: true 后, 需要引入 HotModuleReplacementPlugin 才能实现热更新, 或者是在, npm 指令中设置 webpack-dev-server --hot --open, 然后 webpack 就会自动引入 HotModuleReplacementPlugin 插件了, 不需要自己手动引入了, 开启热更新是将css和js的热更新都开了

2. css相关插件

mini-css-extract-plugin(只在生产环境中使用) 作用, 将css整合到一个文件中, 使用mini-css-extract-plugin时, 使用MiniCssExtractPlugin.loader替换掉style-loader, MiniCssExtractPlugin.loader只在生产环境都可以用, 开发环境用style-loader

optimize-css-assets-webpack-plugin将mini-css-extract-plugin整合的css文件进行压缩


# 2.3 tree shaking

tree shaking 的概念就是做构建时的优化, 清除无用代码, 比如没有引用代码, tree shaking有两大前提, 第一是必须使用esmodule模块化, 第二是mode=production, 这有这样, tree shaking才会生效, 需要在package.json中设置. sideEffects来说明那些文件包含副作用不能随便删除代码, 一般就是样式,像less, css不能随便删除, 其他的都能随便删除


# 2.4 垫片



### webpack优化

1. 多线程构建 happyPack

2. tree shaking

3. 


