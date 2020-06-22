/* eslint comma-dangle: 0, object-shorthand: 0, prefer-arrow-callback: 0 */
const errors = require('@feathersjs/errors');
const utils = require('feathers-hooks-common/lib/services');
const joiErrorsForForms = require('joi-errors-for-forms');
const Joi = require('@hapi/joi');
const pick = require('lodash/pick');

// We only directly need the convert option. The others are listed for convenience.
// See defaults at https://hapi.dev/family/joi/api/?v=17.1.0#anyvalidatevalue-options
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
  setContext: undefined
};

function setupValidateWithJoi(joiSchema, joiOptions, translator, ifTest) {
  if (!['undefined', 'object'].includes(typeof joiOptions)) {
    throw new errors.GeneralError('joiOptions must be a valid object.');
  }

  const { getContext, setContext, ...mergedOptions } = { ...joiDefaults, ...joiOptions };

  if ((getContext || setContext) && (!getContext || !setContext)) {
    throw new errors.GeneralError('getContext and setContext must be used together');
  }

  return async function validateWithJoi(context, next) {
    let values;
    if (typeof getContext === 'function') {
      values = getContext(context);
    } else {
      values = utils.getItems(context);
    }

    try {
      const convertedValues = await joiSchema.validateAsync(values, mergedOptions);

      if (mergedOptions.convert === true) {
        if (typeof setContext === 'function') {
          setContext(context, convertedValues);
        } else {
          utils.replaceItems(context, convertedValues);
        }
      }

      if (typeof next === 'function') {
        return next(null, context);
      }
      return context;
    } catch (error) {
      const formErrors = translator(error);
      if (formErrors) {
        // Hacky, but how else without a custom assert?
        const msg = ifTest ? JSON.stringify(formErrors) : 'Invalid data';
        throw new errors.BadRequest(msg, {
          errors: formErrors,
          type: context.type,
          path: context.path,
          method: context.method,
        });
      }
      return formErrors || error;
    }
  };
}

const validators = {
  form: function (joiSchema, joiOptions, translations, ifTest) {
    const translator = joiErrorsForForms.form(translations);
    return setupValidateWithJoi(joiSchema, joiOptions, translator, ifTest);
  },
  mongoose: function (joiSchema, joiOptions, translations, ifTest) {
    const translator = joiErrorsForForms.mongoose(translations);
    return setupValidateWithJoi(joiSchema, joiOptions, translator, ifTest);
  }
};

/**
 * The validatedProvidedAttrs hook is great for validating patch requests, where a partial
 * schema needs to be validated.  It only validates the attributes that have matching keys
 * in `context.data`.
 * @param {Object} validationsObj - an object containing the raw keys from a service's
 *    schema object. It cannot be already wrapped in `Joi.object(validationsObject)`.
 * @param {JoiOptionsObject} joiOptions
 */
function setupValidateProvidedData(validationsObj, joiOptions) {
  if (!validationsObj || typeof validationsObj !== 'object') {
    throw new Error('The `validationsObj` argument is required.');
  }
  return function validatedProvidedData(context) {
    if (context.type === 'after') {
      throw new Error('validateProvidedData can only be a before hook');
    }
    const patchAttrs = pick(validationsObj, Object.keys(context.data));
    const patchSchema = Joi.object(patchAttrs);

    const validateHook = validators.form(patchSchema, joiOptions);

    return validateHook(context);
  };
}

Object.assign(validators, { validateProvidedData: setupValidateProvidedData });


module.exports = validators;
