import path from 'path';
import fs from 'fs';
import glob from 'glob';
import _ from 'lodash';
import express from 'express';
import hljs from 'highlight.js';

import commFunc from '../common';
import htmlFunc from '../html';
import devserver from './devserver';

const { getNodeProjectRoot, getRc, safe } = commFunc;
const { example, list } = htmlFunc;

/**
 * @param {{dir: string,
            host: string,
            port: number}} _config
 **/
export default function server(_config) {
  const cwd = process.cwd();
  const root = getNodeProjectRoot(cwd);
  const config = _.merge(getRc(root), _config);

  // consts
  const exname = config.dir || 'examples';
  const host = config.host || 'http://localhost';
  const port = config.port || 3001;
  /* eslint-disable global-require */
  const pkg = require(path.join(root, 'package.json'));
  const app = express();
  const exdir = path.join(root, exname);

  devserver.getMiddlewares({
    rtconfig: config,
    tpldir: exdir,
    port,
    root,
    pkg,
  }).forEach(x => app.use(x));

  function getExamples() {
    const files = glob.sync(exdir + '/**')
      .filter(f => /\.(js|jsx)$/.test(f));
    return files;
  }
  function filename(p) {
    return p.replace(/\.[^/.]+$/, '').replace(/^.*\//, '');
  }

  /* eslint-disable new-cap */
  const router = express.Router();
  app.use(express.static(path.join(__dirname, '../../vendor')));

  router.get('/', (req, res) => {
    const files = getExamples();
    const fns = files.map(filename);

    res.send(list({
      examples: fns,
      title: 'examples',
    }));
  });

  router.get('/examples/:name', (req, res) => {
    const name = req.params.name;
    const tfp = path.join(exdir, name);
    let fp;
    let contentHTML;
    if (fs.existsSync(tfp + '.js')) fp = `${tfp}.js`;
    if (fs.existsSync(tfp + '.jsx')) fp = `${tfp}.jsx`;
    if (!fp) {
      res.send(`<h1 style="color:#cc1122"> ${name} not found!</h1>`);
      return;
    }
    /* eslint-disable no-unused-vars, no-return-assign */
    safe(__ => contentHTML = fs.readFileSync(`${tfp}.html`, 'utf-8'));

    const content = fs.readFileSync(fp, 'utf-8');
    res.send(example({
      pkg,
      contentHTML,
      pagename: name,
      styles: [
        '/hljs.css',
      ],
      scripts: [
        { src: '/browser-polyfill.js' },
        { src: devserver.getURL(fp) },
      ],
      title: pkg.name + '-' + name,
      // @TODO delete
      pkgjson: JSON.stringify({
        name: `${pkg.name}-${name}-test`,
        dependencies: {
          [pkg.name]: pkg.version,
        },
      }, null, 2),
      sourcecode: hljs.highlight('javascript', content).value,
    }));
  });

  app.use(router);

  app.listen(port, () => {
    setTimeout(() => {
      /* eslint-disable no-console */
      console.log(
        `
-----------------------------------------------------------------------------------
  app server listening on ${port}, visit ${host}:${port} to check awesome!
-----------------------------------------------------------------------------------
        `
      );
    }, 1000);
  });
}
