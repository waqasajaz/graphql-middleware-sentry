# graphql-middleware-sentry

[![CircleCI](https://circleci.com/gh/maticzav/graphql-middleware-sentry.svg?style=shield)](https://circleci.com/gh/maticzav/graphql-middleware-sentry)
[![npm version](https://badge.fury.io/js/graphql-middleware-sentry.svg)](https://badge.fury.io/js/graphql-middleware-sentry)

> GraphQL Middleware plugin for Sentry.

## Usage

> With GraphQL Yoga

```ts
import { GraphQLServer } from 'graphql-yoga'
import { sentry } from 'graphql-middleware-sentry'

const typeDefs = `
  type Query {
    hello: String!
    bug: String!
  }
`

const resolvers = {
  Query: {
    hello: () => `Hey there!`
    bug: () => {
      throw new Error(`Many bugs!`)
    }
  }
}

const sentryMiddleware = sentry({
  dns: SENTRY_DNS
})

const server = GraphQLServer({
  typeDefs,
  resolvers,
  middlewares: [sentryMiddleware]
})

serve.start(() => `Server running on http://localhost:4000`)
```

## API

```ts
export interface Options {
  dsn: string
  config?: ConstructorOptions
}

function sentry(options: Options): IMiddleware
```

* DSN: Sentry DSN url.
* config: A config object passed down to `Raven.config`.

## License

MIT @ Matic Zavadlal
