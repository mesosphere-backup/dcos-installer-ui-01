import classnames from 'classnames';
import React from 'react';

class SectionHeaderPrimary extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName);

    return (
      <h1 className={classes}>
        {this.props.children}
      </h1>
    );
  }
}

SectionHeaderPrimary.defaultProps = {
  className: 'section-header-primary',
  layoutClassName: 'text-align-center'
};

SectionHeaderPrimary.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  layoutClassName: React.PropTypes.string
};

module.exports = SectionHeaderPrimary;
