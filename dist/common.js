'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

exports['default'] = {
  getNodeProjectRoot: function getNodeProjectRoot(_cwd) {
    var cwd = _cwd;
    var count = 0;
    var found = false;
    // 最多查找8层
    while (count++ < 8) {
      if (_fs2['default'].existsSync(_path2['default'].join(cwd, 'package.json'))) {
        found = true;
        break;
      }
      cwd = _path2['default'].join(cwd, '..');
    }
    if (!found) throw new Error('没有在当前目录及上层目录找到package.json文件');
    return cwd;
  },
  getRc: function getRc(root) {
    var f = _path2['default'].join(root, '.rtrc');
    if (_fs2['default'].existsSync(f)) {
      /* eslint-disable no-eval */
      return eval('(' + _fs2['default'].readFileSync(f, 'utf-8') + ')');
    }
    return {};
  },
  // safely invoke a function
  safe: function safe(fn) {
    try {
      fn();
    } catch (e) {
      // do nothing!
    }
  }
};
module.exports = exports['default'];