import { idArg, list, mutationField, nonNull, objectType, queryField, stringArg } from 'nexus'

const Webhook = objectType({
  name: 'Webhook',
  definition: (t) => {
    t.id('id')
    t.string('url')
  }
})

const webhooks = queryField('webhooks', {
  type: list(Webhook),
  resolve: (root, args, { prisma }) => prisma.webhook.findMany()
})

const webhook = queryField('webhook', {
  type: Webhook,
  args: {
    id: nonNull(idArg())
  },
  resolve: (root, { id }, { prisma }) => prisma.webhook.findFirst({ where: { id } })
})

const addWebhook = mutationField('addWebhook', {
  type: Webhook,
  args: {
    url: nonNull(stringArg())
  },
  resolve: async (root, { url }, { prisma }) => prisma.webhook.create({ data: { url } })
})

export const types = [addWebhook, webhook, webhooks]
