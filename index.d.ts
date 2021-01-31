import type { HookContext, Hook } from '@feathersjs/feathers';
import Joi from 'joi';

declare namespace FeathersValidateJoi {
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
    getContext?: (context: HookContext) => void
    setContext?: (context: HookContext, validatedValues: any) => void
    [option: string]: any
  }

  export interface RawSchema {
    [field: string]: Joi.AnySchema;
  }

  export interface Translation {
    [key: string]: (context?: any) => string | undefined;
  }

  export function validateProvidedData (validationsObj: RawSchema, joiOptions?: ValidateJoiOptions): Hook
  export function form (joiSchema: Joi.AnySchema, joiOptions?: ValidateJoiOptions, translations?: Translation, ifTest?: boolean): Hook
  export function mongoose (joiSchema: Joi.AnySchema, joiOptions?: ValidateJoiOptions, translations?: Translation, ifTest?: boolean): Hook
}

export = FeathersValidateJoi;
