<div align="center">
  <a href="https://www.npmjs.com/package/@evilkiwi/compose" target="_blank">
    <img src="https://img.shields.io/npm/v/@evilkiwi/compose?style=flat-square" alt="NPM" />
  </a>
  <a href="https://discord.gg/3S6AKZ2GR9" target="_blank">
    <img src="https://img.shields.io/discord/1000565079789535324?color=7289DA&label=discord&logo=discord&logoColor=FFFFFF&style=flat-square" alt="Discord" />
  </a>
  <img src="https://img.shields.io/npm/l/@evilkiwi/compose?style=flat-square" alt="GPL-3.0-only" />
  <h3>Docker Compose TypeScript Runtime</h3>
</div>

`@evilkiwi/compose` provides TypeScript bindings to Docker Compose commands and syntax.

- Supports both Compose v1 & v2
- Functional API
- Side-effect free
- Zero dependencies
- ES Module
- Less than 3kb

## Installation

This package is available via NPM:

```bash
yarn add @evilkiwi/compose

# or

npm install @evilkiwi/compose
```

## Usage

```typescript
import { compose } from '@evilkiwi/compose';

// By default, the current cwd will be used.
await compose().up();

// You can specify a different cwd, too.
await compose({ cwd: '/path/to/project' }).up();

// As well as cwd, the files used for docker compose can be specified.
await compose({
  cwd: '/path/to/project',
  path: ['my-compose-file.yaml'],
}).up();

// Or you can alternatively specify your compose config inline as a string.
await compose({
  cwd: '/path/to/project',
  config: `
name: my-project

services:
  proxy:
    container_name: proxy
    image: nginx:latest
    restart: always`,
}).up();

// `@evilkiwi/compose` uses Docker Compose v2 by default, you can force it to use v1.
await compose({
  cwd: '/path/to/project',
  v1: true,
}).up();
```
