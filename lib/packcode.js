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
  var r = function(x) { return x.map(f => require.resolve(f))}
  var compiler = webpack({
     cache: true,
     entry: {
       'def': filepath
     },
     module: {
       loaders: [
         {
           exclude: /node_modules/,
           loaders: r([ 'babel-loader' ]),
           test: /\.(es6|js|jsx)$/
         },
         {
           loaders: r([ 'json-loader' ]),
           test: /\.(json)$/
         },
         {
           loaders: r([ 'style-loader', 'css-loader' ]),
           test: /\.(css)$/
         },
         { 
             loaders: r(["url-loader"]),
             test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
         }
       ]
     },
     resolve: {
       alias,
       extensions: ['', '.js', '.jsx']
     },
     output:{
       path: "/",
       filename: 'bundle.js'
     }
   });
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
