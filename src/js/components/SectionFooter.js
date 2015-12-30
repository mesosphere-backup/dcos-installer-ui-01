import classnames from 'classnames';
import React from 'react';

class SectionFooter extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName);

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

SectionFooter.defaultProps = {
  className: 'section-footer',
  layoutClassName: ''
};

SectionFooter.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  layoutClassName: React.PropTypes.string
};

module.exports = SectionFooter;
