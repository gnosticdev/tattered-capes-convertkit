declare module 'bun' {
    interface Env {
        CONVERT_KIT_API_KEY: string
        CONVERT_KIT_SECRET: string
        CONVERT_KIT_BASE_URL: string
        DEPLOYMENT_ID: string
        SCRIPT_ID: string
    }
}
