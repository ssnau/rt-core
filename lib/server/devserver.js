var _ = require('lodash');
var path = require('path');
var glob = require('glob');
var r = function(x) { return typeof x.map === 'function' ? x.map(f => require.resolve(f)) : require.resolve(x)}

module.exports = {
  getEntries(dir) {
     var entries = {};
     glob
      .sync(dir + "/**")
      .filter(function (f) {
        return !/node_modules/.test(f)
      })
      .filter(function(f) {
        return /(js|jsx)$/.test(f)
      })
      .forEach(function (f) {
        var name = path.relative(dir, f).replace(/.(js|jsx)$/, '');
        entries[name] = f;
      });
      return entries;
  },
  getMiddlewares({tpldir, pkg, port, root, rtconfig}) {
    this.baseURL = 'http://localhost:' + port;
    this.tpldir = tpldir;

    var pkgname = pkg.name;
    var alias = {};
    alias[pkgname + "$"] = path.join(root, 'src');
    alias[pkgname] = root;
    var r = function(x) { return x.map(f => require.resolve(f))}

    var express = require('express');
    var webpack = require('webpack');
    var app = express();

    var hotPrefix = [
      require.resolve('webpack-hot-middleware/client') + `?path=${this.baseURL}/__webpack_hmr`
    ];
    var entries = this.getEntries(tpldir);
    Object.keys(entries).forEach(function (key) {
      entries[key] = hotPrefix.concat(entries[key]);
    });

    var webpackConfig = require('../webpackconfig')({
        babelQuery: rtconfig.babelQuery || {}
    });
    webpackConfig.entry = entries;
    webpackConfig.devtool = '#eval-source-map';
    // prefix with "/" to make it as absolute path for memfs
    webpackConfig.output.path = '/' + webpackConfig.output.path;
    webpackConfig.output.publicPath = this.baseURL + webpackConfig.output.path;
    webpackConfig.plugins = [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ];
    webpackConfig.resolve = _.assign({}, webpackConfig.resolve || {}, {alias})

    var compiler = webpack(webpackConfig);
    
    return [
        require('webpack-dev-middleware')(compiler, {
          noInfo: true,
          publicPath: webpackConfig.output.publicPath
        }),
        require('webpack-hot-middleware')(compiler)
    ];
  },
  getURL(file) {
    var p = "/static/" + path.relative(this.tpldir, file);
    p = p.replace('//', '/').replace(/.jsx$/, '.js');
    return this.baseURL + p;
  }
};
