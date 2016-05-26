import React from 'react';
import ReactDOM from 'react-dom';

class MeasuredComponent extends React.Component {
  constructor() {
    super();
    this.measurements = null;
  }

  componentDidMount() {
    this.measureChildren();
  }

  componentDidUpdate() {
    if (this.props.measureOnUpdate) {
      this.measureChildren();
    }
  }

  measureChildren() {
    this.measurements = ReactDOM.findDOMNode(this).getBoundingClientRect();
    this.props.onMeasure(this.measurements);
  }

  render() {
    let child = React.Children.only(this.props.children);
    let style = this.props.measuredStyle;

    if (this.measurements == null) {
      style = this.props.unmeasuredStyle;
    }

    if (!this.props.visible) {
      style.visibility = 'hidden';
    }

    return React.cloneElement(child, {style});
  }
}

MeasuredComponent.propTypes = {
  measuredStyle: {},
  measureOnUpdate: false,
  onMeasure: function () {},
  unmeasuredStyle: {
    visibility: hidden
  },
  visible: true
};

MeasuredComponent.propTypes = {
  measuredStyle: React.PropTypes.object,
  measureOnUpdate: React.PropTypes.bool,
  onMeasure: React.PropTypes.func,
  unmeasuredStyle: React.PropTypes.object,
  visible: React.PropTypes.bool
};

export default MeasuredComponent;
