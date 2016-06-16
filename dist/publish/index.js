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

var _child = require('../child');

var _child2 = _interopRequireDefault(_child);

var _common = require('../common');

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var getNodeProjectRoot = _common2.default.getNodeProjectRoot;
var getRc = _common2.default.getRc;
var safe = _common2.default.safe;

exports.default = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_config) {
        var cwd, root, dir, npm, pkgs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, x;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        cwd = process.cwd();
                        root = getNodeProjectRoot(cwd);
                        dir = _config.dir || '';
                        npm = _config.dir || 'npm';
                        pkgs = _glob2.default.sync(_path2.default.join(root, dir) + '/*/package.json').filter(function (x) {
                            return x.indexOf('node_modules') == -1;
                        }).map(function (x) {
                            var groupName = require(x)["mt-group"];
                            if (groupName) {
                                var direct = x.replace('\/package.json', '');
                                var version = require(x)["version"];
                                var name = require(x)["name"];
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
                            _context.next = 17;
                            break;
                        }

                        x = _step.value;
                        _context.next = 14;
                        return _child2.default.exec('cd ' + x.direct + ' && npm run pub');

                    case 14:
                        _iteratorNormalCompletion = true;
                        _context.next = 10;
                        break;

                    case 17:
                        _context.next = 23;
                        break;

                    case 19:
                        _context.prev = 19;
                        _context.t0 = _context['catch'](8);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                    case 23:
                        _context.prev = 23;
                        _context.prev = 24;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 26:
                        _context.prev = 26;

                        if (!_didIteratorError) {
                            _context.next = 29;
                            break;
                        }

                        throw _iteratorError;

                    case 29:
                        return _context.finish(26);

                    case 30:
                        return _context.finish(23);

                    case 31:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[8, 19, 23, 31], [24,, 26, 30]]);
    }));

    function publish(_x) {
        return ref.apply(this, arguments);
    }

    return publish;
}();