## feathers-hooks-validate-joi
Feathers hook utility for schema validation and sanitization using Joi.
Joi error messages are converted to web/mobile friendly formats,
and optionally translated for clarity or internationalization.

[![Build Status](https://travis-ci.org/eddyystop/feathers-hooks-validate-joi.svg?branch=master)](https://travis-ci.org/eddyystop/feathers-hooks-validate-joi)
[![Coverage Status](https://coveralls.io/repos/github/eddyystop/feathers-hooks-validate-joi/badge.svg?branch=master)](https://coveralls.io/github/eddyystop/feathers-hooks-validate-joi?branch=master)

## Code Example

```javascript
const Joi = require('joi');
const validate = require('feathers-hooks-validate-joi');

const name = Joi.string().trim().min(5).max(30)
  .regex(/^[\sa-zA-Z0-9]$/, 'letters, numbers and spaces').required();
const password = Joi.string().trim().min(2).max(30).required();
const schema = Joi.object().keys({
  name: name,
  password,
  confirmPassword: password.label('Confirm password'),
});
const joiOptions = { convert: true, abortEarly: false };
```

(1) Validate sanitize data. The client receives any errors in a 
[format suitable for forms](https://github.com/eddyystop/joi-errors-for-forms#code-examples)
which also seems to be
[recommend by Feathers](http://docs.feathersjs.com/middleware/error-handling.html#featherserror-api).

```javascript
export.before = {
  create: [ validate.form(schema, joiOptions) ],
  update: [ validate.form(schema, joiOptions) ],
  patch: [ validate.form(schema, joiOptions) ]
};

```

(2) Errors are returned in a 
    [Mongoose format.](https://github.com/eddyystop/joi-errors-for-forms#code-examples)

```javascript
export.before = {
  create: [ validate.mongoose(schema, joiOptions) ],
  update: [ validate.mongoose(schema, joiOptions) ],
  patch: [ validate.mongoose(schema, joiOptions) ]
};
```

(3) Internationalize or clarify Joi error messages.

```javascript
function i18n(str) { return str; } // internationalization

const translations = {
  'string.min': () => i18n('"${key}" must be ${limit} or more chars.'),
  'string.regex.base': (context) => {
    switch (context.pattern.toString()) {
      case /^[\sa-zA-Z0-9]{5,30}$/.toString():
        return i18n('"${key}" must consist of letters, digits or spaces.');
    }
  }
};

export.before = {
  create: [ validate.mongoose(schema, joiOptions, translations) ],
  update: [ validate.mongoose(schema, joiOptions, translations) ],
  patch: [ validate.mongoose(schema, joiOptions, translations) ]
};
```


## Motivation

Data must be validated and sanitized before the database is changed.
The client must be informed of any errors using a schema friendly to web/mobile apps.

This repo helps implement this in [Feathers](http://feathersjs.com/) CRUD
[hooks](http://docs.feathersjs.com/hooks/readme.html).

## Installation

Install [Nodejs](https://nodejs.org/en/).

Run `npm install feathers-hooks-validate-joi --save` in your project folder.

You can then require the utilities.

## API Reference

To do.

## Tests

`npm test` to run tests.

`npm run cover` to run tests plus coverage.

## A Note on Internationalization

The `options` in `Joi.validate(value, schema, options, cb)`supports a
[`language` option](https://github.com/hapijs/joi/blob/v9.0.0/API.md#validatevalue-schema-options-callback)
with which you can change
[Joi error messages](https://github.com/hapijs/joi/blob/v9.0.0/lib/language.js)
in bulk.

You can then internationalize your field names and regex descriptions in the schema, e.g.

```javascript
Joi.string().regex(/^[\sa-zA-Z0-9]$/, i18n('letters, number and spaces')).label(i18n('Confirm password'))
```

These are suitable methods to internationalize the majority of Joi error messages.

## Contributors

- [eddyystop](https://github.com/eddyystop)

## License

MIT. See LICENSE.