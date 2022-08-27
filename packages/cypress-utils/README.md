# @eternagame/cypress-utils

Eterna standard cypress setup and utilities

## Usage

First install this library:
```sh
npm install -D @eternagame/cypress-utils
```

Note that these configs assume a monorepo setup where Cypress component testing is used
in the same package as components but e2e testing is done in its own package.

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

If setting up e2e testing, use the following in your `cypress.config.ts`:

```js
import { getE2EConfig } from '@eternagame/cypress-utils';

export default getE2EConfig();
```

or using commonjs

```js
const { getE2EConfig } = require('@eternagame/cypress-utils');

export default getE2EConfig();
```
