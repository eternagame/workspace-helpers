# @eternagame/tsconfig

Opinionated TypeScript configurations

Add one of the available configurations to your `tsconfig.json`:

- Base configuration (runtime-agnostic)
  ```json
  "extends": "@eternagame/tsconfig/tsconfig.json"
  ```
- Configuration for Node environment
  ```json
  "extends": "@eternagame/tsconfig/tsconfig.node.json"
  ```
- Configuration for browser environment
  ```json
  "extends": "@eternagame/tsconfig/tsconfig.web.json"
  ```
- Configuration for jest when used with a Node environment
  ```json
  "extends": "@eternagame/tsconfig/tsconfig.jest-node.json"
  ```
- Configuration for jest when used with a browser environment
  ```json
  "extends": "@eternagame/tsconfig/tsconfig.jest-web.json"
  ```
