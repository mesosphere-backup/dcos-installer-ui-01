import classnames from 'classnames';
import React from 'react';

class SectionHeaderIcon extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName);

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

SectionHeaderIcon.defaultProps = {
  className: 'section-header-icon',
  layoutClassName: ''
};

SectionHeaderIcon.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  layoutClassName: React.PropTypes.string
};

module.exports = SectionHeaderIcon;
