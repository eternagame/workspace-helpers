# <%= name %>

<%= description %>

<%= readmeProlog %>

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
run `npx nx generate <generator>` (eg, `npx nx generate ts-iso`). Running `npx nx generate <generator> --help`
will show available options for that generator. In particular, if generating a new package, you may want to pass
the `--directory` flag to put the package in a specific subdirectory of the packages directory if you don't
want it placed in the root.

### Updating Dependencies

When upgrading `@eternagame/nx`, there may be changes to the repository that should be made when updating.
This process is automated, and can be done via `npx nx migrate @eternagame/nx@latest` and then (if necessary)
`npx nx migrate --run-migrations` after reviewing the changes to be made in the migrations.json.

When upgrading nx, you may also want to run migrations for it as well (eg, `npx nx migrate nx@latest`),
though you most likely will not need to if you don't customize any nx configuration files. Note that `@eternagame/nx`
has `nx` as a peer dependency - if the latest version of `nx` is beyond its requirement and you want to upgrade
to a more recent version that is allowed, you'll need to specify a version like `npx nx migrate nx@version`.

For updating other dependencies, you may want to use `npx npm-check-updates --deep --peer`

If you're on a unix-like system and want to remove all nested node_modules folders,
you can run `find . -type d -name node_modules -prune | xargs rm -r`
