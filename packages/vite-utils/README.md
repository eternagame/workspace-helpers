# @eternagame/vite-utils

Eterna standard Vite setup and utilities

## Usage

First install this library:
```sh
npm install -D @eternagame/vite-utils
```

Then to use our provided config, in your `vite.config.js` or `vite.config.ts`:

```ts
import getConfig from '@eternagame/vite-utils';

export default getConfig({ type: 'lib', env: 'node' });
```

or using commonjs

```ts
const { getConfig } = require('@eternagame/vite-utils');

export default getConfig({ type: 'lib', env: 'node' });
```

`getConfig` takes a settings object of the following format:

```js
export interface Settings {
  // Whether the output is intended to be run directly or used in another app
  type: 'app' | 'lib';
  // The intended runtime environment (iso ie isomorphic could be run in any environment)
  env: 'web' | 'node' | 'iso';
  // If you need some source files copied with the same structure to the output directory, we
  // provide a built-in plugin for that
  resourceFiles?: {
    // Where to resolve source globs relative to
    sourceRoot: string;
    // Micromatch globs of files that should be copied to the output directory
    sourceGlobs: string[];
  };
}
```

`getConfig` returns a Vite `UserConfigFn` which you can wrap and modify the result of as needed
