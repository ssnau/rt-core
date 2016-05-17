require('babel-polyfill')

const rtCore = require('../')

rtCore.server({
  dir: 'examples/examples',
  host: 'http://localhost',
  port: 8012,
})
