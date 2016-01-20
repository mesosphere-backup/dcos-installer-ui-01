import classnames from 'classnames';
import React from 'react';

class SectionFooterSecondary extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName);

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

SectionFooterSecondary.defaultProps = {
  className: 'section-footer-secondary',
  layoutClassName: 'text-align-center'
};

SectionFooterSecondary.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  layoutClassName: React.PropTypes.string
};

module.exports = SectionFooterSecondary;
