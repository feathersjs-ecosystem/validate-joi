## feathers-hooks-validate-joi
Feathers hook utility for schema validation and sanitization using joi (from Walmart).

[![Build Status](https://travis-ci.org/eddyystop/feathers-hooks-validate-joi.svg?branch=master)](https://travis-ci.org/eddyystop/feathers-hooks-validate-joi)
[![Coverage Status](https://coveralls.io/repos/github/eddyystop/feathers-hooks-validate-joi/badge.svg?branch=master)](https://coveralls.io/github/eddyystop/feathers-hooks-validate-joi?branch=master)

## Code Example

```javascript
const joi = require('joi');
const utils = require('feathers-hooks-validate-joi');

```

## Motivation

You will be using [hooks](http://docs.feathersjs.com/hooks/readme.html)
with your CRUD methods if you use [Feathers](http://feathersjs.com/).

This hook let's you validate the schema and contents of your REST and socket data using
hapijs/joi (from Walmart).

## Installation

Install [Nodejs](https://nodejs.org/en/).

Run `npm install feathers-hooks-validate-joi --save` in your project folder.

You can then require the utilities.

```javascript
// ES5
var validate = require('feathers-hooks-validate-joi');
// or ES6
import validate from 'feathers-hooks-validate-joi';
```

`/src` on GitHub contains the ES6 source. It will run on Node 6+ without transpiling.

## API Reference

To do.

## Tests

`npm test` to run tests.

`npm run cover` to run tests plus coverage.

## Contributors

- [eddyystop](https://github.com/eddyystop)

## License

MIT. See LICENSE.