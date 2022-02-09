# @eternagame/nx

Opinionated Nx utilities

## Generators

- preset - Nx workspace bootstrapping to be used on top of the Nx Core preset. Run this generator after running
  `create-nx-workspace --preset core` rather than specifying `@eternagame/nx` as the preset to allow
  all modifications from the core preset to be applied (see [this issue](https://github.com/nrwl/nx/issues/8917)
  for information on why this is necessary).
- package - Adds an empty package to an Nx workspace
