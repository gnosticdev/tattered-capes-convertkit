import { listSubs } from './src/subs'
import { getTags, tagSubscriber } from './src/tags'
import { createWebhook, deleteWebhook } from './src/webhook'

export const TC_TAG_ID = 4278910
export const TEST_EMAIL = 'dufivo@afia.pro'
const DELETE_WEBHOOK_ID = process.argv[3]

if (import.meta.main) {
    const caller = process.argv[2]
    console.log('calling ' + caller)
    switch (caller) {
        case 'createWebhook':
            // response = await createWebhook()
            const createResponse = await createWebhook(
                Bun.env.APPS_SCRIPT_URL,
                {
                    name: 'subscriber.tag_add',
                    tag_id: TC_TAG_ID
                }
            )
            if (!createResponse) {
                console.error('webhook not created')
                break
            }
            break

        case 'deleteWebhook':
            if (!DELETE_WEBHOOK_ID) {
                console.error('no webhook id provided')
                break
            }
            const deleteResponse = await deleteWebhook(
                parseInt(DELETE_WEBHOOK_ID)
            )
            if (!deleteResponse) {
                console.error('webhook not deleted')
                break
            }

            console.log('delete response: ', deleteResponse)

        case 'getSubs':
            await listSubs()
            break
        case 'getTags':
            await getTags()
            break
        case 'tagSubscriber':
            await tagSubscriber(TEST_EMAIL)
            break
        default:
            console.log('not a valid caller')
            break
    }
}
