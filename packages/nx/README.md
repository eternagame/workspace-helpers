# @eternagame/nx

Opinionated Nx utilities

## Generators

- preset - Nx workspace bootstrapping to be used on top of the Nx Core preset. Run this generator after running
  `create-nx-workspace --preset core` rather than specifying `@eternagame/nx` as the preset to allow
  all modifications from the core preset to be applied (see [this issue](https://github.com/nrwl/nx/issues/8917)
  for information on why this is necessary).
- preset-eterna - Superset of the preset generator, but customized for projects managed by the Eterna project
  (whereas preset is usable in external contexts)
- package - Adds an empty generic package to an Nx workspace
- ts-iso - Adds new isomorphic TypeScript package to an Nx workspace
- ts-node - Adds a new TypeScript package intended for usage within NodeJS to an Nx workspace
- ts-web - Adds a new TypeScript package intended for usage within the browser to an Nx workspace
- app-node - Adds a new Typescript NodeJS application to an Nx workspace
- app-web - Adds a new Typescript browser application to an Nx workspace
- license - Changes the license across all packages (namely useful if you decide to add a license to a
  repo where you initialized it with no license)
