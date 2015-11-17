'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var child = require('../child');

var _require = require('../common');

var getNodeProjectRoot = _require.getNodeProjectRoot;
var getRc = _require.getRc;
var safe = _require.safe;

var _require2 = require('../html');

var example = _require2.example;
var list = _require2.list;

var packcode = require('../packcode');
var UglifyJS = require("uglify-js");

module.exports = function callee$0$0(config) {
    var cwd, root, exname, builddir, host, port, devport, pkg, fs, exdir, glob, getExamples, filename, escapeScript, minifyScript, basedir, hljs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, scriptcode, polyfillcode, hljscss, contentHTML, htmlcontent, df;

    return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                minifyScript = function minifyScript(content) {
                    return UglifyJS.minify(content, { fromString: true });
                };

                escapeScript = function escapeScript(content) {
                    return content.replace(/<script>/g, '\\u003cscript>').replace(/<\/script>/g, '\\u003c/script>');
                };

                filename = function filename(p) {
                    return p.replace(/\.[^/.]+$/, "").replace(/^.*\//, '');
                };

                getExamples = function getExamples() {
                    var files = glob.sync(exdir + "/**").filter(function (f) {
                        return (/\.(js|jsx)$/.test(f)
                        );
                    });
                    return files;
                };

                cwd = process.cwd();
                root = getNodeProjectRoot(cwd);

                config = _.merge(getRc(root), config);

                // consts
                exname = config.dir || 'examples';
                builddir = config.builddir || "build";
                host = config.host || 'http://localhost';
                port = config.port || 3001;
                devport = config.devport || 9181;
                pkg = require(path.join(root, 'package.json'));
                fs = require('fs');
                exdir = path.join(root, exname);
                glob = require('glob');
                basedir = path.join(root, builddir, 'examples');
                context$1$0.next = 19;
                return regeneratorRuntime.awrap(child.exec('mkdir -p ' + basedir, { $through: false, $silent: true }));

            case 19:
                hljs = require('highlight.js');
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                context$1$0.prev = 23;
                _iterator = getExamples()[Symbol.iterator]();

            case 25:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    context$1$0.next = 40;
                    break;
                }

                file = _step.value;
                context$1$0.next = 29;
                return regeneratorRuntime.awrap(packcode(file, pkg, root));

            case 29:
                scriptcode = context$1$0.sent;
                polyfillcode = fs.readFileSync(path.join(__dirname, '../../vendor/browser-polyfill.js'), 'utf-8');
                hljscss = fs.readFileSync(path.join(__dirname, '../../vendor/hljs.css'), 'utf-8');

                safe(function (__) {
                    return contentHTML = fs.readFileSync(file.replace(/(js|jsx)$/, 'html'), 'utf-8');
                });
                htmlcontent = example({
                    contentHTML: contentHTML,
                    pkg: pkg,
                    pagename: filename(file),
                    sourcecode: hljs.highlight('javascript', fs.readFileSync(file, 'utf-8')).value,
                    styles: [hljscss],
                    scripts: [{ content: escapeScript(minifyScript(polyfillcode).code) }, { content: escapeScript(minifyScript(scriptcode).code) }]
                });
                df = path.join(basedir, filename(file) + '.html');

                console.log('writing file ' + df);

                fs.writeFileSync(df, htmlcontent, { encoding: 'utf-8' });

            case 37:
                _iteratorNormalCompletion = true;
                context$1$0.next = 25;
                break;

            case 40:
                context$1$0.next = 46;
                break;

            case 42:
                context$1$0.prev = 42;
                context$1$0.t0 = context$1$0['catch'](23);
                _didIteratorError = true;
                _iteratorError = context$1$0.t0;

            case 46:
                context$1$0.prev = 46;
                context$1$0.prev = 47;

                if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
                }

            case 49:
                context$1$0.prev = 49;

                if (!_didIteratorError) {
                    context$1$0.next = 52;
                    break;
                }

                throw _iteratorError;

            case 52:
                return context$1$0.finish(49);

            case 53:
                return context$1$0.finish(46);

            case 54:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this, [[23, 42, 46, 54], [47,, 49, 53]]);
};

// try to make the folder first