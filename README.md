# Eterna Workspace Helpers

Helper packages for JS/TS repositories

<!-- Managed by @eternagame/nx-plugin - prologue -->
Interested in development? Join the discussion on the Eterna Discord!

[![Eterna Discord](https://discord.com/api/guilds/702618517589065758/widget.png?style=banner2)](https://discord.gg/KYeTwux)
<!-- End managed by @eternagame/nx-plugin - prologue -->

## Components

### Bootstrapping

Want to set up a new repository using Eterna's standard structure? Check out [`@eternagame/bootstrap`](./packages/bootstrap)

This will also set you up to use our Nx plugin, [`@eternagame/nx-plugin`](./packages/nx-plugin), which has our standard Nx 
configuration and package generators.

### Configuration and Utility Libraries

- [`@eternagame/tsconfig`](./packages/tsconfig) - Eterna standard TypeScript configurations
- [`@eternagame/eslint-plugin`](./packages/eslint-plugin) - Eterna standard ESLint setup and utilities
- [`@eternagame/vite-utils`](./packages/vite-utils) - Eterna standard Vite setup and utilities
- [`@eternagame/lint-staged-utils`](./packages/lint-staged-utils) - Eterna standard lint-staged setup and utilities
- [`@eternagame/cypress-utils`](./packages/cypress-utils) - Eterna standard Cypress setup and utilities

### Utility Applications

- [`@eternagame/nx-spawn`](./packages/nx-spawn) - Run an npm command with Nx dependencies without waiting for them to finish

<!-- Managed by @eternagame/nx-plugin - setup -->
## Setup

- Install [NodeJS](https://nodejs.org/en/download/) (we recommend using the latest LTS version)
- Run `npm install` in the root of this repository
<!-- End managed by @eternagame/nx-plugin - setup -->

<!-- Managed by @eternagame/nx-plugin - commands -->
## Common Commands

This repository is structured as a [monorepo](https://monorepo.tools/), using
[NPM Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces) and [Nx](https://nx.dev/) to
manage its components. Here are some common actions you might want to take:
<!-- End managed by @eternagame/nx-plugin - commands -->

<!-- Managed by @eternagame/nx-plugin - commands/run -->
### Running Apps

Run `npx nx dev <package-name>` to run an application package, automatically reloading when changes occur.

Run `npx nx start <package-name>` to run after building the package (with dependencies) without reloading.
<!-- End managed by @eternagame/nx-plugin - commands/run -->

<!-- Managed by @eternagame/nx-plugin - commands/build -->
### Build

Run `npx nx build <package-name>` to build a package. This will also build any dependencies of the package.

Run `npx nx build:watch <package-name>` to build a package and rebuild when files are changed.
This will also build any dependencies of the package.
<!-- End managed by @eternagame/nx-plugin - commands/build -->

<!-- Managed by @eternagame/nx-plugin - commands/lint -->
### Linting and Formatting

Run `npx nx lint <package-name>` to run linting for a package via [ESLint](https://eslint.org/).

Run `npx nx lint <package-name> --fix` to run linting with automatic fixes
<!-- End managed by @eternagame/nx-plugin - commands/lint -->

<!-- Managed by @eternagame/nx-plugin - commands/test -->
### Unit Tests

Run `npx nx test <package-name>` to execute the unit tests for a package via [Vitest](https://vitest.dev/).

Run `npx nx affected:test` to execute the unit tests for all packages affected by a code change.
<!-- End managed by @eternagame/nx-plugin - commands/test -->

<!-- Managed by @eternagame/nx-plugin - commands/generate -->
### Code Generation

You can use the Eterna Nx plugin to automatically create and update files, including adding new packages.

To see the available generators, run `npx nx list @eternagame/nx-plugin`. To run a given generator,
run `npx nx generate <generator>` (eg, `npx nx generate ts-iso`). Running `npx nx generate <generator> --help`
will show available options for that generator. In particular, if generating a new package, you may want to pass
the `--directory` flag to put the package in a specific subdirectory of the packages directory if you don't
want it placed in the root.
<!-- End managed by @eternagame/nx-plugin - commands/generate -->

### Updating Dependencies

In general, when updating dependencies the fastest method to do so, covering all packages
and taking into account satisfying all peer dependencies, is `npx npm-check-updates --deep --peer --dep dev,optional,peer,prod,bundle`.

Take special care when upgrading `nx` - there may be changes to the repository that should be made
when updating, plus there may be changes that should be made to `@eternagame/nx-plugin`, including changing
our default Nx configuration, changing our generators and adding migrations, etc. Using `nx migrate nx`
will allow Nx to apply its own migrations, however it will not take into account, for example,
migrating our Nx preset. Additionally there may be changes we want to make based off of migrations
in `@nrwl/workspace`, even though we don't use it. You should look in the following locations for
changes that we may want to incorporate:

- https://github.com/nrwl/nx/tree/master/packages/nx/presets
- https://github.com/nrwl/nx/tree/master/packages/nx/src/migrations
- https://github.com/nrwl/nx/tree/master/packages/workspace/src/migrations
- And, of course, check the release notes for any new features we may want to take advantage of

If you're on a unix-like system and want to remove all nested node_modules folders,
you can run `find . -type d -name node_modules -prune | xargs rm -r`

## Testing packages outside this repository

If you want to test changes to packages outside of this repository, you will need a way to install your
local version in whatever other repository you're using. There are generally two ways to do this:

### npm link

If you run `npm link -w @eternagame/<package>`, this will create a symlink to the local directory
in your global node modules. You can then run `npm link @eternagame/<package>` in an existing repository
to use the symlinked version instead of retrieving it from npm.

### Local registry

A limitation of `npm link` is that calls to `npm install` will still pull from npm rather than using
the global symlink. This is particularly problematic when testing changes to `@eternagame/bootstrap`
or the `@eternagame/nx-plugin:preset` generator, as both packages install `@eternagame/nx-plugin` during the
generation process, and so it will use whatever the latest version is in npm rather than your local copy.

To work around this, you can run a local npm registry using [verdaccio](https://github.com/verdaccio/verdaccio).

- In a dedicated terminal, run `npx verdaccio` to start the local registry
- Run `npm adduser --registry http://localhost:4873` to set up an account
- Run `npm publish -w @eternagame/<package> --registry http://localhost:4873` to publish a package
  to your local repository
- Test out commands by setting the environment variable `NPM_CONFIG_REGISTRY=http://localhost:4873`,
  for example `NPM_CONFIG_REGISTRY=http://localhost:4873 npx @eternagame/bootstrap`. Alternatively,
  run `npm set registry http://localhost:4873/` to set the local registry as your default registry.
