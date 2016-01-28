import classnames from 'classnames';
import GeminiScrollbar from 'react-gemini-scrollbar';
import React from 'react';
import ReactDOM from 'react-dom';

const METHODS_TO_BIND = ['enableGemini', 'scrollToTop'];

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
    this.enableGemini();
  }

  enableGemini() {
    this.setState({geminiRendered: true});
  }

  scrollToTop() {
    if (this.state.geminiRendered) {
      ReactDOM.findDOMNode(this.refs.gemini.refs['scroll-view']).scrollTop = 0;
    }
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
        <GeminiScrollbar autoshow={true} className={scrollWrapperClasses}
          ref="gemini">
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
