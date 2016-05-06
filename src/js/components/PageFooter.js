import classnames from 'classnames';
import React from 'react';

import Config from '../config/Config';
import PluginSDK from 'PluginSDK';

let {Hooks} = PluginSDK;

class PageFooter extends React.Component {
  getFooterHeading() {
    return Hooks.applyFilter('introductionFooterHeading');
  }

  getLegalCopy() {
    return Hooks.applyFilter('introductionLegalCopy');
  }

  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName);

    return (
      <div className={classes}>
        {this.getFooterHeading()}
        <ul className="page-footer-links list-unstyled">
          <li>
            <a href={`${Config.documentationURI}/administration/installing/custom/system-requirements/`} target="_blank">System Requirements</a>
          </li>
          <li>
            <a href={`${Config.documentationURI}/`} target="_blank">Docs & Tutorials</a>
          </li>
          <li>
            <a href={`${Config.documentationURI}/support/`} target="_blank">Support</a>
          </li>
        </ul>
        <p className="page-footer-legal short">
          {this.getLegalCopy()}
          <a href="https://mesosphere.com/terms/" target="_blank">Terms Of Service</a>
          <a href="https://mesosphere.com/privacy/" target="_blank">Privacy Policy</a>
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
