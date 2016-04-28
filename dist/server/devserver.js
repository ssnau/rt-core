'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

exports['default'] = {
  getEntries: function getEntries(dir) {
    var entries = {};
    _glob2['default'].sync(dir + '/**').filter(function (f) {
      return !/node_modules/.test(f);
    }).filter(function (f) {
      return (/(js|jsx)$/.test(f)
      );
    }).forEach(function (f) {
      var name = _path2['default'].relative(dir, f).replace(/.(js|jsx)$/, '');
      entries[name] = f;
    });
    return entries;
  },
  getMiddlewares: function getMiddlewares(_ref) {
    var tpldir = _ref.tpldir;
    var pkg = _ref.pkg;
    var port = _ref.port;
    var root = _ref.root;
    var rtconfig = _ref.rtconfig;

    this.baseURL = 'http://localhost:' + port;
    this.tpldir = tpldir;

    var pkgname = pkg.name;
    var alias = {};
    alias[pkgname + '$'] = _path2['default'].join(root, 'src');
    alias[pkgname] = root;

    var hotPrefix = [require.resolve('webpack-hot-middleware/client') + ('?path=' + this.baseURL + '/__webpack_hmr')];
    var entries = this.getEntries(tpldir);
    Object.keys(entries).forEach(function (key) {
      entries[key] = hotPrefix.concat(entries[key]);
    });

    var webpackConfig = (0, _webpackconfig2['default'])({
      babelQuery: rtconfig.babelQuery || {}
    });
    webpackConfig.entry = entries;
    webpackConfig.devtool = '#eval-source-map';
    // prefix with "/" to make it as absolute path for memfs
    webpackConfig.output.path = '/' + webpackConfig.output.path;
    webpackConfig.output.publicPath = this.baseURL + webpackConfig.output.path;
    webpackConfig.plugins = [new _webpack2['default'].HotModuleReplacementPlugin(), new _webpack2['default'].NoErrorsPlugin()];
    webpackConfig.resolve = _lodash2['default'].assign({}, webpackConfig.resolve || {}, { alias: alias });

    var compiler = (0, _webpack2['default'])(webpackConfig);

    return [(0, _webpackDevMiddleware2['default'])(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    }), (0, _webpackHotMiddleware2['default'])(compiler)];
  },
  getURL: function getURL(file) {
    var p = '/static/' + _path2['default'].relative(this.tpldir, file);
    p = p.replace('//', '/').replace(/.jsx$/, '.js');
    return this.baseURL + p;
  }
};
module.exports = exports['default'];