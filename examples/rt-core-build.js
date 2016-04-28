require('babel/register');

const rtCore = require('../');

rtCore.build({
  dir: 'examples/examples',
  builddir: 'examples/build',
});
