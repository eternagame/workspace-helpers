# @eternagame/nx-plugin

Eterna standard Nx setup and utilities

## Nx Presets
- preset.json - nx.json preset for Nx projects using @eternagame/nx-plugin

## Generators

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
