# @eternagame/tsconfig

Eterna standard TypeScript configurations

## Usage

```sh
npm install -D @eternagame/nx-spawn
```

Add one of the available configurations to your `tsconfig.json`:

- Base configuration (runtime-agnostic)
  ```json
  { "extends": "@eternagame/tsconfig/tsconfig.json" }
  ```
- Configuration for Node environment
  ```json
  { "extends": "@eternagame/tsconfig/tsconfig.node.json" }
  ```
- Configuration for browser environment
  ```json
  { "extends": "@eternagame/tsconfig/tsconfig.web.json" }
  ```
- Configuration for Vitest when used with a Node environment
  ```json
  { "extends": "@eternagame/tsconfig/tsconfig.vitest-node.json" }
  ```
- Configuration for Vitest when used with a browser environment
  ```json
  { "extends": "@eternagame/tsconfig/tsconfig.vitest-web.json" }
  ```
- Configuration for Cypress environment
  ```json
  "extends": "@eternagame/tsconfig/tsconfig.cypress.json"
  ```
