'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _highlightJs = require('highlight.js');

var _highlightJs2 = _interopRequireDefault(_highlightJs);

var DemoPage = (function (_React$Component) {
  _inherits(DemoPage, _React$Component);

  function DemoPage() {
    _classCallCheck(this, DemoPage);

    _get(Object.getPrototypeOf(DemoPage.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(DemoPage, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var _props$sourcecode = _props.sourcecode;
      var sourcecode = _props$sourcecode === undefined ? '' : _props$sourcecode;
      var _props$pkg = _props.pkg;
      var pkg = _props$pkg === undefined ? {} : _props$pkg;
      var pagename = _props.pagename;
      var contentHTML = _props.contentHTML;
      var _props$pkgjson = _props.pkgjson;
      var pkgjson = _props$pkgjson === undefined ? '' : _props$pkgjson;

      var id = Math.random().toString(32).slice(2) + '-' + Date.now();
      var contentHTMLColored = contentHTML ? _highlightJs2['default'].highlight('html', contentHTML).value : '';
      var jscode = '\n        ~function() {\n          // support IE8+\n          var node = document.getElementById("' + id + '");\n          var blocks = [].slice.call(node.querySelectorAll(\'.__code-block\'));\n          var lis = [].slice.call(node.querySelectorAll(\'.__code-tab\'));\n          function select(tabName) {\n              lis.forEach(function(b) {\n                b.className = b.className.replace(/__selected/g, \'\');\n                if (b.getAttribute(\'data-code-toggle\') === tabName) {\n                    b.className += \' __selected\';\n                }\n              });\n\n              blocks.forEach(function(b) {\n                b.style.display = \'none\';\n                if (b.className.indexOf(tabName) > -1) {\n                    b.style.display = \'block\';\n                }\n              });\n          }\n          node.onclick = function (e) {\n              var target = e.target;\n              var li;\n              if (target.tagName === \'LI\') li = target;\n              if (target.parentNode.tagName === \'LI\') li = target.parentNode;\n\n              if (!li) return;\n              var tabName = li.getAttribute(\'data-code-toggle\');\n              if (!tabName) return;\n\n              select(tabName);\n          }\n          select(\'__source_code\');\n        }();\n    ';

      var navListJSX = contentHTML ? _react2['default'].createElement(
        'ul',
        null,
        _react2['default'].createElement(
          'li',
          { className: '__code-tab', 'data-code-toggle': '__html_code' },
          ' HTML '
        ),
        _react2['default'].createElement(
          'li',
          { className: '__code-tab', 'data-code-toggle': '__source_code' },
          ' JavaScript '
        )
      ) : null;

      // @TODO delete
      // <li className="__code-tab" data-code-toggle="__package_code"> package.json </li>

      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          'h1',
          null,
          pkg.name,
          '@',
          pkg.version,
          ' - ',
          pagename
        ),
        _react2['default'].createElement('div', {
          id: '__component-content',
          dangerouslySetInnerHTML: { __html: contentHTML || '' }
        }),
        _react2['default'].createElement('br', null),
        _react2['default'].createElement(
          'div',
          { className: 'code-highlight', id: id },
          navListJSX,
          _react2['default'].createElement(
            'pre',
            null,
            _react2['default'].createElement('code', {
              id: '_component_code',
              'data-codetype': 'html',
              className: '__code-block __html_code',
              dangerouslySetInnerHTML: { __html: contentHTMLColored }
            }),
            _react2['default'].createElement('code', {
              id: '_component_code',
              'data-codetype': 'javascript',
              className: '__code-block __source_code',
              dangerouslySetInnerHTML: { __html: sourcecode }
            }),
            _react2['default'].createElement('code', {
              style: { display: 'none' },
              id: '_component_code',
              className: '__code-block __package_code',
              'data-codetype': 'package.json',
              dangerouslySetInnerHTML: { __html: _highlightJs2['default'].highlight('json', pkgjson).value }
            })
          ),
          _react2['default'].createElement('script', { dangerouslySetInnerHTML: { __html: jscode } })
        )
      );
    }
  }]);

  return DemoPage;
})(_react2['default'].Component);

DemoPage.propTypes = {
  sourcecode: _react2['default'].PropTypes.string,
  pkg: _react2['default'].PropTypes.object,
  pagename: _react2['default'].PropTypes.string,
  contentHTML: _react2['default'].PropTypes.string,
  pkgjson: _react2['default'].PropTypes.string
};

exports['default'] = DemoPage;
module.exports = exports['default'];