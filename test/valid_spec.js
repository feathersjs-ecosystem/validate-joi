
const assert = require('chai').assert;
const validate = require('../src');

const Joi = require('joi');
const name = Joi.string().trim().regex(/^[\sa-zA-Z0-9]{5,30}$/).required();
const password = Joi.string().trim().min(2).max(30).required();
const schema = Joi.object().keys({
  name: name.uppercase(),
  password,
  confirmPassword: password.label('Confirm password'),
});

describe('valid values', () => {
  var joiOptions, values, converted, hook, valuesBad, hookBad; // eslint-disable-line no-var

  beforeEach(function() {
    joiOptions =  { abortEarly: false };
    values = { name: 'a1234567z', password: '123456789', confirmPassword: '123456789' };
    converted = { name: 'A1234567Z', password: '123456789', confirmPassword: '123456789' };
  });

  describe('before hook', () => {
    beforeEach(function() {
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
  });

  describe('update hook', () => {
    beforeEach(function() {
      hook = { type: 'before', method: 'update', data: { $set: values } };
    });

    it('does not convert if convert=false', (done) => {
      validate.form(schema, joiOptions, undefined)(hook, function (err, hook) {
        assert.equal(err, null);
        assert.deepEqual(hook.data.$set, values);
        done();
      });
    });

    it('does convert if convert=true', (done) => {
      joiOptions.convert = true;

      validate.form(schema, joiOptions, undefined)(hook, function (err, hook) {
        assert.equal(err, null);
        assert.deepEqual(hook.data.$set, converted);
        done();
      });
    });
  });

  describe('patch hook', () => {
    beforeEach(function() {
      hook = { type: 'before', method: 'patch', data: { $set: values } };
    });

    it('does not convert if convert=false', (done) => {
      validate.form(schema, joiOptions, undefined)(hook, function (err, hook) {
        assert.equal(err, null);
        assert.deepEqual(hook.data.$set, values);
        done();
      });
    });

    it('does convert if convert=true', (done) => {
      joiOptions.convert = true;

      validate.form(schema, joiOptions, undefined)(hook, function (err, hook) {
        assert.equal(err, null);
        assert.deepEqual(hook.data.$set, converted);
        done();
      });
    });
  });
});
