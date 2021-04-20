/**
 * 1. plugin 就是 包含apply函数的类或者构造函数, 然后apply这个方法的参数是compiler对象
 * 2. 开发plugin 就是 开发一个使用commonjs 模块化暴露的包含apply 方法的类或者构造函数
 * 3. 同步的插件事件直接执行就行， 异步的插件事件需要在执行完之后， 执行callback回调
 * 4. 可以通过给compiler和compilation的属性赋值或者其他操作来达到插件想要达到的效果
 */