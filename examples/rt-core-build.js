require('babel-polyfill')

const rtCore = require('../')

rtCore.build({
  dir: 'examples/examples',
  builddir: 'examples/build',
})
