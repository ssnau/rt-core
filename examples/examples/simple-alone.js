import React from 'react';
import ReactDOM from 'react-dom';


class ComponentDemo extends React.Component {
  render() {
    return (
      <div>
        Hello, world~
      </div>
    );
  }
}

ReactDOM.render(<ComponentDemo />, document.getElementById('__component-content'));
