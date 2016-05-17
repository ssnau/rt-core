'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _highlight = require('highlight.js');

var _highlight2 = _interopRequireDefault(_highlight);

var _child = require('../child');

var _child2 = _interopRequireDefault(_child);

var _packcode = require('../packcode');

var _packcode2 = _interopRequireDefault(_packcode);

var _common = require('../common');

var _common2 = _interopRequireDefault(_common);

var _html = require('../html');

var _html2 = _interopRequireDefault(_html);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var getNodeProjectRoot = _common2.default.getNodeProjectRoot;
var getRc = _common2.default.getRc;
var safe = _common2.default.safe;
var example = _html2.default.example;

exports.default = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_config) {
    var _this = this;

    var cwd, root, config, exname, builddir, pkg, exdir, getExamples, filename, escapeScript, minifyScript, basedir, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            minifyScript = function minifyScript(content) {
              return _uglifyJs2.default.minify(content, { fromString: true });
            };

            escapeScript = function escapeScript(content) {
              return content.replace(/<script>/g, '\\u003cscript>').replace(/<\/script>/g, '\\u003c/script>');
            };

            filename = function filename(p) {
              return p.replace(/\.[^/.]+$/, '').replace(/^.*\//, '');
            };

            getExamples = function getExamples() {
              var files = _glob2.default.sync(exdir + '/**').filter(function (f) {
                return (/\.(js|jsx)$/.test(f)
                );
              });
              return files;
            };

            cwd = process.cwd();
            root = getNodeProjectRoot(cwd);
            config = _lodash2.default.merge(getRc(root), _config);

            // consts

            exname = config.dir || 'examples';
            builddir = config.builddir || 'build';

            /* eslint-disable global-require */

            pkg = require(_path2.default.join(root, 'package.json'));

            // var fs   = require('fs');

            exdir = _path2.default.join(root, exname);


            // try to make the folder first
            basedir = _path2.default.join(root, builddir, 'examples');
            _context2.next = 14;
            return _child2.default.exec('mkdir -p ' + basedir, { $through: false, $silent: true });

          case 14:

            /* eslint-disable prefer-const */
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 17;
            _loop = regeneratorRuntime.mark(function _callee() {
              var file, scriptcode, polyfillcode, hljscss, contentHTML, htmlcontent, df;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      file = _step.value;
                      _context.next = 3;
                      return (0, _packcode2.default)(file, pkg, root);

                    case 3:
                      scriptcode = _context.sent;
                      polyfillcode = _fs2.default.readFileSync(_path2.default.join(__dirname, '../../vendor/browser-polyfill.js'), 'utf-8');
                      hljscss = _fs2.default.readFileSync(_path2.default.join(__dirname, '../../vendor/hljs.css'), 'utf-8');
                      contentHTML = void 0;
                      /* eslint-disable no-unused-vars, no-return-assign */

                      safe(function (__) {
                        return contentHTML = _fs2.default.readFileSync(file.replace(/(js|jsx)$/, 'html'), 'utf-8');
                      });
                      htmlcontent = example({
                        contentHTML: contentHTML,
                        pkg: pkg,
                        pagename: filename(file),
                        sourcecode: _highlight2.default.highlight('javascript', _fs2.default.readFileSync(file, 'utf-8')).value,
                        styles: [hljscss],
                        scripts: [{ content: escapeScript(minifyScript(polyfillcode).code) }, { content: escapeScript(minifyScript(scriptcode).code) }]
                      });
                      df = _path2.default.join(basedir, filename(file) + '.html');
                      /* eslint-disable no-console */

                      console.log('writing file ' + df);

                      _fs2.default.writeFileSync(df, htmlcontent, { encoding: 'utf-8' });

                    case 12:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, _this);
            });
            _iterator = getExamples()[Symbol.iterator]();

          case 20:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context2.next = 25;
              break;
            }

            return _context2.delegateYield(_loop(), 't0', 22);

          case 22:
            _iteratorNormalCompletion = true;
            _context2.next = 20;
            break;

          case 25:
            _context2.next = 31;
            break;

          case 27:
            _context2.prev = 27;
            _context2.t1 = _context2['catch'](17);
            _didIteratorError = true;
            _iteratorError = _context2.t1;

          case 31:
            _context2.prev = 31;
            _context2.prev = 32;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 34:
            _context2.prev = 34;

            if (!_didIteratorError) {
              _context2.next = 37;
              break;
            }

            throw _iteratorError;

          case 37:
            return _context2.finish(34);

          case 38:
            return _context2.finish(31);

          case 39:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[17, 27, 31, 39], [32,, 34, 38]]);
  }));

  function build(_x) {
    return ref.apply(this, arguments);
  }

  return build;
}();