import Joi from '@hapi/joi';
import validate, { ValidateJoiOptions } from '../index.js';

const options: ValidateJoiOptions = {
    abortEarly: true,
    convert: false,
    presence: 'optional',
    nonEnumerables: true,
    getContext: (context) => {
        context.data = {}
    },
    setContext: (context) => {
        context.dispatch = {}
    }
}

const formHook = validate.form(Joi.object({ test: Joi.string() }), options);
const mongooseHook = validate.mongoose(Joi.object({ test: Joi.string() }), options);
const validateHook = validate.setupValidateProvidedData({
    test: Joi.string().required()
}, options);