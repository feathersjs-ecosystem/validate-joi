
const Joi = require('joi');
const errors = require('feathers-errors');
const utils = require('feathers-hooks-utils');
const joiErrorsForForms = require('joi-errors-for-forms');

function validator(joiSchema, joiOptions, translator, ifTest) {
  return (hook, next) => {
    utils.checkContext(hook, 'before', ['create', 'update', 'patch'], 'validate-joi');
    const values = utils.get(hook);

    Joi.validate(values, joiSchema, joiOptions, (joiErr, convertedValues) => {
        const formErrors = translator(joiErr);
        if (formErrors) {
          // Hacky but how else? No assertion library provides access to Error props.
          const msg = ifTest ? JSON.stringify(formErrors) : 'Invalid data';
          throw new errors.BadRequest(msg, { errors: formErrors });
        }

        if (joiOptions.convert === true) {
          utils.setAll(hook, convertedValues);
        }
        next(null, hook);
      }
    );
  };
}

module.exports = {
  form: function (joiSchema, joiOptions, translations, ifTest) {
    const translator = joiErrorsForForms.form(translations);
    return validator(joiSchema, joiOptions, translator, ifTest);
  },
  mongoose: function (joiSchema, joiOptions, translations , ifTest) {
    const translator = joiErrorsForForms.mongoose(translations);
    return validator(joiSchema, joiOptions, translator, ifTest);
  }
};
