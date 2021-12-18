# GraphQL Backend Template with Node.js and TypeScript 

[![javascript style guide][standard-image]][standard-url]
[![Fastify Inside][fastify-image]][fastify-url]
[![GraphQL Inside][graphql-image]][graphql-url]
[![TypeScript Inside][typescript-image]][typescript-url]
[![Prisma Inside][prisma-image]][prisma-url]

## Template Features

- VSCode Debug
- Live reload (`nodemon`)
- No Typescript compilation output (`ts-node`)
- ESLint (`prettier`, `standard`, `unicorn`)
- Tests (`jest`, `ts-jest`)
- [Fastify][fastify-url] web framework
- [Mercurius](https://mercurius.dev/) GraphQL adapter for Fastify
    - [nexus](https://github.com/graphql-nexus/nexus) Declarative, code-first and strongly typed GraphQL schema construction
- [Prisma][prisma-url] ORM for PostgreSQL
- [devcontainer](https://code.visualstudio.com/docs/remote/containers) unified development workstation setup


[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[standard-url]: https://standardjs.com
[graphql-image]: https://shields.io/badge/GraphQL-inside-brightgreen?logo=graphql&style=flat
[graphql-url]: https://graphql.org/
[typescript-image]: https://shields.io/badge/TypeScript-inside-brightgreen?logo=typescript&style=flat
[typescript-url]: https://typescriptlang.org/
[prisma-image]: https://shields.io/badge/Prisma-inside-brightgreen?logo=prisma&style=flat
[prisma-url]: https://prisma.io/
[fastify-image]: https://shields.io/badge/Fastify-inside-brightgreen?logo=fastify&style=flat
[fastify-url]: https://fastify.io/

## Usage

- `yarn start` - starts the project
- `yarn dev` - starts the project with live-reload
- `yarn db:migrate dev` - migrate database locally
- `yarn db:migrate deploy` - migrate database on production
- `yarn test` - launch jest
