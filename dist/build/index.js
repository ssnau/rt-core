'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _uglifyJs = require('uglify-js');

var _uglifyJs2 = _interopRequireDefault(_uglifyJs);

var _highlightJs = require('highlight.js');

var _highlightJs2 = _interopRequireDefault(_highlightJs);

var _child = require('../child');

var _child2 = _interopRequireDefault(_child);

var _packcode = require('../packcode');

var _packcode2 = _interopRequireDefault(_packcode);

var _common = require('../common');

var _common2 = _interopRequireDefault(_common);

var _html = require('../html');

var _html2 = _interopRequireDefault(_html);

var getNodeProjectRoot = _common2['default'].getNodeProjectRoot;
var getRc = _common2['default'].getRc;
var safe = _common2['default'].safe;
var example = _html2['default'].example;

exports['default'] = function build(_config) {
  var cwd, root, config, exname, builddir, pkg, exdir, getExamples, filename, escapeScript, minifyScript, basedir, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

  return regeneratorRuntime.async(function build$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        minifyScript = function minifyScript(content) {
          return _uglifyJs2['default'].minify(content, { fromString: true });
        };

        escapeScript = function escapeScript(content) {
          return content.replace(/<script>/g, '\\u003cscript>').replace(/<\/script>/g, '\\u003c/script>');
        };

        filename = function filename(p) {
          return p.replace(/\.[^/.]+$/, '').replace(/^.*\//, '');
        };

        getExamples = function getExamples() {
          var files = _glob2['default'].sync(exdir + '/**').filter(function (f) {
            return (/\.(js|jsx)$/.test(f)
            );
          });
          return files;
        };

        cwd = process.cwd();
        root = getNodeProjectRoot(cwd);
        config = _lodash2['default'].merge(getRc(root), _config);
        exname = config.dir || 'examples';
        builddir = config.builddir || 'build';
        pkg = require(_path2['default'].join(root, 'package.json'));
        exdir = _path2['default'].join(root, exname);
        basedir = _path2['default'].join(root, builddir, 'examples');
        context$1$0.next = 14;
        return regeneratorRuntime.awrap(_child2['default'].exec('mkdir -p ' + basedir, { $through: false, $silent: true }));

      case 14:
        _iteratorNormalCompletion = true;
        _didIteratorError = false;
        _iteratorError = undefined;
        context$1$0.prev = 17;

        _loop = function callee$1$0() {
          var file, scriptcode, polyfillcode, hljscss, contentHTML, htmlcontent, df;
          return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                file = _step.value;
                context$2$0.next = 3;
                return regeneratorRuntime.awrap((0, _packcode2['default'])(file, pkg, root));

              case 3:
                scriptcode = context$2$0.sent;
                polyfillcode = _fs2['default'].readFileSync(_path2['default'].join(__dirname, '../../vendor/browser-polyfill.js'), 'utf-8');
                hljscss = _fs2['default'].readFileSync(_path2['default'].join(__dirname, '../../vendor/hljs.css'), 'utf-8');
                contentHTML = undefined;

                /* eslint-disable no-unused-vars, no-return-assign */
                safe(function (__) {
                  return contentHTML = _fs2['default'].readFileSync(file.replace(/(js|jsx)$/, 'html'), 'utf-8');
                });
                htmlcontent = example({
                  contentHTML: contentHTML,
                  pkg: pkg,
                  pagename: filename(file),
                  sourcecode: _highlightJs2['default'].highlight('javascript', _fs2['default'].readFileSync(file, 'utf-8')).value,
                  styles: [hljscss],
                  scripts: [{ content: escapeScript(minifyScript(polyfillcode).code) }, { content: escapeScript(minifyScript(scriptcode).code) }]
                });
                df = _path2['default'].join(basedir, filename(file) + '.html');

                /* eslint-disable no-console */
                console.log('writing file ' + df);

                _fs2['default'].writeFileSync(df, htmlcontent, { encoding: 'utf-8' });

              case 12:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this);
        };

        _iterator = getExamples()[Symbol.iterator]();

      case 20:
        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
          context$1$0.next = 26;
          break;
        }

        context$1$0.next = 23;
        return regeneratorRuntime.awrap(_loop());

      case 23:
        _iteratorNormalCompletion = true;
        context$1$0.next = 20;
        break;

      case 26:
        context$1$0.next = 32;
        break;

      case 28:
        context$1$0.prev = 28;
        context$1$0.t0 = context$1$0['catch'](17);
        _didIteratorError = true;
        _iteratorError = context$1$0.t0;

      case 32:
        context$1$0.prev = 32;
        context$1$0.prev = 33;

        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }

      case 35:
        context$1$0.prev = 35;

        if (!_didIteratorError) {
          context$1$0.next = 38;
          break;
        }

        throw _iteratorError;

      case 38:
        return context$1$0.finish(35);

      case 39:
        return context$1$0.finish(32);

      case 40:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[17, 28, 32, 40], [33,, 35, 39]]);
};

module.exports = exports['default'];

// consts

/* eslint-disable global-require */

// var fs   = require('fs');

// try to make the folder first

/* eslint-disable prefer-const */