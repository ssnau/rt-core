import React from 'react';

class DemoList extends React.Component {

  render() {
    const { examples = [] } = this.props;
    return (
      <div>
        <h1> Examples </h1>
        <ul>
          {
            examples.map(f =>
              <li key={f} style={{ padding: '10px', fontSize: '16px' }}>
                <a href={`/examples/${f}`}>{f}</a>
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
