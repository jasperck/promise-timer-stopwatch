Timer-Stopwatch
===============
A stopwatch supports **promise** usage for node.js with **0** dependency

[![Build Status](https://travis-ci.org/jasperck/promise-timer-stopwatch.svg?branch=master)](https://travis-ci.org/jasperck/promise-timer-stopwatch)

Instalation
-----------
```shell
npm install promise-timer-stopwatch
```

Usage
-----------
**Requirement**
```js
const Stopwatch = require('stopwatch');
const stopwatch = new Stopwatch();
```
**Events**
```js
stopwatch.on('started', () => { // when stopwatch started });
stopwatch.on('stopped', () => { // when stopwatch stopped });
stopwatch.on('paused', () => { // when stopwatch paused });
```
**Methods**

#### `.start(time)`

Start the stopwatch with duration given, trigger `started` event.

**Arguments**

time: (number; `unit: second`) The duration time stopwatch should watch.

**Return**

(Promise) Resolve when done.

#### `.pause([ time ])`

Pause the stopwatch, update and keep the latest duration left, trigger `paused` event.

**Arguments**

time: (number; optional; default = `0`; `unit: second`) The duration stopwatch should pause, default `0` means stopwatch will pause until `.start()` is called again.

**Return**

(Promise | Self): Promise if argument **time** is given, otherwise return self.

#### `.stop()`

Stop the stopwatch, trigger `stopped` event.

**Return**

(Promise) Resolve when done.

#### `.clear([ clearDuration ])`

Clear the stopwatch job of instance.

**Arguments**

clearDuration: (boolean; optional) Also clear the current duration. usually for `reset`.

**Return**

(Promise) Resolve when done.

#### `.getDuration()`

Get stopwatch current duration.

**Return**

(number) Current duration stopwatch left.

#### `.getStatus()`

Get stopwatch current status.

**Return**

(String) Current status stopwatch is.

**Sample codes**
```js
const bluebird = require('bluebird'); // Using for example

// 1.
stopwatch.start(3)
  .then(() => { // do what you like })
  .then(() => stopwatch.pause(3))
  .then(() => stopwatch.clear(true))
  .then(() => stopwatch.start(2));

// 2.
stopwatch.start(3)
  .then(() => { // do what you like })
  .then(() => stopwatch.pause())
  .then(() => setTimeout(() => stopwatch.start(), 5000));

// 3.
stopwatch.start(3)
  .then(() => { // do what you like })
  .then(() => bluebird.delay(1000))
  .then(() => stopwatch.pause())
  .then(() => bluebird.delay(3000))
  .then(() => stopwatch.start());
```
Test
-----------
```shell
npm test
```
Author
-----------
* Jasper Chang