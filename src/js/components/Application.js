import classnames from 'classnames';
import React from 'react';

import APIErrorModal from '../components/APIErrorModal';

class Application extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName);

    return (
      <div className={classes}>
        {this.props.children}
        <APIErrorModal />
      </div>
    );
  }
}

Application.defaultProps = {
  className: 'application-wrapper',
  layoutClassName: 'flex-box flex-box-fit-height'
};

Application.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  layoutClassName: React.PropTypes.string,
  view: React.PropTypes.node
};

module.exports = Application;
