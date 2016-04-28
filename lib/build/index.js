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
const { example } = htmlFunc;

export default async function build(_config) {
  const cwd = process.cwd();
  const root = getNodeProjectRoot(cwd);
  const config = _.merge(getRc(root), _config);

  // consts
  const exname = config.dir || 'examples';
  const builddir = config.builddir || 'build';

  /* eslint-disable global-require */
  const pkg = require(path.join(root, 'package.json'));

  // var fs   = require('fs');
  const exdir = path.join(root, exname);

  function getExamples() {
    const files = glob.sync(`${exdir}/**`)
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

  // try to make the folder first
  const basedir = path.join(root, builddir, 'examples');
  await child.exec(`mkdir -p ${basedir}`, { $through: false, $silent: true });

  /* eslint-disable prefer-const */
  for (let file of getExamples()) {
    const scriptcode = await packcode(file, pkg, root);
    const polyfillcode = fs.readFileSync(
      path.join(__dirname, '../../vendor/browser-polyfill.js'), 'utf-8');
    const hljscss = fs.readFileSync(
      path.join(__dirname, '../../vendor/hljs.css'), 'utf-8');
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
