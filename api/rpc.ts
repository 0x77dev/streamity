import { NatsConnection } from 'nats'
import { PrismaClient } from '@prisma/client'
import { Client as ElasticClient } from '@elastic/elasticsearch'

export const setRPC = (nats: NatsConnection, prisma: PrismaClient, es: ElasticClient): void => {
  nats.subscribe('api.camera.get', {
    callback: async (err, msg) => {
      if (!msg.reply) return
      if (err) console.error(err)
      const cameras = await prisma.camera.findMany()

      nats.publish(msg.reply, Buffer.from(JSON.stringify(cameras)))
    },
    queue: 'api.camera'
  })

  nats.subscribe('recognition.face.encodings', {
    callback: async (err, msg) => {
      if (err) console.error(err)

      const data = JSON.parse(msg.data.toString()) as { encodings: number[], id: string }
      const { body: { hits: { hits } } } = await es.search({
        index: 'faces',
        size: 50,
        _source: 'face_name',
        body: {
          query: {
            script_score: {
              query: {
                match_all: {}
              },
              script: {
                source: "cosineSimilarity(params.query_vector, 'face_encoding')",
                params: {
                  query_vector: data.encodings
                }
              }
            }
          }
        }
      })
      console.log('hits', hits.length)
      for (const hit of hits) {
        if (hit._score > 0.93) {
          const face = await prisma.face.update({ where: { id: hit._source.face_name }, data: { lastSeen: new Date() } })
          console.log('Face ', face.id, '\n\tlastSeen:', face.lastSeen)
        }
      }
    }
  })
}
