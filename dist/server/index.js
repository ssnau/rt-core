'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var _require = require('../common');

var getNodeProjectRoot = _require.getNodeProjectRoot;
var getRc = _require.getRc;
var safe = _require.safe;

var _require2 = require('../html');

var example = _require2.example;
var list = _require2.list;

var hljs = require('highlight.js');

module.exports = function (config) {
    var cwd = process.cwd();
    var root = getNodeProjectRoot(cwd);
    config = _.merge(getRc(root), config);

    // consts
    var exname = config.dir || 'examples';
    var host = config.host || 'http://localhost';
    var port = config.port || 3001;
    var babelQuery = config.babelQuery || {};

    var pkg = require(path.join(root, 'package.json'));

    var express = require('express');
    var app = express();
    var fs = require('fs');
    var exdir = path.join(root, exname);
    var glob = require('glob');
    var devserver = require('./devserver');

    devserver.getMiddlewares({
        rtconfig: config,
        tpldir: exdir,
        port: port,
        root: root,
        pkg: pkg
    }).forEach(function (x) {
        return app.use(x);
    });

    function getExamples() {
        var files = glob.sync(exdir + "/**").filter(function (f) {
            return (/\.(js|jsx)$/.test(f)
            );
        });
        return files;
    }
    function filename(p) {
        return p.replace(/\.[^/.]+$/, "").replace(/^.*\//, '');
    }

    var router = express.Router();
    app.use(express['static'](path.join(__dirname, "../../vendor")));

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
        if (fs.existsSync(tfp + '.js')) fp = tfp + ".js";
        if (fs.existsSync(tfp + '.jsx')) fp = tfp + ".jsx";
        if (!fp) {
            res.send('<h1 style="color:#cc1122"> ' + name + ' not found!</h1>');
            return;
        }
        safe(function (__) {
            return contentHTML = fs.readFileSync(tfp + '.html', 'utf-8');
        });

        var content = fs.readFileSync(fp, 'utf-8');

        res.send(example({
            pkg: pkg,
            contentHTML: contentHTML,
            pagename: name,
            styles: ["/hljs.css"],
            scripts: [{ src: '/browser-polyfill.js' }, { src: devserver.getURL(fp) }],
            title: pkg.name + '-' + name,
            pkgjson: JSON.stringify({
                name: pkg.name + '-' + name + "-test",
                dependencies: _defineProperty({}, pkg.name, pkg.version)
            }, null, 2),
            sourcecode: hljs.highlight('javascript', content).value
        }));
    });

    app.use(router);

    app.listen(port, function () {
        setTimeout(function () {
            console.log('\n-------\napp server listening on ' + port + ', visit ' + host + ':' + port + ' to check awesome!', '\n--------\n');
        }, 1000);
    });
};