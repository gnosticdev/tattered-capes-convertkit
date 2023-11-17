export async function listSubs() {
    // search last 7 days -> from: yyyy-mm-dd
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - 7)
    const toDate = new Date()
    const fromDateFormatted = formatDate(fromDate)
    const toDateFormatted = formatDate(toDate)
    const params = new URLSearchParams({
        api_secret: Bun.env.CONVERT_KIT_SECRET,
        from: fromDateFormatted,
        to: toDateFormatted
    })

    const url = new URL(Bun.env.CONVERT_KIT_BASE_URL + '/subscribers')
    url.search = params.toString()
    console.log('sending request to ' + url)

    try {
        const response = await fetch(url)

        if (response.status === 200) {
            const json = (await response.json()) as GetSubscribers
            return json
        }
        return response.statusText
    } catch (error) {
        console.log(error)
    }
}

export async function getSubscriberTags(subscriberId: number) {
    const params = new URLSearchParams({
        api_secret: Bun.env.CONVERT_KIT_SECRET
    })

    const url = new URL(
        Bun.env.CONVERT_KIT_BASE_URL + `/subscribers/${subscriberId}/tags`
    )
    url.search = params.toString()
    console.log('sending request to ' + url)

    try {
        const response = await fetch(url)

        if (response.status === 200) {
            const json = (await response.json()) as GetSubscribers
            return json
        }
        return response.statusText
    } catch (error) {
        console.log(error)
    }
}
function formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2) // Months are 0 based, so +1 and pad with '0' if necessary
    const day = ('0' + date.getDate()).slice(-2) // Pad with '0' if necessary
    return `${year}-${month}-${day}`
}

export type SubscriberWebhookResponse = {
    subscriber: {
        id: number
        first_name: string
        email_address: string
        state: 'active' | string
        created_at: string
        fields: {
            [key: string]: string | number | boolean
        }
    }
}
export interface GetSubscribers {
    total_subscribers: number
    page: number
    total_pages: number
    subscribers: Subscriber[]
}

export interface Subscriber {
    id: number
    first_name: string
    email_address: string
    state: string
    created_at: string
    fields: Fields
}

export interface Fields {
    last_name: string
}
