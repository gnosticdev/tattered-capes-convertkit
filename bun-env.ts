// Get the environment variables
const allEnvVars = Bun.env as Record<string, string>

// Read the .env file
const dotEnvContent = await Bun.file('.env').text()
const dotEnvKeys = dotEnvContent.split('\n').map((line) => line.split('=')[0])
console.log(dotEnvKeys)
// Separate the keys from the .env file and the other keys
const dotEnvVars = {} as Record<string, string>
const otherVars = {} as Record<string, string>

for (const key in allEnvVars) {
    if (dotEnvKeys.includes(key)) {
        dotEnvVars[key] = 'string'
    } else {
        otherVars[key] = 'string'
    }
}

// Create the content for the env.d.ts file
let content = "declare module 'bun' {\n    interface Env {\n"

// Add the keys from the .env file
for (const key in dotEnvVars) {
    content += `        ${key}: ${dotEnvVars[key]}\n`
}

// Close the interface and module declarations
content += '    }\n}\n'

// Write the content to the env.d.ts file
Bun.write('env2.d.ts', content)
