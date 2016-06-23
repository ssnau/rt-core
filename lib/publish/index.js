import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import glob from 'glob';
import child from '../child';
import commonFunc from '../common';

const { getNodeProjectRoot, getRc, safe } = commonFunc;

export default async function publish(_config) {
  const cwd = process.cwd();
  const root = getNodeProjectRoot(cwd);
  const dir = _config.dir || '';
  const npm =  _config.dir || 'npm';

  var pkgs = glob
      .sync(`${path.join(root, dir)}/*/package.json`)
      .filter(x => x.indexOf('node_modules') == -1)
      .map(x => {
          var groupName = require(x)["mt-group"];
          if(groupName) {
              var direct = path.dirname(x);
              var version = require(x)["version"];
              var name = require(x)["name"];
              return {
                  name: name,
                  version: version,
                  direct: direct,
              }
         }
      });
  
  for (var x of pkgs) {
    await child.exec(`cd ${x.direct} && npm run pub`);
  }

  // await child.exec(`cd root && ${npm} publish`);
}

