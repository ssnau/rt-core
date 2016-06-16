'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _webpackconfig = require('../webpackconfig');

var _webpackconfig2 = _interopRequireDefault(_webpackconfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  getEntries: function getEntries(dir, items) {
    var entries = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;

        item.files.forEach(function (f) {
          var name = _path2.default.relative(dir, f).replace(/.(js|jsx)$/, '').replace('//', '/');
          entries[name] = f;
        });
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

    return entries;
  },
  getMiddlewares: function getMiddlewares(_ref) {
    var tpldir = _ref.tpldir;
    var pkg = _ref.pkg;
    var port = _ref.port;
    var root = _ref.root;
    var rtconfig = _ref.rtconfig;
    var _ref$entries = _ref.entries;
    var entries = _ref$entries === undefined ? {} : _ref$entries;
    var _ref$items = _ref.items;
    var items = _ref$items === undefined ? [] : _ref$items;

    this.baseURL = 'http://localhost:' + port;
    this.tpldir = tpldir;

    var pkgname = pkg.name;
    var alias = {};
    alias[pkgname + '$'] = _path2.default.join(root, 'src');
    alias[pkgname] = root;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var item = _step2.value;

        alias[item.name + '$'] = _path2.default.join(item.path, 'src');
        alias[item.name] = item.path;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    var hotPrefix = [require.resolve('webpack-hot-middleware/client') + ('?path=' + this.baseURL + '/__webpack_hmr')];
    entries = _lodash2.default.merge(entries, this.getEntries(tpldir, items));
    Object.keys(entries).forEach(function (key) {
      entries[key] = hotPrefix.concat(entries[key]);
    });

    var webpackConfig = (0, _webpackconfig2.default)({
      babelQuery: rtconfig.babelQuery || {}
    });
    webpackConfig.entry = entries;
    webpackConfig.devtool = '#eval-source-map';
    // prefix with "/" to make it as absolute path for memfs
    webpackConfig.output.path = '/' + webpackConfig.output.path;
    webpackConfig.output.publicPath = this.baseURL + webpackConfig.output.path;
    webpackConfig.plugins = [new _webpack2.default.HotModuleReplacementPlugin(), new _webpack2.default.NoErrorsPlugin()];
    webpackConfig.resolve = _lodash2.default.assign({}, webpackConfig.resolve || {}, { alias: alias });

    var compiler = (0, _webpack2.default)(webpackConfig);

    return [(0, _webpackDevMiddleware2.default)(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    }), (0, _webpackHotMiddleware2.default)(compiler)];
  },
  getURL: function getURL(file) {
    var p = '' + _path2.default.relative(this.tpldir, file);
    p = p.replace('//', '/').replace(/.jsx$/, '.js');
    return this.baseURL + '/static/' + p;
  }
};