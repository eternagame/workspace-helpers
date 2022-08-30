# @eternagame/nx-spawn

Run an npm command with Nx dependencies without waiting for them to finish

This package is heavily based on `nx/src/task-runner`, though significantly simplified for this use case
(eg: no caching, no batch mode, etc).

## Usage

```sh
npm install -D @eternagame/nx-spawn
```

```sh
nx-spawn <command>
```

The package to run the command for will be determined by the current working directory
