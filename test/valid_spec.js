
/* eslint  newline-per-chained-call: 0, no-shadow: 0, one-var: 0,
one-var-declaration-per-line: 0, prefer-arrow-callback: 0 */ /* ES5 code */

const { assert } = require('chai');
const Joi = require('@hapi/joi');
const { ObjectID } = require('mongodb');
const validate = require('../index');

const name = Joi.string().trim().regex(/^[\sa-zA-Z0-9]{5,30}$/).required();
const password = Joi.string().trim().min(2).max(30).required();
const schema = Joi.object().keys({
  name: name.uppercase(),
  password,
  confirmPassword: password.label('Confirm password'),
});

/**
 * Custom objectId validator
 */
function objectId() {
  return Joi.custom((value, helpers) => {
    if (value === null || value === undefined) {
      return value;
    }
    try {
      return new ObjectID(value);
    } catch (error) {
      const errVal = helpers.error('any.invalid');
      errVal.message = `"${errVal.path.join('.')}" objectId validation failed because ${error.message}`;
      return errVal;
    }
  }, 'objectId');
}

describe('custom context with getContext', async () => {
  const schema = Joi.object({
    userId: objectId(),
  });

  it('allows validating params.query', async () => {
    const joiOptions = {
      convert: true,
      getContext(context) {
        return context.params.query;
      },
      setContext(context, newValues) {
        Object.assign(context.params.query, newValues);
      },
    };
    const context = {
      params: {
        query: {
          userId: '5e44b40855534a38798ba1aa',
        },
      },
    };
    try {
      const validateWithJoi = validate.form(schema, joiOptions);
      const responseContext = await validateWithJoi(context);
      assert(responseContext.params.query.userId instanceof ObjectID, 'params.query.userId should be converted to an objectId');
    } catch (error) {
      assert(!error, 'should not have failed');
    }
  });

  it('throws if getContext is used without setContext', async () => {
    const joiOptions = {
      getContext() {},
    };
    try {
      const validateWithJoi = validate.form(schema, joiOptions);
      const responseContext = await validateWithJoi(context);
      assert(!responseContext, 'should have failed');
    } catch (error) {
      assert.equal(error.message, 'getContext and setContext must be used together');
    }
  });
});

describe('valid values', () => {
  var joiOptions, values, converted, context; // eslint-disable-line no-var

  beforeEach(function () {
    joiOptions = { abortEarly: false };
    values = { name: 'a1234567z', password: '123456789', confirmPassword: '123456789' };
    converted = { name: 'A1234567Z', password: '123456789', confirmPassword: '123456789' };
  });

  describe('before hook', () => {
    beforeEach(function () {
      context = { type: 'before', method: 'create', data: values };
    });

    it('still works with callback syntax', async () => {
      try {
        const validateWithJoi = validate.form(schema, joiOptions, undefined);
        const responseContext = await validateWithJoi(context, function (err, context) {
          assert.equal(err, null);
          assert.deepEqual(context.data, values);
        });
        assert(responseContext);
      } catch (error) {
        assert(!error, 'should not have failed');
      }
    });

    it('does not convert if convert === false', async () => {
      const joiOptions = { convert: false, abortEarly: false };
      try {
        const validateWithJoi = validate.form(schema, joiOptions, undefined);
        const responseContext = await validateWithJoi(context);
        assert(!responseContext, 'should have failed due to name requiring uppercase');
      } catch (error) {
        assert.strictEqual(error.errors.name, '"name" must only contain uppercase characters');
      }
    });

    it('does convert if convert === true', async () => {
      const joiOptions = { convert: true };
      try {
        const validateWithJoi = validate.form(schema, joiOptions, undefined);
        const responseContext = await validateWithJoi(context);
        assert.deepEqual(responseContext.data, converted);
      } catch (error) {
        assert(!error, 'should not have failed');
      }
    });

    it('converts by default', async () => {
      const joiOptions = {};
      try {
        const validateWithJoi = validate.form(schema, joiOptions, undefined);
        const responseContext = await validateWithJoi(context);
        assert.deepEqual(responseContext.data, converted);
      } catch (error) {
        assert(!error, 'should not have failed');
      }
    });
  });

  describe('update hook', () => {
    beforeEach(function () {
      context = { type: 'before', method: 'update', data: values };
    });

    it('does not convert if convert === false', async () => {
      const joiOptions = { convert: false, abortEarly: false };
      try {
        const validateWithJoi = validate.form(schema, joiOptions, undefined);
        const responseContext = await validateWithJoi(context);
        assert(!responseContext, 'should have failed due to name requiring uppercase');
      } catch (error) {
        assert.strictEqual(error.errors.name, '"name" must only contain uppercase characters');
      }
    });

    it('does convert if convert === true', async () => {
      const joiOptions = { convert: true };
      try {
        const validateWithJoi = validate.form(schema, joiOptions, undefined);
        const responseContext = await validateWithJoi(context);
        assert.deepEqual(responseContext.data, converted);
      } catch (error) {
        assert(!error, 'should not have failed');
      }
    });

    it('converts by default', async () => {
      const joiOptions = {};
      try {
        const validateWithJoi = validate.form(schema, joiOptions, undefined);
        const responseContext = await validateWithJoi(context);
        assert.deepEqual(responseContext.data, converted);
      } catch (error) {
        assert(!error, 'should not have failed');
      }
    });
  });

  describe('patch hook', () => {
    beforeEach(function () {
      context = { type: 'before', method: 'patch', data: values };
    });

    it('does not convert if convert === false', async () => {
      const joiOptions = { convert: false, abortEarly: false };
      try {
        const validateWithJoi = validate.form(schema, joiOptions, undefined);
        const responseContext = await validateWithJoi(context);
        assert(!responseContext, 'should have failed due to name requiring uppercase');
      } catch (error) {
        assert.strictEqual(error.errors.name, '"name" must only contain uppercase characters');
      }
    });

    it('does convert if convert === true', async () => {
      const joiOptions = { convert: true };
      try {
        const validateWithJoi = validate.form(schema, joiOptions, undefined);
        const responseContext = await validateWithJoi(context);
        assert.deepEqual(responseContext.data, converted);
      } catch (error) {
        assert(!error, 'should not have failed');
      }
    });

    it('converts by default', async () => {
      const joiOptions = {};
      try {
        const validateWithJoi = validate.form(schema, joiOptions, undefined);
        const responseContext = await validateWithJoi(context);
        assert.deepEqual(responseContext.data, converted);
      } catch (error) {
        assert(!error, 'should not have failed');
      }
    });
  });
});
