
/* eslint  newline-per-chained-call: 0, no-shadow: 0, one-var: 0,
one-var-declaration-per-line: 0, prefer-arrow-callback: 0 */ /* ES5 code */

const assert = require('chai').assert;
const validate = require('../index');

const Joi = require('@hapi/joi');
const name = Joi.string().trim().regex(/^[\sa-zA-Z0-9]{5,30}$/).required();
const password = Joi.string().trim().min(2).max(30).required();
const schema = Joi.object().keys({
  name: name.uppercase(),
  password,
  confirmPassword: password.label('Confirm password'),
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
