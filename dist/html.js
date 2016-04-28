'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDomServer = require('react-dom/server');

var _reactDomServer2 = _interopRequireDefault(_reactDomServer);

var _componentsDemoPage = require('./components/DemoPage');

var _componentsDemoPage2 = _interopRequireDefault(_componentsDemoPage);

var _componentsDemoList = require('./components/DemoList');

var _componentsDemoList2 = _interopRequireDefault(_componentsDemoList);

var _componentsWrapper = require('./components/Wrapper');

var _componentsWrapper2 = _interopRequireDefault(_componentsWrapper);

function html(content, opt) {
  var props = opt;
  props.content = content;
  return '<!DOCTYPE html>\n    <html>\n    <head>\n        <meta charset="utf-8">\n        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"/>\n        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>\n        <title>' + (props.title || 'component demo') + '</title>\n    </head>\n    <body>\n      ' + _reactDomServer2['default'].renderToStaticMarkup(_react2['default'].createElement(_componentsWrapper2['default'], props)) + '\n    </body>\n    </html>';
}

exports['default'] = {
  example: function example(opt) {
    var props = opt || {};
    var content = _reactDomServer2['default'].renderToStaticMarkup(_react2['default'].createElement(_componentsDemoPage2['default'], props));
    return html(content, props);
  },
  list: function list(opt) {
    var props = opt || {};
    var content = _reactDomServer2['default'].renderToStaticMarkup(_react2['default'].createElement(_componentsDemoList2['default'], props));
    return html(content, props);
  }
};
module.exports = exports['default'];