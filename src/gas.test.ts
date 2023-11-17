import { describe, it } from 'bun:test'

describe('send payload to google apps script', () => {
    it('should send payload to google apps script', async () => {
        await testMain()
    })
})
async function testMain() {
    const testPayload = JSON.stringify({
        subscriber: {
            id: 1,
            first_name: 'John',
            email_address: 'John@example.com',
            state: 'active',
            created_at: '2018-02-15T19:40:24.913Z',
            fields: {
                'My Custom Field': 'Value'
            }
        }
    })
    // send test payload to apps script url
    const url = Bun.env.APPS_SCRIPT_URL
    const response = await fetch(url, {
        method: 'POST',
        body: testPayload
    })
    console.log(await response.text())
}
