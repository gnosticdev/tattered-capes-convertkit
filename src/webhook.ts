export async function createWebhook(
    targetUrl: string,
    event: EventTypes[number]
) {
    const params = new URLSearchParams({
        api_key: Bun.env.CONVERT_KIT_API_KEY
    })

    const url = new URL(Bun.env.CONVERT_KIT_BASE_URL + '/automations/hooks')
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
            return response
        }
        console.error(response.statusText)
    } catch (error) {
        console.log(error)
    }
}

export async function deleteWebhook(webhookId: number) {
    const params = new URLSearchParams({
        api_key: Bun.env.CONVERT_KIT_API_KEY
    })

    const url = new URL(Bun.env.CONVERT_KIT_BASE_URL)
    url.pathname = `/automations/hooks/${webhookId}`
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
            return (await response.json()) as { success: boolean }
        }
        console.error(await response.text())
    } catch (error) {
        console.log(error)
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
