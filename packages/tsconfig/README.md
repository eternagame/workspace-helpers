# @eternagame/tsconfig

Eterna standard TypeScript configurations

## Usage

```sh
npm install -D @eternagame/tsconfig
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
