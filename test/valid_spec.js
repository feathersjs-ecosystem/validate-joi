
/* eslint  newline-per-chained-call: 0, no-shadow: 0, one-var: 0,
one-var-declaration-per-line: 0, prefer-arrow-callback: 0 */ /* ES5 code */

const assert = require('chai').assert;
const validate = require('../index');

const Joi = require('joi');
const name = Joi.string().trim().regex(/^[\sa-zA-Z0-9]{5,30}$/).required();
const password = Joi.string().trim().min(2).max(30).required();
const schema = Joi.object().keys({
  name: name.uppercase(),
  password,
  confirmPassword: password.label('Confirm password'),
});

describe('valid values', () => {
  var joiOptions, values, converted, hook; // eslint-disable-line no-var

  beforeEach(function () {
    joiOptions = { abortEarly: false };
    values = { name: 'a1234567z', password: '123456789', confirmPassword: '123456789' };
    converted = { name: 'A1234567Z', password: '123456789', confirmPassword: '123456789' };
  });

  describe('before hook', () => {
    beforeEach(function () {
      hook = { type: 'before', method: 'create', data: values };
    });

    it('does not convert if convert=false', (done) => {
      validate.form(schema, joiOptions, undefined)(hook, function (err, hook) {
        assert.equal(err, null);
        assert.deepEqual(hook.data, values);
        done();
      });
    });

    it('does convert if convert=true', (done) => {
      joiOptions.convert = true;

      validate.form(schema, joiOptions, undefined)(hook, function (err, hook) {
        assert.equal(err, null);
        assert.deepEqual(hook.data, converted);
        done();
      });
    });

    it('does convert if joiOptions is not provided (joi defaults)', (done) => {
      validate.form(schema, undefined, undefined)(hook, function (err, hook) {
        assert.equal(err, null);
        assert.deepEqual(hook.data, converted);
        done();
      });
    });
  });

  describe('update hook', () => {
    beforeEach(function () {
      hook = { type: 'before', method: 'update', data: values };
    });

    it('does not convert if convert=false', (done) => {
      validate.form(schema, joiOptions, undefined)(hook, function (err, hook) {
        assert.equal(err, null);
        assert.deepEqual(hook.data, values);
        done();
      });
    });

    it('does convert if convert=true', (done) => {
      joiOptions.convert = true;

      validate.form(schema, joiOptions, undefined)(hook, function (err, hook) {
        assert.equal(err, null);
        assert.deepEqual(hook.data, converted);
        done();
      });
    });

    it('does convert if joiOptions is not provided (joi defaults)', (done) => {
      validate.form(schema, undefined, undefined)(hook, function (err, hook) {
        assert.equal(err, null);
        assert.deepEqual(hook.data, converted);
        done();
      });
    });
  });

  describe('patch hook', () => {
    beforeEach(function () {
      hook = { type: 'before', method: 'patch', data: values };
    });

    it('does not convert if convert=false', (done) => {
      validate.form(schema, joiOptions, undefined)(hook, function (err, hook) {
        assert.equal(err, null);
        assert.deepEqual(hook.data, values);
        done();
      });
    });

    it('does convert if convert=true', (done) => {
      joiOptions.convert = true;

      validate.form(schema, joiOptions, undefined)(hook, function (err, hook) {
        assert.equal(err, null);
        assert.deepEqual(hook.data, converted);
        done();
      });
    });

    it('does convert if joiOptions is not provided (joi defaults)', (done) => {
      validate.form(schema, undefined, undefined)(hook, function (err, hook) {
        assert.equal(err, null);
        assert.deepEqual(hook.data, converted);
        done();
      });
    });
  });
});
