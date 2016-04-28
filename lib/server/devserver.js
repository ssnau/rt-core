import _ from 'lodash';
import path from 'path';
import glob from 'glob';
import webpack from 'webpack';

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import webpackConfigFunc from '../webpackconfig';


export default {
  getEntries(dir) {
    const entries = {};
    glob
      .sync(`${dir}/**`)
      .filter(f => !/node_modules/.test(f))
      .filter(f => /(js|jsx)$/.test(f))
      .forEach(f => {
        const name = path.relative(dir, f).replace(/.(js|jsx)$/, '');
        entries[name] = f;
      });
    return entries;
  },
  getMiddlewares({ tpldir, pkg, port, root, rtconfig }) {
    this.baseURL = 'http://localhost:' + port;
    this.tpldir = tpldir;

    const pkgname = pkg.name;
    const alias = {};
    alias[`${pkgname}$`] = path.join(root, 'src');
    alias[pkgname] = root;


    const hotPrefix = [
      require.resolve('webpack-hot-middleware/client') + `?path=${this.baseURL}/__webpack_hmr`,
    ];
    const entries = this.getEntries(tpldir);
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
    let p = `/static/${path.relative(this.tpldir, file)}`;
    p = p.replace('//', '/').replace(/.jsx$/, '.js');
    return this.baseURL + p;
  },
};
