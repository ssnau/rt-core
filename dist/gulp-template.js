'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var tpl = require('./template');
// 一个给gulp使用的template流处理
function compile(options, data, render) {
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-template', 'Streaming not supported'));
			return;
		}

		try {
			file.contents = new Buffer(tpl(file.contents.toString(), data));
			this.push(file);
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-template', err, { fileName: file.path }));
		}

		cb();
	});
}

module.exports = function (data, options) {
	return compile(options, data, true);
};