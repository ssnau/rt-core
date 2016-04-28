import childProcess from 'child_process';
import _ from 'lodash';


const exec = childProcess.exec;

export default {
  /* 一个拥有promise风格的exec,返回{code, out} */
  exec: function _exec(command, _options) {
    const options = _.merge({
      $through: true,  // 是否将stdout, stderr打到控制台
    }, _options || {});

    return new Promise((resolve, reject) => {
      const child = exec(command, options);
      const { $through, $silent = true } = options;
      let out = '';
      const cmd = { resolve, reject };
      child.stdout.on('data', buf => {
        const string = String(buf);
        if ($through) process.stdout.write(string);
        out += string;
      });
      child.stderr.on('data', buf => {
        const string = String(buf);
        if ($through) process.stdout.write(string);
        out += string;
      });
      child.on('close', code => {
        const hasError = String(code) !== '0' && $silent !== true;
        cmd[hasError ? 'reject' : 'resolve']({ code, out });
      });
    });
  },
};
