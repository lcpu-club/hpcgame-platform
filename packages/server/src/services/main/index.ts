import { fastify } from 'fastify'
import { fastifySensible } from '@fastify/sensible'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastifySwagger } from '@fastify/swagger'
import { API_HOST, API_PORT, DEV_MODE } from '../../config/index.js'
import { logger } from '../../logger/index.js'

export const server = fastify({ logger })
await server.register(fastifySensible)

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

import { rootRouter } from './api/index.js'
import { GetRouterDescriptor } from 'fastify-typeful'
import { client } from '../../db/index.js'
import fastifyCors from '@fastify/cors'
await server.register(rootRouter.toPlugin())

await client.connect()
logger.info(`Connected to MongoDB`)

await server.listen({
  host: API_HOST,
  port: API_PORT
})

export type MainDescriptor = GetRouterDescriptor<typeof rootRouter>
