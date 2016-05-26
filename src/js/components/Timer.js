import React from 'react';

const METHODS_TO_BIND = ['resetTimer', 'startTimer', 'stopTimer', 'tick'];

class Timer extends React.Component {
  constructor() {
    super();

    this.state = {time: 0};

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  getHumanReadableTime(timeInSeconds = 0) {
    let hours = Math.floor(timeInSeconds / (60 * 60)) || '';
    let minutes = Math.floor((timeInSeconds % (60 * 60)) / 60);
    let seconds = timeInSeconds % 60;

    if (hours > 0) {
      hours = `${hours}:`;
    }

    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return `${hours}${minutes}:${seconds}`;
  }

  resetTimer() {
    this.setState({time: 0});
  }

  startTimer() {
    this.intervalID = setInterval(this.tick, 1000);
  }

  stopTimer() {
    this.intervalID = clearInterval(this.intervalID);
  }

  tick() {
    this.setState({time: this.state.time + 1});
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.getHumanReadableTime(this.state.time)}
      </div>
    );
  }
}

Timer.defaultProps = {
  className: 'timer'
};

Timer.propTypes = {
  className: React.PropTypes.string
};

module.exports = Timer;
