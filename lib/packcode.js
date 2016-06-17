import webpack from 'webpack';
import MemoryFileSystem from 'memory-fs';
import path from 'path';

import webpackConfigFunc from './webpackconfig';


export default function pack(filepath, aliasInfo) {
  const alias = {};
  for (let pkg of aliasInfo) {
    alias[`${pkg.name}$`] = path.join(pkg.path, 'src');
    alias[pkg.name] = pkg.path;
  }
  const webpackConfig = webpackConfigFunc();
  webpackConfig.entry = { def: filepath };
  webpackConfig.cache = true;
  webpackConfig.resolve.alias = alias;
  webpackConfig.output = {
    path: '/',
    filename: 'bundle.js',
  };
  const compiler = webpack(webpackConfig);
  const mfs = new MemoryFileSystem();
  compiler.outputFileSystem = mfs;

  return new Promise((resolve, reject) => {
    compiler.run(err => {
      if (err) return reject(err);
      try {
        const ret = mfs.readFileSync('/bundle.js', 'utf-8');
        resolve(ret);
      } catch (e) {
        reject(e.toString());
      }
    });
  });
}
