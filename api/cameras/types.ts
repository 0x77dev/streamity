import { idArg, list, mutationField, nonNull, objectType, queryField, stringArg } from 'nexus'

const Camera = objectType({
  name: 'Camera',
  definition: (t) => {
    t.id('id')
    t.string('src')
  }
})

const cameras = queryField('cameras', {
  type: list(Camera),
  resolve: (root, args, { prisma }) => prisma.camera.findMany()
})

const camera = queryField('camera', {
  type: Camera,
  args: {
    id: nonNull(idArg())
  },
  resolve: (root, { id }, { prisma }) => prisma.camera.findFirst({ where: { id } })
})

const addCamera = mutationField('addCamera', {
  type: Camera,
  args: {
    src: nonNull(stringArg())
  },
  resolve: async (root, { src }, { prisma }) => prisma.camera.create({ data: { src } })
})

export const types = [addCamera, camera, cameras]
