
/* eslint comma-dangle:0, newline-per-chained-call: 0, no-shadow: 0,
 object-shorthand: 0, one-var: 0, one-var-declaration-per-line: 0,
 prefer-arrow-callback: 0 */ /* ES5 code */

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

const errsRaw = {
  name: '"name" with value "J" fails to match the required pattern: /^[\\sa-zA-Z0-9]{5,30}$/',
  password: '"password" length must be at least 2 characters long',
  confirmPassword: '"confirmPassword" length must be at least 2 characters long'
};

const errsType = {
  name: '"name" must consist of letters, digits or spaces.',
  password: '"password" must be 2 or more chars.',
  confirmPassword: '"confirmPassword" must be 2 or more chars.'
};

const errsGeneric = {
  name: '"name" is badly formed.',
  password: '"password" is badly formed.',
  confirmPassword: '"confirmPassword" is badly formed.'
};

const errsSubstr = {
  name: '"name" is badly formed.',
  password: '"password" must be 2 or more chars.',
  confirmPassword: '"confirmPassword" must be 2 or more chars.'
};

const errsTypeMongoose = {
  name: {
    message: '"name" must consist of letters, digits or spaces.',
    name: 'ValidatorError',
    path: 'name',
    type: 'string.pattern.base'
  },
  password: {
    message: '"password" must be 2 or more chars.',
    name: 'ValidatorError',
    path: 'password',
    type: 'string.min'
  },
  confirmPassword: {
    message: '"Confirm password" must be 2 or more chars.',
    name: 'ValidatorError',
    path: 'confirmPassword',
    type: 'string.min'
  }
};

describe('invalid joiOptions', function () {
  it('joiOptions is optional', function (done) {
    const values = { name: 'a1234567z', password: '123456789', confirmPassword: '123456789' };
    const context = { type: 'before', method: 'create', data: values };

    const joiOptions = undefined;
    const validateWithJoi = validate.form(schema, joiOptions, undefined, true);

    validateWithJoi(context, function () {
      assert(true, 'joiOptions can be undefined');
      done();
    });
  });

  it('joiOptions cannot be invalid', function (done) {
    const joiOptions = 2;
    try {
      validate.form(schema, joiOptions, undefined, true);

      assert(false, 'validate.form should have errored with bad options.');
      done();
    } catch (error) {
      assert.strictEqual(error.message, 'joiOptions must be a valid object.', error.message);
      done();
    }
  });
});

describe('invalid data - form UI', () => {
  var joiOptions, valuesBad, contextBad; // eslint-disable-line no-var

  beforeEach(function () {
    joiOptions = { abortEarly: false };
    valuesBad = { name: 'j', password: 'z', confirmPassword: 'z' };
    contextBad = { type: 'before', method: 'create', data: valuesBad };
  });

  it('throws on error. default is 1 message, no translation', async () => {
    joiOptions = {};

    try {
      const validateWithJoi = validate.form(schema, joiOptions, undefined, true);
      const responseContext = await validateWithJoi(contextBad, function () {
        assert(false, 'validate.form callback unexpectedly called');
      });
      assert(!responseContext, 'should not have succeeded');
    } catch (error) {
      const message = JSON.parse(error.message);
      assert.strictEqual(message.name, errsRaw.name);
    }
  });

  it('throws on error. return all messages, no translation', async () => {
    try {
      const validateWithJoi = validate.form(schema, joiOptions, undefined, true);
      const responseContext = await validateWithJoi(contextBad, function () {
        assert(false, 'validate.form callback unexpectedly called');
      });
      assert(!responseContext, 'should not have succeeded');
    } catch (error) {
      const message = JSON.parse(error.message);
      assert.deepEqual(message, errsRaw);
    }
  });

  it.only('throws on error. translate by type', async () => {
    const translations = {
      'string.min': function () {
        return '"${key}" must be ${limit} or more chars.';
      },
      'string.pattern.base': function (context) {
        switch (context.regex.toString()) {
          case /^[\sa-zA-Z0-9]{5,30}$/.toString():
            return '"${key}" must consist of letters, digits or spaces.';
          default:
            return null; // todo have repo pass original message for use as a default
        }
      }
    };

    try {
      const validateWithJoi = validate.form(schema, joiOptions, translations, true);
      const responseContext = await validateWithJoi(contextBad, function () {
        assert(false, 'validate.form callback unexpectedly called');
      });
      assert(!responseContext, 'should not have succeeded');
    } catch (error) {
      const message = JSON.parse(error.message);
      assert.deepEqual(message, errsType);
    }
  });

  it('throws on error. translate generic', (done) => {
    const translations = '"${key}" is badly formed.';

    const fcn = () => {
      validate.form(schema, joiOptions, translations, true)(contextBad, function () {
        assert(false, 'validate.form callback unexpectedly called');
        done();
      });
    };

    assert.throws(fcn, errors.BadRequest, JSON.stringify(errsGeneric));
    done();
  });

  it('throws on error. translate using substrings', (done) => {
    const translations = [
      { regex: 'at least 2 characters long',
        message: '"${key}" must be 2 or more chars.'
      },
      { regex: /required pattern/,
        message: '"${key}" is badly formed.'
      }
    ];

    const fcn = () => {
      validate.form(schema, joiOptions, translations, true)(contextBad, function () {
        assert(false, 'validate.form callback unexpectedly called');
        done();
      });
    };

    assert.throws(fcn, errors.BadRequest, JSON.stringify(errsSubstr));
    done();
  });
});


describe('invalid data - Mongoose', () => {
  var joiOptions, valuesBad, contextBad; // eslint-disable-line no-var

  beforeEach(function () {
    joiOptions = { abortEarly: false };

    valuesBad = { name: 'j', password: 'z', confirmPassword: 'z' };
    contextBad = { type: 'before', method: 'create', data: valuesBad };
  });

  it('throws on error. translate by type', (done) => {
    const translations = {
      'string.min': function () { return '"${key}" must be ${limit} or more chars.'; },
      'string.pattern.base': function (context) {
        switch (context.pattern.toString()) {
          case /^[\sa-zA-Z0-9]{5,30}$/.toString():
            return '"${key}" must consist of letters, digits or spaces.';
          default:
            return null; // todo have repo pass original message for use as a default
        }
      }
    };

    const fcn = () => {
      validate.mongoose(schema, joiOptions, translations, true)(contextBad, function () {
        assert(false, 'validate.mongoose callback unexpectedly called');
        done();
      });
    };

    assert.throws(fcn, errors.BadRequest, JSON.stringify(errsTypeMongoose));
    done();
  });
});
