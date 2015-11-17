'use strict';

var child = require('../child');
var config = require('../config');
var defaults = require('../defaults');
var template = require('../gulp-template');
var inquirer = require('inquirer');
var _ = require('lodash');
var __ = require('underscore.string');
var gulp = require('gulp');
var fs = require('fs');
var pt = require('path');
var through = require('through2');
var conflict = require('gulp-conflict');
var tpl = require('../template');
var glob = require('glob');
var chalk = require('chalk');

function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
}

function info() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    console.log(chalk.green('info') + ' ' + args.join(' '));
}

function ask(prompts) {
    return new Promise(function (resolve, reject) {
        inquirer.prompt(prompts, resolve);
    });
}

module.exports = function callee$0$0(_ref) {
    var name = _ref.name;
    var cwd = _ref.cwd;

    var answers, cssprocessor, basedir, file, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, filename, files, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, f, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, conditionVarName;

    return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.next = 2;
                return regeneratorRuntime.awrap(child.exec('mkdir ' + pt.join(cwd, name)));

            case 2:
                context$1$0.next = 4;
                return regeneratorRuntime.awrap(ask([{
                    name: 'componentType',
                    message: 'What kind of component do you want?',
                    type: 'list',
                    choices: ['react-component', 'angular-component'],
                    'default': 0
                }, {
                    name: 'appName',
                    message: 'What is the name of your project?',
                    'default': function _default(answers) {
                        var prefix = answers.componentType.match(/^\w+-/);
                        return "@mtfe/" + (prefix ? prefix[0] : '') + name;
                    }
                }, {
                    name: 'appDescription',
                    message: 'What is the description?',
                    'default': 'a simple ui component'
                }, {
                    name: 'appVersion',
                    message: 'What is the version of your project?',
                    'default': '0.1.0'
                }, {
                    name: 'authorName',
                    message: 'What is the author name?',
                    'default': defaults.authorName
                }, {
                    name: 'authorEmail',
                    message: 'What is the author email?',
                    'default': defaults.authorEmail
                }, {
                    name: 'cssprocessor',
                    message: 'Which css preprocessor do you want?',
                    type: 'list',
                    choices: ['css', 'postcss', 'less', 'scss'],
                    'default': 0
                }]));

            case 4:
                answers = context$1$0.sent;
                cssprocessor = answers.cssprocessor;

                if (cssprocessor === 'css' || cssprocessor === 'postcss') answers.usecss = true;

                answers.appNameSlug = __.slugify(answers.appName);
                answers[answers.cssprocessor] = true;
                answers.appClassName = answers.appNameSlug
                // three times is enough!!
                .replace('/', '-').replace('@', '').replace('/', '-').replace('@', '').replace('/', '-').replace('@', '');

                context$1$0.next = 12;
                return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                    var sourcedir = config.template.component + answers.componentType;
                    info('template is based on ' + sourcedir);
                    gulp.src([sourcedir + '/**', "!" + sourcedir + '/node_modules']).pipe(template(answers)).pipe(gulp.dest('./' + name)).on('end', resolve);
                }));

            case 12:
                basedir = pt.join(cwd, name);

                file = function file(p) {
                    return pt.join(basedir, p);
                };

                // rename dotfile
                info('dealing dotfiles');
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                context$1$0.prev = 18;
                _iterator = glob.sync(basedir + "/*").filter(function (x) {
                    return (/_d_/.test(x)
                    );
                })[Symbol.iterator]();

            case 20:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    context$1$0.next = 27;
                    break;
                }

                filename = _step.value;
                context$1$0.next = 24;
                return regeneratorRuntime.awrap(child.exec('mv ' + filename + ' ' + filename.replace('_d_', '.')));

            case 24:
                _iteratorNormalCompletion = true;
                context$1$0.next = 20;
                break;

            case 27:
                context$1$0.next = 33;
                break;

            case 29:
                context$1$0.prev = 29;
                context$1$0.t0 = context$1$0['catch'](18);
                _didIteratorError = true;
                _iteratorError = context$1$0.t0;

            case 33:
                context$1$0.prev = 33;
                context$1$0.prev = 34;

                if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
                }

            case 36:
                context$1$0.prev = 36;

                if (!_didIteratorError) {
                    context$1$0.next = 39;
                    break;
                }

                throw _iteratorError;

            case 39:
                return context$1$0.finish(36);

            case 40:
                return context$1$0.finish(33);

            case 41:
                files = glob.sync(basedir + "/**").filter(function (f) {
                    return (/\.template$/.test(f)
                    );
                });
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                context$1$0.prev = 45;
                _iterator2 = files[Symbol.iterator]();

            case 47:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                    context$1$0.next = 61;
                    break;
                }

                f = _step2.value;
                context$1$0.prev = 49;
                context$1$0.next = 52;
                return regeneratorRuntime.awrap(child.exec('rm ' + f.replace(/\.template$/, ''), { $through: false }));

            case 52:
                context$1$0.next = 56;
                break;

            case 54:
                context$1$0.prev = 54;
                context$1$0.t1 = context$1$0['catch'](49);

            case 56:
                context$1$0.next = 58;
                return regeneratorRuntime.awrap(child.exec('mv ' + f + ' ' + f.replace(/\.template$/, ''), { $through: false }));

            case 58:
                _iteratorNormalCompletion2 = true;
                context$1$0.next = 47;
                break;

            case 61:
                context$1$0.next = 67;
                break;

            case 63:
                context$1$0.prev = 63;
                context$1$0.t2 = context$1$0['catch'](45);
                _didIteratorError2 = true;
                _iteratorError2 = context$1$0.t2;

            case 67:
                context$1$0.prev = 67;
                context$1$0.prev = 68;

                if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                    _iterator2['return']();
                }

            case 70:
                context$1$0.prev = 70;

                if (!_didIteratorError2) {
                    context$1$0.next = 73;
                    break;
                }

                throw _iteratorError2;

            case 73:
                return context$1$0.finish(70);

            case 74:
                return context$1$0.finish(67);

            case 75:

                // determine the file should exists
                info('determine file existence');
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                context$1$0.prev = 79;
                _iterator3 = glob.sync(basedir + "/**")[Symbol.iterator]();

            case 81:
                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                    context$1$0.next = 96;
                    break;
                }

                filename = _step3.value;

                if (/\?\w+/.test(filename)) {
                    context$1$0.next = 85;
                    break;
                }

                return context$1$0.abrupt('continue', 93);

            case 85:
                conditionVarName = filename.slice(filename.lastIndexOf('?') + 1);

                if (answers[conditionVarName]) {
                    context$1$0.next = 91;
                    break;
                }

                context$1$0.next = 89;
                return regeneratorRuntime.awrap(child.exec('rm -rf ' + filename));

            case 89:
                context$1$0.next = 93;
                break;

            case 91:
                context$1$0.next = 93;
                return regeneratorRuntime.awrap(child.exec('mv ' + filename + ' ' + filename.slice(0, filename.lastIndexOf('?'))));

            case 93:
                _iteratorNormalCompletion3 = true;
                context$1$0.next = 81;
                break;

            case 96:
                context$1$0.next = 102;
                break;

            case 98:
                context$1$0.prev = 98;
                context$1$0.t3 = context$1$0['catch'](79);
                _didIteratorError3 = true;
                _iteratorError3 = context$1$0.t3;

            case 102:
                context$1$0.prev = 102;
                context$1$0.prev = 103;

                if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                    _iterator3['return']();
                }

            case 105:
                context$1$0.prev = 105;

                if (!_didIteratorError3) {
                    context$1$0.next = 108;
                    break;
                }

                throw _iteratorError3;

            case 108:
                return context$1$0.finish(105);

            case 109:
                return context$1$0.finish(102);

            case 110:

                // init git repo
                info('initing git repo');
                context$1$0.next = 113;
                return regeneratorRuntime.awrap(child.exec('cd ' + basedir + ' && git init && git add . && git commit -m "init push"'));

            case 113:

                // install
                info('npm install dependencies');
                context$1$0.next = 116;
                return regeneratorRuntime.awrap(child.exec('npm run installNormal', { cwd: basedir }));

            case 116:

                info('\n--------\ndone! run "cd ' + name + ' && npm start" to develop and enjoy!');

            case 117:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this, [[18, 29, 33, 41], [34,, 36, 40], [45, 63, 67, 75], [49, 54], [68,, 70, 74], [79, 98, 102, 110], [103,, 105, 109]]);
};

// ask project meta info and replace for the project

// extra vars

// replace template.* file

// do nothing..

// get the condition variable name, e.g.: index.css?usecss => usecss

// remove the file if the var is falsy

// strip the query