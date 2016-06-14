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
  const exdir = config.dir || '';
  const host = config.host || 'http://localhost';
  const port = config.port || 3001;
  const isGroup = config.group || null;
  /* eslint-disable global-require */
  const pkg = require(path.join(root, 'package.json'));
  const app = express();
  var tpldir = path.join(root, exdir);
  var itemList = getItems(isGroup);

  devserver.getMiddlewares({
    rtconfig: config,
    tpldir: tpldir,
    port,
    root,
    pkg,
    items: itemList,
  }).forEach(x => app.use(x));

  function filename(p) {
    return p.replace(/\.[^/.]+$/, '').replace(/^.*\//, '');
  }

  function getExamples() {
    const files = glob.sync(tpldir + '/**')
      .filter(f => /\.(js|jsx)$/.test(f));
    return files;
  }


  function getComponents(itemList) {
    var components = itemList.map(x => ({
          name: x.name,
          examples: x.examples
        }));

    return components;
  }

  function getItems(isGroup) {
    let items = [];
    if (isGroup) {
      const paths = glob.sync(tpldir + '/*/package.json');
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

  /* eslint-disable new-cap */
  const router = express.Router();
  app.use(express.static(path.join(__dirname, '../../vendor')));

  router.get('/', (req, res) => {
    if (isGroup) {
      var components = getComponents(itemList);
      res.send(htmlFunc.group({
          components: components,
          title: pkg['name']
      }));
    } else {
      const files = getExamples();
      const fns = files.map(filename);
      res.send(list({
        examples: fns,
        title: 'examples',
      }));
    }
  });

  router.get('/examples/', (req, res) => {
    const itemName = req.query.component;
    const exampleName = req.query.name;

    if (!exampleName) {
      res.send(`<h1 style="color:#cc1122"> example's name can not null!</h1>`);
      return;
    }

    let fp, contentHTML, tfp, jsPath, pkgInfo = pkg;

    if (isGroup) {
      const item = itemList.find(x => x.name === itemName)
      if (!itemName || !item) {
        res.send(`<h1 style="color:#cc1122"> component not found!</h1>`);
        return;
      }
      tfp = path.join(item.path, 'examples', exampleName);
      pkgInfo = require(item.path + '/package.json');

    } else {
      tfp = path.join(tpldir, exampleName);
    }

    if (fs.existsSync(tfp + '.js')) fp = `${tfp}.js`;
    if (fs.existsSync(tfp + '.jsx')) fp = `${tfp}.jsx`;
    if (!fp) {
      res.send(`<h1 style="color:#cc1122"> ${exampleName} not found!</h1>`);
      return;
    }

    jsPath =  devserver.getURL(fp);
    /* eslint-disable no-unused-vars, no-return-assign */
    safe(__ => contentHTML = fs.readFileSync(`${tfp}.html`, 'utf-8'));

    const content = fs.readFileSync(fp, 'utf-8');
    res.send(example({
      pkg: pkgInfo,
      contentHTML,
      pagename: exampleName,
      styles: [
        '/hljs.css',
      ],
      scripts: [
        { src: '/browser-polyfill.js' },
        { src: jsPath },
      ],
      title: pkgInfo.name + '-' + exampleName,
      // @TODO delete
      pkgjson: JSON.stringify({
        name: `${pkgInfo.name}-${exampleName}-test`,
        dependencies: {
          [pkgInfo.name]: pkgInfo.version,
        },
      }, null, 2),
      sourcecode: hljs.highlight('javascript', content).value,
    }));

    return;
  });


  router.get('/components/', (req, res) => {
    const itemName = req.query.name;
    const item = itemList.find(x => x.name === itemName)
    if (!item) {
      res.send(`<h1 style="color:#cc1122"> ${itemName} not found!</h1>`);
      return;
    }

    res.send(list({
      examples: item.examples,
      title: 'examples',
      component: itemName,
    }));

    return;
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
