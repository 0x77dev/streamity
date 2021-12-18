import got from 'got'
import { idArg, list, mutationField, nonNull, objectType, queryField, scalarType, stringArg } from 'nexus'
import { v4 as uuid } from 'uuid'
const Date = scalarType({ name: 'Date' })
const Face = objectType({
  name: 'Face',
  definition: (t) => {
    t.id('id')
    t.string('slug')
    t.field('lastSeen', { type: Date })
    t.list.nonNull.float('encodings')
  }
})

const faces = queryField('faces', {
  type: list(Face),
  resolve: (root, args, { prisma }) => prisma.face.findMany({ orderBy: { lastSeen: 'desc' } })
})

const face = queryField('face', {
  type: Face,
  args: {
    id: nonNull(idArg())
  },
  resolve: (root, { id }, { prisma }) => prisma.face.findFirst({ where: { id } })
})

const addFace = mutationField('addFace', {
  type: Face,
  args: {
    imageUrl: nonNull(stringArg()),
    slug: nonNull(stringArg())
  },
  resolve: async (root, { imageUrl, slug }, { prisma, nats, elastic }) => {
    const { rawBody: image } = await got(imageUrl)
    const req = await nats.request('recognition.frame.add', image)
    const data = JSON.parse(req.data.toString())
    const id = uuid()

    await elastic.create({
      id,
      index: 'faces',
      refresh: true,
      body: {
        face_name: id,
        face_encoding: data.encodings
      }
    })

    return prisma.face.create({
      data: { id, encodings: data.encodings, slug }
    })
  }
})

export const types = [addFace, face, faces, Date]
