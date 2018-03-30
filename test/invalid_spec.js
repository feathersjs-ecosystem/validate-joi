
/* eslint comma-dangle:0, newline-per-chained-call: 0, no-shadow: 0,
 object-shorthand: 0, one-var: 0, one-var-declaration-per-line: 0,
 prefer-arrow-callback: 0 */ /* ES5 code */

const assert = require('chai').assert;
const errors = require('@feathersjs/errors');
const validate = require('../index');

const Joi = require('joi');
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
  confirmPassword: '"Confirm password" length must be at least 2 characters long'
};

const errsType = {
  name: '"name" must consist of letters, digits or spaces.',
  password: '"password" must be 2 or more chars.',
  confirmPassword: '"Confirm password" must be 2 or more chars.'
};

const errsGeneric = {
  name: '"name" is badly formed.',
  password: '"password" is badly formed.',
  confirmPassword: '"Confirm password" is badly formed.'
};

const errsSubstr = {
  name: '"name" is badly formed.',
  password: '"password" must be 2 or more chars.',
  confirmPassword: '"Confirm password" must be 2 or more chars.'
};

const errsTypeMongoose = {
  name: {
    message: '"name" must consist of letters, digits or spaces.',
    name: 'ValidatorError',
    path: 'name',
    type: 'string.regex.base'
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
  it('throws on error. joiOptions is optional but must be an object', function (done) {
    const values = { name: 'a1234567z', password: '123456789', confirmPassword: '123456789' };
    const hook = { type: 'before', method: 'create', data: values };

    const fcn = () => {
      const joiOptions = 2;
      validate.form(schema, joiOptions, undefined, true)(hook, function () {
        assert(false, 'validate.form callback unexpectedly called');
        done();
      });
    };

    assert.throws(fcn, '"value" must be an object');
    done();
  });
});

describe('invalid data - form UI', () => {
  var joiOptions, valuesBad, hookBad; // eslint-disable-line no-var

  beforeEach(function () {
    joiOptions = { abortEarly: false };
    valuesBad = { name: 'j', password: 'z', confirmPassword: 'z' };
    hookBad = { type: 'before', method: 'create', data: valuesBad };
  });

  it('throws on error. default is 1 message, no translation', (done) => {
    joiOptions = {};

    const fcn = () => {
      validate.form(schema, joiOptions, undefined, true)(hookBad, function () {
        assert(false, 'validate.form callback unexpectedly called');
        done();
      });
    };

    assert.throws(fcn, errors.BadRequest, JSON.stringify(errsRaw.name));
    done();
  });

  it('throws on error. return all messages, no translation', (done) => {
    const fcn = () => {
      validate.form(schema, joiOptions, undefined, true)(hookBad, function () {
        assert(false, 'validate.form callback unexpectedly called');
        done();
      });
    };

    assert.throws(fcn, errors.BadRequest, JSON.stringify(errsRaw));
    done();
  });

  it('throws on error. translate by type', (done) => {
    const translations = {
      'string.min': function () { return '"${key}" must be ${limit} or more chars.'; },
      'string.regex.base': function (context) {
        switch (context.pattern.toString()) {
          case /^[\sa-zA-Z0-9]{5,30}$/.toString():
            return '"${key}" must consist of letters, digits or spaces.';
          default:
            return null; // todo have repo pass original message for use as a default
        }
      }
    };

    const fcn = () => {
      validate.form(schema, joiOptions, translations, true)(hookBad, function () {
        assert(false, 'validate.form callback unexpectedly called');
        done();
      });
    };

    assert.throws(fcn, errors.BadRequest, JSON.stringify(errsType));
    done();
  });

  it('throws on error. translate generic', (done) => {
    const translations = '"${key}" is badly formed.';

    const fcn = () => {
      validate.form(schema, joiOptions, translations, true)(hookBad, function () {
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
      validate.form(schema, joiOptions, translations, true)(hookBad, function () {
        assert(false, 'validate.form callback unexpectedly called');
        done();
      });
    };

    assert.throws(fcn, errors.BadRequest, JSON.stringify(errsSubstr));
    done();
  });
});


describe('invalid data - Mongoose', () => {
  var joiOptions, valuesBad, hookBad; // eslint-disable-line no-var

  beforeEach(function () {
    joiOptions = { abortEarly: false };

    valuesBad = { name: 'j', password: 'z', confirmPassword: 'z' };
    hookBad = { type: 'before', method: 'create', data: valuesBad };
  });

  it('throws on error. translate by type', (done) => {
    const translations = {
      'string.min': function () { return '"${key}" must be ${limit} or more chars.'; },
      'string.regex.base': function (context) {
        switch (context.pattern.toString()) {
          case /^[\sa-zA-Z0-9]{5,30}$/.toString():
            return '"${key}" must consist of letters, digits or spaces.';
          default:
            return null; // todo have repo pass original message for use as a default
        }
      }
    };

    const fcn = () => {
      validate.mongoose(schema, joiOptions, translations, true)(hookBad, function () {
        assert(false, 'validate.mongoose callback unexpectedly called');
        done();
      });
    };

    assert.throws(fcn, errors.BadRequest, JSON.stringify(errsTypeMongoose));
    done();
  });
});
