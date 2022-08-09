# @eternagame/eslint-plugin

Eterna standard ESLint setup and utilities

## Installation

Note that the following are marked as optional peer dependencies, so you need to explicitly
install them if using the relevant configs (in order to avoid downloading them when you aren't):

- `eslint-config-airbnb-typescript` (for the typescript configurations)
- `eslint-config-airbnb-vue` (for the vue configurations)
- `@nrwl/eslint-plugin-nx` (for the Nx configs)

## Configuration

There are six sets of configurations available:

- `plugin:@eternagame/javascript` (core)
- `plugin:@eternagame/typescript` (core)
- `plugin:@eternagame/vue3-javascript` (core)
- `plugin:@eternagame/vue3-typescript` (core)
- `plugin:@eternagame/nx-javascript`
- `plugin:@eternagame/nx-typescript`

Note that `@eternagame/typescript` extends `@eternagame/javascript`, `@eternagame/vue3-javascript` extends
`@eternagame/javascript`, and `@eternagame/vue3-typescript` extends `@eternagame/typescript`, so you should
pick whichever of the core configs has the greatest superset of features you want to work with.

The Nx configurations must be added separately, but if you use `@eternagame/nx-javascript` you must
use any of the core configs and if you use `@eternagame/nx-typescript` you must use one of the
typescript core configs (as they override rules in the relevant js/ts airbnb config).

## Background/Rationale/Design

Core configurations are based on airbnb, a relatively popular style guide. Typescript core
configurations also take advantage of typescript-eslint (with all recommended rules, including those
requiring type checking) and airbnb-typescript to handle conflicting definitions. The vue3 configs
add on the vue3 recommended rules. All and all, we feel these are overall sensible defaults to go with,
using relatively standard configurations for each technology.

As we use Nx monorepos, we've also included the additional configuration for that setting.

Under `src/configs/base-rules`, you will find additional rule customizations we have opted for. Each change is
documented with specific rationale, but in general reflects our personal experience with what we find
useful for our workflow and stylistic preferences.

Also note that the various configs are tied to their relevant extension. IE, the javascript config
only applies to js/jsx files, and the typescript config uses that plus a separate configuration
for ts/tsx files, rather than the js configuration applying for js and ts then overriding specific
parts of the config for ts files. This is to cleanly handle issues with mixed codebases in addition
to the specific ordering requirements of the various base configurations used in the core configurations.
Shared configuration is still made available in `src/configs/base-rules` (and in the case of parserOptions, the
javascript config which is included in all other core configs).
