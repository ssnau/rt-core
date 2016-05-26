import React from 'react';

class DemoList extends React.Component {

  render() {
    const { examples = [], component = null } = this.props;
    return (
      <div>
        <h1> Examples </h1>
        <ul>
          {
            examples.map(f =>
              <li key={f} style={{ padding: '10px', fontSize: '16px' }}>
                <a href={component ? `/examples?component=${component}&name=${f}` : `/examples?name=${f}`}>{f}</a>
              </li>
            )
          }
        </ul>
      </div>
    );
  }
}

DemoList.propTypes = {
  examples: React.PropTypes.array,
};

export default DemoList;
