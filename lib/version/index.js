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

export default async function publish(_config = {}) {
  const cwd = process.cwd();
  const root = getNodeProjectRoot(cwd);
  const dir = _config.dir || '';
  const version =  _config.version || 'patch';

  var pkgs = glob
      .sync(`${path.join(root, dir)}/*/package.json`)
      .filter(x => x.indexOf('node_modules') == -1)
      .map(x => {
          var groupName = require(x)["mt-group"];
          if(groupName) {
              var direct = path.dirname(x);
              var name = require(x)["name"];
              var version = require(x)["version"];
              return {
                  name: name,
                  version: version,
                  direct: direct,
              }
         }
      });

  for (var x of pkgs) {
    var msg = await child.exec(`cd ${x.direct} && npm version ${version}`, {$through: false});
    console.log(`${x.name} ${msg.out}`);
  }
  await child.exec(`cd ${root} && git add .`);
}

