import { listSubs } from './src/subs'
import { getTags, tagSubscriber } from './src/tags'
import { createWebhook, deleteWebhook } from './src/webhook'

export const TC_TAG_ID = 4278910
export const TEST_EMAIL = 'dufivo@afia.pro'

if (import.meta.main) {
    const response = await main(process.argv[2])
    if (typeof response === 'string') {
        console.error(response)
        process.exit(1)
    }
    console.log(response)
}

async function main(args: string) {
    console.log('calling ' + args)
    switch (args) {
        case 'createWebhook':
            // response = await createWebhook()
            const createResponse = await createWebhook(
                Bun.env.APPS_SCRIPT_URL,
                {
                    name: 'subscriber.tag_add',
                    tag_id: TC_TAG_ID
                }
            )
            if (!createResponse) throw new Error('webhook not created')
            if (createResponse.status !== 200)
                throw new Error(createResponse.statusText)

            const existingLog = await Bun.file('logs/webhooks.json').text()
            await Bun.write(
                'logs/webhooks.json',
                existingLog + '\n' + createResponse.statusText
            )
            console.error('wrote log to logs/webhooks.json')
            return createResponse

        case 'deleteWebhook':
            const deleteResponse = await deleteWebhook(3970478)
            if (!deleteResponse) {
                console.log('webhook not created')
                return null
            }

            return deleteResponse

        case 'getSubs':
            return await listSubs()
        case 'getTags':
            return await getTags()
        case 'tagSubscriber':
            return await tagSubscriber(TEST_EMAIL)
        default:
            return 'no command specified'
    }
}
