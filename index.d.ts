import Joi from '@hapi/joi';
import { HookContext } from '@feathersjs/feathers';

export interface ValidateJoiOptions {
    abortEarly?: boolean,
    allowUnknown?: boolean,
    cache?: boolean,
    convert?: boolean,
    debug?: boolean,
    externals?: boolean,
    noDefaults?: boolean,
    nonEnumerables?: boolean,
    presence?: Joi.PresenceMode,
    skipFunctions?: boolean,
    stripUnknown?: boolean,
    getContext?: (context: HookContext, next?: (arg0: any, arg1: any) => any) => any,
    setContext?: (context: HookContext, next?: (arg0: any, arg1: any) => any) => any,
    [option: string]: any
}

export interface RawSchema {
    [field: string]: Joi.AnySchema;
}

export interface Translation {
    [key: string]: (context?: any) => string | undefined;
}

type FeathersHook = ((context: HookContext) => any);

export interface Validators {
    setupValidateProvidedData: (validationsObj: RawSchema, joiOptions?: ValidateJoiOptions) => FeathersHook,
    form: (joiSchema: Joi.AnySchema, joiOptions?: ValidateJoiOptions, translations?: Translation, ifTest?: boolean) => FeathersHook,
    mongoose: (joiSchema: Joi.AnySchema, joiOptions?: ValidateJoiOptions, translations?: Translation, ifTest?: boolean) => FeathersHook
}

declare const validators: Validators;
export default validators;