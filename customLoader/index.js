/**
 * 1. loader 就是一个函数， 参数接收上一个loader处理后的文件字符串， 或者文件内容初始字符串, 然后return 处理后的文件字符串结果
 * 2. 开发loader 就是使用commonjs 模块化返回这个 loader 函数
 * 3. 每个loader都是接收上一个loader的处理结果
 */