# webpack 整理

***

## webpack 的作用
```
webpack 就是一个模块化的构建工具, 它能处理 js, css, 图片, 和字体
```

***

## 主要概念

## webpack 识别node_modules中包的 原理
1. webpack babel-loader中忽略node_modules中的包， 只是忽略对包中的语法的转化， webpack默认是可以识别代码中所有模块化引用导出的代码的， 所有包中的模块化代码都可以被webpack识别， 而不是需要webpack转化后识别

2. 在webpack中使用es6module导出的模块，可以被commonjs的方式引入(引入后就是一个对象， 对象上的属性就是导出的变量名)，使用commonjs导出的模块也可以被es6module的方式导入(导入的方式就是把commonjs导出当做export default 导出一样，所以引入的时候也是export default的引入方式)， 因为es6module相当于commonjs的封装，esmodule 引入图片的结果是图片的相对路径

3. 可以把引用的包，当做自己的也写组件一样， 在引用的时候， 因为就是静态文件， webpack对他们模块化的处理都是相同的

4. commonjs模块化对于文件的引用规则， 如果是例如require('antd')这样的引用， 会默认去检查是否是node的核心模块， 如果不是就去看node_modules里面是否有这个包(如果包还可以以这个包为项目的绝对路径，继续访问项目中的其他文件)， 如果在没有那就报错了，如果引用绝度路径或者是相对路径， 那就按照对应的路径规则去查找引用

5. babel-plugin-import 这个babel 插件是解决我们react组件npm包， 引用时需要组件和样式分别引用的问题的，使用了它之后， 只需要引用组件就可以达到引用样式的效果了

6. 安装npm包的时候， 不但会安装npm包本身， 还会安装这个包的package.json中的依赖，如果这个包导出的是编译好的结果，那这些依赖下载好了也是没有用的， 如果这个包导出的不是编译后的结果， 那这些依赖是有用的，这些依赖是组成这个包的一部分

7. 如果使用webpack编译一个包， 设置在externals中的依赖是不会被编译在包里的，而是将externals中的依赖安装在使用包的用户的node_modules中， 用户在使用webpack编译的时候再将, 在通过包中webpack编译后的依赖引用， 将node_modules中包的依赖编译到用户的最后产出的文件中

## webpack的理解

1. webpack默认值能识别， 多种模块化，不是babel-loader的作用， esmodule会先被webpack修改为对应的commonjs的模块化形式，然后在继续做模块化处理. export default 会被webpack 先转换为module.exports.default，export a 会被转换为 module.exports.a，然后在继续做模块化处理, 所以我们在用webpack构建的时候，是可以按照规则将  commonjs和esmodule混用的

2.

### chunk 和 module 的定义

1. chunk(代码块) 就表示我们构建出来的文件，（就好像我们正常项目中的tsx文件），module(模块，就是项目里的文件) 就表示chunk中引用的模块，就表示项目中文件，module就表示项目中文件，包括js文件， css文件， 图片等，就是我们（就好像我们tsx文件中通过import 引入的文件一样）

2. chunk中引入module， 需要通过moduleId当做key， 还有一个函数作为module内容赋值给这个key
```
这就是对应一个chunk的存储结构
[
  [111], chunk的chunkId
  {
    module1: () => {}, chunk中引入的两个module
    module2: () => {},
  }
]

然后script中执行webpack打包处理的代码， 需要使用webpack运行函数执行， 然后给webpack运行函数穿的参数需要是数组，数组的值就是module的值（就是module对应的函数）（webpack运行函数的默认参数就是数组）， webpack运行函数的参数也可以是对象
```

3. 每个chunk 都对应一个chunkId，默认的chunkId是chunk的索引值加1，但是这个chunkId是不固定的， chunkId其实是不需要变的，所以我们要固定chunk的chunkId， 因为chunkId改变会导致自己chunk内的对应自己chunkId的值改变，也会导致其他chunk中对应自己的chunkId发生改变， 因为chunkHash是根据chunk的内容计算出来， 所以chunk内容改变，会导致chunkHash重新计算， 导致chunkHash发生了改变， 也就导致借用chunkHash命名的chunk的名称发生改变，进一步导致前端浏览器内对文件的缓存失效了，导致前端持久化缓存失效了

4. 每个module 都对应一个moduleId，默认的moduleId是module的索引值加1，但是这个moduleId是不固定的， moduleId其实是不需要变的，所以我们要固定的moduleId， 因为moduleId改变会导致引用这个module的chunk内的对应自己moduleId的值改变，也会导致其他其他引用这个module的chunk中moduleId的改变， 因为chunkHash是根据chunk的内容计算出来， 所以chunk内容改变，会导致chunkHash重新计算， 导致chunkHash发生了改变， 也就导致借用chunkHash命名的chunk的名称发生改变，进一步导致前端浏览器内对文件的缓存失效了，导致前端持久化缓存失效了

5. 我们需要固定moduleId和chunkId， webpack5之前需要plugin固定，之后不需要了

6. mode: development (开发默认)的情况会默认 固定chunkId(使用NamedChunksPlugin， 把chunk的chunkId改成entry中对应入口名称, 通过配置optimization 的chunkId: 'named'，然后在webpack构建内部调用NamedChunksPlugin插件实现)， 和 moduleId (使用 NamedModulesPlugin， 把moduleId改成对应模块的相对路径字符串，通过配置optimization 的moduleIds: 'named'， 然后在webpack构建内部调用NamedModulesPlugin实现)， 这个两处配置都是在开发模式下webpack自动调用的,
生产模式 mode: production 也会默认固定moduleId（使用hashdModuleIdssPlugin实现）和chunkId，这些都是webpack4的实现， webpack5 直接更改了chunkId和moduleId的实现默认就是固定得了， 不需要再自己调用plugin固定， 或者webpack内部调用plugin实现固定

### target 构建目标
```
1. 可以构建用于node环境运行的代码，构建node环境用的js代码， 只需要构建自己写的代码， 不需要将核心模块代码和node_modules中的代码， 打包进最后的chunk中， 只保持commonjs  require就行， 所以我们在写node代码时， 也可以使用ts这样的等，webpack可以转化的语法，node默认支持模块化，所以就保持构建后的代码是commonjs模块化就行了
2. 也可以构建用于浏览器运行的代码, 可以将node_modules中的包打包到最后的chunk中, 也可以不打包进去， 在target: 'web'的js中使用
node代码， 构建的时候会执行， 获取到最后的结果，输出到最后的chunk中
3. 还可以构建其他环境运行的js代码， 参考文档
```

### entry

如果入口的js文件中引用了样式文件， 那最后打包的时候， 就会打包出一个和js文件名称相同的css文件

### output

```
主要配置

output.publicPath：

  就是给图片的请求路径补全的， 打包处理后的图片src路径就是publicPath补全后的结果,和publicPath拼接的url如果是../../a这样的， 那直接拼成publicPath/a 这样的结果， 不用管../../。

  1. 以/开头的图片请求路径，是绝对路径， 最终以  协议 + host + 以/开头的图片请求路径 的结果去请求图片
  2. 不以/开头的图片请求路径，是相对路径， 最终以  地址栏中html文件所在目录的整体url + 不以/开头的图片请求路径 的组合结果 去请求图片
  3. 提供了完成路径， 没有提供协议的， 以地址栏的协议为准请求图片
  4. 提供了协议的完整路径， 就以这个路径请求图片

library: 表示 打包出来的库，引用后，用什么名称使用，这个可以在多个场景使用, 可以使用在直接在html中引用打包好的js包，也可以在是webpack架构下的项目中使用import 引入包

libraryTarget: 表示打包好的库的导出方式，根据导出方式的不同， 库可以被多种场景使用，包括在script中直接引用，或者在webpack架构的项目下使用es6模块化或者commonjs模块化引入， umd导出方式就基本支持所有的导出方式了

注意： 如果webpack构建的包是一个给别人使用库， 入口文件就要导出我们给用户使用的内容（使用 expert（导出多个） 、expert default(导出一个)、或者使用commonjs模块化导出）， 如果webpack构建的包是用于业务代码执行的包，那就在入口文件中直接执行代码， 不需要导出代码
```
### 再看看字体是怎么引用的， 可错误的在改

### resolve 用于处理模块解析的相关参数

```
使用绝对路径引用模块时的查找路径（路径必须是绝对路径）， 可以设置多项， 排在前面的优先级高， 别名alias 比他的优先级更高

resolve.modules:['node_modules'] (默认值),
```

#### externals 外部扩展  就是根据webpack配置将包现有引入方式， 改为配置的引入方式，然后在宿主环境中引到对应的包，继续发挥之前的作用, externals可以用在业务代码， 包从cdn引入的情况， 也可以用在库的构建，从引用者的node_modules中引入

```
有几种形式：

1. 编译后， 将原有的引入方式编译成commonjs2的引入方式， 以后的名称还是原有的名称， 这就适合构建包的时候使用
externals: {
    'fs-extra': 'commonjs2 fs-extra',
},

2. 构建后， 将原有fs-extra的引入， 编译成从window中或者global中的Fs属性中提取包， 这比较适合业务代码的构建， 然后依赖包从cdn获取的情况
externals: {
    'fs-extra': 'Fs',
}

3.
externals: {
    'lodash': {
      // root 就是和2一样，构建后将一样的方式改成从全局变量_获取包， 如： window['_']
      root: '_',
      // 构建后， 将原有引用包的形式， 构建成使用commonjs的引用方式引入， 引用的结果是lodash， 例如 const lodash = require('lodash');
      commonjs: 'lodash',
      // 构建后， 将原有引用包的形式， 构建成使用commonjs2的引用方式引入， 引用的结果是lodash， 例如 import lodash from 'lodash';
      commonjs2: 'lodash'
    },
}
```

### loader

```
loader 的作用:

转换 webpack 无法处理的文件的工具, webpack 默认只能处理 js(ES5 和之前)和 json 文件, 处理比如 css, 图片, react, 都需要用 loader
```

#### 主要 loader
```
  raw-loader 处理字符串数据

  1. webpack5 之前处理图片和字体等文件：
  url-loader、file-loader就是处理图片、字体等文件的模块化引用， 和最后的构建打包生成的路径和文件名称的loader, 将指定文件类型构建输出到固定目录下， 因为图片文件和字体文件都没有导出但是可以被require和import引入， 这都是url-loader和file-loader的作用, import和require引入得到的图片和字体文件结果都是被url-loader和file-loader处理后得到的， 得到的结果都是被url-loader和file-loader处理后的文件的相关信息， 所以我们引用本地构建的图片和字体文件就先先引入在使用， 不能直接写路径， 因为构建之后的文件名称和路径是会变的，使用 url-loader然后import或者require得到的图片信息是图片路径， 但是使用file-loader然后import得到的图片信息是路径，require得到的图片信息是对象，对象的default属性是图片的路径， 导师可以通过试着file-loader的esmodule为 false，实现require和import得到的图片信息都是路径

  2. 在js中想要被url-loader、file-loader处理然后打包到最后的文件中，需要使用import或者require引用图片等文件、在css引用图片等文件就不需要import或者require，  因为css-loader会将css中相对路径的图片转化为require形式的

  3. webpack5 开始就提供了内置的配置处理图片和字体等文件了，就不在需要url-loader和file-loader， raw-loader了

  4. 处理每种文件的loader， 或者输出， 都有对自己输出文件的publicPath的控制，比如js的output中的publicPath， minicsspluginloader中的publicPath， 都是对构建出来的css或者js中的图片等资源的引用路径的设置

  5. file-loader、和url-loader只会将图片、字体等文件构建输出， 不会影响引用这些资源的文件中原有的引用路径，但是通过原有的引用路径得到的结果是构建后的路径结果， js中的require和import得到的就是构建后的图片地址路径，不需要处理， css中使用本地图片路径，可能需要在minicssloader中处理一下publicPath， 使构建后的文件中也能应用到原有的，图片等文件

  url-loader的主要作用：

  就是处理图片和字体的等文件名字和文件打包到的位置的， 将图片的src引用处理成base64编码字符串，可以达到减少http请求的优化作用，因为图片的src引用变成base64字符串后，加载图片的时候就不会，发送额外的http请求了， 会在加载html的时候直接就加载图片了，但是现在都是js动态生成html啊

  1. url-loader 和 file-loader, 是处理图片和图标字体的 loader, 但是url-loader可以将图片转成base64格式
  2. url-loader 可以将图片和字体转换为 base64 字符串
  3. url-loader 内部是依赖 file-loader 的, 所以使用 url-loader 时,也要安装 file-loader
  4. url-loader 特有的参数, limit 表示可以转换为base64编码的图片文件的最大值, 单位是 b, 如果文件大小大于limit 的值, 那就不将  文件转为 base64 字符串(url-loader 默认值 limit 是无限制的, 就是文件多大都可以转成 base64 字符串), 而是使用 fallback 设置  的 loader 替代 url-loader 处理文件, fallback 的默认值是 file-loader(file-loader 不能将图片转为base64编码，其余和  url-loader一样)
  5. mimetype 设置需要转换文件的 mime 类型, 如果没有设置, 会根据后缀名, 查找 mime 类型所以一般不用设置, url-loader 其他的配置 项和 file-loader 相同
  6. url-loader 的name属性，就是设置打包后文件的目录和文件名的， 如果只设置文件名， 那就将文件打包到output.path设置的目录下
  ```
  ```
  babel 的理解

  babel 是 js 文件的转换工具, 主要包括babel-core(babel的主要实现), babel-polyfill(对babel不支持的 一次方法的补充), babelrc文件, 主要配置babel的present(预设, 常见有present-env处理es6, 7, 8, 9, 10 还有将要进入es规范的, present-react处理react语法的), 还有plugins(babel的一些插件, 起到处理文件时一 些其他的作用)

  babel的原理, 还各个部分的具体功能和实现:  待续
```

****

### plugin

```
plugin 的作用:

因为 loader 的功能比较单一, 就是转换文件的, plugin 就是在 webpack 生命周期注册是监听钩子, 用于处理 loader 无法处理的事情, 比如清楚就是包, 压缩 js 和 压缩 css
```

#### 主要 plugin
```
热更新相关插件

NamedModulesPlugin(在命令行打印更新模块(就是文件)id, 使用的是模块的路径名, 而不是 数字id), 默认是 数字id, 这样有助于我们在命令行查看更新的文件, 在开发环境使用, 但是这个插件执行的时间有些长, 看情况使用

HashedModuleIdsPlugin:

正常模块id是数字, 按照模块的顺序分为0, 1, 2, 3, 4, 5..., 会根据顺序的改变而发生变化id值, id发生变化后, 他们组成的chunk的chunkhash也会发生变化, HashedModuleIdsPlugin的作用就是根据模块的相对路径生成一个四位数的hash作为模块id, 而不是按照顺序作为id了, 这样当模块顺序变化时就不会, 导致他们组成chunk的chunkhash改变了, HashedModuleIdsPlugin用于生成环境, 优化根据chunkhash判断的强缓存

HotModuleReplacementPlugin:

是配合 webpack-dev-server hot 共同处理热更新, hot: true 后, 需要引入 HotModuleReplacementPlugin 才能实现热新, 或者是在, npm 指令中设置 webpack-dev-server --hot --open, 然后 webpack 就会自动引入HotModuleReplacementPlugin 插件了, 不需要自己手动引入了, 开启热更新是将 css 和 js 的热更新都开了
```
```
css 相关插件

mini-css-extract-plugin(只在生产环境中使用):

将 css 整合到一个文件中, 使用 mini-css-extract-plugin 时, 使用 MiniCssExtractPlugin.loader 替换掉 style-loader, MiniCssExtractPlugin.loader 只在生产环境都可以用, 开发环境用 style-loader

optimize-css-assets-webpack-plugin:

将 mini-css-extract-plugin 整合的 css 文件进行压缩

去除没有用到的css， 类似于js的tree shaking

purgecss-webpack-plugin
```
```
CopyWebpackPlugin:

copy 静态资源插件, 我们可以将本地静态资源 copy 到打的包里, 并且 to 的文件路径参照, 就是打包完成的目录

form 的文件路径参照就是项目根目录
new CopyWebpackPlugin([
  { from: './src/platform/public/lang', to: '../public/lang' },
  { from: './src/platform/resource/', to: '../' }
])
```
```
CleanWebpackPlugin:

删除项目里的目录, 主要用于, 删除打包目录, 它的文件路径参照也是根目录

new CleanWebpackPlugin(['dist/platform'], {
  root: path.join(\_\_dirname, '../../'),
  verbose: true,
  dry: false
});
```
```
html 相关

HtmlWebpackPlugin 插件:

1. 可以用于在生产模式下， 产生最后返回的html文件，打包的css文件和js文件会根据对应的目录关系自动引入html，其他不是本次打包的js代码，需要使用AddAssetHtmlWebpackPlugin加到html文件中
2. 也可以用于开发模式下，返回开发模式下最后的html文件， 用开发展示
3. HtmlWebpackPlugin可以多次调用， 生成多个html文件， 这个主要是用在打包多页面
4. 多入口打包调用多次HtmlWebpackPlugin 会生成多个html文件， 默认每个html文件中都会引入所有入口打包后和公共的js文件，
如果我们想只引入对应入口的js文件和指定的公共chunk， 那就在对应的HtmlWebpackPlugin的chunks数组中设置对应的entry 属性名称， 这样自己的html页面就只会引入自己的js文件了， 还有相反的excludeChunks， 就是在html不引入那些js, 我们可以在chunks配置通过entry 的属性名称设置引入的js， 也可以通过配置构建公共模块时的chunk名称（这个名称是不包括文件后缀的），来控制将公共chunk引入到我们的html文件中， 只有我们入口文件的相关文件中引入了css， css才会被构建出对应的css文件， 才会在html引入，对应引入的js chunks 相关的css文件

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
```
add-asset-html-webpack-plugin插件:

1. 这个 plugin 是将js文件引入到 html 文件中
```
```
webpack.HashedModuleIdsPlugin

1. 将 module id 转换为根据路径生成的 hash, 防止 hash 值变化
```
****

### tree shaking
```
作用: tree shaking 的概念就是做构建时的优化, 清除无用代码比如没有引用代码

要求: 使用tree shaking 有两大前提
1. 是必须使用 esmodule 模块化
2. mode=production, 这有这样, tree shaking 才会生效, 需要在 package.json 中设置. sideEffects 来说明那些文件包含副作用不能随便删除代码, 一般就是样式, 像 less, css 不能随便删除, 其他的都能随便删除
3. webpack5 内部 tree shaking 处理了更深层级的export，进一步去除了无用代码， 减小代码体积
```
****

#### prepack

webpack5 内部使用prepack整合代码， 使编译后的代码变得更加简洁，执行速度更快， 代码体积更小

### shimming (垫片)

```
shimming 就是用来解决对不支持模块化的一些老库的引用问题，还有避免重复引用的问题

主要使用：

providePlugin 是向我们的文件中自动引入node_modules中的包， 使用import 或者require（这是从构建结果出发这么说的， 这是在构建构后达到了和手动引入一样的先过），使我们在开发过程中不需要每次都import模块， 例如react ， 使用这个配置后， 就不需要在每个文件中都引入react了，避免了报错react17之前

exports-loader 将文件中的全局变量，导出成模块

imports-loader 在文件中引入全局变量

script-loader 类似在html中使用script标签引入js包

expose-loader 就是我们可以设置引用node_modules中的模块是有， 我们自己项目中的模块， 然后作为变量放在window或者global中，这个根据target决定，然后使用script引用我们构建的包后，全局的window或者global中就有这个属性了， 就可以用了
```

****

### 多种hash的概念和作用

```
作用:

通过各种hash对文件进行命名是为了，做前端性能优化， 在生产环境的时候， 对请求的文件开启强缓存， 当文件内容 没有变时， 我们的hash也就不变， 此时我们加载文件， 就会走之前的强缓存， 如果我们hash变了，文件名就变 了， 那就会去加载最新的文件， 原来的文件的缓存也就没有意义了， 这样就不会走缓存了, 就是只有这一个作用，  并不会在hash不变时，构建的时候就不创建这个文件
```
```
1. hash表示每次构建完成产生的hash值, compilation产生的hash值, 多入口打包时，所有入口对应的hash值都是一个, 在webpack5之前是这样的， 但是webpack5中每次构建完成产生的hash值, compilation产生的hash值， 使用fullhash表示，hash只表示模块hash(就是原来的modulehash)

2. chunkhash表示创建chunk时，chunk的hash， 后续代码块内的代码不变， chunkhash也是不变的

3. contenthash 表示MiniCssExtractPlugin最后整合出来的css文件的hash，因为一开始css是在js中的, 所以css和js是一个代码块的，所以共用一个chunkhash， 所以这也就导致一个问题， 那就是但是css没有改变时， js发生改变，css的chunkhash也会变，所以导致css也进行了没有必要的加载，影响了性能，contenthash只会关注css文件的变化，css文件变化后， contenthash才会变, 确保只有css变化是contenthash才会变, contenthash: 根据文件内容计算而来

4. id在表示chunk的时候就是chunkId， 在表示module的时候就是moduleId
```
****

### webpack devSerVer

```
1. 使用https 和跳过https浏览器证书认证
2. 热更新的实现原理还没有写还不懂
```

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
devServer就是使用express 运行的一个node代理服务， 用于本地起服务， 和实现本地代理跨域请求，实现本地调试
使用webpack-dev-middleware express中间件实现webpack-dev-sever
devServer的代理proxy是根据http-proxy-middleware这个npm包实现的, http-proxy-middleware就是express的一个中间件

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

### performance
```
1. performance是webpack编译时的包大小和入口文件大小的监控， 配置打包结果的最大范围， 超出后警告或者 报错， 也可以禁用掉包大小和入口文件大小监控， 默认值进行监控的， 超出范围warning提示
```
### stats
```
这个属性是控制编译时， 命令行输出的内容的

1. 有一种情况就是， 输出太多看不到报错时， 可以只输出报错查看错误
```

### webpack 优化

#### 多线程构建 happyPack
```
作用:
happypack 就是结合 loader 使用的, 实现 loader 多线程转换, 提高 loader 的转换速度

1. happypack 主要的字段: id(唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件), loaders(对哪些 loader 进行, 多线程转换), happypack 优化 js 时, happypack 的 loaders 中只能配置 babel-loader, 其他 loader 都配置在 use 中, happypack 优化 css 时, MiniCssExtractPlugin.loader 不能配置在 happypack 的 loaders 中, 只能配置在 use 中
```

#### tree shaking

上面提到了， 就是去掉构建过程中发现的无用代码

#### scope hoisting （作用域提升）

webpack内部使用 ModuleConcatenationPlugin(模块关联插件)， 将所有和模块导出引用的相关的代码都放到一个函数中，
使精简代码， 减少代码量，减少webpack内部的webpack_require的多次引用， 提升了执行的速度，scope hoisting 是在mode
为 production时， webpack会自动调用，模块只有使用的es6模块， scope hoisting 才会将模块的导入和引用还有使用放到一个函数中，非es6模块化还有动态加载import(), scope hoisting 都不会对他们起作用

#### cache-loader 缓存

webpack5 中内置了缓存配置， 不在需要配置cache-loader实现缓存

#### optimization webpack 自带优化配置项

```
主要使用, minimizer 自定义 terserplugin 插件(js 压缩插件), splitChunks 代码分割，将符合缓存组配置要求的文件提取到一个构建后的文件中, webpack默认提供了vendors和default缓存组， 如果想取消这两个缓存组， 需要将他们设置为false, 缓存组提取的文件默认命名规则为：组名+共同引用的各个入口名+chunkhash:8组成（但是也是可以直接通过name属性设置构建后文件的名称的）, 根据缓存组的优先级, 依次去构建提取出对应文件， 如果没有满足缓存组条件的文件，那就过，就不提取对应缓存组的文件了
```
```
splitChunks 代码分割配置, 就是提取多个入口的公共代码，提高构建的性能， 然后利用html-webpack-plugin将主文件和公共文件引入到对应的页面的html中去， 所有他们两个是配合使用的

代码分割的意义主要就是，将公共代码提取出来， 将有的包提取单独提取出来 和 总得项目js文件分开， 这样可以加快构建的速度， 还可以提取公共逻辑(在构建多入口的时候避免， 每个入口的包里都构建进去相同的包， 这样降低效率， 还可以不管在多入口还是单入口的时候根据我们项目需要构建出多个包， 这样可以将一个大包分成多个小文件多次加载， 不是一次加载一个大文件， 提高我们的加载效率，
加载后浏览器会对文件进行缓存， 所以代码拆分的时候， 需要在缓存和文件请求数这里做一下权衡）

import() 动态加载的模块， 将会被单独编译成一个文件， 如果使用htmlWebpackPlugin不会将这个文件引入到html文件中，
而是浏览器中使用这个动态加载模块时， 在去通过jsonp去加载这个文件，并使用文件中的模块

splitChunks: {

  // 不管同步初始情况还是异步都提取到公共文件，还可以区分使用同步加载时，符合下方条件时被提取成一个单独的文件，
  // 使用异步加载时，符合下方条件时被提取成一个单独的文件，就是使用import();

  chunks: 'all', 可以根据异步和同步在对应的缓存组中单独设置chunks，要不避免同步和异步提取代码的混合

  // 构建后被提取成单独文件的原文件大小， 大于等于这个大小才会被单独提取成一个文件, 文件大小的单位是b

  minSize: 30000,

  // 文件大于多少时被二次拆分， 但是这个值需要大于minSize，否则配置不生效
  // 所以谨慎使用， 一般用不上
  maxSize: 0,

  // 模块被entry这里面的几个入口引用了, 就将这个模块放到公共的模块中，引用这个模块的入口数大于等于minchunks才把模块提取到公共模块中去
  minChunks: 1,

  // 这俩都没有minChunks优先级高， 所以不用管他俩， 直接用默认值就行
  maxAsyncRequests: 5,
  maxInitialRequests: 3,

  // 公共chunk名的连接符

  automaticNameDelimiter: '-',

  // 自定义构建后文件名称的文案, 写成true其实没啥意义
  name: true,

  // 缓存组(缓存组是直译解释， 其实应该理解为公共代码组, 可以形成各个公共代码chunk), 组名+共同引用的各个入口名组成, 分割成的代码块名

  cacheGroups: {
    // 每个缓存组都是一样的， vendors， default这两个缓存组是默认就有的， 写不写都是有的，这两个缓存组是有默认配置的， 还可以自己加其他缓存组， 构建执行缓存组规则的顺序， 就是按照缓存组的priority（权重）优先级的顺序依次去构建提取公共模块代码
    // test,priority, reuseExistingChunk这三个配置项是缓存组特有的， 其他的项都是缓存组和splitChunks公共选项共用的， 缓存组中的属性可以覆盖splitChunks公共选项

    // 默认缓存组
    vendors: {
      // 将哪些包分割成一个模块
      test: /[\\/]node_modules[\\/]/,
      // 优先级
      priority: -10,
      // 自定义构建后文件名称的文案
      name: 'test',
      // 公共文件最终的名字, 如果不加filename， 就是默认的name + chunkhash， 如果不设置name, name就按照默认规则生成
      filename: '[name].js'
    },

    //  默认缓存组
    default: {
      minChunks: 1,
      // priority值越大它的优先级越高
      priority: -20,

      // 如果当前缓存组要提取的文件， 已经被其他优先级高的缓存，提取到单独的文件中去了， 那么我们这个缓存组提取的文件中就不提取这个文件了， 当reuseExistingChunk为true时

      reuseExistingChunk: true,
    }
  }
}
```

#### service work 离线加载:

webpack使用offline-plugin 实现 service work

```
offline-plugin 使用:

1. npm install offline-plugin --save-dev ,安装

2. 在打包的入口文件中引入，开启serviceworker

import * as OfflinePluginRuntime from 'offline-plugin/runtime';
OfflinePluginRuntime.install();

在webpack配置文件中配置 offline-plugin
var OfflinePlugin = require('offline-plugin');
module.exports = {
  plugins: [
    new OfflinePlugin()
  ]
}

4. 这样配置之后结果就是，会在最后打的包里生成一个用于处理servicework的sw.js文件， 这个文件名称是自己定义的，然后会在我们项目最后打包的js代码中， 自动引入这个sw.js（这里是个人理解， 因为在html中没有引入sw.js）, 然后剩下的事就可以交给sw.js了，它会自己处理serviceWorker的生命周期

5. 在说一下，自己对serviceWorer的作用的理解， 他就是劫持请求， 在没有网的时候，将之前存储的数据，塞给请求，作为它的响应结果，保证在离线的情况下， 网页还可以正常浏览， 这是pwa的主要概念
```

# webpack-cli 主要指令

1. webpack --config webpack.config.js, --config 是执行webpack配置文件的指令
2. webpack 也可以不需要配置文件， 直接在命令行， 设置入口和出口， 但是这样不实用
3. webpack-bundle-analyzer 和 webpack --json配合使用， webpack --json 以json的形式产生控制台打印出来的数据， webpack-bundle-analyzer解析这个json数据
4. webpack --env 是获取设置shell里面的所有环境变量的， 是全局的
5. webpack --debug 打开loader的debug模式， 不知道有啥用
6. webpack --devtool 将devtool 设置为source-map模式， 可以让我们看到源码， 进行调试
7. webpack --progress 就是在控制台打印， 编译的进度
8. webpack --dispaly-error-details 这个展示我们编译报错的细节
9. webpack --color 设置控制台输出的样式
10. webpack --profile 就是在控制台打印，编译时每个步骤所需要的时间， 现在我是这么理解的， 还需要后续验证


疑问：

1. libraryTarget:__system_context 这个有啥用

2. 外部扩展 这个是啥意思

module.exports = {
  externals: [
    function(context, request, callback) {
      // 该外部化模块是一个在`@scope/library`模块里的命名导出（named export）。
      callback(null, ['@scope/library', 'namedexport'], 'commonjs');
    }
  ]
};


暴露打包的包和暴露不打包的包， 有啥区别， 为啥要那样, 两种的区别是啥


### webpack5升级

