import { config as raven, captureException, ConstructorOptions } from 'raven'
import { IMiddlewareFunction } from 'graphql-middleware/dist/types'

// Options for graphql-middleware-sentry
export interface Options {
  dsn: string
  config?: ConstructorOptions
}

export class SentryError extends Error {
  constructor(...props) {
    super(...props)
  }
}

export const sentry = (options: Options): IMiddlewareFunction => {
  // Check if Sentry DSN is present
  if (!options.dsn) {
    throw new SentryError(`Missing dsn parameter in configuration.`)
  }

  // Configure and install Raven
  raven(options.dsn, options.config).install()

  // Return middleware resolver
  return async function(resolve, parent, args, ctx, info) {
    try {
      const res = await resolve(parent, args, ctx, info)
      return res
    } catch (err) {
      captureException(err)
    }
  }
}
