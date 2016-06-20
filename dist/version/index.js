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

exports.default = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var cwd, root, dir, version, pkgs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, x, msg;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        cwd = process.cwd();
                        root = getNodeProjectRoot(cwd);
                        dir = _config.dir || '';
                        version = _config.version || 'patch';
                        pkgs = _glob2.default.sync(_path2.default.join(root, dir) + '/*/package.json').filter(function (x) {
                            return x.indexOf('node_modules') == -1;
                        }).map(function (x) {
                            var groupName = require(x)["mt-group"];
                            if (groupName) {
                                var direct = _path2.default.dirname(x);
                                var name = require(x)["name"];
                                var version = require(x)["version"];
                                return {
                                    name: name,
                                    version: version,
                                    direct: direct
                                };
                            }
                        });
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 8;
                        _iterator = pkgs[Symbol.iterator]();

                    case 10:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 19;
                            break;
                        }

                        x = _step.value;
                        _context.next = 14;
                        return _child2.default.exec('cd ' + x.direct + ' && npm version ' + version, { $through: false });

                    case 14:
                        msg = _context.sent;

                        console.log(x.name + ' ' + msg.out);

                    case 16:
                        _iteratorNormalCompletion = true;
                        _context.next = 10;
                        break;

                    case 19:
                        _context.next = 25;
                        break;

                    case 21:
                        _context.prev = 21;
                        _context.t0 = _context['catch'](8);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                    case 25:
                        _context.prev = 25;
                        _context.prev = 26;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 28:
                        _context.prev = 28;

                        if (!_didIteratorError) {
                            _context.next = 31;
                            break;
                        }

                        throw _iteratorError;

                    case 31:
                        return _context.finish(28);

                    case 32:
                        return _context.finish(25);

                    case 33:
                        _context.next = 35;
                        return _child2.default.exec('cd ' + root + ' && git add .');

                    case 35:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[8, 21, 25, 33], [26,, 28, 32]]);
    }));

    function publish(_x) {
        return ref.apply(this, arguments);
    }

    return publish;
}();