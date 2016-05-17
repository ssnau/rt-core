'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exec = _child_process2.default.exec;

exports.default = {
  /* 一个拥有promise风格的exec,返回{code, out} */
  exec: function _exec(command, _options) {
    var options = _lodash2.default.merge({
      $through: true }, // 是否将stdout, stderr打到控制台
    _options || {});

    return new Promise(function (resolve, reject) {
      var child = exec(command, options);
      var $through = options.$through;
      var _options$$silent = options.$silent;
      var $silent = _options$$silent === undefined ? true : _options$$silent;

      var out = '';
      var cmd = { resolve: resolve, reject: reject };
      child.stdout.on('data', function (buf) {
        var string = String(buf);
        if ($through) process.stdout.write(string);
        out += string;
      });
      child.stderr.on('data', function (buf) {
        var string = String(buf);
        if ($through) process.stdout.write(string);
        out += string;
      });
      child.on('close', function (code) {
        var hasError = String(code) !== '0' && $silent !== true;
        cmd[hasError ? 'reject' : 'resolve']({ code: code, out: out });
      });
    });
  }
};