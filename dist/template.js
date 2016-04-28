'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = tpl;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mustache = require('mustache');

var _mustache2 = _interopRequireDefault(_mustache);

function tpl(string, data) {
  return _mustache2['default'].render('{{=<$$ $$>=}}' + string, data);
}

module.exports = exports['default'];