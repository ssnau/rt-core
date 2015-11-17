// 模板引擎，仅支持<$$name$$>，不与现有模板引擎有语法冲突，适合用来做project template
'use strict';

var Mustache = require('mustache');
module.exports = function tpl(string, data) {
  return Mustache.render('{{=<$$ $$>=}}' + string, data);
};