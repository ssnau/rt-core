import React from 'react';

class DemoGroup extends React.Component {

  render() {
    const { components = [] } = this.props;

    return (
      <div>
        <h1 style={{marginLeft: '40px'}}> The components list </h1>
        { components.length ? '' : <p>There is no component.</p> }
        <ul>
        { components.map(component => 
           <div style={{ margin: '5px 0', padding: '5px', background: '#efefef' }}>
             <p style={{ margin: '5px 0', fontSize: '16px' }}><a href={`/components/?name=${component.name}`}>{component.name}</a></p>
             <ul>
             { component.examples.map(example =>
                 <li style={{ margin: '5px 0', fontSize: '16px' }}><a href={`/examples?component=${component.name}&name=${example}`}>{example}</a></li>
               )
             }
             </ul>
           </div>
           )
        }
        </ul>
      </div>
    );
  }
}

DemoGroup.propTypes = {
  components: React.PropTypes.array,
};

export default DemoGroup;
 
