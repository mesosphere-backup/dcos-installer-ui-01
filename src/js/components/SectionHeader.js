import classnames from 'classnames';
import React from 'react';

class SectionHeader extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName);

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

module.exports = SectionHeader;
