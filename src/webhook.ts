const WEBHOOK_URL = Bun.env.CONVERT_KIT_BASE_URL + '/automations/hooks'

export async function createWebhook(
    targetUrl: string,
    event: EventTypes[number]
) {
    const params = new URLSearchParams({
        api_key: Bun.env.CONVERT_KIT_API_KEY
    })

    const url = new URL(WEBHOOK_URL)
    url.search = params.toString()
    console.log('sending request to ' + url)

    const requestBody: WebhookRequest = {
        api_secret: Bun.env.CONVERT_KIT_SECRET,
        target_url: targetUrl,
        event: event
    }
    console.log('request body: ', requestBody)

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })

        if (response.status === 200) {
            const json = (await response.json()) as CreateWebhookResponse
            console.log(Bun.inspect(json))
            await writeToLog(json)
            return json
        }
        await Bun.write('logs/error.log', response)
        console.error('error creating webook: ' + (await response.text()))
    } catch (error) {
        console.log('error caught: ', error)
    }
}

async function writeToLog(json: any) {
    const existingLog = await Bun.file('logs/webhooks.json').json()
    // append to existing log
    const newLog = existingLog.concat(json)
    await Bun.write('logs/webhooks.json', JSON.stringify(newLog, null, 2))
    console.log('wrote log to logs/webhooks.json')
}

export async function deleteWebhook(webhookId: number) {
    const params = new URLSearchParams({
        api_key: Bun.env.CONVERT_KIT_API_KEY
    })

    const url = new URL(WEBHOOK_URL + '/' + webhookId)

    url.search = params.toString()
    console.log('sending request to ' + url)

    const requestBody = {
        api_secret: Bun.env.CONVERT_KIT_SECRET
    }
    console.log('request body: ', requestBody)
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })

        if (response.status === 200) {
            const json = (await response.json()) as { success: boolean }
            console.log(Bun.inspect(json))
            await writeToLog(json)
            console.log('deleted webhook ' + webhookId)
            return json
        }
        const errorLog = Bun.file('logs/error.log').text()
        console.error('error deleting webhook: ', response)
        await Bun.write(
            'logs/error.log',
            errorLog + '\n' + (await response.text())
        )
    } catch (error) {
        console.error('error caught: ', error)
    }
}

export type WebhookRequest = {
    api_secret: string
    target_url: string
    event: {}
}

export type CreateWebhookResponse = {
    rule: {
        id: number
        account_id: number
        event: {
            name: EventTypes[number]['name']
        }
    }
}

export type EventTypes = [
    { name: 'subscriber.subscriber_activate' },
    { name: 'subscriber.subscriber_unsubscribe' },
    { name: 'subscriber.subscriber_bounce' },
    { name: 'subscriber.subscriber_complain' },
    { name: 'subscriber.form_subscribe'; form_id: number },
    {
        name: 'subscriber.course_subscribe'
        course_id: number
    },
    {
        name: 'subscriber.course_complete'
        course_id: number
    },
    {
        name: 'subscriber.link_click'
        initiator_value: string
    },
    {
        name: 'subscriber.product_purchase'
        product_id: number
    },
    { name: 'subscriber.tag_add'; tag_id: number },
    { name: 'subscriber.tag_remove'; tag_id: number },
    { name: 'purchase.purchase_create' }
]
