'use strict';

var fs = require('fs');
var path = require('path');

module.exports = {
    getNodeProjectRoot: function getNodeProjectRoot(cwd) {
        var count = 0;
        var found = false;
        // 最多查找8层
        while (count++ < 8) {
            if (fs.existsSync(path.join(cwd, 'package.json'))) {
                found = true;
                break;
            }
            cwd = path.join(cwd, '..');
        }
        if (found) return cwd;else throw new Error('没有在当前目录及上层目录找到package.json文件');
    },
    getRc: function getRc(root) {
        var f = path.join(root, '.rtrc');
        if (fs.existsSync(f)) {
            return eval('(' + fs.readFileSync(f, 'utf-8') + ')');
        }
        return {};
    },
    // safely invoke a function
    safe: function safe(fn) {
        try {
            fn();
        } catch (e) {
            // do nothing!
        }
    }
};