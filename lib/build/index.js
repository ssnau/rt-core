import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import glob from 'glob';
import UglifyJS from 'uglify-js';
import hljs from 'highlight.js';

import child from '../child';
import packcode from '../packcode';

import commonFunc from '../common';
import htmlFunc from '../html';

const { getNodeProjectRoot, getRc, safe } = commonFunc;
const { example, page } = htmlFunc;

export default async function build(_config) {
  const cwd = process.cwd();
  const root = getNodeProjectRoot(cwd);
  const config = _.merge(getRc(root), _config);

  // consts
  const builddir = config.builddir || 'build';
  const exdir = config.dir || '';
  const isGroup = config.group || false;

  /* eslint-disable global-require */
  const pkg = require(path.join(root, 'package.json'));

  // var fs   = require('fs');
  var tpldir = path.join(root, exdir);

  function getItems(isGroup) {
    let items = [];
    if (isGroup) {
      const paths = glob
                    .sync(tpldir + '/*/package.json')
                    .filter(x => x.indexOf('node_modules') == -1);
      for (let p of paths) {
        let pkg = require(p),
            examples = [],
            files = [];

        if (pkg['mt-group']) {
          const item_path = p.substr(0, p.indexOf('package.json'));

          glob
           .sync(item_path + '/examples/**')
           .filter(f => /\.(js|jsx)$/.test(f))
           .forEach(f => {
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
      }
    } else {
      const paths = glob.sync(tpldir + '/**').filter(f => /\.(js|jsx)$/.test(f));
      let examples = [],
          files = [];
      
      paths.forEach(f => {examples.push(filename(f)), files.push(f)});
      items.push({
        name: pkg['name'],
        path: root,
        examples: examples,
        files: files,
      });
    }
    return items;
  }

  function getExamples() {
    const files = glob.sync(`${tpldir}/**`)
      .filter(f => /\.(js|jsx)$/.test(f));
    return files;
  }
  function filename(p) {
    return p.replace(/\.[^/.]+$/, '').replace(/^.*\//, '');
  }
  function escapeScript(content) {
    return content
      .replace(/<script>/g, '\\u003cscript>')
      .replace(/<\/script>/g, '\\u003c/script>');
  }
  function minifyScript(content) {
    return UglifyJS.minify(content, { fromString: true });
  }

  var itemList = getItems(isGroup);
  const polyfillcode = fs.readFileSync(
      path.join(__dirname, '../../vendor/browser-polyfill.js'), 'utf-8');
  const hljscss = fs.readFileSync(
  path.join(__dirname, '../../vendor/hljs.css'), 'utf-8');

  for (let item of itemList) {
    const basedir = path.join(item.path, builddir, 'examples');
    await child.exec(`mkdir -p ${basedir}`, { $through: false, $silent: true });
    let pkg = require(path.join(item.path, 'package.json'));
    /* eslint-disable prefer-const */
    for (let file of item.files) {
      let aliasList = [{
          name: item.name,
          path: item.path
      }];
      const scriptcode = await packcode(file, aliasList);
      let contentHTML;
      /* eslint-disable no-unused-vars, no-return-assign */
      safe(__ => contentHTML = fs.readFileSync(file.replace(/(js|jsx)$/, 'html'), 'utf-8'));
      const htmlcontent = example({
        contentHTML,
        pkg,
        pagename: filename(file),
        sourcecode: hljs.highlight('javascript', fs.readFileSync(file, 'utf-8')).value,
        styles: [
          hljscss,
        ],
        scripts: [
          { content: escapeScript(minifyScript(polyfillcode).code) },
          { content: escapeScript(minifyScript(scriptcode).code) },
        ],
      });

      const df = path.join(basedir, filename(file) + '.html');
      /* eslint-disable no-console */
      console.log('writing file ' + df);
      fs.writeFileSync(df, htmlcontent, { encoding: 'utf-8' });
    }
  }

  // build homepage 
  if (isGroup) {
    const basedir = path.join(root, builddir, 'homepage');
    await child.exec(`mkdir -p ${basedir}`, { $through: false, $silent: true });
    var aliasList = itemList.map( x => ({name: x.name, path: x.path }));
    const files = _.uniq(glob.sync(root + '/homepage/**')
          .filter(f => /\.(js|jsx|html)$/.test(f))
          .filter(f => filename(f)[0] !== '_')
          .map(f => f.replace(/\.(js|jsx|html)$/, ''))
      );

    for (var f of files) {
      var jsFile = fs.existsSync(`${f}.js`) ? `${f}.js` : `${f}.jsx`;
      var cssCode = fs.existsSync(`${f}.css`) ? fs.readFileSync(`${f}.css`, 'utf-8') : '';
      var jsCode = fs.existsSync(jsFile) ? await packcode(f, aliasList) : '';
      let contentHTML;
      if (fs.existsSync(`${f}.html`)) {
          /* eslint-disable no-unused-vars, no-return-assign */
          safe(__ => contentHTML = fs.readFileSync(`${f}.html`, 'utf-8'));
      } else {
          /* eslint-disable no-unused-vars, no-return-assign */
          safe(__ => contentHTML = `<div id="container-wrap"></div>`, 'utf-8');
      }
      const htmlcontent = page({
        contentHTML,
        pkg,
        pagename: filename(f),
        styles: [
          hljscss,
          cssCode,
        ],
        scripts: [
          { content: escapeScript(minifyScript(polyfillcode).code) },
          { content: escapeScript(minifyScript(jsCode).code) },
        ],
      });
      
      const df = path.join(basedir, `${filename(f)}.html`);
      /* eslint-disable no-console */
      console.log('writing file ' + df);
      fs.writeFileSync(df, htmlcontent, { encoding: 'utf-8' });
    }
  }
}
