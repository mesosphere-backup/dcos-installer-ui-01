import classnames from 'classnames';
import React from 'react';

import Page from './Page';

class AlertPanel extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName);

    return (
      <Page inverse={this.props.inverse} size={this.props.pageSize}
        pageName={this.props.pageName}>
        <div className={classes}>
          <div className={this.props.headingWrapperClassName}>
            <h2 className={this.props.headingClassName}>
              {this.props.heading}
            </h2>
          </div>
          <div className={this.props.contentClassName}>
            {this.props.content}
          </div>
        </div>
      </Page>
    );
  }
}

AlertPanel.defaultProps = {
  className: 'alert-panel',
  contentClassName: 'panel-content text-align-center',
  headingClassName: 'text-align-center inverse flush',
  headingWrapperClassName: 'panel-heading panel-heading-large text-align-center',
  inverse: true,
  layoutClassName: 'flex-box flex-box-fit-height fill-height panel',
  pageName: 'alert',
  pageSize: 'medium'
};

AlertPanel.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  content: React.PropTypes.node,
  contentClassName: React.PropTypes.string,
  heading: React.PropTypes.node,
  headingClassName: React.PropTypes.string,
  headingWrapperClassName: React.PropTypes.string,
  inverse: React.PropTypes.bool,
  layoutClassName: React.PropTypes.string,
  pageName: React.PropTypes.string,
  pageSize: React.PropTypes.string
};

module.exports = AlertPanel;
