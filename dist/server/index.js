'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = server;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _highlightJs = require('highlight.js');

var _highlightJs2 = _interopRequireDefault(_highlightJs);

var _common = require('../common');

var _common2 = _interopRequireDefault(_common);

var _html = require('../html');

var _html2 = _interopRequireDefault(_html);

var _devserver = require('./devserver');

var _devserver2 = _interopRequireDefault(_devserver);

var getNodeProjectRoot = _common2['default'].getNodeProjectRoot;
var getRc = _common2['default'].getRc;
var safe = _common2['default'].safe;
var example = _html2['default'].example;
var list = _html2['default'].list;

/**
 * @param {{dir: string,
            host: string,
            port: number}} _config
 **/

function server(_config) {
  var cwd = process.cwd();
  var root = getNodeProjectRoot(cwd);
  var config = _lodash2['default'].merge(getRc(root), _config);

  // consts
  var exname = config.dir || 'examples';
  var host = config.host || 'http://localhost';
  var port = config.port || 3001;
  /* eslint-disable global-require */
  var pkg = require(_path2['default'].join(root, 'package.json'));
  var app = (0, _express2['default'])();
  var exdir = _path2['default'].join(root, exname);

  _devserver2['default'].getMiddlewares({
    rtconfig: config,
    tpldir: exdir,
    port: port,
    root: root,
    pkg: pkg
  }).forEach(function (x) {
    return app.use(x);
  });

  function getExamples() {
    var files = _glob2['default'].sync(exdir + '/**').filter(function (f) {
      return (/\.(js|jsx)$/.test(f)
      );
    });
    return files;
  }
  function filename(p) {
    return p.replace(/\.[^/.]+$/, '').replace(/^.*\//, '');
  }

  /* eslint-disable new-cap */
  var router = _express2['default'].Router();
  app.use(_express2['default']['static'](_path2['default'].join(__dirname, '../../vendor')));

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
    var tfp = _path2['default'].join(exdir, name);
    var fp = undefined;
    var contentHTML = undefined;
    if (_fs2['default'].existsSync(tfp + '.js')) fp = tfp + '.js';
    if (_fs2['default'].existsSync(tfp + '.jsx')) fp = tfp + '.jsx';
    if (!fp) {
      res.send('<h1 style="color:#cc1122"> ' + name + ' not found!</h1>');
      return;
    }
    /* eslint-disable no-unused-vars, no-return-assign */
    safe(function (__) {
      return contentHTML = _fs2['default'].readFileSync(tfp + '.html', 'utf-8');
    });

    var content = _fs2['default'].readFileSync(fp, 'utf-8');
    res.send(example({
      pkg: pkg,
      contentHTML: contentHTML,
      pagename: name,
      styles: ['/hljs.css'],
      scripts: [{ src: '/browser-polyfill.js' }, { src: _devserver2['default'].getURL(fp) }],
      title: pkg.name + '-' + name,
      // @TODO delete
      pkgjson: JSON.stringify({
        name: pkg.name + '-' + name + '-test',
        dependencies: _defineProperty({}, pkg.name, pkg.version)
      }, null, 2),
      sourcecode: _highlightJs2['default'].highlight('javascript', content).value
    }));
  });

  app.use(router);

  app.listen(port, function () {
    setTimeout(function () {
      /* eslint-disable no-console */
      console.log('\n-----------------------------------------------------------------------------------\n  app server listening on ' + port + ', visit ' + host + ':' + port + ' to check awesome!\n-----------------------------------------------------------------------------------\n        ');
    }, 1000);
  });
}

module.exports = exports['default'];