import { config as raven, captureException, ConstructorOptions } from 'raven'
import { IMiddlewareFunction } from 'graphql-middleware/dist/types'

// Options for graphql-middleware-sentry
export interface Options {
  dsn: string
  config?: ConstructorOptions
  forwardErrors?: boolean
}

export class SentryError extends Error {
  constructor(...props) {
    super(...props)
  }
}

function normalizeOptions(options: Options): Options {
  // Check if Sentry DSN is present
  if (!options.dsn) {
    throw new SentryError(`Missing dsn parameter in configuration.`)
  }

  return {
    dsn: options.dsn,
    config: options.config !== undefined ? options.config : {},
    forwardErrors:
      options.forwardErrors !== undefined ? options.forwardErrors : false,
  }
}

export const sentry = (_options: Options): IMiddlewareFunction => {
  const options = normalizeOptions(_options)

  // Configure and install Raven
  raven(options.dsn, options.config).install()

  // Return middleware resolver
  return async function(resolve, parent, args, ctx, info) {
    try {
      const res = await resolve(parent, args, ctx, info)
      return res
    } catch (err) {
      // Capture exception
      captureException(err, {
        req: ctx.request,
      })

      // Forward error
      if (options.forwardErrors) {
        throw err
      }
    }
  }
}
