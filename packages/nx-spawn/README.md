# @eternagame/nx-spawn

Run a command for all dependencies of a given package, without waiting for their completion

## Usage

```
nx-spawn <command for dependencies> [<command for this package>]
```

The first parameter is the command that will be run in the folder of each package in the dependency
tree for the current package (ie, the one corresponding to the current working directory).
The second is an optional command to be run in the current package.

Commands are run via [concurrently](https://www.npmjs.com/package/concurrently), so they may
be specified using compatible syntax (eg, a `serve` script that builds all dependencies in watch mode
and spins up a development server might look like `nx-spawn npm:build-watch npm:_serve`)
