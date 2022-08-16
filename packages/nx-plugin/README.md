# @eternagame/nx-plugin

Eterna standard Nx setup and utilities

## Usage

We recommend using [`@eternagame/bootstrap`](../bootstrap/) to set up a project that uses this plugin.

Otherwise, run the following:

```sh
npm install -D nx @eternagame/nx-plugin
```

To set up your project using the structure we recommend, you can then run `npx nx generate @eternagame/nx-plugin:preset`.
Note however that this is liable to overwrite many of your core project files.

## Nx Presets

We provide a preset that you can extend from in your `nx.json`:

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "extends": "@eternagame/nx-plugin/preset.json"
}
```

## Generators

Generators can be run just like any other nx generator like `nx generate <generator>`. They can also be
imported for use in your own generators (see [src/index.ts](./src/index.ts) for exports).

- preset - Nx project bootstrapping. This generator will not currently work with `create-nx-workspace` -
  use `npx @eternagame/bootstrap` instead.
- preset-eterna - Superset of the preset generator, but customized for projects managed by the Eterna project
  (whereas preset is usable in external contexts)
- package - Adds an empty generic package to an Nx project
- ts-iso - Adds new isomorphic TypeScript package to an Nx project
- ts-node - Adds a new TypeScript package intended for usage within NodeJS to an Nx project
- ts-web - Adds a new TypeScript package intended for usage within the browser to an Nx project
- app-node - Adds a new Typescript NodeJS application to an Nx project
- app-web - Adds a new Typescript browser application to an Nx project
- license - Changes the license across all packages (namely useful if you decide to add a license to a
  repo where you initialized it with no license)
