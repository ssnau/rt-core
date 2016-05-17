'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _DemoPage = require('./components/DemoPage');

var _DemoPage2 = _interopRequireDefault(_DemoPage);

var _DemoList = require('./components/DemoList');

var _DemoList2 = _interopRequireDefault(_DemoList);

var _Wrapper = require('./components/Wrapper');

var _Wrapper2 = _interopRequireDefault(_Wrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function html(content, opt) {
  var props = opt;
  props.content = content;
  return '<!DOCTYPE html>\n    <html>\n    <head>\n        <meta charset="utf-8">\n        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"/>\n        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>\n        <title>' + (props.title || 'component demo') + '</title>\n    </head>\n    <body>\n      ' + _server2.default.renderToStaticMarkup(_react2.default.createElement(_Wrapper2.default, props)) + '\n    </body>\n    </html>';
}

exports.default = {
  example: function example(opt) {
    var props = opt || {};
    var content = _server2.default.renderToStaticMarkup(_react2.default.createElement(_DemoPage2.default, props));
    return html(content, props);
  },
  list: function list(opt) {
    var props = opt || {};
    var content = _server2.default.renderToStaticMarkup(_react2.default.createElement(_DemoList2.default, props));
    return html(content, props);
  }
};