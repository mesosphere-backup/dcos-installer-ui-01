import classnames from 'classnames';
import React from 'react';

class SectionHeaderSecondary extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName, {
      'inverse': this.props.inverse
    });

    return (
      <h3 className={classes}>
        {this.props.children}
      </h3>
    );
  }
}

SectionHeaderSecondary.defaultProps = {
  className: 'section-header-tertiary',
  layoutClassName: 'flush text-align-center'
};

SectionHeaderSecondary.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  inverse: React.PropTypes.bool,
  layoutClassName: React.PropTypes.string
};

module.exports = SectionHeaderSecondary;
