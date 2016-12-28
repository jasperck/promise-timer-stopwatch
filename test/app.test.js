'use strict';

const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const assert = sinon.assert;

chai.should();
chai.use(chaiAsPromised);

describe('Timer module', () => {
  const bluebird = require('bluebird');
  const TimerStopwatch = require('../lib/timer-stopwatch');
  const STATUS = require('../lib/constants/status');

  var stopwatch = null;
  beforeEach(() => stopwatch = new TimerStopwatch());

  describe('#constructor', () => {
    it('should construct a timer instance', () => {
      expect(stopwatch).be.instanceOf(TimerStopwatch);
    });
  });
  describe('#getDuration', () => {
    it('should always be number', () => {
      const actual = stopwatch.getDuration();
      expect(actual).be.a('number');
    });
    it('should return current value', () => {
      const delta = 10;

      return Promise.resolve()
        .then(() => expect(stopwatch.getDuration()).closeTo(0, delta))
        .then(() => stopwatch.start(5))
        .then(() => expect(stopwatch.getDuration()).closeTo(5000, delta))
        .then(() => stopwatch.pause())
        .then(() => expect(stopwatch.getDuration()).closeTo(5000, delta))
        .then(() => stopwatch.stop())
        .then(() => expect(stopwatch.getDuration()).closeTo(0, delta));
    });
  });
  describe('#getStatus', () => {
    it('should always be string', () => {
      const actual = stopwatch.getStatus();
      expect(actual).be.a('string');
    });
  });
  describe('#start', () => {
    it('should return if value of duration isn\'t given', () => {
      return Promise.resolve()
        .then(() => stopwatch.start())
        .then(actual => expect(actual).to.be.instanceOf(TimerStopwatch))
        .then(() => expect(stopwatch.getStatus()).eql(STATUS.INITIALIZED));
    });
    it('should throw exception if handling config exists error', () => {
      return Promise.resolve()
        .then(() => stopwatch._config = null)
        .then(() => stopwatch.start())
        .should.eventually.be.rejected;
    });
    it('should change status to started', () => {
      return Promise.resolve()
        .then(() => expect(stopwatch.getStatus()).eql(STATUS.INITIALIZED))
        .then(() => stopwatch.start(1))
        .then(() => expect(stopwatch.getStatus()).eql(STATUS.STARTED));
    });
    it('should trigger "started" event', () => {
      const spy = sinon.spy();

      stopwatch.on(STATUS.STARTED, spy);

      return Promise.resolve()
        .then(() => stopwatch.start(1))
        .then(() => bluebird.delay(1000))
        .then(() => assert.calledOnce(spy));
    });
    it('should resume timer after pause', () => {
      const expectation = 2000;
      const delta = 10;

      return Promise.resolve()
        .then(() => stopwatch.start(3))
        .then(() => bluebird.delay(1000))
        .then(() => stopwatch.pause())
        .then(() => expect(stopwatch.getStatus()).eql(STATUS.PAUSED))
        .then(() => stopwatch.start())
        .then(() => expect(stopwatch.getStatus()).eql(STATUS.STARTED))
        .then(() => expect(stopwatch.getDuration()).closeTo(expectation, delta));
    });
  });
  describe('#pause', () => {
    const timerSpan = 1;

    it('should return if timer is not started', () => {
      return Promise.resolve()
        .then(() => stopwatch.pause())
        .then(actual => expect(actual).to.be.instanceOf(TimerStopwatch))
        .then(() => expect(stopwatch.getStatus()).eql(STATUS.INITIALIZED));
    });
    it('should change status to started', () => {
      return Promise.resolve()
        .then(() => expect(stopwatch.getStatus()).eql(STATUS.INITIALIZED))
        .then(() => stopwatch.start(timerSpan))
        .then(() => stopwatch.pause())
        .then(() => expect(stopwatch.getStatus()).eql(STATUS.PAUSED));
    });
    it('should trigger "paused" event', () => {
      const spy = sinon.spy();

      stopwatch.on(STATUS.PAUSED, spy);

      return Promise.resolve()
        .then(() => stopwatch.start(timerSpan))
        .then(() => stopwatch.pause())
        .then(() => assert.calledOnce(spy));
    });
  });
  describe('#stop', () => {
    const timerSpan = 1;

    it('should change status to started', () => {
      return Promise.resolve()
        .then(() => expect(stopwatch.getStatus()).eql(STATUS.INITIALIZED))
        .then(() => stopwatch.start(timerSpan))
        .then(() => stopwatch.stop())
        .then(() => expect(stopwatch.getStatus()).eql(STATUS.STOPPED));
    });
    it('should trigger "stopped" event', () => {
      const spy = sinon.spy();

      stopwatch.on(STATUS.STOPPED, spy);

      return Promise.resolve()
        .then(() => stopwatch.start(timerSpan))
        .then(() => stopwatch.stop())
        .then(() => assert.calledOnce(spy));
    });
  });
  describe('#trigger', () => {
    it('should emit event given', () => {
      const EVENT = 'test';
      const spy = sinon.spy();

      stopwatch.on(EVENT, spy);

      return Promise.resolve()
        .then(() => stopwatch.trigger(EVENT))
        .then(() => assert.calledOnce(spy))
    });
  });
  describe('#durationHandler', () => {
    const timerSpan = 5;

    it('should convert time to millisecond called by started', () => {
      const expectation = 5000;
      const actual = stopwatch.durationHandler(5, STATUS.STARTED);
      expect(actual).eql(expectation);
    });
    it('should minus the duration with time spent', () => {
      const timeSpent = 2000;
      const expectation = 3000;
      return Promise.resolve()
        .then(() => stopwatch.start(timerSpan))
        .then(() => expect(stopwatch.durationHandler(timeSpent, STATUS.PAUSED)).eql(expectation));
    });
  });
  describe('#clear', () => {
    const timerSpan = 3;

    it('should return if timer\'s stopwatch isn\'t init', () => {
      return Promise.resolve()
        .then(() => stopwatch.clear())
        .then(actual => expect(actual).to.be.instanceOf(TimerStopwatch))
        .then(() => expect(stopwatch.getStatus()).eql(STATUS.INITIALIZED));
    });
    it('should reset duration to 0 if argument is given with true', () => {
      return Promise.resolve()
        .then(() => stopwatch.start(timerSpan))
        .then(() => stopwatch.clear(true))
        .then(() => expect(stopwatch.getDuration()).eql(0));
    });
  });
});