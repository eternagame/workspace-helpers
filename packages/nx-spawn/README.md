# @eternagame/nx-spawn

Run an npm command with nx dependencies without waiting for them to finish

This package is heavily based on `nx/src/task-runner`, though significantly simplified for this use case
(eg, no caching, no match mode, assumes long running dependencies, etc)

## Usage

```
nx-spawn <command>
```

The package to run the command for will be determined by the current working directory
