# Eterna Workspace Helpers

Helper packages for JS projects

Interested in development? Join the discussion on the Eterna Discord!

[![Eterna Discord](https://discord.com/api/guilds/702618517589065758/widget.png?style=banner2)](https://discord.gg/KYeTwux)

## Components

- [`@eternagame/bootstrap](./packages/bootstrap) - Bootstrap a new project using the Eternagame standards
- [`@eternagame/nx`](./packages/nx) - Opinionated Nx utilities
- [`@eternagame/tsconfig`](./packages/tsconfig) - Opinionated TypeScript configurations
- [`@eternagame/eslint-plugin`](./packages/eslint-plugin) - Semi-opinionated ESLint configuration
- [`@eternagame/jest`](./packages/jest) - Opinionated Jest utilities
- [`@eternagame/vite`](./packages/vite) - Opinionated Vite configurations
- [`@eternagame/nx-spawn`](./packages/nx-spawn) - Run a command for all dependencies of a given package, without waiting for their completion
- [`@eternagame/distify`](./packages/distify) - Lightweight build step for static assets

## Setup

- Install [NodeJS](https://nodejs.org/en/download/) (we recommend using the latest LTS version)
- Run `npm install` in the root of this repository

## Common Commands

This project is structured as a monorepo, using [NPM Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
and [Nx](https://nx.dev/) to manage its components. Here are some common actions you might want to take:

### Development Server

Run `npx nx serve <package-name>` to run a local development server for a given package, configured
with things like live reloading.

### Build

Run `npx nx build <package-name>` to build a package. This will also build any dependencies of the package.

### Linting and Formatting

Run `npx nx lint <package-name>` to run linting for a package via [ESLint](https://eslint.org/).

Run `npx prettier --write .` to format files via [Prettier](https://prettier.io/)

### Unit Tests

Run `npx nx test <package-name>` to execute the unit tests for a package via [Jest](https://jestjs.io/).

Run `npx nx affected:test` to execute the unit tests for all packages affected by a code change.

### Code Generation

You can use the Eterna nx plugin to automatically create and update files, including adding new packages.

To see the available generators, run `npx nx list @eternagame/nx`. To run a given generator,
run `npx nx generate @eternagame/nx:<generator>` (eg, `npx nx generate @eternagame/nx:ts-iso`).
Running `npx nx generate @eternagame/nx:<generator> --help` will show available options for that generator.
In particular, if generating a new package, you may want to pass the `--directory` flag to put the package in
a specific subdirectory of the packages directory if you don't want it placed in the root.

### Updating Dependencies

When upgrading `@eternagame/nx`, there may be changes to the repository that should be made when updating.
This process is automated, and can be done via `npx nx migrate @eternagame/nx@latest` and then (if necessary)
`npx nx migrate --run-migrations` after reviewing the changes to be made in the migrations.json. `@eternagame/nx`
also pins a specific version of `nx` as a peer dependency, as there may be migrations that need to be run
for `nx`, which are vendorized by `@eternagame/nx` to ensure they function properly using this repository layout.

For updating other dependencies, you may want to use `npx npm-check-updates --deep --peer`

If you're on a unix-like system and want to remove all nested node_modules folders,
you can run `find . -type d -name node_modules -prune | xargs rm -r`

### Testing packages outside this project

If you want to test changes to packages outside of this project, you will need a way to install your
local version in whatever other project you're using. There are generally two ways to do this:

### npm link

If you run `npm link -w @eternagame/<package>`, this will create a symlink to the local directory
in your global node modules. You can then run `npm link @eternagame/<package>` in an existing project
to use the symlinked version instead of retrieving it from npm.

### Local registry

A limitation of `npm link` is that calls to `npm install` will still pull from npm rather than using
the global symlink. This is particularly problematic when testing changes to `@eternagame/bootstrap`
or the `@eternagame/nx:preset` generator, as both packages install `@eternagame/nx` during the
generation project, and so it will use whatever the latest version is in npm rather than your local copy.

To work around this, you can run a local npm registry using [verdaccio](https://github.com/verdaccio/verdaccio).

- In a dedicated terminal, run `npx verdaccio` to start the local registry
- Run `npm adduser --registry http://localhost:4873` to set up an account
- Run `npm publish -w @eternagame/<package> --registry http://localhost:4873` to publish a package
  to your local repository
- Test out commands by setting the environment variable `NPM_CONFIG_REGISTRY=http://localhost:4873`,
  for example `NPM_CONFIG_REGISTRY=http://localhost:4873 npx @eternagame/bootstrap`. Alternatively,
  run `npm set registry http://localhost:4873/` to set the local registry as your default registry.
