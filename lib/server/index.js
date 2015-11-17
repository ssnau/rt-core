var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var {getNodeProjectRoot, getRc, safe} = require('../common');
var {example, list} = require('../html');
var hljs = require('highlight.js');

module.exports = function (config) {
    var cwd = process.cwd();
    var root = getNodeProjectRoot(cwd);
    config = _.merge(getRc(root), config);

    // consts
    var exname = config.dir || 'examples';
    var host = config.host || 'http://localhost';
    var port = config.port || 3001
    var devport = config.devport || 9181; //deprecated

    var pkg = require(path.join(root, 'package.json'));

    var express = require('express');
    var app = express();
    var fs   = require('fs');
    var exdir = path.join(root, exname);
    var glob = require('glob');
    var devserver = require('./devserver');

    devserver.getMiddlewares({
      tpldir: exdir,
      port: port,
      root,
      pkg
    }).forEach(x => app.use(x));

    function getExamples() {
        var files = glob.sync(exdir + "/**")
            .filter(f => /\.(js|jsx)$/.test(f));
        return files;
    }
    function filename(p) {
        return p.replace(/\.[^/.]+$/, "").replace(/^.*\//, '')
    }

    var router = express.Router();
    app.use(express.static(path.join(__dirname, "../../vendor")));


    router.get('/', function (req, res) {
      var files = getExamples();
      var fns = files.map(filename);
      
      res.send(list({
          examples: fns,
          title: 'examples'
      }));
    });

    router.get('/examples/:name', function (req, res) {
      var name = req.params.name;
      var tfp = path.join(exdir, name);
      var fp, contentHTML;
      if (fs.existsSync(tfp + '.js'))  fp = tfp + ".js"; 
      if (fs.existsSync(tfp + '.jsx')) fp = tfp + ".jsx";
      if (!fp)  {
          res.send(`<h1 style="color:#cc1122"> ${name} not found!</h1>`);
          return;
      }
      safe(__ => contentHTML = fs.readFileSync(tfp + '.html', 'utf-8'));

      var content = fs.readFileSync(fp, 'utf-8');

      res.send(example({
          pkg,
          contentHTML,
          pagename: name,
          styles: [
            "/hljs.css"
          ],
          scripts: [
            {src: '/browser-polyfill.js'},
            {src: devserver.getURL(fp)},
          ],
          title: pkg.name + '-' + name,
          pkgjson:  JSON.stringify({
            name: pkg.name + '-' + name + "-test" ,
            dependencies: {
                [pkg.name]: pkg.version
            }
          }, null, 2),
          sourcecode: hljs.highlight('javascript', content).value
      }));
    });

    app.use(router);

    app.listen(port, function(){
        setTimeout(function(){
           console.log(`\n-------\napp server listening on ${port}, visit ${host}:${port} to check awesome!` ,'\n--------\n');    
        }, 1000);
    });
}
