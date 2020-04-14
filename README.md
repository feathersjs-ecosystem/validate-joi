# @feathers-plus/validate-joi
Feathers hook utility for schema validation and sanitization using Joi.
Joi error messages are converted to web/mobile friendly formats,
and optionally translated for clarity or internationalization.

[![Build Status](https://travis-ci.org/feathers-plus/validate-joi.svg?branch=master)](https://travis-ci.org/feathers-plus/validate-joi)
[![Coverage Status](https://coveralls.io/repos/github/feathers-plus/validate-joi/badge.svg?branch=master)](https://coveralls.io/github/feathers-plus/validate-joi?branch=master)

## New in Version 3.2

Version 3.2 adds the `validateProvidedData` hook, which can be very useful in validating patch requests.

## New in Version 3.1

- 🙌 Updated to work with latest `@hapi/joi`.
- 🎁 Support for asynchronous validations.
- 🚀 Support for FeathersJS V4.
- 😎 Validate anything in the hook `context`.
- 🤷‍♂️ It might still support FeathersJS V3, because the callback syntax is still supported.

Since `Joi.validate()` has been removed, all validations now use `schema.validateAsync()`, which means this package now supports asynchronous validations.

If you're using MongoDB, be sure to take a look at [@feathers-plus/validate-joi-mongodb](https://github.com/feathers-plus/validate-joi-mongodb) for some time-saving utilities.

## Installation

```
npm install @feathers-plus/validate-joi --save

yarn add @feathers-plus/validate-joi
```

## Usage Example

```js
const Joi = require('@hapi/joi');
const validate = require('@feathers-plus/validate-joi');

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
[format suitable for forms](https://github.com/feathers-plus/joi-errors-for-forms#code-examples)
which also seems to be
[recommend by Feathers](http://docs.feathersjs.com/middleware/error-handling.html#featherserror-api).

```js
export.before = {
  create: [ validate.form(schema, joiOptions) ],
  update: [ validate.form(schema, joiOptions) ],
  patch: [ validate.form(schema, joiOptions) ]
};
```

(2) Errors are returned in a 
    [Mongoose format.](https://github.com/feathers-plus/joi-errors-for-forms#code-examples)

```js
export.before = {
  create: [ validate.mongoose(schema, joiOptions) ],
  update: [ validate.mongoose(schema, joiOptions) ],
  patch: [ validate.mongoose(schema, joiOptions) ]
};
```

(3) Internationalize or clarify Joi error messages.

```js
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

Note: Data values in the `$set` operator are not validated.
You could use `joi-errors-for-forms` for that. 

## Validate Anything in the Hook Context

As of version 3.1.0, you can validate anything in the hook `context` using the `getContext` and `setContext` options.

```js
const objectId = require('./some-custom-validator')
const schema = Joi.object({
  userId: objectId(),
});

const joiOptions = {
  getContext(context) {
    return context.params.query;
  },
  setContext(context, newValues) {
    Object.assign(context.params.query, newValues);
  },
};

export.before = {
  find: [ validate.mongoose(schema, joiOptions, translations) ]
};
```

## validateProvidedData Hook

The `validateProvidedData` hook is just like `validate.form`, but it only validates the attributes from the schema which are actually present in the request's `data` object.  In short, it allows partial validation of the schema attributes.  Using it as a hook looks like this:

```js
const validate = require('@featehrs-plus/validate-joi')
const attrs = require('./faqs.model')

const hooks = {
  before: {
    patch: [
      validate.validateProvidedData(attrs, { abortEarly: false })
    ]
  }
}
```

The above example supposes that you have an `/faqs` service with a model that looks like the following.  Notice how the `attrs` are defined as a separate object, then they are used in the schema and made available in the export.  The `validateProvidedData` hook uses the individual attrs to validate each individual item in the request's `data` object.

```js
// src/services/faqs/faqs.model.js
const Joi = require('@hapi/joi')
const { objectId } = require('@feathers-plus/validate-joi-mongodb')

const attrs = {
  _id: objectId(),
  question: Joi.string().disallow(null).required(),
  answer: Joi.string().disallow(null).required(),
  isPublic: Joi.boolean().default(false),
  createdBy: objectId().disallow(null).required()
}

module.exports = {
  attrs,
  schema: Joi.object(attrs)
}
```

## Motivation

Data must be validated and sanitized before the database is changed.
The client must be informed of any errors using a schema friendly to web/mobile apps.

This repo helps implement this in [Feathers](http://feathersjs.com/) CRUD
[hooks](http://docs.feathersjs.com/hooks/readme.html).

## API Reference

The `joiOptions` object is passed directly to the schema, internally.  You can see all of the available options and defaults [in the @hapi/joi documentation](https://hapi.dev/family/joi/api/?v=17.1.0#anyvalidatevalue-options).  Here is a summary of the defaults:

```js
const joiDefaults = {
  abortEarly: true,
  allowUnknown: false,
  cache: true,
  convert: true,
  debug: false,
  externals: true,
  noDefaults: false,
  nonEnumerables: false,
  presence: 'optional',
  skipFunctions: false,
  stripUnknown: false,
  getContext: undefined,
  setContext: undefined,
};
```

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

```js
Joi.string().regex(/^[\sa-zA-Z0-9]$/, i18n('letters, number and spaces')).label(i18n('Confirm password'))
```

These are suitable methods to internationalize the majority of Joi error messages.

## Contributors

- [eddyystop](https://github.com/feathers-plus)

## License

MIT. See LICENSE.