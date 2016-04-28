import React from 'react';
import Stylejs from 'react-style-js';

class DemoList extends React.Component {
  render() {
    const { scripts = [], styles = [], content = '' } = this.props;
    const scriptsJSX = scripts.map(
      (s, i) => (s.src ? <script key={i} src={s.src} /> :
        <script key={i} dangerouslySetInnerHTML={{ __html: s.content }} />)
    );

    return (
      <div>
        {
          styles.map((s, i) => {
            // if it is url
            if (/css$/.test(s) && s.split('\n').length < 2) {
              return <Stylejs src={s} key={i} />;
            }
            return <style dangerouslySetInnerHTML={{ __html: s }} />;
          })
        }
        <div dangerouslySetInnerHTML={{ __html: content }} />
        {scriptsJSX}
      </div>
    );
  }
}

DemoList.propTypes = {
  scripts: React.PropTypes.array,
  styles: React.PropTypes.array,
  content: React.PropTypes.string,
};

export default DemoList;
