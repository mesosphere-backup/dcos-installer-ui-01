import classnames from 'classnames';
import React from 'react';

class PageContent extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName);

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

PageContent.defaultProps = {
  className: 'page-content',
  layoutClassName: ''
};

PageContent.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  layoutClassName: React.PropTypes.string
};

module.exports = PageContent;
