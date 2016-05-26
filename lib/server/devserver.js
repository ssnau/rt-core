import _ from 'lodash';
import path from 'path';
import glob from 'glob';
import webpack from 'webpack';

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import webpackConfigFunc from '../webpackconfig';


export default {
  getEntries(dir, items) {
    const entries = {};
    for (let item of items) {
        item.files.forEach(f => {
          const name = path.relative(dir, f).replace(/.(js|jsx)$/, '').replace('//', '/');
          entries[name] = f;
        });
    }

    return entries;
  },
  getMiddlewares({ tpldir, pkg, port, root, rtconfig, items = [] }) {
    this.baseURL = 'http://localhost:' + port;
    this.tpldir = tpldir;

    const pkgname = pkg.name;
    const alias = {};
    alias[`${pkgname}$`] = path.join(root, 'src');
    alias[pkgname] = root;
    for (let item of items) {
      alias[`${item.name}$`] = path.join(item.path, 'src');
      alias[item.name] = item.path;
    }

    const hotPrefix = [
      require.resolve('webpack-hot-middleware/client') + `?path=${this.baseURL}/__webpack_hmr`,
    ];
    const entries = this.getEntries(tpldir, items);
    Object.keys(entries).forEach(key => {
      entries[key] = hotPrefix.concat(entries[key]);
    });

    const webpackConfig = webpackConfigFunc({
      babelQuery: rtconfig.babelQuery || {},
    });
    webpackConfig.entry = entries;
    webpackConfig.devtool = '#eval-source-map';
    // prefix with "/" to make it as absolute path for memfs
    webpackConfig.output.path = '/' + webpackConfig.output.path;
    webpackConfig.output.publicPath = this.baseURL + webpackConfig.output.path;
    webpackConfig.plugins = [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ];
    webpackConfig.resolve = _.assign({}, webpackConfig.resolve || {}, { alias });

    const compiler = webpack(webpackConfig);

    return [
      webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath,
      }),
      webpackHotMiddleware(compiler),
    ];
  },
  getURL(file) {
    let p = `${path.relative(this.tpldir, file)}`;
    p = p.replace('//', '/').replace(/.jsx$/, '.js');
    return this.baseURL + '/static/' + p;
  },
};
