import webpack from "webpack";
import MemoryFileSystem from "memory-fs";
import fs from "fs";
import path from "path";
var babel = require('babel');

export default function pack(filepath, pkg, root) {
  var alias = {};
  if (pkg && root) {
    alias[pkg.name + "$"] = path.join(root, 'src');
    alias[pkg.name] = root;
  }
  var webpackConfig = require('./webpackconfig')();
  webpackConfig.entry = {'def': filepath};
  webpackConfig.cache = true;
  webpackConfig.resolve.alias = alias;
  webpackConfig.output = {
    path: "/",
    filename: 'bundle.js'
  };
  var compiler = webpack(webpackConfig);
  var mfs = new MemoryFileSystem();
  compiler.outputFileSystem = mfs;
  return new Promise(function(resolve, reject) {
      compiler.run(function(err, stats){
        if(err) return reject(err);
        try {
          var ret = mfs.readFileSync("/bundle.js", 'utf-8');
          resolve(ret);
        } catch (e) {
          reject(e.toString());
        }
      });
  });
}
