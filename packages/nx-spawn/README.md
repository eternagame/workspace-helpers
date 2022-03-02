# @eternagame/nx-spawn

Run a command for all dependencies of a given package, without waiting for their completion

## Usage

```
nx-spawn <command> [--extraRootCommand <command>] [--noRoot]
```

The first parameter is the command that will be run in the folder of each package in the dependency
tree for the current package (ie, the one corresponding to the current working directory).
If extraRootCommand is present, that additional command will be run concurrently in the context
of the current package. If noRoot is true, don't run the command for the current package, only its dependencies.

Commands are run via [concurrently](https://www.npmjs.com/package/concurrently), so they may
be specified using compatible syntax (eg, a `serve` script that builds all dependencies in watch mode
and spins up a development server might look like `nx-spawn npm:build-watch npm:_serve`)
