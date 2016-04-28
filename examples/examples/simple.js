import React from 'react';
import ReactDOM from 'react-dom';


class ComponentDemo extends React.Component {
  render() {
    return (
      <div>
        <i
          className="fa fa-envira"
          style={{ color: 'green', fontSize: '3em' }}
        />
        hello, world!~
      </div>
    );
  }
}

ReactDOM.render(<ComponentDemo />, document.getElementById('app'));
