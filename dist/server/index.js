'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = server;

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

var _highlight = require('highlight.js');

var _highlight2 = _interopRequireDefault(_highlight);

var _common = require('../common');

var _common2 = _interopRequireDefault(_common);

var _html = require('../html');

var _html2 = _interopRequireDefault(_html);

var _devserver = require('./devserver');

var _devserver2 = _interopRequireDefault(_devserver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getNodeProjectRoot = _common2.default.getNodeProjectRoot;
var getRc = _common2.default.getRc;
var safe = _common2.default.safe;
var example = _html2.default.example;
var list = _html2.default.list;
var page = _html2.default.page;

/**
 * @param {{dir: string,
            host: string,
            port: number}} _config
 **/

function server(_config) {
  var cwd = process.cwd();
  var root = getNodeProjectRoot(cwd);
  var config = _lodash2.default.merge(getRc(root), _config);

  // consts
  var exdir = config.dir || '';
  var host = config.host || 'http://localhost';
  var port = config.port || 3001;
  var isGroup = config.group || null;
  /* eslint-disable global-require */
  var pkg = require(_path2.default.join(root, 'package.json'));
  var app = (0, _express2.default)();
  var tpldir = _path2.default.join(root, exdir);
  var itemList = getItems(isGroup);
  var entries = {};
  if (isGroup) {
    entries['homepage/index'] = _path2.default.join(root, 'homepage/index.js');
  }

  _devserver2.default.getMiddlewares({
    rtconfig: config,
    tpldir: tpldir,
    port: port,
    root: root,
    pkg: pkg,
    entries: entries,
    items: itemList
  }).forEach(function (x) {
    return app.use(x);
  });

  function filename(p) {
    return p.replace(/\.[^/.]+$/, '').replace(/^.*\//, '');
  }

  function getExamples() {
    var files = _glob2.default.sync(tpldir + '/**').filter(function (f) {
      return (/\.(js|jsx)$/.test(f)
      );
    });
    return files;
  }

  function getComponents(itemList) {
    var components = itemList.map(function (x) {
      return {
        name: x.name,
        examples: x.examples
      };
    });

    return components;
  }

  function getItems(isGroup) {
    var items = [];
    if (isGroup) {
      var paths = _glob2.default.sync(tpldir + '/*/package.json');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var p = _step.value;

          var pkg = require(p),
              examples = [],
              files = [];

          if (pkg['mt-group']) {
            var item_path = p.substr(0, p.indexOf('package.json'));

            _glob2.default.sync(item_path + '/examples/**').filter(function (f) {
              return (/\.(js|jsx)$/.test(f)
              );
            }).forEach(function (f) {
              examples.push(filename(f));
              files.push(f);
            });

            items.push({
              name: pkg['name'],
              path: p.substr(0, p.indexOf('package.json') - 1),
              examples: examples,
              files: files
            });
          }
        };

        for (var _iterator = paths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } else {
      (function () {
        var paths = _glob2.default.sync(tpldir + '/**').filter(function (f) {
          return (/\.(js|jsx)$/.test(f)
          );
        });
        var examples = [],
            files = [];

        paths.forEach(function (f) {
          examples.push(filename(f)), files.push(f);
        });
        items.push({
          name: pkg['name'],
          path: root,
          examples: examples,
          files: files
        });
      })();
    }
    return items;
  }

  /* eslint-disable new-cap */
  var router = _express2.default.Router();
  app.use(_express2.default.static(_path2.default.join(__dirname, '../../vendor')));

  router.get('/', function (req, res) {
    if (isGroup) {
      var components = getComponents(itemList);
      res.send(_html2.default.group({
        components: components,
        title: pkg['name']
      }));
    } else {
      var _files = getExamples();
      var fns = _files.map(filename);
      res.send(list({
        examples: fns,
        title: 'examples'
      }));
    }
  });

  router.get('/examples/', function (req, res) {
    var itemName = req.query.component;
    var exampleName = req.query.name;

    if (!exampleName) {
      res.send('<h1 style="color:#cc1122"> example\'s name can not null!</h1>');
      return;
    }

    var fp = void 0,
        contentHTML = void 0,
        tfp = void 0,
        jsPath = void 0,
        pkgInfo = pkg;

    if (isGroup) {
      var item = itemList.find(function (x) {
        return x.name === itemName;
      });
      if (!itemName || !item) {
        res.send('<h1 style="color:#cc1122"> component not found!</h1>');
        return;
      }
      tfp = _path2.default.join(item.path, 'examples', exampleName);
      pkgInfo = require(item.path + '/package.json');
    } else {
      tfp = _path2.default.join(tpldir, exampleName);
    }

    if (_fs2.default.existsSync(tfp + '.js')) fp = tfp + '.js';
    if (_fs2.default.existsSync(tfp + '.jsx')) fp = tfp + '.jsx';
    if (!fp) {
      res.send('<h1 style="color:#cc1122"> ' + exampleName + ' not found!</h1>');
      return;
    }

    jsPath = _devserver2.default.getURL(fp);
    /* eslint-disable no-unused-vars, no-return-assign */
    safe(function (__) {
      return contentHTML = _fs2.default.readFileSync(tfp + '.html', 'utf-8');
    });

    var content = _fs2.default.readFileSync(fp, 'utf-8');
    res.send(example({
      pkg: pkgInfo,
      contentHTML: contentHTML,
      pagename: exampleName,
      styles: ['/hljs.css'],
      scripts: [{ src: '/browser-polyfill.js' }, { src: jsPath }],
      title: pkgInfo.name + '-' + exampleName,
      // @TODO delete
      pkgjson: JSON.stringify({
        name: pkgInfo.name + '-' + exampleName + '-test',
        dependencies: _defineProperty({}, pkgInfo.name, pkgInfo.version)
      }, null, 2),
      sourcecode: _highlight2.default.highlight('javascript', content).value
    }));

    return;
  });

  router.get('/components/', function (req, res) {
    var itemName = req.query.name;
    var item = itemList.find(function (x) {
      return x.name === itemName;
    });
    if (!item) {
      res.send('<h1 style="color:#cc1122"> ' + itemName + ' not found!</h1>');
      return;
    }

    res.send(list({
      examples: item.examples,
      title: 'examples',
      component: itemName
    }));

    return;
  });

  router.get('/homepage/', function (req, res) {

    var fp = void 0,
        contentHTML = void 0,
        tfp = void 0,
        jsPath = void 0,
        pkgInfo = pkg;

    tfp = _path2.default.join(root, 'homepage', 'index');
    pkgInfo = require(_path2.default.join(root, '/package.json'));

    if (_fs2.default.existsSync(tfp + '.js')) fp = tfp + '.js';
    if (_fs2.default.existsSync(tfp + '.jsx')) fp = tfp + '.jsx';

    jsPath = _devserver2.default.getURL(fp).replace('\/..\/', '\/');
    /* eslint-disable no-unused-vars, no-return-assign */
    safe(function (__) {
      return contentHTML = _fs2.default.readFileSync(tfp + '.html', 'utf-8');
    });

    var content = _fs2.default.readFileSync(fp, 'utf-8');
    var indexcss = _fs2.default.readFileSync(_path2.default.join(root, 'homepage', 'index.css'), 'utf-8');
    res.send(_html2.default.page({
      pkg: pkgInfo,
      contentHTML: contentHTML,
      pagename: '',
      styles: ['/hljs.css', indexcss],
      scripts: [{ src: '/browser-polyfill.js' }, { src: jsPath }],
      title: pkgInfo.name,
      sourcecode: _highlight2.default.highlight('javascript', content).value
    }));

    return;
  });

  app.use(router);

  app.listen(port, function () {
    setTimeout(function () {
      /* eslint-disable no-console */
      console.log('\n-----------------------------------------------------------------------------------\n  app server listening on ' + port + ', visit ' + host + ':' + port + ' to check awesome!\n-----------------------------------------------------------------------------------\n        ');
    }, 1000);
  });
}