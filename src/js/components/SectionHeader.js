import classnames from 'classnames';
import React from 'react';

export default class SectionHeader extends React.Component {
  render() {
    let classes = classnames({
      [this.props.className]: true,
      [this.props.layoutClassName]: true
    });

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

SectionHeader.defaultProps = {
  className: 'section-header',
  layoutClassName: ''
};

SectionHeader.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  layoutClassName: React.PropTypes.string
};
