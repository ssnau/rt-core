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
var page = _html2.default.page;

exports.default = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_config) {
    var _this = this;

    var cwd, root, config, builddir, exdir, isGroup, pkg, tpldir, getItems, getExamples, filename, escapeScript, minifyScript, itemList, polyfillcode, hljscss, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, item, _basedir, _pkg, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _loop2, _iterator4, _step4, basedir, aliasList, _files, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, f, jsFile, cssCode, jsCode, contentHTML, htmlcontent, df;

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
              var files = _glob2.default.sync(tpldir + '/**').filter(function (f) {
                return (/\.(js|jsx)$/.test(f)
                );
              });
              return files;
            };

            getItems = function getItems(isGroup) {
              var items = [];
              if (isGroup) {
                var paths = _glob2.default.sync(tpldir + '/*/package.json').filter(function (x) {
                  return x.indexOf('node_modules') == -1;
                });
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
            };

            cwd = process.cwd();
            root = getNodeProjectRoot(cwd);
            config = _lodash2.default.merge(getRc(root), _config);

            // consts

            builddir = config.builddir || 'build';
            exdir = config.dir || '';
            isGroup = config.group || false;

            /* eslint-disable global-require */

            pkg = require(_path2.default.join(root, 'package.json'));

            // var fs   = require('fs');

            tpldir = _path2.default.join(root, exdir);
            itemList = getItems(isGroup);
            polyfillcode = _fs2.default.readFileSync(_path2.default.join(__dirname, '../../vendor/browser-polyfill.js'), 'utf-8');
            hljscss = _fs2.default.readFileSync(_path2.default.join(__dirname, '../../vendor/hljs.css'), 'utf-8');
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context2.prev = 19;
            _iterator2 = itemList[Symbol.iterator]();

          case 21:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context2.next = 55;
              break;
            }

            item = _step2.value;
            _basedir = _path2.default.join(item.path, builddir, 'examples');
            _context2.next = 26;
            return _child2.default.exec('mkdir -p ' + _basedir, { $through: false, $silent: true });

          case 26:
            _pkg = require(_path2.default.join(item.path, 'package.json'));
            /* eslint-disable prefer-const */

            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context2.prev = 30;
            _loop2 = regeneratorRuntime.mark(function _callee() {
              var file, aliasList, scriptcode, contentHTML, htmlcontent, df;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      file = _step4.value;
                      aliasList = [{
                        name: item.name,
                        path: item.path
                      }];
                      _context.next = 4;
                      return (0, _packcode2.default)(file, aliasList);

                    case 4:
                      scriptcode = _context.sent;
                      contentHTML = void 0;
                      /* eslint-disable no-unused-vars, no-return-assign */

                      safe(function (__) {
                        return contentHTML = _fs2.default.readFileSync(file.replace(/(js|jsx)$/, 'html'), 'utf-8');
                      });
                      htmlcontent = example({
                        contentHTML: contentHTML,
                        pkg: _pkg,
                        pagename: filename(file),
                        sourcecode: _highlight2.default.highlight('javascript', _fs2.default.readFileSync(file, 'utf-8')).value,
                        styles: [hljscss],
                        scripts: [{ content: escapeScript(minifyScript(polyfillcode).code) }, { content: escapeScript(minifyScript(scriptcode).code) }]
                      });
                      df = _path2.default.join(_basedir, filename(file) + '.html');
                      /* eslint-disable no-console */

                      console.log('writing file ' + df);
                      _fs2.default.writeFileSync(df, htmlcontent, { encoding: 'utf-8' });

                    case 11:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, _this);
            });
            _iterator4 = item.files[Symbol.iterator]();

          case 33:
            if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
              _context2.next = 38;
              break;
            }

            return _context2.delegateYield(_loop2(), 't0', 35);

          case 35:
            _iteratorNormalCompletion4 = true;
            _context2.next = 33;
            break;

          case 38:
            _context2.next = 44;
            break;

          case 40:
            _context2.prev = 40;
            _context2.t1 = _context2['catch'](30);
            _didIteratorError4 = true;
            _iteratorError4 = _context2.t1;

          case 44:
            _context2.prev = 44;
            _context2.prev = 45;

            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }

          case 47:
            _context2.prev = 47;

            if (!_didIteratorError4) {
              _context2.next = 50;
              break;
            }

            throw _iteratorError4;

          case 50:
            return _context2.finish(47);

          case 51:
            return _context2.finish(44);

          case 52:
            _iteratorNormalCompletion2 = true;
            _context2.next = 21;
            break;

          case 55:
            _context2.next = 61;
            break;

          case 57:
            _context2.prev = 57;
            _context2.t2 = _context2['catch'](19);
            _didIteratorError2 = true;
            _iteratorError2 = _context2.t2;

          case 61:
            _context2.prev = 61;
            _context2.prev = 62;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 64:
            _context2.prev = 64;

            if (!_didIteratorError2) {
              _context2.next = 67;
              break;
            }

            throw _iteratorError2;

          case 67:
            return _context2.finish(64);

          case 68:
            return _context2.finish(61);

          case 69:
            if (!isGroup) {
              _context2.next = 115;
              break;
            }

            basedir = _path2.default.join(root, builddir, 'homepage');
            _context2.next = 73;
            return _child2.default.exec('mkdir -p ' + basedir, { $through: false, $silent: true });

          case 73:
            aliasList = itemList.map(function (x) {
              return { name: x.name, path: x.path };
            });
            _files = _lodash2.default.uniq(_glob2.default.sync(root + '/homepage/**').filter(function (f) {
              return (/\.(js|jsx|html)$/.test(f)
              );
            }).filter(function (f) {
              return filename(f)[0] !== '_';
            }).map(function (f) {
              return f.replace(/\.(js|jsx|html)$/, '');
            }));
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context2.prev = 78;
            _iterator3 = _files[Symbol.iterator]();

          case 80:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context2.next = 101;
              break;
            }

            f = _step3.value;
            jsFile = _fs2.default.existsSync(f + '.js') ? f + '.js' : f + '.jsx';
            cssCode = _fs2.default.existsSync(f + '.css') ? _fs2.default.readFileSync(f + '.css', 'utf-8') : '';

            if (!_fs2.default.existsSync(jsFile)) {
              _context2.next = 90;
              break;
            }

            _context2.next = 87;
            return (0, _packcode2.default)(f, aliasList);

          case 87:
            _context2.t3 = _context2.sent;
            _context2.next = 91;
            break;

          case 90:
            _context2.t3 = '';

          case 91:
            jsCode = _context2.t3;
            contentHTML = void 0;

            if (_fs2.default.existsSync(f + '.html')) {
              /* eslint-disable no-unused-vars, no-return-assign */
              safe(function (__) {
                return contentHTML = _fs2.default.readFileSync(f + '.html', 'utf-8');
              });
            } else {
              /* eslint-disable no-unused-vars, no-return-assign */
              safe(function (__) {
                return contentHTML = '<div id="container-wrap"></div>';
              }, 'utf-8');
            }
            htmlcontent = page({
              contentHTML: contentHTML,
              pkg: pkg,
              pagename: filename(f),
              styles: [hljscss, cssCode],
              scripts: [{ content: escapeScript(minifyScript(polyfillcode).code) }, { content: escapeScript(minifyScript(jsCode).code) }]
            });
            df = _path2.default.join(basedir, filename(f) + '.html');
            /* eslint-disable no-console */

            console.log('writing file ' + df);
            _fs2.default.writeFileSync(df, htmlcontent, { encoding: 'utf-8' });

          case 98:
            _iteratorNormalCompletion3 = true;
            _context2.next = 80;
            break;

          case 101:
            _context2.next = 107;
            break;

          case 103:
            _context2.prev = 103;
            _context2.t4 = _context2['catch'](78);
            _didIteratorError3 = true;
            _iteratorError3 = _context2.t4;

          case 107:
            _context2.prev = 107;
            _context2.prev = 108;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 110:
            _context2.prev = 110;

            if (!_didIteratorError3) {
              _context2.next = 113;
              break;
            }

            throw _iteratorError3;

          case 113:
            return _context2.finish(110);

          case 114:
            return _context2.finish(107);

          case 115:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[19, 57, 61, 69], [30, 40, 44, 52], [45,, 47, 51], [62,, 64, 68], [78, 103, 107, 115], [108,, 110, 114]]);
  }));

  function build(_x) {
    return ref.apply(this, arguments);
  }

  return build;
}();