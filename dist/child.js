'use strict';

var _exec = require('child_process').exec;
var _ = require('lodash');
// 一个拥有promise风格的exec,返回{code, out}
module.exports = {
    exec: function exec(command, options) {
        var options = _.merge({
            $through: true // 是否将stdout, stderr打到控制台
        }, options || {});
        return new Promise(function (resolve, reject) {
            var child = _exec(command, options);
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