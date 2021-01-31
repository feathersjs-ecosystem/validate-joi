const assert = require('assert');
const Joi = require('joi');
const { mongooseWithProvidedData: setupValidate } = require('../index');

describe('form-with-provided-data hook', () => {
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
      assert.equal(errors.email.message, '"email" must be a string', 'validation should have failed for bad email');
    }
  });
});
