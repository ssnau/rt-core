import React from 'react';
import ReactServer from 'react-dom/server';
import DemoPage from './components/DemoPage';
import DemoList from './components/DemoList';
import DemoGroup from './components/DemoGroup';
import Wrapper from './components/Wrapper';

function html(content, opt) {
  const props = opt;
  props.content = content;
  return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <title>${props.title || 'component demo'}</title>
    </head>
    <body>
      ${ReactServer.renderToStaticMarkup(<Wrapper {...props} />)}
    </body>
    </html>`;
}

export default {
  example(opt) {
    const props = opt || {};
    const content = ReactServer.renderToStaticMarkup(<DemoPage {...props} />);
    return html(content, props);
  },
  list(opt) {
    const props = opt || {};
    const content = ReactServer.renderToStaticMarkup(<DemoList {...props} />);
    return html(content, props);
  },
  group(opt) {
    const props = opt || {};
    const content = ReactServer.renderToStaticMarkup(<DemoGroup {...props} />);
    return html(content, props);
  }
};
