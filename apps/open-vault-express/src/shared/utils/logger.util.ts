export const logger = (message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(message, data ?? '')
    }
}