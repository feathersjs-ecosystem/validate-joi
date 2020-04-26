import Joi from '@hapi/joi';
import validate, { ValidateJoiOptions } from '../index.js';

const translations = {
    'string.regex.base': (context: any) => {
        switch (context.pattern.toString()) {
        case /^[\sa-zA-Z0-9]{5,30}$/.toString():
            return 'message';
        }
    }
}

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
const mongooseHook = validate.mongoose(Joi.object({ test: Joi.string() }), options, translations);
const validateHook = validate.setupValidateProvidedData({
    test: Joi.string().required()
}, options);