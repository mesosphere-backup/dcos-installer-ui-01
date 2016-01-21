import classnames from 'classnames';
import GeminiScrollbar from 'react-gemini-scrollbar';
import React from 'react';

const METHODS_TO_BIND = ['enableGemini'];

class Page extends React.Component {
  constructor() {
    super();

    this.state = {
      geminiRendered: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    setTimeout(this.enableGemini, 500);
  }

  enableGemini() {
    this.setState({geminiRendered: true});
  }

  render() {
    let scrollWrapperClasses = classnames(this.props.scrollWrapperClasses, {
      'has-navigation-bar': this.props.hasNavigationBar
    });

    let pageClasses = classnames(this.props.className,
      this.props.layoutClassName, `${this.props.className}-${this.props.size}`,
      {
        'has-gemini': this.state.geminiRendered,
        [`page-${this.props.pageName}`]: this.props.pageName,
        'is-inverted': this.props.inverse
      }
    );

    if (this.state.geminiRendered) {
      return (
        <GeminiScrollbar autoshow={true} className={scrollWrapperClasses}>
          <div className={pageClasses}>
            {this.props.children}
          </div>
        </GeminiScrollbar>
      );
    } else {
      return (
        <div className={pageClasses}>
          {this.props.children}
        </div>
      );
    }
  }
}

Page.defaultProps = {
  className: 'page',
  layoutClassName: 'flex-box flex-box-align-horizontal-center ' +
    'flex-box-align-vertical-center',
  scrollWrapperClasses: 'page-scroll-wrapper',
  size: 'small'
};

Page.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  hasNavigationBar: React.PropTypes.bool,
  inverse: React.PropTypes.bool,
  layoutClassName: React.PropTypes.string,
  pageName: React.PropTypes.string,
  scrollWrapperClasses: React.PropTypes.string,
  size: React.PropTypes.oneOf(['small', 'medium', 'large'])
};

module.exports = Page;
