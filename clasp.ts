import { readableStreamToText } from 'bun'

const deploy = () =>
    Bun.spawn({
        cmd: ['clasp', 'deploy', '--deploymentId', Bun.env.DEPLOYMENT_ID],
        stdout: 'pipe'
    })

const push = () =>
    Bun.spawn({ cmd: ['clasp', 'push', '--force'], stdout: 'pipe' })

const status = () =>
    Bun.spawn({
        cmd: ['clasp', 'status'],
        stdout: 'pipe'
    })

const update = () =>
    Bun.spawn({
        cmd: ['clasp', 'settings', 'scriptId', Bun.env.SCRIPT_ID],
        stdout: 'pipe'
    })

let result = null
const caller = process.argv.at(2)
switch (caller) {
    case 'push':
        result = push().stdout
    case 'status':
        result = status().stdout
    case 'deploy':
        result = deploy().stdout
    case 'update':
        result = update().stdout
    default:
}

if (!result) {
    console.error('no command specified')
    process.exit(1)
}

const text = await readableStreamToText(result)
console.log(text)
