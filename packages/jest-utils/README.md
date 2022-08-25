# @eternagame/jest-utils

Eterna standard Jest setup and utilities

## Usage

First install this library:
```sh
npm install -D @eternagame/jest-utils
```

Then to use our provided config for your project, in your `jest.config.js`:

```js
import { getConfig } from '@eternagame/jest-utils';

export default getConfig('typescript');
```

or using commonjs

```js
const { getConfig } = require('@eternagame/jest-utils');

export default getConfig('typescript');
```

`getConfig` takes a single parameter specifying the project type/featureset to use (currently
`typescript` and `vue` are supported) and returns a Jest `Config.InitialOptions` which you can
modify as needed
