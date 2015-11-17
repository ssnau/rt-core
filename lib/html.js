import Stylejs from "react-style-js";
var hljs = require('highlight.js');
var React = require('react');
var ReactServer = require('react-dom/server');
var Wrapper = React.createClass({
    render() {
        const {scripts=[], styles=[], content=''} = this.props;
        return (
        <div>
        {styles.map((s, i) => {
          // if it is url
          if (/css$/.test(s) && s.split('\n').length < 2) {
            return <Stylejs src={s} key={i} />
           } else {
             return <style dangerouslySetInnerHTML={{__html: s}}></style>
           }
        })}
        <div dangerouslySetInnerHTML={{__html: content}}></div>
        {scripts.map((s, i) => {
          return s.src ? <script key={i} src={s.src}></script> :
            <script key={i} dangerouslySetInnerHTML={{__html: s.content}}></script>
        })}
        </div>);

    }
});
var DemoPage = React.createClass({
    render() {
        const {sourcecode='', pkg = {}, pagename, contentHTML, pkgjson=''} = this.props;
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
        `
        return (
        <div>
            <h1>{pkg.name}@{pkg.version} - {pagename}</h1>
            {
                contentHTML ? 
                <div id="__component-content" dangerouslySetInnerHTML={{__html: contentHTML}}></div> : 
                <div id="__component-content"></div>
            }

            <br />
            <div className="code-highlight" id={id}>
                {function(){
                    if (!contentHTML) return null;
                    return (
                        <ul>
                            <li className="__code-tab" data-code-toggle="__html_code"> HTML </li>
                            <li className="__code-tab" data-code-toggle="__source_code"> JavaScript </li>
                        </ul>
                    )
                }()}
                <pre>
                    <code id="_component_code" data-codetype="html" className="__code-block __html_code" dangerouslySetInnerHTML={{__html: contentHTMLColored}}></code>
                    <code id="_component_code" data-codetype="javascript" className="__code-block __source_code" dangerouslySetInnerHTML={{__html: sourcecode}}></code>
                    <div style={{"display":"none"}}>
                        <code id="_component_code" data-codetype="package.json" className="__code-block __source_code" dangerouslySetInnerHTML={{__html: pkgjson}}></code>
                    </div>
                </pre>
                <script dangerouslySetInnerHTML={{__html: jscode}}></script>
            </div>
        </div>);
    }
});

var List = React.createClass({
    render() {
        const {examples = []} = this.props;
        return (
        <div>
            <h1> Examples </h1>
            <ul>
                {examples.map(f =>
                <li key={f} style={{padding: '10px',fontSize: '16px'}}>
                    <a href={'/examples/'  + f}>{f}</a>
                </li>)}
            </ul>
        </div>);
    }
});
function html(content, opt) {
    opt.content = content;
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <title>${opt.title || 'component demo'}</title>
    </head>
    <body>
    ${ReactServer.renderToStaticMarkup(<Wrapper {...opt} />)}
    </body>
    </html>`
}

module.exports = {
    example: function (opt) {
        var opt = opt || {};
        var content = ReactServer.renderToStaticMarkup(<DemoPage {...opt} />);
        return html(content, opt);
    },
    list: function (opt) {
        var opt = opt || {};
        var content = ReactServer.renderToStaticMarkup(<List {...opt} />);
        return html(content, opt);
    }
};
