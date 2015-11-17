'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactStyleJs = require("react-style-js");

var _reactStyleJs2 = _interopRequireDefault(_reactStyleJs);

var hljs = require('highlight.js');
var React = require('react');
var ReactServer = require('react-dom/server');
var Wrapper = React.createClass({
    displayName: 'Wrapper',

    render: function render() {
        var _props = this.props;
        var _props$scripts = _props.scripts;
        var scripts = _props$scripts === undefined ? [] : _props$scripts;
        var _props$styles = _props.styles;
        var styles = _props$styles === undefined ? [] : _props$styles;
        var _props$content = _props.content;
        var content = _props$content === undefined ? '' : _props$content;

        return React.createElement(
            'div',
            null,
            styles.map(function (s, i) {
                // if it is url
                if (/css$/.test(s) && s.split('\n').length < 2) {
                    return React.createElement(_reactStyleJs2['default'], { src: s, key: i });
                } else {
                    return React.createElement('style', { dangerouslySetInnerHTML: { __html: s } });
                }
            }),
            React.createElement('div', { dangerouslySetInnerHTML: { __html: content } }),
            scripts.map(function (s, i) {
                return s.src ? React.createElement('script', { key: i, src: s.src }) : React.createElement('script', { key: i, dangerouslySetInnerHTML: { __html: s.content } });
            })
        );
    }
});
var DemoPage = React.createClass({
    displayName: 'DemoPage',

    render: function render() {
        var _props2 = this.props;
        var _props2$sourcecode = _props2.sourcecode;
        var sourcecode = _props2$sourcecode === undefined ? '' : _props2$sourcecode;
        var _props2$pkg = _props2.pkg;
        var pkg = _props2$pkg === undefined ? {} : _props2$pkg;
        var pagename = _props2.pagename;
        var contentHTML = _props2.contentHTML;
        var _props2$pkgjson = _props2.pkgjson;
        var pkgjson = _props2$pkgjson === undefined ? '' : _props2$pkgjson;

        var id = Math.random().toString(32).slice(2) + '-' + Date.now();
        var contentHTMLColored = contentHTML ? hljs.highlight('html', contentHTML).value : '';
        var jscode = '\n        ~function() {\n          // support IE8+ \n          var node = document.getElementById("' + id + '");\n          var blocks = [].slice.call(node.querySelectorAll(\'.__code-block\'));\n          var lis = [].slice.call(node.querySelectorAll(\'.__code-tab\'));\n          function select(tabName) {\n              lis.forEach(function(b) {\n                b.className = b.className.replace(/__selected/g, \'\');\n                if (b.getAttribute(\'data-code-toggle\') === tabName) {\n                    b.className += \' __selected\';\n                }\n              });\n\n              blocks.forEach(function(b) {\n                b.style.display = \'none\';\n                if (b.className.indexOf(tabName) > -1) {\n                    b.style.display = \'block\';\n                }\n              });\n          }\n          node.onclick = function (e) {\n              var target = e.target;\n              var li;\n              if (target.tagName === \'LI\') li = target;\n              if (target.parentNode.tagName === \'LI\') li = target.parentNode;\n\n              if (!li) return;\n              var tabName = li.getAttribute(\'data-code-toggle\');\n              if (!tabName) return;\n\n              select(tabName);\n          }\n          select(\'__source_code\');\n        }();\n        ';
        return React.createElement(
            'div',
            null,
            React.createElement(
                'h1',
                null,
                pkg.name,
                '@',
                pkg.version,
                ' - ',
                pagename
            ),
            contentHTML ? React.createElement('div', { id: '__component-content', dangerouslySetInnerHTML: { __html: contentHTML } }) : React.createElement('div', { id: '__component-content' }),
            React.createElement('br', null),
            React.createElement(
                'div',
                { className: 'code-highlight', id: id },
                (function () {
                    if (!contentHTML) return null;
                    return React.createElement(
                        'ul',
                        null,
                        React.createElement(
                            'li',
                            { className: '__code-tab', 'data-code-toggle': '__html_code' },
                            ' HTML '
                        ),
                        React.createElement(
                            'li',
                            { className: '__code-tab', 'data-code-toggle': '__source_code' },
                            ' JavaScript '
                        )
                    );
                })(),
                React.createElement(
                    'pre',
                    null,
                    React.createElement('code', { id: '_component_code', 'data-codetype': 'html', className: '__code-block __html_code', dangerouslySetInnerHTML: { __html: contentHTMLColored } }),
                    React.createElement('code', { id: '_component_code', 'data-codetype': 'javascript', className: '__code-block __source_code', dangerouslySetInnerHTML: { __html: sourcecode } }),
                    React.createElement(
                        'div',
                        { style: { "display": "none" } },
                        React.createElement('code', { id: '_component_code', 'data-codetype': 'package.json', className: '__code-block __source_code', dangerouslySetInnerHTML: { __html: pkgjson } })
                    )
                ),
                React.createElement('script', { dangerouslySetInnerHTML: { __html: jscode } })
            )
        );
    }
});

var List = React.createClass({
    displayName: 'List',

    render: function render() {
        var _props$examples = this.props.examples;
        var examples = _props$examples === undefined ? [] : _props$examples;

        return React.createElement(
            'div',
            null,
            React.createElement(
                'h1',
                null,
                ' Examples '
            ),
            React.createElement(
                'ul',
                null,
                examples.map(function (f) {
                    return React.createElement(
                        'li',
                        { key: f, style: { padding: '10px', fontSize: '16px' } },
                        React.createElement(
                            'a',
                            { href: '/examples/' + f },
                            f
                        )
                    );
                })
            )
        );
    }
});
function html(content, opt) {
    opt.content = content;
    return '<!DOCTYPE html>\n    <html>\n    <head>\n        <meta charset="utf-8">\n        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"/>\n        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>\n        <title>' + (opt.title || 'component demo') + '</title>\n    </head>\n    <body>\n    ' + ReactServer.renderToStaticMarkup(React.createElement(Wrapper, opt)) + '\n    </body>\n    </html>';
}

module.exports = {
    example: function example(opt) {
        var opt = opt || {};
        var content = ReactServer.renderToStaticMarkup(React.createElement(DemoPage, opt));
        return html(content, opt);
    },
    list: function list(opt) {
        var opt = opt || {};
        var content = ReactServer.renderToStaticMarkup(React.createElement(List, opt));
        return html(content, opt);
    }
};