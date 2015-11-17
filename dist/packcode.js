"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = pack;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _memoryFs = require("memory-fs");

var _memoryFs2 = _interopRequireDefault(_memoryFs);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var babel = require('babel');

function pack(filepath, pkg, root) {
  var alias = {};
  if (pkg && root) {
    alias[pkg.name + "$"] = _path2["default"].join(root, 'src');
    alias[pkg.name] = root;
  }
  var r = function r(x) {
    return x.map(function (f) {
      return require.resolve(f);
    });
  };
  var compiler = (0, _webpack2["default"])({
    cache: true,
    entry: {
      'def': filepath
    },
    module: {
      loaders: [{
        exclude: /node_modules/,
        loaders: r(['babel-loader']),
        test: /\.(es6|js|jsx)$/
      }, {
        loaders: r(['json-loader']),
        test: /\.(json)$/
      }, {
        loaders: r(['style-loader', 'css-loader']),
        test: /\.(css)$/
      }, {
        loaders: r(["url-loader"]),
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/
      }]
    },
    resolve: {
      alias: alias,
      extensions: ['', '.js', '.jsx']
    },
    output: {
      path: "/",
      filename: 'bundle.js'
    }
  });
  var mfs = new _memoryFs2["default"]();
  compiler.outputFileSystem = mfs;
  return new Promise(function (resolve, reject) {
    compiler.run(function (err, stats) {
      if (err) return reject(err);
      try {
        var ret = mfs.readFileSync("/bundle.js", 'utf-8');
        resolve(ret);
      } catch (e) {
        reject(e.toString());
      }
    });
  });
}

module.exports = exports["default"];