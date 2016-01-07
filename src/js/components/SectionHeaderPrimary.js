import classnames from 'classnames';
import React from 'react';

class SectionHeaderPrimary extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName, {
      'inverse': this.props.inverse
    });

    return (
      <h1 className={classes}>
        {this.props.children}
      </h1>
    );
  }
}

SectionHeaderPrimary.defaultProps = {
  className: 'section-header-primary',
  layoutClassName: 'flush text-align-center'
};

SectionHeaderPrimary.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  inverse: React.PropTypes.bool,
  layoutClassName: React.PropTypes.string
};

module.exports = SectionHeaderPrimary;
