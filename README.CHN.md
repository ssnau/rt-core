# RT-CORE

[![NPM Version](http://img.shields.io/npm/v/rt-core.svg?style=flat)](https://www.npmjs.org/package/rt-core)
[![NPM Downloads](https://img.shields.io/npm/dm/rt-core.svg?style=flat)](https://www.npmjs.org/package/rt-core)

The core functionalities for Rabbit Tools.

## 如何使用

- 安装相关`npm`依赖

```bash
npm install --save-dev babel-plugin-react-transform
npm install --save-dev react-transform-catch-errors
npm install --save-dev react-transform-hmr
npm install --save-dev redbox-react
```

- 在项目根目录创建[.rtrc](.rtrc)文件 (HMR功能需要)

- 使用`rt-core` 提供的两个功能：开发服务、HTML构建

- 开发服务（HMR功能）

```js
require('babel-polyfill')

const rtCore = require('rt-core')

rtCore.server({
  dir: 'examples/examples',
  host: 'http://localhost',
  port: 8012,
})
```

- HTML构建

```js
require('babel/polyfill')

const rtCore = require('rt-core');

rtCore.build({
  dir: 'examples/examples',
  builddir: 'examples/build',
})
```

请参考[examples](examples)。
