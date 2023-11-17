import { TC_TAG_ID } from '../convertkit'
import { SubscriberWebhookResponse } from './subs'

export const convertKitTags = {
    tags: [
        {
            id: 1745018,
            name: 'LA Age Calculator',
            created_at: '2020-07-21T21:49:37.000Z'
        },
        {
            id: 1457813,
            name: 'Master List',
            created_at: '2020-05-05T15:16:15.000Z'
        },
        {
            id: 3443185,
            name: 'Osher UVA',
            created_at: '2022-11-06T18:17:35.000Z'
        },
        {
            id: 2346032,
            name: 'spreadsheet download',
            created_at: '2021-04-28T16:24:13.000Z'
        },
        {
            id: 4278910,
            name: 'tattered capes',
            created_at: '2023-11-16T19:22:48.000Z'
        },
        {
            id: 2273868,
            name: 'Whealthspan',
            created_at: '2021-03-24T20:36:54.000Z'
        }
    ]
}

export async function getTags() {
    const params = new URLSearchParams({
        api_key: Bun.env.CONVERT_KIT_API_KEY
    })
    const url = new URL(Bun.env.CONVERT_KIT_BASE_URL + '/tags')
    url.search = params.toString()

    console.log('sending reqest to ' + url)

    try {
        const tagsResponse = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const tags = (await tagsResponse.json()) as TagsResponse
        return tags
    } catch (error) {
        console.log(error)
    }
}

type TagsResponse = {
    tags: {
        id: number
        name: string
        created_at: string
    }[]
}

export async function tagSubscriber(email: string, tagId?: number) {
    tagId ??= TC_TAG_ID
    const params = new URLSearchParams({
        api_key: Bun.env.CONVERT_KIT_API_KEY
    })

    const url = new URL(
        Bun.env.CONVERT_KIT_BASE_URL + `/tags/${tagId}/subscribe`
    )

    url.search = params.toString()
    console.log('sending request to ' + url)

    const requestBody = {
        api_secret: Bun.env.CONVERT_KIT_SECRET,
        email: email
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
            const json = (await response.json()) as SubscriberWebhookResponse
            return json
        }
        return response.statusText
    } catch (error) {
        console.log(error)
    }
}
