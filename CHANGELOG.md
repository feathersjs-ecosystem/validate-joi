# Changelog

## 4.0.1

**Change**: Update and export typescript type definition file in `package.json`
**Chore**: Updated dependency `@feathersjs/errors@4.5.3` -> `4.5.11`
**Chore**: Updated devDependencies: `mocha`, `eslint`, `eslint-plugin-react`, `eslint-plugin-jsx-a11y`

## 4.0.0

**Breaking**: Changed core dependency from `@hapi/joi` -> `joi`
**Change**: Migrate to `nyc` from `istanbul`
**Change**: Migrate to `github-actions` from `travis` (future proofing)
**Change**: Added dependabot config (future proofing)

### Consistency Changes

**Breaking**: NPM package name changed from `@featherjs-plus/validate-joi` -> `feathers-validate-joi`
**Change**: Removed yarn lockfile
**Change**: Added .github templates

## New in Version 3.2.0

Version 3.2 adds the `validateProvidedData` hook, which can be very useful in validating patch requests.

## New in Version 3.1.0

- 🙌 Updated to work with latest `joi`.
- 🎁 Support for asynchronous validations.
- 🚀 Support for FeathersJS V4.
- 😎 Validate anything in the hook `context`.
- 🤷‍♂️ It might still support FeathersJS V3, because the callback syntax is still supported.

Since `Joi.validate()` has been removed, all validations now use `schema.validateAsync()`, which means this package now supports asynchronous validations.

If you're using MongoDB, be sure to take a look at [@feathers-plus/validate-joi-mongodb](https://github.com/feathers-plus/validate-joi-mongodb) for some time-saving utilities.

## < 3.1.0

No change log was kept, please review the releases or commits to learn what was changed.
