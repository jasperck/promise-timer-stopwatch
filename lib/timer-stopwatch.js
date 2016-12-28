'use strict';

const EventEmitter = require('events');
const STATUS = require('./constants/status');

class TimerStopwatch extends EventEmitter {
  /**
   * Constructor
   * @param config
   */
  constructor(config) {
    super();
    this._config = config || {
        status: STATUS.INITIALIZED,
        duration: 0,
        startTime: 0,
      };
    this._stopwatch = null;
  }

  /**
   * Start timer
   * @param duration
   * @returns {*}
   */
  start(duration) {
    if (!duration && !this._config.duration) {
      return this;
    }
    this._config.duration = duration ? this.durationHandler(duration, STATUS.STARTED) : this._config.duration;
    this._config.startTime = Date.now();
    this._config.status = STATUS.STARTED;

    return new Promise((resolve) => {
      this._stopwatch = setTimeout(() => this.stop(), this._config.duration);
      this.trigger(STATUS.STARTED);
      resolve();
    });
  }

  /**
   * Stop timer
   */
  stop() {
    this._config.status = STATUS.STOPPED;
    return new Promise((resolve) => {
      this.clear(true);
      this.trigger(STATUS.STOPPED);
      resolve();
    });
  }

  /**
   * Pause timer
   * @param duration
   * @returns {*}
   */
  pause(duration) {
    if (this._config.status !== STATUS.STARTED) {
      return this;
    }
    this._config.status = STATUS.PAUSED;
    this._config.duration = this.durationHandler((Date.now() - this._config.startTime), STATUS.PAUSED);
    this.trigger(STATUS.PAUSED);

    return this.clear()
      .then(() => {
        return !duration ? this
          : new Promise(resolve => this._stopwatch = setTimeout(() => resolve(), this.durationHandler(duration, STATUS.STARTED)));
      });
  }

  /**
   * Emit event
   * @param event
   */
  trigger(event) {
    this.emit(event);
  }

  /**
   * Handler watch duration
   * @param ms
   * @param status
   * @returns {number}
   */
  durationHandler(ms, status) {
    return status === STATUS.STARTED ? ms * 1000
      : status === STATUS.PAUSED ? this._config.duration - ms
      : 0;
  }

  /**
   * Clear watch
   * @param clearDuration
   * @returns {*}
   */
  clear(clearDuration) {
    if (!this._stopwatch) {
      return this;
    }
    return new Promise((resolve) => {
      if (clearDuration) {
        this._config.duration = 0;
      }
      clearTimeout(this._stopwatch);
      resolve();
    });
  }

  /**
   * Get current duration
   * @returns {number}
   */
  getDuration() {
    return this._config.duration;
  }

  /**
   * Get current status
   * @returns {string|*}
   */
  getStatus() {
    return this._config.status;
  }
}

module.exports = TimerStopwatch;
