'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pack;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _memoryFs = require('memory-fs');

var _memoryFs2 = _interopRequireDefault(_memoryFs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpackconfig = require('./webpackconfig');

var _webpackconfig2 = _interopRequireDefault(_webpackconfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function pack(filepath, aliasInfo) {
  var alias = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = aliasInfo[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var pkg = _step.value;

      alias[pkg.name + '$'] = _path2.default.join(pkg.path, 'src');
      alias[pkg.name] = pkg.path;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var webpackConfig = (0, _webpackconfig2.default)();
  webpackConfig.entry = { def: filepath };
  webpackConfig.cache = true;
  webpackConfig.resolve.alias = alias;
  webpackConfig.output = {
    path: '/',
    filename: 'bundle.js'
  };
  var compiler = (0, _webpack2.default)(webpackConfig);
  var mfs = new _memoryFs2.default();
  compiler.outputFileSystem = mfs;

  return new Promise(function (resolve, reject) {
    compiler.run(function (err) {
      if (err) return reject(err);
      try {
        var ret = mfs.readFileSync('/bundle.js', 'utf-8');
        resolve(ret);
      } catch (e) {
        reject(e.toString());
      }
    });
  });
}