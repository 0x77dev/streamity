import { PrismaClient } from '@prisma/client'
import got from 'got'
import { join } from 'path'
import Fastify from 'fastify'
import mercurius from 'mercurius'
import { fieldAuthorizePlugin, makeSchema } from 'nexus'
import { Context } from './services/interfaces'
import { getTypes } from './services/modules'
import { connect as connectNATS } from 'nats'
import { setRPC } from './rpc'
import { Client as ElasticClient } from '@elastic/elasticsearch'
const fastify = Fastify()

const run = async () => {
  const nats = await connectNATS({ servers: [process.env.NATS_URL || 'nats://localhost:4222'] })
  const node = process.env.ELASTICSEARCH_URL ?? 'http://localhost:9200'
  const elastic = new ElasticClient({ node })
  const prisma = new PrismaClient()

  got.post(`${node}/faces`, {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mappings: {
        properties: {
          face_name: {
            type: 'keyword'
          },
          face_encoding: {
            type: 'dense_vector',
            dims: 128
          }
        }
      }
    })
  }).catch(console.warn)

  const schema = makeSchema({
    types: await getTypes(),
    plugins: [
      fieldAuthorizePlugin()
    ],
    outputs: {
      schema: join(__dirname, './generated/schema.graphql'),
      typegen: join(__dirname, './generated/types.d.ts')
    },
    contextType: { module: join(__dirname, 'services', 'interfaces.ts'), export: 'Context' }
  })

  fastify.register(mercurius, {
    schema,
    graphiql: true,
    context: async ({ headers }): Promise<Context> => ({
      prisma,
      nats,
      elastic
    })
  })

  const url = await fastify.listen(process.env.PORT ?? 3000, '0.0.0.0')
  await prisma.$connect()
  setRPC(nats, prisma, elastic)
  console.info('Listening on', url)
}

run()
  .catch(console.error)
