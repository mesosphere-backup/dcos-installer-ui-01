import classnames from 'classnames';
import React from 'react';

class SectionHeaderPrimary extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName,
      `text-align-${this.props.align}`, {
        'inverse': this.props.inverse
      });

    return (
      <h1 className={classes} onClick={this.props.onClick}>
        {this.props.children}
      </h1>
    );
  }
}

SectionHeaderPrimary.defaultProps = {
  align: 'center',
  className: 'section-header-primary',
  layoutClassName: 'flush-top'
};

SectionHeaderPrimary.propTypes = {
  align: React.PropTypes.oneOf(['center', 'left', 'right']),
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  inverse: React.PropTypes.bool,
  layoutClassName: React.PropTypes.string,
  onClick: React.PropTypes.func
};

module.exports = SectionHeaderPrimary;
