import classnames from 'classnames';
import React from 'react';

class SectionHeaderSecondary extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName);

    return (
      <h2 className={classes}>
        {this.props.children}
      </h2>
    );
  }
}

SectionHeaderSecondary.defaultProps = {
  className: 'section-header-secondary',
  layoutClassName: 'text-align-center'
};

SectionHeaderSecondary.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  layoutClassName: React.PropTypes.string
};

module.exports = SectionHeaderSecondary;
