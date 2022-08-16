# <%= name %>

<%= description %>

<!-- Managed by @eternagame/nx-plugin - readme prologue -->
<%= readmePrologue %>
<!-- End managed by @eternagame/nx-plugin - readme prologue -->

<!-- Managed by @eternagame/nx-plugin - setup -->
## Setup

- Install [NodeJS](https://nodejs.org/en/download/) (we recommend using the latest LTS version)
- Run `npm install` in the root of this repository
<!-- End managed by @eternagame/nx-plugin - setup -->

<!-- Managed by @eternagame/nx-plugin - commands -->
## Common Commands

This project is structured as a monorepo, using [NPM Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
and [Nx](https://nx.dev/) to manage its components. Here are some common actions you might want to take:
<!-- End managed by @eternagame/nx-plugin - commands -->

<!-- Managed by @eternagame/nx-plugin - commands/run -->
### Development Server

Run `npx nx serve <package-name>` to run a local development server for a given package, configured
with things like live reloading.
<!-- End managed by @eternagame/nx-plugin - commands/run -->

<!-- Managed by @eternagame/nx-plugin - commands/build -->
### Build

Run `npx nx build <package-name>` to build a package. This will also build any dependencies of the package.
<!-- End managed by @eternagame/nx-plugin - commands/build -->

<!-- Managed by @eternagame/nx-plugin - commands/lint -->
### Linting and Formatting

Run `npx nx lint <package-name>` to run linting for a package via [ESLint](https://eslint.org/).

Run `npx nx lint <package-name> --fix` to run linting with automatic fixes
<!-- End managed by @eternagame/nx-plugin - commands/lint -->

<!-- Managed by @eternagame/nx-plugin - commands/test -->
### Unit Tests

Run `npx nx test <package-name>` to execute the unit tests for a package via [Jest](https://jestjs.io/).

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

<!-- Managed by @eternagame/nx-plugin - commands/update -->
### Updating Dependencies

When upgrading `@eternagame/nx-plugin`, there may be changes to the repository that should be made when updating.
This process is automated, and can be done via `npx nx migrate @eternagame/nx-plugin@latest` and then (if necessary)
`npx nx migrate --run-migrations` after reviewing the changes to be made in the migrations.json.

When upgrading nx, you may also want to run migrations for it as well (eg, `npx nx migrate nx@latest`),
though you most likely will not need to if you don't customize any Nx configuration files. Note that `@eternagame/nx-plugin`
has `nx` as a peer dependency - if the latest version of `nx` is beyond its requirement and you want to upgrade
to a more recent version that is allowed, you'll need to specify a version like `npx nx migrate nx@version`.

For updating other dependencies, you may want to use `npx npm-check-updates --deep --peer`

If you're on a unix-like system and want to remove all nested node_modules folders,
you can run `find . -type d -name node_modules -prune | xargs rm -r`
<!-- End managed by @eternagame/nx-plugin - commands/update -->
