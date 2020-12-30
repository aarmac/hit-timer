import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { TimerIcon, RepeatIcon } from "./icons";

export default class Timer extends Component {
  static propTypes = {
    displayFormat: PropTypes.string.isRequired,
    updateRate: PropTypes.number.isRequired
  };

  static defaultProps = {
    displayFormat: "mm:ss",
    updateRate: 1000 // milliseconds
  };

  constructor(props) {
    super(props);
    this.state = {
      _showIntervalForm: false,
      _updateIntervalId: undefined,
      interval: {
        minutes: undefined,
        seconds: undefined
      },
      repetitions: 1,
      startTime: undefined,
      currentTime: undefined,
      endTime: undefined,
      timeRemaining: undefined
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.timeRemaining && nextState.timeRemaining <= 0) {
      this.stop(); // Stop when 0 is reached.
      return false;
    }

    return true;
  }

  render() {
    const {
      _showIntervalForm,
      interval,
      repetitions,
      timeRemaining
    } = this.state;

    return (
      <div id="Timer">
        <div id="Timer__display" onClick={() => this.toggleIntervalForm()}>
          <h1 id="Timer__display--time">
            {this.formatTime(timeRemaining ? timeRemaining : interval)}
          </h1>
          <div id="Timer__display--info">
            <span id="Timer__display--interval" className="Timer__label">
              <TimerIcon /> {this.formatTime(interval)}
            </span>
            <span id="Timer__display--repeat" className="Timer__label">
              <RepeatIcon /> {repetitions}
            </span>
          </div>
        </div>
        <div id="Timer__controls">
          <button
            id="Timer__start"
            className="Timer__button"
            onClick={() => this.start()}
          >
            Start
          </button>
          <button
            id="Timer__stop"
            className="Timer__button"
            onClick={() => this.stop()}
          >
            Stop
          </button>
        </div>
        {_showIntervalForm && (
          <form id="Timer__settings" className="Timer__form">
            <div className="Timer__field">
              <input
                type="number"
                min="0"
                max="59"
                step="1"
                className="Timer__input"
                id="Timer__minutes"
                name="minutes"
                value={interval.minutes ? interval.minutes : ""}
                placeholder="0"
                onChange={event => this.setInterval(event)}
              />
              <label htmlFor="Timer__minutes" className="Timer__label">
                Minutes
              </label>
            </div>
            <div className="Timer__field">
              <input
                type="number"
                min="0"
                max="59"
                step="1"
                className="Timer__input"
                id="Timer__seconds"
                name="seconds"
                value={interval.seconds ? interval.seconds : ""}
                placeholder="0"
                onChange={event => this.setInterval(event)}
              />
              <label htmlFor="Timer__seconds" className="Timer__label">
                Seconds
              </label>
            </div>
            <div className="Timer__field">
              <input
                type="number"
                min="1"
                max="99"
                step="1"
                className="Timer__input"
                id="Timer__repetitions"
                name="repetitions"
                value={repetitions ? repetitions : ""}
                placeholder="0"
                onChange={event => this.setRepetitions(event)}
              />
              <label htmlFor="Timer__repetitions" className="Timer__label">
                Repetitions
              </label>
            </div>
            <button
              id="Timer__set"
              className="Timer__button"
              onClick={() => this.toggleIntervalForm()}
            >
              Set
            </button>
            <button
              id="Timer__clear"
              className="Timer__button"
              onClick={() => {
                this.clearInterval();
                this.toggleIntervalForm();
              }}
            >
              Clear
            </button>
          </form>
        )}
      </div>
    );
  }

  start() {
    const now = moment.now();
    const _updateIntervalId = setInterval(
      this.tick.bind(this),
      this.props.updateRate
    );

    return this.setState((state, props) => {
      return {
        _updateIntervalId, // Stored so it may be cleared by reference in stop()
        startTime: now,
        currentTime: now,
        endTime: moment(now)
          .add(state.interval)
          .valueOf(),
        timeRemaining: moment(state.interval)
      };
    });
  }

  stop() {
    return this.setState((state, props) => {
      clearInterval(state._updateIntervalId);

      return {
        intervalId: undefined,
        startTime: undefined,
        currentTime: undefined,
        endTime: undefined,
        timeRemaining: undefined
      };
    });
  }

  tick() {
    const now = moment.now();

    return this.setState((state, props) => {
      return {
        currentTime: now,
        timeRemaining: state.endTime - (state.currentTime + 1)
      };
    });
  }

  toggleIntervalForm() {
    return this.setState((state, props) => {
      return { _showIntervalForm: !state._showIntervalForm };
    });
  }

  setInterval(event) {
    const value =
      event.target.value !== "" ? parseInt(event.target.value, 10) : undefined;

    if (value < 0 || value > 59) {
      return;
    }

    if (event.target.name === "minutes") {
      return this.setState((state, props) => {
        return {
          interval: {
            minutes: value,
            seconds: state.interval.seconds
          }
        };
      });
    } else if (event.target.name === "seconds") {
      return this.setState((state, props) => {
        return {
          interval: {
            minutes: state.interval.minutes,
            seconds: value
          }
        };
      });
    }
  }

  setRepetitions(event) {
    const value =
      event.target.value !== "" ? parseInt(event.target.value, 10) : "";

    return this.setState((state, props) => {
      return {
        repetitions: value
      };
    });
  }

  clearInterval() {
    return this.setState((state, props) => {
      return {
        interval: {
          minutes: undefined,
          seconds: undefined
        },
        repetitions: 1
      };
    });
  }

  formatTime(timeValue) {
    return moment.utc(timeValue).format(this.props.displayFormat);
  }
}
