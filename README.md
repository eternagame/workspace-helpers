# Eterna Workspace Helpers

Helper packages for JS projects

Interested in development? Join the discussion on the Eterna Discord!

[![Eterna Discord](https://discord.com/api/guilds/702618517589065758/widget.png?style=banner2)](https://discord.gg/KYeTwux)

## Components

- [`@eternagame/eslint-plugin`](./packages/eslint-plugin) - Semi-opinionated ESLint configuration
- [`@eternagame/jest`](./packages/jest) - Opinionated Jest utilities
- [`@eternagame/nx`](./packages/nx) - Opinionated Nx utilities
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

Run `npx nx format:write` to format files via [Prettier](https://prettier.io/)

### Unit Tests

Run `npx nx test <package-name>` to execute the unit tests for a package via [Jest](https://jestjs.io/).

Run `npx nx affected:test` to execute the unit tests for all packages affected by a code change.

### Generate a Package

To scaffold a new package, run `npx nx generate @eternagame/nx:package`. You may also want to pass the
`--directory` flag to put the package in a specific directory if it doesn't match your desired package name.

### Updating Dependencies

When updating Nx plugins (or dependencies that are managed by Nx plugins), the plugins may have
changes to configurations or other changes that should be made when updating. The process of updating
packages and making changes is automated, and can be done via `npx nx migrate latest` and then (if necessary)
`npx nx migrate --run-migrations` after reviewing the changes to be made in the migrations.json. Never update these packages
"manually" (without using this command). Remove the migrations.json file before committing changes.

For updating other dependencies, you may want to use `npx npm-check-updates --deep --peer`

If you're on a unix-like system and want to remove all nested node_modules folders,
you can run `find . -type d -name node_modules -prune | xargs rm -r`