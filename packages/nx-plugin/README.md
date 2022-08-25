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

To get a list of available generators, run `nx list @eternagame/nx-plugin`.

Note that the `preset` generator will not currently work with `create-nx-workspace` -
  use `npx @eternagame/bootstrap` instead.
