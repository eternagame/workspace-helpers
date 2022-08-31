# @eternagame/cypress-utils

Eterna standard Cypress setup and utilities

## Usage

First install this library:
```sh
npm install -D @eternagame/cypress-utils
```

If setting up component testing, use the following in your `cypress.config.ts`:

```js
import { getCTConfig } from '@eternagame/cypress-utils';

export default getCTConfig();
```

or using commonjs

```js
const { getCTConfig } = require('@eternagame/cypress-utils');

export default getCTConfig();
```

If setting up e2e testing in a dedicated project, use the following in your `cypress.config.ts`:

```js
import { getE2EPackageConfig } from '@eternagame/cypress-utils';

export default getE2EPackageConfig();
```

or using commonjs

```js
const { getE2EPackageConfig } = require('@eternagame/cypress-utils');

export default getE2EPackageConfig();
```
