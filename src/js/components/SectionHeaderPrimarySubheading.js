import classnames from 'classnames';
import React from 'react';

class SectionHeaderPrimarySubheading extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName, {
        'inverse': this.props.inverse
      });

    return (
      <p className={classes}>
        {this.props.children}
      </p>
    );
  }
}

SectionHeaderPrimarySubheading.defaultProps = {
  className: 'section-header-primary-sub-heading',
  layoutClassName: ''
};

SectionHeaderPrimarySubheading.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  inverse: React.PropTypes.bool,
  layoutClassName: React.PropTypes.string
};

module.exports = SectionHeaderPrimarySubheading;
