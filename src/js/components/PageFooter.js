import classnames from 'classnames';
import React from 'react';

class PageFooter extends React.Component {
  getYear() {
    return new Date().getFullYear();
  }

  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName);

    return (
      <div className={classes}>
        <ul className="page-footer-links list-unstyled">
          <li>
            <a href="#">System Requirements</a>
          </li>
          <li>
            <a href="#">Docs & Tutorials</a>
          </li>
          <li>
            <a href="#">Support</a>
          </li>
        </ul>
        <p className="page-footer-legal">
          &copy; {this.getYear()} Mesosphere, Inc. All Rights Reserved.
          <a href="#">Terms Of Service</a>
          <a href="#">Privacy Policy</a>
        </p>
      </div>
    );
  }
}

PageFooter.defaultProps = {
  className: 'page-footer',
  layoutClassName: 'text-align-center'
};

PageFooter.propTypes = {
  className: React.PropTypes.string,
  layoutClassName: React.PropTypes.string,
};

module.exports = PageFooter;
