import classnames from 'classnames';
import React from 'react';

export default class Application extends React.Component {
  render() {
    let classes = classnames({
      'has-navigation-bar': this.props.navigationBar,
      [this.props.className]: true,
      [this.props.layoutClassName]: true
    });

    return (
      <div className={classes}>
        {this.props.navigationBar}
        {this.props.view}
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
  navigationBar: React.PropTypes.node,
  view: React.PropTypes.node
};
