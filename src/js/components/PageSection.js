import classnames from 'classnames';
import React from 'react';

class PageSection extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName);

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

PageSection.defaultProps = {
  className: 'page-section',
  layoutClassName: ''
};

PageSection.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  layoutClassName: React.PropTypes.string
};

module.exports = PageSection;
