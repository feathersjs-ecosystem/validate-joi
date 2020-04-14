const assert = require('assert');
const Joi = require('@hapi/joi');
const { validateProvidedData: setupValidate } = require('../index');

describe('validate-provided-data hook', () => {
  it('throws an error if no valdationAttrs are provided', async () => {
    try {
      setupValidate();
    } catch (error) {
      assert.equal(error.message, 'The `validationsObj` argument is required.');
    }
  });

  it('throws an error if used as an after hook', async () => {
    const attrs = {
      name: Joi.string().required(),
      email: Joi.string().required(),
    };
    const context = {
      type: 'after',
    };

    try {
      const validate = setupValidate(attrs);
      const responseContext = await validate(context);
      assert(!responseContext, 'should have failed when used as an after hook');
    } catch (error) {
      assert.equal(error.message, 'validateProvidedData can only be a before hook',
        'should have been able to validate');
    }
  });

  it('validates only the attributes in context.data', async () => {
    const attrs = {
      name: Joi.string().required(),
      email: Joi.string().required(),
    };
    const context = {
      type: 'before',
      data: {
        name: 'Marshall',
      },
    };

    try {
      const validate = setupValidate(attrs);
      const responseContext = await validate(context);
      assert(responseContext);
    } catch (error) {
      assert(!error, 'should have been able to validate');
    }
  });

  it('can fail if validations do not match', async () => {
    const attrs = {
      name: Joi.string().required(),
      email: Joi.string().required(),
    };
    const context = {
      type: 'before',
      data: {
        name: 'Marshall',
        email: 200, // this should fail
      },
    };

    try {
      const validate = setupValidate(attrs);
      const options = { convert: true, abortEarly: false, stripUnknown: true };
      const responseContext = await validate(context, options);
      assert(!responseContext, 'should have failed email validation');
    } catch ({ errors }) {
      assert.equal(errors.email, '"email" must be a string', 'validation should have failed for bad email');
    }
  });
});
