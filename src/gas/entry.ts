import { SubscriberWebhookResponse } from '../subs'

function doPost(e: GoogleAppsScript.Events.DoPost) {
    Logger.log('starting  doGet')
    console.log(JSON.stringify(e))
    const params = JSON.parse(JSON.stringify(e.postData.contents))

    const postData = JSON.parse(
        e.postData.contents
    ) as SubscriberWebhookResponse

    if (!postData.subscriber) {
        return ContentService.createTextOutput('No subscriber')
    }
    if (!postData.subscriber.email_address) {
        return ContentService.createTextOutput('No email')
    }

    console.log(JSON.stringify(postData))

    const email = postData.subscriber.email_address
    const time = new Date().toLocaleString()
    const sheet =
        SpreadsheetApp.getActiveSpreadsheet().getSheetByName('web_form')
    sheet!.appendRow([time, email])
    return ContentService.createTextOutput('Successfully added row')
}
