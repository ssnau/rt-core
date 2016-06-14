'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DemoGroup = function (_React$Component) {
  _inherits(DemoGroup, _React$Component);

  function DemoGroup() {
    _classCallCheck(this, DemoGroup);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(DemoGroup).apply(this, arguments));
  }

  _createClass(DemoGroup, [{
    key: 'render',
    value: function render() {
      var _props$components = this.props.components;
      var components = _props$components === undefined ? [] : _props$components;


      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'h1',
          { style: { marginLeft: '40px' } },
          ' The components list '
        ),
        components.length ? '' : _react2.default.createElement(
          'p',
          null,
          'There is no component.'
        ),
        _react2.default.createElement(
          'ul',
          null,
          components.map(function (component) {
            return _react2.default.createElement(
              'div',
              { style: { margin: '5px 0', padding: '5px', background: '#efefef' } },
              _react2.default.createElement(
                'p',
                { style: { margin: '5px 0', fontSize: '16px' } },
                _react2.default.createElement(
                  'a',
                  { href: '/components/?name=' + component.name },
                  component.name
                )
              ),
              _react2.default.createElement(
                'ul',
                null,
                component.examples.map(function (example) {
                  return _react2.default.createElement(
                    'li',
                    { style: { margin: '5px 0', fontSize: '16px' } },
                    _react2.default.createElement(
                      'a',
                      { href: '/examples?component=' + component.name + '&name=' + example },
                      example
                    )
                  );
                })
              )
            );
          })
        )
      );
    }
  }]);

  return DemoGroup;
}(_react2.default.Component);

DemoGroup.propTypes = {
  components: _react2.default.PropTypes.array
};

exports.default = DemoGroup;