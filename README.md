# 启动web项目并进行调试



## `思路`：

	1.通过 webpack resolve.alias 改变依赖包的指向，来调试react源码。
	2.指向的这个文件目录下如果包含.map.js 文件，就能定位打包后代码，所在的源码的位置。



## `笔记`位于debugNote文件下



## `具体操作`



### 1. `拉去并打包react源码`



详见 `前置操作`

> 打包统一用 npm or yarn 
>

把react源码的整个文件置于 该仓库同级目录下

```
-react-debug // 这个就是这个仓库
-react // 这个是就是 react 源码
```

### 2. `yarn install`

### 

### 3. `yarn start` & 启动 Vs Code 运行调试



做好1和2,现在直接启动就好了，webpack配置已经改好了。



具体操作可以看下面详见 `方案1` 或者 `方案2`

目前这个仓库是用方案2来做的，因为这样用 Vs Cdoe 进行调试打断点的时候，会直接跳转到对应的源码文件，所有信息都可以在调试控制台看到。



现在在源码里随意打断点就行了。



## 前置操作

```js
# 拉取代码
git clone https://github.com/facebook/react.git

# 改sourceMap 配置 
cd ./scripts/rollup/build.js

function getRollupOutputOptions(
  outputPath,
  format,
  globals,
  globalName,
  bundleType
) {
  const isProduction = isProductionBundleType(bundleType);

  return {
    file: outputPath,
    format,
    globals,
    freeze: !isProduction,
    interop: false,
    name: globalName,
    sourcemap: true,
    esModule: false,
  };
}

TODO 注释4个插件 因为他们不构建 sourcemap
// {
//   transform(source) {
//     return source.replace(/['"]use strict["']/g, '');
//   },
// },
// isProduction &&
//   closure(
//     Object.assign({}, closureOptions, {
//       // Don't let it create global variables in the browser.
//       // https://github.com/facebook/react/issues/10909
//       assume_function_wrapper: !isUMDBundle,
//       renaming: !shouldStayReadable,
//     })
//   ),
// shouldStayReadable &&
//   prettier({
//   parser: 'babel',
//   singleQuote: false,
//   trailingComma: 'none',
//   bracketSpacing: true
// }),
// License and haste headers, top-level `if` blocks.
// {
//   renderChunk(source) {
//     return Wrappers.wrapBundle(
//       source,
//       bundleType,
//       globalName,
//       filename,
//       moduleType,
//       bundle.wrapWithModuleBoundaries
//     );
//   },
// },
# 打包
yarn build
```

## 方案1

```shell
# 拉取代码
git clone https://github.com/facebook/react.git

# 如果拉取速度很慢，可以考虑使用cnpm代理
git clone https://github.com.cnpmjs.org/facebook/react

# 切入到react源码所在文件夹
cd react

# 安装依赖
yarn

# 参考修改配置以打包出 sourceMap
https://juejin.cn/post/7126501202866470949#heading-1

# 到 build/node_modules/ react、react-dom、 建立软连接
yarn link

success Registered "react".
success Registered "react-dom".

# 以任意方式创建1个新的 react 项目 如 cra

# 将项目内的react react-dom指向之前申明的包
yarn link react react-dom

# 解除软链

npm unlink react react-dom

success Using linked package for "react".
success Using linked package for "react-dom" 

```

link 我觉得不好使。

1是不方便定位具体调用所属的文件，不利于理解。

2是项目使用link后，好像没有任何标示。

## 方案2 目前 debug2 目录使用的方法

```shell
# 1. 在刚刚clone react 同级目录下或随意 目录下 cra 创建应用

# 2. yarn eject 暴露配置

# 3. 改 config\webpack.config.js 配置

    resolve: {
      // This allows you to set a fallback for where webpack should look for modules.
      // We placed these paths second because we want `node_modules` to "win"
      // if there are any conflicts. This matches Node resolution mechanism.
      // https://github.com/facebook/create-react-app/issues/253
      modules: ["node_modules", paths.appNodeModules].concat(
        modules.additionalModulePaths || []
      ),
      // These are the reasonable defaults supported by the Node ecosystem.
      // We also include JSX as a common component filename extension to support
      // some tools, although we do not recommend using it, see:
      // https://github.com/facebook/create-react-app/issues/290
      // `web` extension prefixes have been added for better support
      // for React Native Web.
      extensions: paths.moduleFileExtensions
        .map((ext) => `.${ext}`)
        .filter((ext) => useTypeScript || !ext.includes("ts")),
      alias: {
        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        "react-native": "react-native-web",
        // Allows for better profiling with ReactDevTools
        // ...(isEnvProductionProfile && {
        //   "react-dom$": "react-dom/profiling",
        //   "scheduler/tracing": "scheduler/tracing-profiling",
        // }),
        ...(modules.webpackAliases || {}),
        "react-dom$": path.resolve(
          __dirname,
          "../../react/build/node_modules/react-dom/umd/react-dom.development.js"
        ),// 【1】 
        "react$": path.resolve(
          __dirname,
          "../../react/build/node_modules/react/umd/react.development.js"
        ),// 【1】
        "scheduler$": path.resolve(
          __dirname,
          "../../react/build/node_modules/scheduler/umd/scheduler.development.js"
        ),// 【1】
        "react-reconciler$": path.resolve(
          __dirname,
          "../../react/build/node_modules/react-reconciler/cjs/react-reconciler.development.js"
        ),// 【1】
      },
      // ModuleScopePlugin 这坨注释掉，会导致无法调转到源码
      plugins: [
        // Prevents users from importing files from outside of src/ (or node_modules/).
        // This often causes confusion because we only process files within src/ with babel.
        // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
        // please link the files into your node_modules/ and let module-resolution kick in.
        // Make sure your source files are compiled, as they will not be processed in any way.
        // new ModuleScopePlugin(paths.appSrc, [
        //   paths.appPackageJson,
        //   reactRefreshRuntimeEntry,
        //   reactRefreshWebpackPluginRuntimeEntry,
        //   babelRuntimeEntry,
        //   babelRuntimeEntryHelpers,
        //   babelRuntimeRegenerator,
        // ]),
      ],
    },
      
【1】注解：打包后的react源码的位置 。

# 4. .vscode\launch.json 添加 debug 配置

{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "edge",
      "request": "launch",
      "name": "针对 localhost 启动 Edge",
      "url": "http://localhost:3001", // 主要是这个和cra启动的端口一致即可
      "webRoot": "${workspaceFolder}",
      "sourceMaps": true, // 主要是这个
    }
  ]
}

# 5. 确认下create-react-app中引用react-dom的地方，要把/client去掉

# 6. yarn run start ，然后 debug 启动即可

有其余报错 看着解决就行了，一般是语法等插件

```





# 其他辅助信息



## 使用 Chrome Performance 标签分析组件

[Optimizing Performance – React (docschina.org)](https://react.docschina.org/docs/optimizing-performance.html)



## React Profiler

[React Profiler 介绍 – React Blog (docschina.org)](https://react.docschina.org/blog/2018/09/10/introducing-the-react-profiler.html)



## console控制台

```js
$0` `$1` `$_
```

- `$0`: 引用最后一次选中的dom节点
- `$1`: 引用倒数第二个选中的dom节点
- `$_`: 引用 console 中上一个表达式返回的值
- 使用场景：在 console 中我们可能经常要尝试一些功能，写一些测试代码。`$0` 和 `$1` 能够让我们快速选中 dom 节点，对选中的 dom 做些操作。`$_` 方便我们在没有给返回值赋给变量，但又需要引用这个值的情况使用。



元素 & 源码

​	store as global variable 保存为全局变量



条件表达式

xxx == true 、xxx=='xxx' 表达式为ture才进入断点



VsCode 代码层级折叠

- 折叠 **`Ctrl+Shift+[`**

- 展开 **`Ctrl+Shift+]`**

- 代码折叠：先按ctrl+k，再按ctrl+0 [注意0为数字0]

  代码展开：先按ctrl+k，再按ctrl+j



18对比demo

https://claudiopro.github.io/react-fiber-vs-stack-demo/ 



# 参考



[zxg_神说要有光](https://juejin.cn/user/2788017216685118)

[React源码学习进阶篇（一）新版React如何调试源码？ (qq.com)](https://mp.weixin.qq.com/s/rjSrV6opaef1lqLM7S5F_Q)