import { fastify } from 'fastify'
import { fastifySensible } from '@fastify/sensible'
import fastifyRateLimit from '@fastify/rate-limit'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastifySwagger } from '@fastify/swagger'
import fastifyCors from '@fastify/cors'
import type { GetRouterDescriptor } from 'fastify-typeful'
import { API_HOST, API_PORT, DEV_MODE } from '../../config/index.js'
import { logger } from '../../logger/index.js'
import { redis } from '../../cache/index.js'
import { rootRouter } from './api/index.js'
import { client } from '../../db/index.js'

export const server = fastify({ logger })
export const { httpErrors } = server
await server.register(fastifySensible)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: fastify-rate-limit types are broken
await server.register(fastifyRateLimit.default, {
  redis
})

if (DEV_MODE) {
  await server.register(fastifyCors, {
    origin: true
  })
  await server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'HPCGame',
        description: 'HPCGame Main Service API',
        version: 'latest'
      },
      components: {
        securitySchemes: {
          tokenAuth: {
            type: 'apiKey',
            name: 'auth-token',
            in: 'header'
          }
        }
      }
    },
    transform({ schema, url }) {
      return {
        schema: {
          ...schema,
          security: [{ tokenAuth: [] }]
        },
        url
      } as never
    }
  })
  await server.register(fastifySwaggerUi, {
    routePrefix: '/docs'
  })
}

await server.register(rootRouter.toPlugin())

await client.connect()
logger.info(`Connected to MongoDB`)

await server.listen({
  host: API_HOST,
  port: API_PORT
})

export type MainDescriptor = GetRouterDescriptor<typeof rootRouter>
