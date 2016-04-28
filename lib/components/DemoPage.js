import React from 'react';
import hljs from 'highlight.js';

class DemoPage extends React.Component {

  render() {
    const { sourcecode = '', pkg = {}, pagename, contentHTML, pkgjson = '' } = this.props;
    const id = Math.random().toString(32).slice(2) + '-' + Date.now();
    const contentHTMLColored = contentHTML ? hljs.highlight('html', contentHTML).value : '';
    const jscode = `
        ~function() {
          // support IE8+
          var node = document.getElementById("${id}");
          var blocks = [].slice.call(node.querySelectorAll('.__code-block'));
          var lis = [].slice.call(node.querySelectorAll('.__code-tab'));
          function select(tabName) {
              lis.forEach(function(b) {
                b.className = b.className.replace(/__selected/g, '');
                if (b.getAttribute('data-code-toggle') === tabName) {
                    b.className += ' __selected';
                }
              });

              blocks.forEach(function(b) {
                b.style.display = 'none';
                if (b.className.indexOf(tabName) > -1) {
                    b.style.display = 'block';
                }
              });
          }
          node.onclick = function (e) {
              var target = e.target;
              var li;
              if (target.tagName === 'LI') li = target;
              if (target.parentNode.tagName === 'LI') li = target.parentNode;

              if (!li) return;
              var tabName = li.getAttribute('data-code-toggle');
              if (!tabName) return;

              select(tabName);
          }
          select('__source_code');
        }();
    `;

    const navListJSX = contentHTML ? (
      <ul>
        <li className="__code-tab" data-code-toggle="__html_code"> HTML </li>
        <li className="__code-tab" data-code-toggle="__source_code"> JavaScript </li>
      </ul>
    ) : null;

    // @TODO delete
    // <li className="__code-tab" data-code-toggle="__package_code"> package.json </li>

    return (
      <div>
        <h1>{pkg.name}@{pkg.version} - {pagename}</h1>
        <div
          id="__component-content"
          dangerouslySetInnerHTML={{ __html: contentHTML || '' }}
        />
        <br />
        <div className="code-highlight" id={id}>
          {navListJSX}
          <pre>
            <code
              id="_component_code"
              data-codetype="html"
              className="__code-block __html_code"
              dangerouslySetInnerHTML={{ __html: contentHTMLColored }}
            />
            <code
              id="_component_code"
              data-codetype="javascript"
              className="__code-block __source_code"
              dangerouslySetInnerHTML={{ __html: sourcecode }}
            />
            <code
              style={{ display: 'none' }}
              id="_component_code"
              className="__code-block __package_code"
              data-codetype="package.json"
              dangerouslySetInnerHTML={{ __html: hljs.highlight('json', pkgjson).value }}
            />
          </pre>
          <script dangerouslySetInnerHTML={{ __html: jscode }} />
        </div>
      </div>
    );
  }
}

DemoPage.propTypes = {
  sourcecode: React.PropTypes.string,
  pkg: React.PropTypes.object,
  pagename: React.PropTypes.string,
  contentHTML: React.PropTypes.string,
  pkgjson: React.PropTypes.string,
};

export default DemoPage;
