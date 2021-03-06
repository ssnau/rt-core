import fs from 'fs';
import path from 'path';


export default {
  getNodeProjectRoot(_cwd) {
    let cwd = _cwd;
    let count = 0;
    let found = false;
    // 最多查找8层
    while (count++ < 8) {
      if (fs.existsSync(path.join(cwd, 'package.json'))) {
        found = true;
        break;
      }
      cwd = path.join(cwd, '..');
    }
    if (!found) throw new Error('没有在当前目录及上层目录找到package.json文件');
    return cwd;
  },
  getRc(root) {
    const f = path.join(root, '.rtrc');
    if (fs.existsSync(f)) {
      /* eslint-disable no-eval */
      return eval(`(${fs.readFileSync(f, 'utf-8')})`);
    }
    return {};
  },
  // safely invoke a function
  safe(fn) {
    try {
      fn();
    } catch (e) {
      // do nothing!
    }
  },
};
