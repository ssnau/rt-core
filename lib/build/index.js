var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var child = require('../child');
var {getNodeProjectRoot, getRc, safe} = require('../common');
var {example, list} = require('../html');
var packcode = require('../packcode');
var UglifyJS = require("uglify-js");

module.exports = async function (config) {
    var cwd = process.cwd();
    var root = getNodeProjectRoot(cwd);
    config = _.merge(getRc(root), config);

    // consts
    var exname = config.dir || 'examples';
    var builddir = config.builddir || "build";

    var pkg = require(path.join(root, 'package.json'));

    var fs   = require('fs');
    var exdir = path.join(root, exname);
    var glob = require('glob');

    function getExamples() {
        var files = glob.sync(exdir + "/**")
            .filter(f => /\.(js|jsx)$/.test(f));
        return files;
    }
    function filename(p) {
        return p.replace(/\.[^/.]+$/, "").replace(/^.*\//, '')
    }
    function escapeScript(content) {
        return content
                .replace(/<script>/g, '\\u003cscript>')
                .replace(/<\/script>/g, '\\u003c/script>');
    }
    function minifyScript(content) {
        return UglifyJS.minify(content, {fromString: true});
    }


    // try to make the folder first
    var basedir = path.join(root, builddir, 'examples');
    await child.exec(`mkdir -p ${basedir}`, {$through: false, $silent: true});

    var hljs = require('highlight.js');
    for (var file of getExamples()) {
        var scriptcode = await packcode(file, pkg, root);
        var polyfillcode = fs.readFileSync(path.join(__dirname, '../../vendor/browser-polyfill.js'), 'utf-8');
        var hljscss = fs.readFileSync(path.join(__dirname, '../../vendor/hljs.css'), 'utf-8');
        var contentHTML;
        safe(__ => contentHTML = fs.readFileSync(file.replace(/(js|jsx)$/, 'html'), 'utf-8'));
        var htmlcontent = example({
            contentHTML,
            pkg: pkg,
            pagename: filename(file),
            sourcecode: hljs.highlight('javascript', fs.readFileSync(file, 'utf-8')).value,
            styles: [
              hljscss
            ],
            scripts: [
                {content: escapeScript(minifyScript(polyfillcode).code)},
                {content: escapeScript(minifyScript(scriptcode).code)},
            ]
        });

        var df = path.join(basedir, filename(file) + '.html'); 
        console.log('writing file ' + df);

        fs.writeFileSync(df, htmlcontent, {encoding: 'utf-8'});
    }
}
