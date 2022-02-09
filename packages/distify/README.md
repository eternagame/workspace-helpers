# @eternagame/distify

Lightweight build step for static assets

## Configuration

When running `distify`, it will look in your current working directory for a file called
`distify.config.json`. It should contain a JSON object containing three properties:

- `sourceRoot`: A string specifying the root directory where files should be copied from. The directory structure
  will be copied with respect to this directory
- `outputPath`: A string specifying the directory files should be copied to
- `sourceGlobs`: An array of globs (matched using [fast-glob](https://www.npmjs.com/package/fast-glob) with `dot: true`)
  which are the files that will be copied from `sourceRoot` to `outputPath`
