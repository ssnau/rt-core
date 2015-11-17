import Component from '<$$& appName $$>';
import React from 'react';
import ReactDOM from 'react-dom';

require('<$$& appName $$>/assets/index.css');

class Demo extends React.Component {
  render() {
    return (
      <div>
        <Component name="click me!" onClick={() => alert('custom alert')} />
      </div>
    );
  }
}
ReactDOM.render(<Demo />, document.getElementById('__component-content'));
